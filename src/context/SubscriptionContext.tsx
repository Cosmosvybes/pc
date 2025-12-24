import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

interface SubscriptionContextType {
  isPro: boolean;
  upgradeToPro: () => void; // For testing/simulation
  downgradeToFree: () => void;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPro, setIsPro] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check local storage or Supabase for subscription status
    // For now, we simulate a check
    const status = localStorage.getItem('quietkid_pro_status')
    setIsPro(status === 'active')
    setIsLoading(false)
  }, [])

  const upgradeToPro = () => {
    setIsPro(true)
    localStorage.setItem('quietkid_pro_status', 'active')
  }

  const downgradeToFree = () => {
    setIsPro(false)
    localStorage.removeItem('quietkid_pro_status')
  }

  return (
    <SubscriptionContext.Provider value={{ isPro, upgradeToPro, downgradeToFree, isLoading }}>
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
