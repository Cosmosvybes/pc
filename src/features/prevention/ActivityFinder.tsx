import { useState } from 'react'
import { FadeIn } from '../../ui/animations'
import { ACTIVITIES, type Activity } from './activities'
import { Battery, Clock, Zap, RefreshCw, X, Check, Sparkles } from 'lucide-react'
import { generateActivity } from '../../lib/gemini'

export default function ActivityFinder({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'energy' | 'time' | 'loading' | 'result'>('energy')
  const [energy, setEnergy] = useState<'high' | 'low' | null>(null)
  const [duration, setDuration] = useState<'short' | 'long' | null>(null)
  const [result, setResult] = useState<Activity | null>(null)

  const fetchActivity = async (e: 'high'|'low', d: 'short'|'long') => {
      setStep('loading')
      try {
          // Try AI First
          const aiActivity = await generateActivity(e, d)
          setResult(aiActivity)
          setStep('result')
      } catch (err) {
          // Fallback to Static
          console.warn("AI Failed, using static", err)
          const matches = ACTIVITIES.filter(a => a.energy === e && a.duration === d)
          const random = matches[Math.floor(Math.random() * matches.length)]
          setResult(random)
          setStep('result')
      }
  }

  const handleShowResult = (d: 'short' | 'long') => {
    setDuration(d)
    if (energy) fetchActivity(energy, d)
  }

  const handleReroll = () => {
     if (energy && duration) fetchActivity(energy, duration)
  }

  if (step === 'loading') {
      return (
          <FadeIn className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Generating Idea...</h3>
              <p className="text-slate-500 font-medium">Consulting the creative archives.</p>
          </FadeIn>
      )
  }

  // RENDER: RESULT
  if (step === 'result' && result) {
      return (
          <FadeIn className="h-full flex flex-col pt-8">
               <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500">
                    <X size={24} />
               </button>

               <div className="flex-1 flex flex-col justify-center items-center text-center">
                    <div className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Sparkles size={12} />
                        {result.energy === 'high' ? 'High Energy Release' : 'Calm Regulation'}
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 mb-4 leading-tight">
                        {result.title}
                    </h2>

                    <p className="text-lg text-slate-600 font-medium mb-8 max-w-xs mx-auto">
                        {result.description}
                    </p>

                    {result.materials && result.materials.length > 0 && (
                        <div className="bg-slate-50 rounded-xl p-4 w-full max-w-xs text-left mb-8">
                             <p className="text-xs font-bold text-slate-400 uppercase mb-2">You need:</p>
                             <div className="flex flex-wrap gap-2">
                                 {result.materials.map(m => (
                                     <span key={m} className="bg-white border border-slate-200 px-2 py-1 rounded-md text-sm text-slate-700 font-bold shadow-sm">
                                         {m}
                                     </span>
                                 ))}
                             </div>
                        </div>
                    )}
               </div>

               <div className="space-y-3 pb-6">
                   <button 
                        onClick={onClose}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center space-x-2"
                   >
                       <Check size={20} />
                       <span>Let's do this</span>
                   </button>

                   <button 
                        onClick={handleReroll}
                        className="w-full bg-white text-slate-500 py-3 rounded-2xl font-bold text-sm border border-slate-200 active:scale-95 transition-transform flex items-center justify-center space-x-2 hover:bg-slate-50"
                   >
                       <RefreshCw size={16} />
                       <span>Give me another</span>
                   </button>
               </div>
          </FadeIn>
      )
  }

  // RENDER: WIZARD
  return (
    <div className="h-full flex flex-col pt-12">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500">
            <X size={24} />
        </button>

        <h2 className="text-2xl font-black text-slate-900 mb-2">
            {step === 'energy' ? "How's the energy?" : "Time available?"}
        </h2>
        <p className="text-slate-500 font-medium mb-8">
             {step === 'energy' ? "Match the activity to their state." : "Be honest about your bandwidth."}
        </p>

        <div className="flex-1 grid gap-4">
            {step === 'energy' ? (
                <>
                    <button onClick={() => { setEnergy('high'); setStep('time') }} className="bg-orange-50 border-2 border-orange-100 hover:border-orange-300 p-6 rounded-3xl text-left transition-all group">
                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                            <Zap />
                        </div>
                        <h3 className="text-xl font-bold text-orange-900">Hyper / Angry</h3>
                         <p className="text-orange-700/60 font-medium mt-1">Needs release & heavy work</p>
                    </button>

                    <button onClick={() => { setEnergy('low'); setStep('time') }} className="bg-blue-50 border-2 border-blue-100 hover:border-blue-300 p-6 rounded-3xl text-left transition-all group">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                            <Battery />
                        </div>
                        <h3 className="text-xl font-bold text-blue-900">Bored / Whiny</h3>
                         <p className="text-blue-700/60 font-medium mt-1">Needs connection & sensory</p>
                    </button>
                </>
            ) : (
                 <>
                    <button onClick={() => handleShowResult('short')} className="bg-emerald-50 border-2 border-emerald-100 hover:border-emerald-300 p-6 rounded-3xl text-left transition-all group">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                            <Clock />
                        </div>
                        <h3 className="text-xl font-bold text-emerald-900">Quick Fix</h3>
                         <p className="text-emerald-700/60 font-medium mt-1">Under 15 mins</p>
                    </button>

                    <button onClick={() => handleShowResult('long')} className="bg-purple-50 border-2 border-purple-100 hover:border-purple-300 p-6 rounded-3xl text-left transition-all group">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                            <Hourglass />
                        </div>
                        <h3 className="text-xl font-bold text-purple-900">Deep Play</h3>
                         <p className="text-purple-700/60 font-medium mt-1">15+ mins setup</p>
                    </button>
                </>
            )}
        </div>
        
        {/* Progress Dots */}
        <div className="py-8 flex justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${step === 'energy' ? 'bg-slate-800' : 'bg-slate-300'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 'time' ? 'bg-slate-800' : 'bg-slate-300'}`} />
        </div>
    </div>
  )
}

// Minimal icon component wrapper if needed, but LUCIDE icons used directly above
function Hourglass(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>
}
