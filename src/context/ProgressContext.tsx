import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

export interface CrisisRecord {
  id: string;
  date: string;
  age: string;
  situation: string;
  durationSeconds: number;
}

interface ProgressContextType {
  history: CrisisRecord[];
  totalCrises: number;
  streak: number;
  addCrisis: (record: Omit<CrisisRecord, 'id' | 'date'>) => void;
  clearHistory: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<CrisisRecord[]>([])

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pc_progress')
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse progress history", e)
      }
    }
  }, [])

  // Save to local storage whenever history changes
  useEffect(() => {
    localStorage.setItem('pc_progress', JSON.stringify(history))
  }, [history])

  const addCrisis = (record: Omit<CrisisRecord, 'id' | 'date'>) => {
    const newRecord: CrisisRecord = {
      ...record,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    }
    setHistory(prev => [newRecord, ...prev])
  }

  const clearHistory = () => setHistory([])

  // Calculate Streak (Days since last crisis)
  const streak = history.length > 0 
    ? Math.floor((new Date().getTime() - new Date(history[0].date).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <ProgressContext.Provider value={{
      history,
      totalCrises: history.length,
      streak,
      addCrisis,
      clearHistory
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}
