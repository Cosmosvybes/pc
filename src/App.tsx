import { useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import CrisisMode from './features/crisis/CrisisMode'
import Dashboard from './features/prevention/Dashboard'

function AppContent() {
  const [isCrisis, setIsCrisis] = useState(false)

  const triggerCrisis = () => setIsCrisis(true)
  const handleCoached = () => setIsCrisis(false)

  return (
    <div className="h-screen w-full bg-relief-white text-certainty-dark overflow-hidden font-sans selection:bg-certainty-blue selection:text-white">
      {isCrisis ? (
        <CrisisMode onExit={handleCoached} />
      ) : (
        <>
            <div className="h-full w-full relative z-0">
               <Dashboard onPanic={triggerCrisis} />
              
              {/* Bottom Floating Navigation for "Okay" Mode */}
              <div className="fixed bottom-6 left-0 right-0 px-6 max-w-md mx-auto z-50">
                  <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl rounded-full p-2 flex items-center justify-between pl-6 pr-2">
                       <div className="flex space-x-2 text-sm font-bold text-slate-500">
                          <span className="text-certainty-dark font-extrabold text-base">ParentingCertainty</span>
                       </div>

                       <button 
                        onClick={triggerCrisis}
                        className="bg-rose-600 text-white px-6 py-3 rounded-full font-black shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all opacity-100 border-2 border-transparent animate-pulse hover:animate-none"
                       >
                           <ShieldAlert size={20} strokeWidth={2.5} />
                           <span className="tracking-wide">Help Me Now</span>
                       </button>
                  </div>
              </div>
            </div>
        </>
      )}
    </div>
  )
}

function App() {
  return <AppContent />
}

export default App
