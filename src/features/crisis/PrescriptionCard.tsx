import { useState, useEffect } from 'react'
import { Check, Volume2, Square, ChevronLeft } from 'lucide-react'
import type { Prescription } from './prescriptions'
import AudioPlayer from './AudioPlayer'
import { FadeIn } from '../../ui/animations'

interface Props {
  data: Prescription
  onDone: () => void
  onBack: () => void
}

export default function PrescriptionCard({ data, onDone, onBack }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null)

  // Load and select the best voice
  useEffect(() => {
    const loadVoices = () => {
        const available = window.speechSynthesis.getVoices()
        // Priority list for smooth female voices
        const preferred = available.find(v => 
            v.name.includes("Google US English") || 
            v.name.includes("Zira") || 
            v.name.includes("Samantha") ||
            (v.name.includes("Female") && v.lang.startsWith("en"))
        )
        setVoice(preferred || available[0] || null)
    }

    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices

    return () => {
        window.speechSynthesis.cancel()
        window.speechSynthesis.onvoiceschanged = null
    }
  }, [])

  const handleSpeak = () => {
    if (isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        return
    }

    const utterance = new SpeechSynthesisUtterance()
    utterance.text = `Here is what to say. ${data.say}. And here is what to do. ${data.do}`
    utterance.rate = 0.9 
    utterance.pitch = 1.1 // Slightly higher pitch often sounds softer/more feminine
    if (voice) utterance.voice = voice
    
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    setIsSpeaking(true)
  }

  return (
    <div className="h-full flex flex-col pb-6">
      <AudioPlayer />
      
      <FadeIn className="flex-1 space-y-6">
          {/* Action Header: Back + Read Aloud */}
          <div className="flex justify-between items-center">
            <button 
                onClick={onBack}
                className="flex items-center space-x-1 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors"
            >
                <ChevronLeft size={16} />
                <span>Back</span>
            </button>

            <button 
                onClick={handleSpeak}
                className="flex items-center space-x-2 text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-transform"
            >
                {isSpeaking ? (
                    <>
                        <Square size={14} className="fill-current text-red-500" />
                        <span className="text-red-500">Stop</span>
                    </>
                ) : (
                    <>
                        <Volume2 size={14} />
                        <span>Read Aloud</span>
                    </>
                )}
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border-l-8 border-certainty-blue relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Volume2 size={100} />
            </div>
            
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Say this (Exact words)
            </p>
            <p className="text-2xl font-black text-slate-800 leading-tight relative z-10">
                "{data.say}"
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
               <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">
                        Do This
                    </p>
                    <p className="font-bold text-emerald-900 text-lg">
                        {data.do}
                    </p>
               </div>
               
               <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100 opacity-80">
                    <p className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-1">
                        Avoid This
                    </p>
                    <p className="font-medium text-rose-900">
                        {data.avoid}
                    </p>
               </div>
          </div>
      </FadeIn>

      <div className="mt-6">
        <button 
           onClick={onDone}
           className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-slate-900/20 active:scale-95 transition-transform flex items-center justify-center space-x-2"
        >
            <Check size={24} strokeWidth={3} />
            <span>I did this</span>
        </button>
      </div>
    </div>
  )
}
