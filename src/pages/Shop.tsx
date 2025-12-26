import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DIGITAL_PRODUCTS } from '../features/shop/products';

import { getPaddle, initPaddle } from '../lib/paddle';

import { supabase } from '../lib/supabase';

export default function Shop() {
  
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  useEffect(() => {
    const syncPurchases = async () => {
        // 1. LocalStorage (Device Cache)
        const saved = Object.keys(localStorage).filter(key => key.startsWith('purchased_'));
        const localIds = saved.map(key => key.replace('purchased_', ''));
        
        // 2. Supabase (Cross-Device)
        const { data: { user } } = await supabase.auth.getUser();
        let dbIds: string[] = [];
        
        if (user) {
            const { data } = await supabase
                .from('user_purchases')
                .select('product_id')
                .eq('user_id', user.id);
            
            if (data) {
                dbIds = data.map(r => r.product_id);
                // Sync DB to LocalStorage for faster/offline access next time
                dbIds.forEach(id => localStorage.setItem(`purchased_${id}`, 'true'));
            }
        }

        setPurchasedItems(Array.from(new Set([...localIds, ...dbIds])));
    };
    
    syncPurchases();
  }, []);

  const handleBuy = async (priceId: string, productId: string) => {
      // If already purchased, just redirect (Safety verify, though UI handles this too)
      if (purchasedItems.includes(productId)) {
           if (productId === 'script-book') window.location.href = '/print-script-book';
           return;
      }

      let paddle = getPaddle();
      const onEvent = async (data: any) => {
          if (data.name === 'checkout.completed') {
              // 1. Mark as purchased locally
              localStorage.setItem(`purchased_${productId}`, 'true');
              setPurchasedItems(prev => [...prev, productId]);

              // 2. Sync to Supabase if logged in
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                  const { error } = await supabase.from('user_purchases').insert({
                      user_id: user.id,
                      product_id: productId
                  });
                  if (error) console.error("Failed to save purchase to DB:", error);
              }
              
              // 3. Redirect
              if (productId === 'script-book') {
                  window.location.href = window.location.origin + '/print-script-book';
              }
          }
      };

      if (!paddle) {
          const result = await initPaddle(onEvent);
          if (result) paddle = result;
      } else {
        // If paddle was already init, we might miss the event callback registration if it was done in init.
        // For simplicity in this one-off flow, we re-init or just rely on the fact that if it's open, 
        // we can't easily attach a new global listener without re-init. 
        // A better pattern for this specific library might be needed for robust global events, 
        // but for this specific flow, let's try to update the callback if possible or just rely on the redirect for the *first* time.
        // Actually, initPaddle updates the global callback if called again in our implementation? 
        // Checked paddle.ts: It calls initializePaddle again. Paddle JS might warn but handle it.
        // Let's explicitly pass the callback.
        await initPaddle(onEvent);
      }

      if (paddle) {
          paddle.Checkout.open({
              items: [{ priceId: priceId, quantity: 1 }],
              settings: {
                  displayMode: 'overlay',
                  theme: 'light',
                  locale: 'en',
                  // successUrl: successUrl // REMOVED: We handle redirect manually after saving state
              }
          });
      } else {
          console.error("Paddle failed to initialize. Check your API keys.");
          alert("Payment system unavailable. Please try again later.");
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
       {/* Header */}
       <div className="p-4 flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md z-10">
            <Link to="/" className="text-slate-400 p-2">
                <ArrowLeft size={24} />
            </Link>
            <span className="font-bold text-slate-400 tracking-widest text-xs uppercase">Resource Shop</span>
            <div className="w-8"></div>
        </div>

        <div className="flex-1 px-6 pb-24">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full text-indigo-600 mb-4">
                    <ShoppingBag size={32} />
                </div>
                <h1 className="text-3xl font-black text-slate-800 mb-2">Prevention Tools</h1>
                <p className="text-slate-500 font-medium">Tools to prepare for the storm <br/>before it happens.</p>
            </div>

            <div className="space-y-6">
                {DIGITAL_PRODUCTS.map(product => (
                    <div key={product.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${product.color}`}>
                                <product.icon size={24} />
                            </div>
                            <span className="text-xl font-black text-slate-800">${product.price}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-800 mb-2">{product.title}</h3>
                        <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                            {product.description}
                        </p>
                        <div className="flex items-center gap-2 mb-6">
                            <Check size={14} className="text-green-500" />
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Sent to your email immediately</span>
                        </div>
                        
                        <button 
                            onClick={() => {
                                if (product.comingSoon) return;
                                if (purchasedItems.includes(product.id)) {
                                    if (product.id === 'script-book') window.location.href = '/print-script-book';
                                } else {
                                    handleBuy(product.priceId, product.id);
                                }
                            }}
                            disabled={product.comingSoon}
                            className={`w-full py-3 font-bold rounded-xl transition-all ${
                                product.comingSoon 
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                    : purchasedItems.includes(product.id)
                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                        : 'bg-slate-900 text-white hover:bg-slate-800 active:scale-95'
                            }`}
                        >
                            {product.comingSoon 
                                ? "Coming Soon" 
                                : purchasedItems.includes(product.id) 
                                    ? "Download Again" 
                                    : "Buy Now"}
                        </button>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 text-center">
                 <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-4">Why these work</p>
                 <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-left space-y-3">
                     <div className="flex gap-3">
                         <Check size={16} className="text-green-500 mt-0.5" />
                         <p className="text-sm text-slate-600"><strong>Visuals</strong> work faster than words for overwhelmed kids.</p>
                     </div>
                     <div className="flex gap-3">
                         <Check size={16} className="text-green-500 mt-0.5" />
                         <p className="text-sm text-slate-600"><strong>Planning</strong> when calm builds neural pathways for regulation.</p>
                     </div>
                 </div>
            </div>
        </div>
    </div>
  );
}
