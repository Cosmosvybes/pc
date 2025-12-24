import { useState, useRef, useEffect } from 'react'
import { FadeIn } from '../../ui/animations'
import { CloudRain, Wind, Heart, ChevronLeft } from 'lucide-react'
import { useSubscription } from '../../context/SubscriptionContext'
import Paywall from '../auth/Paywall'

// Web Audio API Helpers
const createBrownNoise = (ctx: AudioContext) => {
    const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 3.5; // Compensate for gain loss
    }
    return buffer;
}

const createPinkNoise = (ctx: AudioContext) => {
  // Approximate Pink Noise (Rain-like)
  const bufferSize = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      data[i] *= 0.11; 
      b6 = white * 0.115926;
  }
  return buffer;
}

type TrackType = 'brown' | 'rain' | 'breath'

interface Props {
    onBack: () => void;
}

export default function AudioVault({ onBack }: Props) {
    const [activeTrack, setActiveTrack] = useState<TrackType | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const gainRef = useRef<GainNode | null>(null);
    
    // Breathing State
    const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Exhale'>('Inhale')
    const [timeLeft, setTimeLeft] = useState(5)

    const { isPro, trialDaysLeft } = useSubscription()
    const hasAccess = isPro || trialDaysLeft > 0

    // Cleanup on unmount
    useEffect(() => {
        return () => {
             stopAudio();
             if (audioCtxRef.current) {
                 audioCtxRef.current.close();
             }
        }
    }, [])
    
    // Breathing Timer Sync
    useEffect(() => {
        let interval: any;
        if (activeTrack === 'breath') {
            setBreathPhase('Inhale');
            setTimeLeft(5);
            
            interval = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === 1) {
                         setBreathPhase(p => p === 'Inhale' ? 'Exhale' : 'Inhale');
                         return 5;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeTrack])
    
    // Check Access
    if (!hasAccess) {
        return (
            <div className="h-full flex flex-col pt-4">
                 <button onClick={onBack} className="flex items-center text-slate-500 font-bold mb-6 hover:text-certainty-dark px-2">
                    <ChevronLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
                <div className="flex-1 overflow-y-auto">
                    <Paywall />
                </div>
            </div>
        )
    }

    const stopAudio = () => {
        if (sourceRef.current) {
            try { sourceRef.current.stop(); } catch(e) {}
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }
        setActiveTrack(null);
    }

    const playAudio = async (type: TrackType) => {
        if (activeTrack === type) {
            stopAudio();
            return;
        }

        // Initialize Context
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        // Stop current if playing
        if (sourceRef.current) {
             try { sourceRef.current.stop(); } catch(e) {}
             sourceRef.current.disconnect();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') await ctx.resume();

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.1; // Initialize quiet
        gainNode.connect(ctx.destination);
        gainRef.current = gainNode;

        const source = ctx.createBufferSource();
        
        if (type === 'brown') {
            source.buffer = createBrownNoise(ctx);
            source.loop = true;
            source.connect(gainNode);
            source.start();
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 2);

        } else if (type === 'rain') {
             source.buffer = createPinkNoise(ctx);
             source.loop = true;
             source.connect(gainNode);
             source.start();
             gainNode.gain.setValueAtTime(0, ctx.currentTime);
             gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2);

        } else if (type === 'breath') {
             // Sine Wave for Breathing Guide
             const oscillator = ctx.createOscillator();
             oscillator.type = 'sine';
             oscillator.frequency.setValueAtTime(180, ctx.currentTime); // Low calming drone
             
             oscillator.connect(gainNode);
             oscillator.start();
             
             // Breath Cycle: 10 seconds (5s In, 5s Out)
             const t = ctx.currentTime;
             const cycle = 10;
             const volume = 0.3;
             
             gainNode.gain.setValueAtTime(0.05, t);
             
             // Create loops of automation
             for (let i = 0; i < 60; i++) {
                 const start = t + (i * cycle);
                 // Inhale (Swell)
                 gainNode.gain.linearRampToValueAtTime(volume, start + (cycle/2));
                 // Exhale (Fade)
                 gainNode.gain.linearRampToValueAtTime(0.05, start + cycle);
             }
             
             sourceRef.current = oscillator as any; 
        }

        // Store active source
        if (type !== 'breath') {
            sourceRef.current = source;
        }
        
        setActiveTrack(type);
    }

    return (
        <FadeIn className="h-full flex flex-col pt-4">
             <button onClick={onBack} className="flex items-center text-slate-500 font-bold mb-6 hover:text-certainty-dark px-2">
                <ChevronLeft size={20} />
                <span>Back to Dashboard</span>
            </button>

            <div className="px-4 mb-6">
                <h2 className="text-3xl font-black text-certainty-dark mb-2">Regulation Station</h2>
                <p className="text-slate-500 font-medium">Tools to lower your blood pressure, instantly.</p>
            </div>

            {/* Visualizer Area */}
            {activeTrack === 'breath' && (
                <FadeIn className="mb-8 flex flex-col items-center justify-center py-8">
                    <div className="relative flex items-center justify-center h-56 w-56">
                        {/* Outer Glow */}
                        <div className={`absolute w-40 h-40 rounded-full blur-2xl transition-all duration-[5000ms] ease-in-out ${breathPhase === 'Inhale' ? 'scale-[1.8] bg-cyan-400/30 opacity-60' : 'scale-75 bg-indigo-600/30 opacity-30'}`}></div>
                        
                        {/* Inner Circle (The Guide) */}
                        <div className={`relative w-40 h-40 rounded-full flex flex-col items-center justify-center text-white font-bold shadow-2xl transition-all duration-[5000ms] ease-in-out z-10 ${breathPhase === 'Inhale' ? 'scale-[1.4] bg-cyan-500 shadow-cyan-500/50' : 'scale-90 bg-indigo-600 shadow-indigo-900/50'}`}>
                             <span className="text-xl uppercase tracking-wider mb-1 opacity-90">{breathPhase}</span>
                             <span className="text-4xl font-black">{timeLeft}s</span>
                        </div>
                    </div>
                     <p className={`text-xl font-black mt-6 text-center transition-all duration-1000 ${breathPhase === 'Inhale' ? 'text-cyan-600 scale-110' : 'text-indigo-600 scale-90'}`}>
                        {breathPhase === 'Inhale' ? 'Enter...' : 'Release...'}
                     </p>
                </FadeIn>
            )}

            <div className="flex-1 overflow-y-auto hide-scrollbar px-4 space-y-4 pb-24">
                
                {/* Brown Noise Card */}
                <button 
                    onClick={() => playAudio('brown')}
                    className={`w-full p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group text-left ${activeTrack === 'brown' ? 'bg-slate-800 text-white border-slate-800 shadow-xl scale-[1.02]' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'}`}
                >
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeTrack === 'brown' ? 'bg-white/20' : 'bg-amber-100 text-amber-900'}`}>
                            <Wind size={24} />
                        </div>
                        {activeTrack === 'brown' && (
                            <div className="flex gap-1 items-end h-6">
                                <div className="w-1 bg-white/50 animate-[bounce_1s_infinite] h-2"></div>
                                <div className="w-1 bg-white/50 animate-[bounce_1.2s_infinite] h-4"></div>
                                <div className="w-1 bg-white/50 animate-[bounce_0.8s_infinite] h-3"></div>
                            </div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold mb-1 relative z-10">Brown Noise</h3>
                    <p className={`text-sm font-medium relative z-10 ${activeTrack === 'brown' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Calms the hyperactive brain. Best for ADHD & Overstimulation.
                    </p>
                </button>

                {/* Rain Card */}
                <button 
                    onClick={() => playAudio('rain')}
                    className={`w-full p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group text-left ${activeTrack === 'rain' ? 'bg-blue-600 text-white border-blue-600 shadow-xl scale-[1.02]' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'}`}
                >
                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeTrack === 'rain' ? 'bg-white/20' : 'bg-blue-100 text-blue-900'}`}>
                            <CloudRain size={24} />
                        </div>
                        {activeTrack === 'rain' && (
                            <div className="flex gap-1 items-end h-6">
                                <div className="w-1 bg-white/50 animate-[bounce_1s_infinite] h-2"></div>
                                <div className="w-1 bg-white/50 animate-[bounce_1.2s_infinite] h-4"></div>
                                <div className="w-1 bg-white/50 animate-[bounce_0.8s_infinite] h-3"></div>
                            </div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold mb-1 relative z-10">Heavy Rain</h3>
                    <p className={`text-sm font-medium relative z-10 ${activeTrack === 'rain' ? 'text-blue-100' : 'text-slate-500'}`}>
                        Blocks out chaos. Best for Anxiety & Panic.
                    </p>
                </button>

                {/* Coherent Breathing Card (Active) */}
                 <button 
                    onClick={() => playAudio('breath')}
                    className={`w-full p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden group text-left ${activeTrack === 'breath' ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-[1.02]' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg'}`}
                 >
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${activeTrack === 'breath' ? 'bg-white/20' : 'bg-indigo-100 text-indigo-900'}`}>
                            <Heart size={24} />
                        </div>
                        {activeTrack === 'breath' && (
                             <div className="flex gap-1 items-end h-6">
                                <div className="w-1 bg-white/50 animate-[bounce_2s_infinite] h-2"></div>
                                <div className="w-1 bg-white/50 animate-[bounce_2s_infinite] h-4"></div>
                            </div>
                        )}
                    </div>
                    <h3 className="text-xl font-bold mb-1 relative z-10">Coherent Breathing</h3>
                    <p className={`text-sm font-medium relative z-10 ${activeTrack === 'breath' ? 'text-indigo-100' : 'text-slate-500'}`}>
                        Visual & Audio guide to slow your heart rate (6 breaths/min).
                    </p>
                </button>

            </div>
        </FadeIn>
    )
}
