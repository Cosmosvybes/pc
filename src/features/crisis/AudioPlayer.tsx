import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const togglePlay = () => {
    if (isPlaying) {
      // Fade out and stop
      const gain = gainNodeRef.current
      if (gain) {
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContextRef.current!.currentTime + 0.1)
      }
      setTimeout(() => {
        audioContextRef.current?.suspend()
        setIsPlaying(false)
      }, 100)
    } else {
      // Init or Resume
      if (!audioContextRef.current) {
        initAudio()
      }
      audioContextRef.current?.resume()
      
      // Fade in
      const gain = gainNodeRef.current
      if (gain) {
        gain.gain.cancelScheduledValues(0)
        gain.gain.setValueAtTime(0.0001, audioContextRef.current!.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.15, audioContextRef.current!.currentTime + 1) // 0.15 is plenty loud for noise
      }
      
      setIsPlaying(true)
    }
  }

  const initAudio = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    const ctx = new AudioContext()
    audioContextRef.current = ctx

    // Brown Noise Generator
    const bufferSize = 4096
    const brownNoise = ctx.createScriptProcessor(bufferSize, 1, 1)
    
    let lastOut = 0
    brownNoise.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        output[i] = (lastOut + (0.02 * white)) / 1.02
        lastOut = output[i]
        output[i] *= 3.5 // Compensate for gain
      }
    }

    // Add some Low Pass filter to make it warmer (Rain-like)
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 400

    const gainNode = ctx.createGain()
    gainNode.gain.value = 0 // Start silent
    gainNodeRef.current = gainNode

    brownNoise.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    // Keep it running
    // Note: ScriptProcessor is deprecated but widely supported. 
    // Ideally use AudioWorklet but that requires separate file loading which complicates this setup.
  }

  useEffect(() => {
    return () => {
      audioContextRef.current?.close()
    }
  }, [])

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex items-center space-x-4 mb-4">
       <button 
        onClick={togglePlay}
        className="h-12 w-12 shrink-0 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 active:scale-95 transition-transform hover:bg-indigo-700"
       >
         {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
       </button>
       
       <div className="flex-1 min-w-0">
         <p className="text-sm font-extrabold text-slate-800 mb-0.5 truncate flex items-center">
            {isPlaying ? 'Generative Brown Noise' : 'Play Calm Focus'}
         </p>
         <p className="text-xs text-slate-400 font-medium truncate">
            {isPlaying ? 'Active • Noise Cancellation' : 'Deep rain sounds for regulation'}
         </p>
       </div>

       <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
            <Volume2 size={16} className={`text-indigo-400 ${isPlaying ? 'animate-pulse' : ''}`} />
       </div>
    </div>
  )
}
