import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import PaymentFeedbackModal from '../features/shop/PaymentFeedbackModal';

interface SubscriptionContextType {
  isPro: boolean;
  upgradeToPro: () => void;
  downgradeToFree: () => void;
  isLoading: boolean;
  trialDaysLeft: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(0)
  
  const { user } = useAuth();

  // Configuration for Flutterwave Recurring Payment (Pro Plan)
  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '',
    tx_ref: 'pro-' + Date.now(),
    amount: 1, // Minimum allowable charge for card verification
    currency: 'USD',
    payment_plan: import.meta.env.VITE_FLUTTERWAVE_PAYMENT_PLAN_ID || '', 
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || '',
      phone_number: '',
      name: user?.user_metadata?.full_name || 'Parent',
    },
    customizations: {
      title: 'ParentingCertainty Pro',
      description: 'Monthly Subscription',
      logo: 'https://cdn-icons-png.flaticon.com/512/2919/2919906.png',
    },
  };

  // Payment Status State
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'cancelled' | 'error'>('idle');

  const handleFlutterwavePayment = useFlutterwave(config);

  useEffect(() => {
    checkStatus();
  }, [user])

  const checkStatus = async () => {
    // 1. Check LocalStorage (Fastest)
    const localStatus = localStorage.getItem('pc_pro_status')
    if (localStatus === 'active') {
        setIsPro(true)
        setTrialDaysLeft(0)
        setIsLoading(false)
        return
    }

  // 2. Check Supabase (Cross-Device)
    if (user) {
        // A. Check for active purchase
        const { data } = await supabase
            .from('user_purchases')
            .select('product_id')
            .eq('user_id', user.id)
            .eq('product_id', 'pro_monthly')
            .single();
        
        if (data) {
            setIsPro(true);
            setTrialDaysLeft(0);
            localStorage.setItem('pc_pro_status', 'active');
            setIsLoading(false);
            return;
        }

        // NO AUTOMATIC TRIAL. 
        // User must "subscribe" (link card) to get access.
    }

    // 3. Default to FALSE
    setIsPro(false);
    setTrialDaysLeft(0);
    setIsLoading(false);
  }

  const upgradeToPro = () => {
    const publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY;
    const planId = import.meta.env.VITE_FLUTTERWAVE_PAYMENT_PLAN_ID;

    if (!publicKey) {
        alert("Configuration Error: Missing Flutterwave Public Key");
        return;
    }

    if (!planId) {
        // Alert descriptive error for user to fix config
        alert("Configuration Error: Missing Payment Plan ID. Please add VITE_FLUTTERWAVE_PAYMENT_PLAN_ID to env.");
        return;
    }

    if (!user?.email) {
        alert("Please sign in to upgrade.");
        return;
    }

    handleFlutterwavePayment({
      callback: async (response) => {
         console.log(response);
         closePaymentModal();
         
         if (response.status === 'successful') {
             // 1. Activate Locally
             setIsPro(true);
             localStorage.setItem('pc_pro_status', 'active');
             setTrialDaysLeft(0);
             setPaymentStatus('success');
             
             // 2. Save to Supabase
             if (user) {
                 const { error } = await supabase.from('user_purchases').insert({
                     user_id: user.id,
                     product_id: 'pro_monthly' // Use a special ID for subscription
                 });
                 if (error) console.error("Sync Error:", error);
             }
         } else {
             setPaymentStatus('error');
         }
      },
      onClose: () => {
          // If modal closed and NOT successful, assume cancelled
          // We need a slight delay or check if we already set success
          // Flutterwave fires callback THEN onClose often. 
          // Let's rely on the callback for success/error. 
          // If we reach onClose and status is still 'idle', then it was cancelled.
          // However, due to closure scope, reading state here is tricky.
          // Simplest: check if we just had a success.
          // Actually, callback usually fires first.
          
          // Let's just set cancelled if no success occurred.
          // But we can't read the latest 'paymentStatus' easily here without refs.
          
          // Strategy: Trigger 'cancelled' state. If it was success, the success state (set in callback) 
          // should override or we check 'response.status' in callback.
          // Actually, best user experience: 
          // Only show 'Cancelled' if they explicitly closed it without paying.
          
          setPaymentStatus((prev) => prev === 'success' ? 'success' : 'cancelled');
      },
    });
  }

  const downgradeToFree = () => {
    setIsPro(false)
    localStorage.removeItem('pc_pro_status')
  }

  return (
    <SubscriptionContext.Provider value={{ isPro, upgradeToPro, downgradeToFree, isLoading, trialDaysLeft }}>
      {children}
      
      {/* GLOBAL PAYMENT FEEDBACK MODAL */}
      <PaymentFeedbackModal 
        status={paymentStatus} 
        onClose={() => setPaymentStatus('idle')} 
      />
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
