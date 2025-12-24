import type { Situation } from './prescriptions';
import { SlideIn } from '../../ui/animations';

interface Props {
  onSelect: (situation: Situation) => void;
  onBack: () => void;
}

export default function SituationSelection({ onSelect, onBack }: Props) {
  const situations: { id: Situation; label: string; icon: string }[] = [
    { id: 'tantrum', label: 'Tantrum / Meltdown', icon: '🌪️' },
    { id: 'boredom', label: 'Whining / Boredom', icon: '🥱' },
    { id: 'hyperactive', label: 'Hyper / Wild', icon: '⚡' },
    { id: 'bedtime', label: 'Bedtime Struggle', icon: '🌙' },
  ];

  return (
    <SlideIn className="flex flex-col space-y-6 w-full">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600">
          ← Back
        </button>
        <h2 className="text-xl font-bold text-certainty-dark">What's happening?</h2>
        <div className="w-8"></div> {/* Spacer for centering */}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {situations.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="p-6 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:border-certainty-blue hover:shadow-md transition-all flex items-center space-x-4"
          >
            <span className="text-3xl">{s.icon}</span>
            <span className="text-xl font-bold text-certainty-dark">{s.label}</span>
          </button>
        ))}
      </div>
    </SlideIn>
  );
}
