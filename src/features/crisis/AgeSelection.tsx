import type { AgeGroup } from './prescriptions';
import { FadeIn } from '../../ui/animations';

interface Props {
  onSelect: (age: AgeGroup) => void;
}

export default function AgeSelection({ onSelect }: Props) {
  return (
    <FadeIn className="flex flex-col space-y-6 w-full">
      <h2 className="text-2xl font-bold text-center text-certainty-dark">How old is your child?</h2>
      
      <div className="grid grid-cols-1 gap-4">
        <button
          onClick={() => onSelect('toddler')}
          className="p-6 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:border-certainty-blue hover:shadow-md transition-all text-left"
        >
          <span className="block text-xl font-bold text-certainty-dark">Toddler (1-3)</span>
          <span className="text-slate-500">Big feelings, limited words</span>
        </button>

        <button
          onClick={() => onSelect('preschool')}
          className="p-6 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:border-certainty-blue hover:shadow-md transition-all text-left"
        >
          <span className="block text-xl font-bold text-certainty-dark">Preschool (3-5)</span>
          <span className="text-slate-500">Testing boundaries, pushing back</span>
        </button>

        <button
          onClick={() => onSelect('school')}
          className="p-6 bg-white border-2 border-slate-100 rounded-xl shadow-sm hover:border-certainty-blue hover:shadow-md transition-all text-left"
        >
          <span className="block text-xl font-bold text-certainty-dark">School Age (5-9)</span>
          <span className="text-slate-500">Big logic, bigger emotions</span>
        </button>
      </div>
    </FadeIn>
  );
}
