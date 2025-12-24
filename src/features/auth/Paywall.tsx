import { useAuth } from '../../context/AuthContext'
import { Check, Sparkles } from 'lucide-react'
import { useSubscription } from '../../context/SubscriptionContext'
import { FadeIn } from '../../ui/animations'

export default function Paywall() {
  const { signInWithGoogle, user } = useAuth()
  const { upgradeToPro } = useSubscription()

  const handleUpgrade = () => {
    // In a real app, this would open Lemon Squeezy Checkout
    // For now, we simulate success
    const confirmed = window.confirm("Simulating Lemon Squeezy Checkout...\n\nClick OK to complete purchase.")
    if (confirmed) {
        upgradeToPro()
    }
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
      <FadeIn>
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200 mb-6 mx-auto">
            <Sparkles size={32} />
        </div>
        
        <h2 className="text-3xl font-black text-certainty-dark mb-2">
            Unlock Certainty.
        </h2>
        <p className="text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
            Get unlimited access to the entire library of psychological scripts and audio guides.
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg mb-8 text-left max-w-sm w-full">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                ParentingCertainty Pro
            </h3>
            <ul className="space-y-4">
                {[
                    'Unlimited Crisis Scripts (All Ages)',
                    'Audio Coaching Tracks',
                    'Deep Dive Prevention Library',
                    'Progress Tracking & Insights'
                ].map((feature, i) => (
                    <li key={i} className="flex items-start space-x-3 text-slate-700 font-bold">
                        <Check size={20} className="text-green-500 shrink-0" strokeWidth={3} />
                        <span className="text-sm">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>

        <div className="space-y-4 w-full max-w-sm">
            {!user ? (
                 <button 
                 onClick={signInWithGoogle}
                 className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-95 transition-transform flex items-center justify-center space-x-2"
                >
                   <span>Sign in to Upgrade</span>
                </button>
            ) : (
                <button 
                    onClick={handleUpgrade}
                    className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-rose-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative">Start Free Trial</span>
                </button>
            )}
            
            <p className="text-xs text-slate-400 font-medium">
                3 days free, then $9.99/month. <br/> Cancel anytime.
            </p>
        </div>
      </FadeIn>
    </div>
  )
}
