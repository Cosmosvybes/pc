import { Check, X, AlertCircle } from 'lucide-react'
import { FadeIn } from '../../ui/animations'

export type PaymentStatus = 'idle' | 'success' | 'cancelled' | 'error'

interface Props {
    status: PaymentStatus;
    onClose: () => void;
}

export default function PaymentFeedbackModal({ status, onClose }: Props) {
    if (status === 'idle') return null;

    const content = {
        success: {
            icon: <Check size={32} className="text-emerald-500" />,
            title: 'Welcome to Pro!',
            message: 'Your subscription is now active.',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            btn: 'bg-emerald-500 hover:bg-emerald-600'
        },
        cancelled: {
            icon: <X size={32} className="text-slate-400" />,
            title: 'Payment Cancelled',
            message: 'No charge was made.',
            bg: 'bg-slate-50',
            border: 'border-slate-200',
            btn: 'bg-slate-800 hover:bg-slate-900'
        },
        error: {
            icon: <AlertCircle size={32} className="text-rose-500" />,
            title: 'Something went wrong',
            message: 'Please try again.',
            bg: 'bg-rose-50',
            border: 'border-rose-100',
            btn: 'bg-rose-500 hover:bg-rose-600'
        }
    }[status];

    if (!content) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <FadeIn className={`w-full max-w-xs ${content.bg} border ${content.border} rounded-3xl p-6 shadow-2xl text-center`}>
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    {content.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">{content.title}</h3>
                <p className="text-slate-500 font-medium mb-6 text-sm">{content.message}</p>
                <button 
                    onClick={onClose}
                    className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 ${content.btn}`}
                >
                    Okay
                </button>
            </FadeIn>
        </div>
    )
}
