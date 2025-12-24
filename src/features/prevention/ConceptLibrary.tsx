import { useState } from 'react'
import { FadeIn } from '../../ui/animations'
import { CONCEPTS } from './concepts'
import type { Concept } from './concepts'
import { ChevronLeft, Clock } from 'lucide-react'

export default function ConceptLibrary({ onBack }: { onBack: () => void }) {
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)

  if (selectedConcept) {
    return (
        <FadeIn className="h-full flex flex-col">
            <button onClick={() => setSelectedConcept(null)} className="flex items-center text-slate-500 font-bold mb-6 hover:text-certainty-dark">
                <ChevronLeft size={20} />
                <span>Back to Library</span>
            </button>
            
            <div className="flex-1 overflow-y-auto hide-scrollbar pb-24">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 ${selectedConcept.color}`}>
                    {selectedConcept.icon}
                </div>
                
                <h1 className="text-3xl font-black text-certainty-dark mb-2">{selectedConcept.title}</h1>
                <div className="flex items-center text-slate-400 text-sm font-bold mb-8">
                    <Clock size={16} className="mr-1" />
                    <span>{selectedConcept.readTime} read</span>
                </div>

                <div className="prose prose-slate prose-lg">
                    {selectedConcept.content.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-4 text-slate-700 leading-relaxed font-medium">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </div>
        </FadeIn>
    )
  }

  return (
    <FadeIn className="h-full flex flex-col">
       <button onClick={onBack} className="flex items-center text-slate-500 font-bold mb-6 hover:text-certainty-dark">
            <ChevronLeft size={20} />
            <span>Back to Dashboard</span>
       </button>

       <h2 className="text-2xl font-black text-certainty-dark mb-6">Concept Library</h2>

       <div className="grid gap-4 overflow-y-auto hide-scrollbar pb-24">
         {CONCEPTS.map((concept) => (
             <button 
                key={concept.id}
                onClick={() => setSelectedConcept(concept)}
                className="text-left bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md hover:border-certainty-blue transition-all group"
             >
                <div className="flex items-start justify-between mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${concept.color}`}>
                        {concept.icon}
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        {concept.readTime}
                    </span>
                </div>
                <h3 className="text-lg font-bold text-certainty-dark mb-1 group-hover:text-certainty-blue transition-colors">
                    {concept.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium line-clamp-2">
                    {concept.description}
                </p>
             </button>
         ))}
       </div>
    </FadeIn>
  )
}
