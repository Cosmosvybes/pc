import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface SubscriptionContextType {
  isPro: boolean;
  upgradeToPro: () => void; // For testing/simulation
  downgradeToFree: () => void;
  isLoading: boolean;
  trialDaysLeft: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(0)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = () => {
    // 1. Check if actively subscribed (Manual override or Lemon Squeezy webhook in real app)
    const status = localStorage.getItem('pc_pro_status')
    if (status === 'active') {
        setIsPro(true)
        setTrialDaysLeft(0)
        setIsLoading(false)
        return
    }

    // 2. Check Guest Trial Status
    let startStr = localStorage.getItem('pc_trial_start')
    if (!startStr) {
        startStr = new Date().toISOString()
        localStorage.setItem('pc_trial_start', startStr)
    }

    const startDate = new Date(startStr)
    const now = new Date()
    const diffMs = now.getTime() - startDate.getTime()
    const hoursPassed = diffMs / (1000 * 60 * 60)
    
    // 3 Days = 72 Hours
    if (hoursPassed < 72) {
        setIsPro(true)
        const daysLeft = 3 - Math.floor(hoursPassed / 24)
        setTrialDaysLeft(daysLeft)
    } else {
        setIsPro(false)
        setTrialDaysLeft(0)
    }
    
    setIsLoading(false)
  }

  const upgradeToPro = () => {
    setIsPro(true)
    localStorage.setItem('pc_pro_status', 'active')
    setTrialDaysLeft(0)
  }

  const downgradeToFree = () => {
    setIsPro(false)
    localStorage.removeItem('pc_pro_status')
    // Reset trial for testing? No, trial is consumed.
  }

  return (
    <SubscriptionContext.Provider value={{ isPro, upgradeToPro, downgradeToFree, isLoading, trialDaysLeft }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}
