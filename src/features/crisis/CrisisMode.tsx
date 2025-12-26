import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, User, MapPin, Zap, Moon, AlertOctagon, Volume2 } from 'lucide-react'
import { FadeIn, ScaleIn } from '../../ui/animations'
import { CRISIS_SCRIPTS, type SituationType, type LocationType, type AgeType } from './static-data'
import { useSubscription } from '../../context/SubscriptionContext'
import Paywall from '../auth/Paywall'
import { useProgress } from '../../context/ProgressContext'

// Audio Context (Same as AudioVault)
const createBrownNoise = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (activeLastOut + (0.02 * white)) / 1.02;
        activeLastOut = output[i];
        output[i] *= 3.5; 
    }
    return buffer;
}
let activeLastOut = 0;

const createRainNoise = (ctx: AudioContext) => {
     const bufferSize = ctx.sampleRate * 2;
     const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
     const output = buffer.getChannelData(0);
     let b0, b1, b2, b3, b4, b5, b6;
     b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
     for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; 
        b6 = white * 0.115926;
     }
     return buffer;
}

interface Props {
  onExit: () => void
}

type Step = 'selector' | 'context' | 'result'

export default function CrisisMode({ onExit }: Props) {
  const [step, setStep] = useState<Step>('selector')
  const [situation, setSituation] = useState<SituationType | null>(null)
  
  // Defaults
  const [location, setLocation] = useState<LocationType>('home')
  const [age, setAge] = useState<AgeType>('2-3')

  const { isPro } = useSubscription()
  const { addCrisis } = useProgress()

  // Audio Logic
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)

  useEffect(() => {
    return () => {
       if (audioCtxRef.current) audioCtxRef.current.close();
    }
  }, [])

  const startAudio = (type: 'brown' | 'rain') => {
      if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.1;
      gainNode.connect(ctx.destination);
      gainRef.current = gainNode;

      const source = ctx.createBufferSource();
      source.buffer = type === 'brown' ? createBrownNoise(ctx) : createRainNoise(ctx);
      source.loop = true;
      source.connect(gainNode);
      source.start();

      // Fade In
      gainNode.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 1);
  }

  const handleSituationClick = (sit: SituationType) => {
      setSituation(sit)
      setStep('context')
  }

  const handleGo = () => {
      if (!situation) return;
      if (!isPro && situation !== 'meltdown') { return; } // Free trial only allows Meltdown potentially? (Actually keeping logic simple for now)
      
      setStep('result')
      
      const script = CRISIS_SCRIPTS[situation][location][age];
      startAudio(script.audio);
      
      // Log it
      addCrisis({ age, situation, durationSeconds: 0 });
  }

  // RENDERERS

  if (!isPro) {
       return (
            <div className="h-full pt-10 px-6">
                 <button onClick={onExit} className="mb-6 text-slate-400 font-medium">Cancel</button>
                 <Paywall />
            </div>
       )
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
            <button onClick={onExit} className="text-slate-400 p-2">
                <ArrowLeft size={24} />
            </button>
            <span className="font-bold text-slate-300 tracking-widest text-xs uppercase">Panic Mode</span>
            <div className="w-8"></div>
        </div>

        {/* STEP 1: SELECTOR */}
        {step === 'selector' && (
            <div className="flex-1 p-4 grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <button onClick={() => handleSituationClick('meltdown')} className="bg-rose-100 hover:bg-rose-200 border-2 border-rose-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                    <AlertOctagon size={48} className="text-rose-500" />
                    <span className="font-black text-rose-700 text-lg">MELTDOWN</span>
                </button>
                <button onClick={() => handleSituationClick('energy')} className="bg-orange-100 hover:bg-orange-200 border-2 border-orange-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                    <Zap size={48} className="text-orange-500" />
                    <span className="font-black text-orange-700 text-lg">ENERGY</span>
                </button>
                <button onClick={() => handleSituationClick('overstimulated')} className="bg-indigo-100 hover:bg-indigo-200 border-2 border-indigo-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                    <div className="relative">
                        <Zap size={48} className="text-indigo-500 blur-sm absolute opacity-50" />
                        <Zap size={48} className="text-indigo-600 relative z-10" />
                    </div>
                    <span className="font-black text-indigo-700 text-lg text-center leading-tight">OVER<br/>STIMULATED</span>
                </button>
                <button onClick={() => handleSituationClick('bedtime')} className="bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all">
                    <Moon size={48} className="text-amber-300" />
                    <span className="font-black text-white text-lg">BEDTIME</span>
                </button>
            </div>
        )}

        {/* STEP 2: CONTEXT */}
        {step === 'context' && (
            <div className="flex-1 p-6 flex flex-col justify-center animate-in fade-in slide-in-from-right-8 duration-300">
                <h2 className="text-2xl font-black text-slate-800 mb-8 text-center">Quick Context</h2>
                
                {/* Location Toggle */}
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mb-6 flex">
                    <button 
                        onClick={() => setLocation('home')}
                        className={`flex-1 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${location === 'home' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <User size={20} /> Home
                    </button>
                    <button 
                        onClick={() => setLocation('public')}
                        className={`flex-1 py-4 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2 ${location === 'public' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        <MapPin size={20} /> Public
                    </button>
                </div>

                {/* Age Toggle */}
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200 mb-8 flex">
                    <button 
                        onClick={() => setAge('2-3')}
                        className={`flex-1 py-4 rounded-lg font-bold text-lg transition-colors ${age === '2-3' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Age 2-3
                    </button>
                    <button 
                        onClick={() => setAge('4-6')}
                        className={`flex-1 py-4 rounded-lg font-bold text-lg transition-colors ${age === '4-6' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                    >
                        Age 4-6
                    </button>
                </div>

                <button 
                    onClick={handleGo}
                    className="w-full py-6 rounded-2xl bg-rose-500 text-white text-2xl font-black shadow-xl hover:bg-rose-600 active:scale-95 transition-all text-center"
                >
                    GO NOW
                </button>
            </div>
        )}

        {/* STEP 3: RESULT */}
        {step === 'result' && situation && (
            <div className="flex-1 flex flex-col animate-in fade-in duration-700 bg-white">
                {/* Audio Indicator */}
                <div className="h-16 bg-slate-900 flex items-center justify-center gap-3">
                    <Volume2 className="text-green-400 animate-pulse" size={24} />
                    <span className="text-white font-mono text-sm tracking-widest uppercase">Audio Playing...</span>
                </div>

                <div className="flex-1 flex flex-col px-6 pt-12 pb-6 text-center">
                    <ScaleIn>
                        <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">You Say:</h3>
                        <p className="text-3xl font-black text-slate-800 leading-tight mb-12">
                            "{CRISIS_SCRIPTS[situation][location][age].say}"
                        </p>
                    </ScaleIn>

                    <FadeIn>
                        <div className="border-t-2 border-slate-100 py-8">
                             <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-4">You Do:</h3>
                             <p className="text-xl font-bold text-indigo-600">
                                {CRISIS_SCRIPTS[situation][location][age].action}
                             </p>
                        </div>
                    </FadeIn>
                </div>
                
                <div className="p-6 bg-slate-50 border-t border-slate-200">
                    <button 
                        onClick={() => setStep('selector')}
                        className="w-full py-4 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        )}
    </div>
  )
}
