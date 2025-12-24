import { useState, useMemo, useEffect } from 'react'
import { FadeIn, SlideIn } from '../../ui/animations'
import { BookOpen, User, ChevronRight, Activity as ActivityIcon, Sparkles, Flame, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useProgress } from '../../context/ProgressContext'
import ConceptLibrary from './ConceptLibrary'
import ActivityFinder from './ActivityFinder'
import SignOutModal from '../auth/SignOutModal'
import { getDailyWisdom } from './wisdom'
import { registerServiceWorker, requestNotificationPermission, sendTestNotification } from '../../lib/notifications'

export default function Dashboard() {
  const { user, signInWithGoogle, signOut } = useAuth()
  const { history, streak } = useProgress()
  const [view, setView] = useState<'home' | 'library' | 'history'>('home')
  const [showActivityFinder, setShowActivityFinder] = useState(false)
  const [showSignOut, setShowSignOut] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(Notification.permission === 'granted')

  useEffect(() => {
      registerServiceWorker();
  }, [])
  
  const dailyWisdom = useMemo(() => getDailyWisdom(), [])
  
  // Get first name if available, otherwise "Safe Parent"
  const displayName = user?.user_metadata?.full_name?.split(' ')[0] || 'Parent'

  const handleSignOut = async () => {
    await signOut()
    setShowSignOut(false)
  }

  const handleEnableNotifications = async () => {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
      if (granted) {
          sendTestNotification();
      }
  }

    if (showActivityFinder) {
        return <ActivityFinder onClose={() => setShowActivityFinder(false)} />
    }
    
    // ... View Logic for Library/History (unchanged) works because we return early

  if (view === 'library') {
      return (
        <div className="w-full max-w-md mx-auto h-full px-6 pt-8">
            <ConceptLibrary onBack={() => setView('home')} />
        </div>
      )
  }

  if (view === 'history') {
      return (
          <div className="w-full max-w-md mx-auto h-full px-6 pt-8 flex flex-col">
              <div className="flex items-center mb-6">
                  <button onClick={() => setView('home')} className="bg-white p-2 rounded-full shadow-sm border border-slate-200 mr-4">
                       <ChevronRight className="rotate-180" size={20} />
                  </button>
                  <h2 className="text-2xl font-black text-slate-900">Your History</h2>
              </div>
              
              <div className="space-y-4 overflow-y-auto pb-24 hide-scrollbar">
                  {history.map((record) => (
                      <div key={record.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                          <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-slate-800 capitalize">{record.situation.replace('-', ' ')}</span>
                              <span className="text-xs text-slate-400 font-mono">{new Date(record.date).toLocaleDateString()}</span>
                          </div>
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold uppercase">{record.age}</span>
                      </div>
                  ))}
                  {history.length === 0 && (
                      <p className="text-center text-slate-400 py-10">No history found.</p>
                  )}
              </div>
          </div>
      )
  }

  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col pt-8 pb-24 px-6 overflow-y-auto hide-scrollbar">
      
      {showSignOut && (
          <SignOutModal 
              onConfirm={handleSignOut} 
              onCancel={() => setShowSignOut(false)} 
          />
      )}
      
      {/* Header */}
      <FadeIn className="mb-8">
        <div className="flex justify-between items-center bg-white/90 backdrop-blur-xl border border-slate-200 p-6 rounded-3xl shadow-lg">
            <div>
               <p className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">
                 {user ? 'Good Morning,' : 'Welcome'}
               </p>
               <h1 className="text-3xl font-black text-black tracking-tight">
                 {user ? displayName : 'Certainty starts here.'}
               </h1>
            </div>
            
            {user ? (
                <button 
                    onClick={() => setShowSignOut(true)}
                    className="h-12 w-12 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200 shadow-inner flex items-center justify-center hover:ring-2 hover:ring-red-400 transition-all focus:outline-none"
                    title="Sign Out"
                >
                    {user.user_metadata?.avatar_url ? (
                         <img src={user.user_metadata.avatar_url} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                         <User className="h-6 w-6 text-slate-800" />
                    )}
                </button>
            ) : (
                <button 
                  onClick={signInWithGoogle}
                  className="bg-white text-slate-700 px-4 py-2.5 rounded-full font-bold border border-slate-300 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all flex items-center space-x-3"
                >
                    {/* Google Icon */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    <span className="text-sm font-medium">Sign in with Google</span>
                </button>
            )}
        </div>
      </FadeIn>

      {/* Daily Wisdom Card */}
      <SlideIn className="mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl shadow-slate-900/40 p-8 border border-slate-800">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-indigo-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-blue-600/20 blur-3xl"></div>
            
            <div className="relative z-10">
                <div className="flex items-center space-x-2 text-white mb-4">
                    <Sparkles size={18} fill="currentColor" className="text-yellow-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-white/90">Daily Wisdom</span>
                </div>
                <h2 className="text-2xl font-black leading-tight mb-4 text-white drop-shadow-md font-serif italic">
                    "{dailyWisdom.text}"
                </h2>
                <p className="text-white text-base mb-6 leading-relaxed font-bold opacity-90">
                    — {dailyWisdom.author}
                </p>
                <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
            </div>
        </div>
      </SlideIn>

      {/* Quick Actions / Modules */}
      <SlideIn className="">
        <h3 className="text-xl font-bold text-certainty-dark mb-5">Your Tools</h3>
        <div className="grid grid-cols-2 gap-4">
            
            {/* Calm Streak (Existing) */}
            <div className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl p-6 rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer group">
                 <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <Flame size={24} />
                </div>
                <h4 className="text-lg font-bold text-certainty-dark">Calm Streak</h4>
                <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-2xl font-black text-rose-600">{streak}</span>
                    <span className="text-sm text-slate-700 font-medium">days</span>
                </div>
            </div>

            {/* Notification Toggle (New) */}
            <div 
                onClick={handleEnableNotifications}
                className={`bg-white/95 backdrop-blur-xl border-2 ${notificationsEnabled ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'} shadow-xl p-6 rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer group`}
            >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 transition-colors ${notificationsEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                    <Bell size={24} />
                </div>
                <h4 className="text-lg font-bold text-certainty-dark">
                    {notificationsEnabled ? 'Reminders On' : 'Get Reminders'}
                </h4>
                <p className="text-sm text-slate-700 font-medium mt-1 leading-snug">
                    {notificationsEnabled ? 'Active' : 'Stay on track'}
                </p>
            </div>

            {/* Activity Finder */}
            <div 
                onClick={() => setShowActivityFinder(true)}
                className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl p-6 rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer group"
            >
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                    <ActivityIcon size={24} />
                </div>
                <h4 className="text-lg font-bold text-certainty-dark">Find Activity</h4>
                <p className="text-sm text-slate-700 font-medium mt-1 leading-snug">Boredom busters</p>
            </div>

            {/* Library */}
            <div 
                onClick={() => setView('library')}
                className="bg-white/95 backdrop-blur-xl border border-slate-200 shadow-xl p-6 rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer group"
            >
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <BookOpen size={24} />
                </div>
                <h4 className="text-lg font-bold text-certainty-dark">Concept Library</h4>
                <p className="text-sm text-slate-700 font-medium mt-1 leading-snug">Deep dives</p>
            </div>
        </div>
      </SlideIn>

       {/* Recent History */}
       <FadeIn className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-certainty-dark">Recent</h3>
                {history.length > 0 && (
                    <button onClick={() => setView('history')} className="text-sm text-certainty-blue font-bold hover:underline">View All</button>
                )}
            </div>
            
            {history.length > 0 ? (
                <div 
                    onClick={() => setView('history')}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer"
                >
                    <div>
                        <p className="font-bold text-lg text-certainty-dark capitalize">
                            {history[0].situation.replace('-', ' ')}
                        </p>
                        <p className="text-sm text-slate-600 font-medium">
                            {new Date(history[0].date).toLocaleDateString()} • {history[0].age}
                        </p>
                    </div>
                    <ChevronRight size={24} className="text-slate-400" />
                </div>
            ) : (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center">
                    <p className="text-slate-400 font-medium">No crises yet. You're doing great.</p>
                </div>
            )}
       </FadeIn>

    </div>
  )
}
