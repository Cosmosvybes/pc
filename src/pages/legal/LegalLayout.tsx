import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function LegalLayout({ title, children }: { title: string, children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <a href="/" className="inline-flex items-center text-indigo-600 font-bold mb-8 hover:underline">
          <ArrowLeft className="mr-2" size={20} /> Back to App
        </a>
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <h1 className="text-3xl font-black mb-8 border-b pb-4">{title}</h1>
          <div className="prose prose-slate max-w-none">
            {children}
          </div>
        </div>
        <div className="mt-8 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} ParentingCertainty. All rights reserved.
        </div>
      </div>
    </div>
  );
}
