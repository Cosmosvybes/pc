import { ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DIGITAL_PRODUCTS } from '../features/shop/products';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { supabase } from '../lib/supabase';

export default function Shop() {
  
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const syncPurchases = async () => {
        // 1. LocalStorage (Device Cache)
        const saved = Object.keys(localStorage).filter(key => key.startsWith('purchased_'));
        const localIds = saved.map(key => key.replace('purchased_', ''));
        
        // 2. Supabase (Cross-Device)
        const { data: { user } } = await supabase.auth.getUser();
        let dbIds: string[] = [];
        
        if (user) {
            setUserEmail(user.email || '');
            setUserName(user.user_metadata?.full_name || 'Parent');

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

  const handleBuy = async (amount: number, productId: string, title: string) => {
      // If already purchased, just redirect
      if (purchasedItems.includes(productId)) {
           if (productId === 'script-book') window.location.href = '/print-script-book';
           return;
      }

      // Guest Handling: If no user, ask for email or just use a placeholder/prompt?
      // Flutterwave requires an email. If not logged in, we should probably prompt or use a dummy for guest checkout if allowed?
      // Better: Prompt for email if missing. For now, let's assume they might be guests and ask prompt.
      let customerEmail = userEmail;
      if (!customerEmail) {
          const promptEmail = prompt("Please enter your email for the receipt:");
          if (!promptEmail) return;
          customerEmail = promptEmail;
      }

      const config = {
        public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '',
        tx_ref: Date.now() + '-' + productId,
        amount: amount,
        currency: 'USD',
        payment_options: 'card,mobilemoney,ussd',
        customer: {
          email: customerEmail,
          phone_number: '',
          name: userName || 'Guest Parent',
        },
        customizations: {
          title: title,
          description: 'ParentingCertainty Digital Resource',
          logo: 'https://cdn-icons-png.flaticon.com/512/2919/2919906.png', // Or app logo
        },
      };

      const handleFlutterwavePayment = useFlutterwave(config);

      handleFlutterwavePayment({
        callback: async (response) => {
           console.log(response);
           closePaymentModal(); // this will close the modal programmatically
           
           if (response.status === 'successful') {
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
                    window.location.href = '/print-script-book';
                }
           }
        },
        onClose: () => {
           // Do nothing
        },
      });
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
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Instant Access + Email Backup</span>
                        </div>
                        
                        <button 
                            onClick={() => {
                                if (product.comingSoon) return;
                                if (purchasedItems.includes(product.id)) {
                                    if (product.id === 'script-book') window.location.href = '/print-script-book';
                                } else {
                                    handleBuy(product.price, product.id, product.title);
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
