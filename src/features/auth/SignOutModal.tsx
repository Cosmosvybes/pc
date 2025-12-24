import { LogOut, X } from 'lucide-react'
import { FadeIn } from '../../ui/animations'

interface Props {
  onConfirm: () => void
  onCancel: () => void
}

export default function SignOutModal({ onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm">
      <FadeIn className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl shadow-slate-900/20 border border-slate-100">
        <div className="flex justify-between items-start mb-6">
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <LogOut size={24} />
            </div>
            <button onClick={onCancel} className="text-slate-300 hover:text-slate-500">
                <X size={24} />
            </button>
        </div>
        
        <h3 className="text-xl font-black text-slate-900 mb-2">Sign Out?</h3>
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
            You will need to sign in again to access your history and Pro features.
        </p>

        <div className="space-y-3">
            <button 
                onClick={onConfirm}
                className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-red-200 active:scale-95 transition-transform"
            >
                Yes, Sign Out
            </button>
            <button 
                onClick={onCancel}
                className="w-full bg-white text-slate-500 py-3 rounded-2xl font-bold text-sm border border-slate-200 active:scale-95 transition-transform hover:bg-slate-50"
            >
                Cancel
            </button>
        </div>
      </FadeIn>
    </div>
  )
}
