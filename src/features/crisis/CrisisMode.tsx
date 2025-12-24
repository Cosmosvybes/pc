import { useState } from 'react'
import { PRESCRIPTIONS } from './prescriptions'
import type { AgeGroup, Situation, Prescription } from './prescriptions'
import AgeSelection from './AgeSelection'
import SituationSelection from './SituationSelection'
import PrescriptionCard from './PrescriptionCard'
import Paywall from '../auth/Paywall'
import { useProgress } from '../../context/ProgressContext'
import { useSubscription } from '../../context/SubscriptionContext'
import { generateCrisisScript } from '../../lib/gemini'
import { Loader2 } from 'lucide-react'
import { FadeIn } from '../../ui/animations'

interface Props {
  onExit: () => void
}

type Step = 'age' | 'situation' | 'prescription'

export default function CrisisMode({ onExit }: Props) {
  const [step, setStep] = useState<Step>('age')
  const [age, setAge] = useState<AgeGroup | null>(null)
  const [situation, setSituation] = useState<Situation | null>(null)
  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { addCrisis } = useProgress()
  const { isPro } = useSubscription()

  const handleAgeSelect = (selectedAge: AgeGroup) => {
    setAge(selectedAge)
    setStep('situation')
  }

  const handleSituationSelect = async (selectedSituation: Situation) => {
    setSituation(selectedSituation)
    setStep('prescription')
    
    // AI GENERATION START
    setLoading(true)
    try {
        if (!age) throw new Error("Age missing");
        
        // 1. Try AI
        const aiResult = await generateCrisisScript(age, selectedSituation);
        setPrescription(aiResult);
    } catch (error) {
        console.error("AI Failed, using fallback:", error);
        // 2. Fallback to Static
        if (age) {
            setPrescription(PRESCRIPTIONS[age][selectedSituation]);
        }
    } finally {
        setLoading(false);
    }
  }

  const handleDone = () => {
    if (age && situation) {
        addCrisis({ age, situation, durationSeconds: 0 }) 
    }
    onExit()
  }

  const renderContent = () => {
    if (step === 'age') {
      return <AgeSelection onSelect={handleAgeSelect} />
    }
    if (step === 'situation') {
      return <SituationSelection onSelect={handleSituationSelect} onBack={() => setStep('age')} />
    }
    if (step === 'prescription') {
        if (!isPro) {
            return <Paywall />
        }
        
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 animate-in fade-in duration-500">
                    <div className="relative">
                        <div className="absolute inset-0 bg-certainty-blue/20 blur-xl rounded-full animate-pulse"></div>
                        <Loader2 className="w-12 h-12 text-certainty-blue animate-spin relative z-10" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">Consulting Clinical Protocol...</h3>
                    <p className="text-slate-500 max-w-xs mx-auto">
                        Matching situation with proven psychological strategies.
                    </p>
                </div>
            )
        }

        if (prescription) {
             return <PrescriptionCard data={prescription} onDone={handleDone} onBack={() => setStep('situation')} />
        }
    }
    return null
  }

  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col pt-8 pb-4 px-6">
      {/* Header / Exit */}
      {step !== 'prescription' && (
        <FadeIn className="flex justify-between items-center mb-6">
           <button 
            onClick={onExit}
            className="text-slate-400 hover:text-slate-600 font-medium px-2"
          >
            Cancel
          </button>
          <div className="flex space-x-2">
            <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${step === 'age' ? 'bg-certainty-blue shadow-glow' : 'bg-slate-200'}`} />
            <div className={`h-2 w-2 rounded-full transition-colors duration-300 ${step === 'situation' ? 'bg-certainty-blue shadow-glow' : 'bg-slate-200'}`} />
            <div className="h-2 w-2 rounded-full bg-slate-200" />
          </div>
          <div className="w-12"></div>
        </FadeIn>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {renderContent()}
      </div>
    </div>
  )
}
