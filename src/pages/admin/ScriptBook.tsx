import { CRISIS_SCRIPTS, type SituationType, type LocationType, type AgeType } from '../../features/crisis/static-data';
import { BONUS_SCRIPTS } from '../../features/crisis/bonus-scripts';

export default function ScriptBook() {
  const situations: SituationType[] = ['meltdown', 'energy', 'overstimulated', 'bedtime'];
  const locations: LocationType[] = ['home', 'public'];
  const ages: AgeType[] = ['2-3', '4-6'];

  return (
    <div className="bg-white min-h-screen text-slate-800 p-12 print:p-0 max-w-4xl mx-auto">
      {/* Cover Page */}
      <div className="h-screen flex flex-col items-center justify-center text-center border-b-2 border-slate-100 mb-12 print:h-screen print:border-0 print:mb-0">
         <h1 className="text-6xl font-black text-slate-900 mb-6">The Script Book</h1>
         <p className="text-2xl text-slate-500 font-medium">Calm words for hard moments.</p>
         <div className="mt-12 p-6 bg-slate-50 rounded-xl">
            <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Property Of</p>
            <div className="h-0.5 w-64 bg-slate-300 mt-8"></div>
         </div>
      </div>

      {/* Content */}
      <div className="space-y-12">
          {situations.map((situation) => (
             <div key={situation} className="print:break-before-page">
                 <h2 className="text-4xl font-black text-slate-900 capitalize mb-8 border-b-4 border-slate-900 inline-block pb-2">
                    {situation}
                 </h2>
                 
                 <div className="grid grid-cols-1 gap-12">
                     {locations.map((location) => (
                        <div key={location}>
                            <h3 className="text-2xl font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                               {location === 'home' ? '🏠 At Home' : '🏙️ In Public'}
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {ages.map(age => {
                                    const script = CRISIS_SCRIPTS[situation][location][age];
                                    return (
                                        <div key={age} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 print:border-slate-300">
                                             <div className="mb-4">
                                                 <span className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded">Age {age}</span>
                                             </div>
                                             
                                             <div className="mb-6">
                                                 <p className="text-slate-400 text-xs font-bold uppercase mb-1">You Say:</p>
                                                 <p className="text-xl font-bold text-slate-800 leading-snug">"{script.say}"</p>
                                             </div>
                                             
                                             <div>
                                                 <p className="text-slate-400 text-xs font-bold uppercase mb-1">You Do:</p>
                                                 <p className="text-base font-medium text-indigo-600">{script.action}</p>
                                             </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                     ))}
                 </div>
             </div>
          ))}
      </div>

      <div className="print:break-before-page mt-24">
          <h1 className="text-5xl font-black text-slate-900 mb-4 text-center">Bonus Scenarios</h1>
           <p className="text-xl text-slate-500 font-medium text-center mb-12">Lying, Hitting, Defiance & More</p>

           <div className="space-y-12">
               {['Defiance & Lying', 'Aggression', 'Sibling Rivalry', 'Daily Battles', 'Transitions'].map(category => (
                   <div key={category} className="break-inside-avoid">
                        <h2 className="text-3xl font-bold text-indigo-600 mb-6 border-b-2 border-indigo-100 pb-2">{category}</h2>
                        <div className="grid grid-cols-1 gap-6">
                            {BONUS_SCRIPTS.filter(s => s.category === category).map((script, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start">
                                    <div className="md:w-1/3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide">{script.scenario}</span>
                                            <span className="text-slate-400 text-xs font-bold">Age {script.age}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">You Say:</p>
                                            <p className="text-lg font-bold text-slate-800">"{script.say}"</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs font-bold uppercase mb-1">You Do:</p>
                                            <p className="text-sm font-medium text-indigo-600">{script.action}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                   </div>
               ))}
           </div>
      </div>

      <div className="mt-24 text-center print:mt-12">
          <p className="text-slate-400 text-sm">Generated by ParentingCertainty</p>
      </div>

      {/* Instructions Overlay (Hidden on Print) */}
      <div className="fixed bottom-6 right-6 print:hidden">
          <button 
            onClick={() => window.print()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
              <span>Download PDF</span>
          </button>
      </div>
    </div>
  );
}
