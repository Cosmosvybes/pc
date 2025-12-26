import LegalLayout from './legal/LegalLayout';
import { Check } from 'lucide-react';

export default function Pricing() {
  return (
    <LegalLayout title="Pricing">
      <div className="text-center mb-12">
        <p className="text-xl text-slate-600 mb-4">Simple, transparent pricing for peace of mind.</p>
        <div className="inline-block bg-white p-8 rounded-3xl shadow-xl border-2 border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Pro Access</h2>
            <div className="flex items-baseline justify-center space-x-1 mb-6">
                <span className="text-4xl font-black text-indigo-600">$10</span>
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
            
            <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                Start 7-Day Free Trial
            </button>
            <p className="text-xs text-slate-400 mt-4">Secure payment via Paddle</p>
        </div>
      </div>
    </LegalLayout>
  );
}
