import LegalLayout from './legal/LegalLayout';
import { Check } from 'lucide-react';
import { useSubscription } from '../context/SubscriptionContext';

export default function Pricing() {
  const { upgradeToPro } = useSubscription();

  return (
    <LegalLayout title="Pricing">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">"Next time you won't be alone."</h2>
        <p className="text-lg text-slate-500 mb-6">Your backup plan for the hard moments.</p>
        <div className="inline-block bg-white p-8 rounded-3xl shadow-xl border-2 border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">BACKUP</div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Pro Access</h2>
            <div className="flex items-baseline justify-center space-x-1 mb-6">
                <span className="text-4xl font-black text-indigo-600">$9.99</span>
                <span className="text-slate-500 font-medium">/month</span>
            </div>
            
            <ul className="text-left space-y-4 mb-8">
                {[
                    'Instant Crisis Scripts',
                    'Audio Regulation Vault',
                    'Calm Streak Tracking'
                ].map(feature => (
                    <li key={feature} className="flex items-center space-x-3">
                        <div className="bg-green-100 p-1 rounded-full">
                             <Check size={14} className="text-green-600" />
                        </div>
                        <span className="text-slate-700 font-medium">{feature}</span>
                    </li>
                ))}
            </ul>
            
            <button 
                onClick={upgradeToPro}
                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors"
            >
                Start for $1
            </button>
            <p className="text-xs text-slate-400 mt-4">First month $1, then $9.99/mo.</p>
        </div>
      </div>
    </LegalLayout>
  );
}
