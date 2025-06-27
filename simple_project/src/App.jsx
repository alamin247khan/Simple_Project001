import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import { useToast } from './components/Toast'
import { storage } from './utils/storage'
import { fetchGoogleUserData, fetchGitHubUserData, getDeviceInfo, getLocationData, getNetworkInfo, getIPInfo } from './utils/apiClient'
import { trackUserBehavior, getAdvancedFingerprint } from './utils/analytics'
import { createRealtimeMonitor } from './utils/realtime'
import UserProfile from './components/UserProfile'
import AuthButtons from './components/AuthButtons'
import Toast from './components/Toast'
import './App.css'

function App() {
  const { user, loading, error, additionalInfo, signIn, signOut, providers } = useAuth()
  const { toasts, addToast, removeToast } = useToast()
  const [userInfo, setUserInfo] = useState(() => storage.get('userInfo'))
  const [providerData, setProviderData] = useState(() => storage.get('providerData'))
  const [extendedData, setExtendedData] = useState(() => storage.get('extendedData'))
  const [deviceInfo] = useState(() => getDeviceInfo())
  const [locationData, setLocationData] = useState(null)
  const [networkInfo] = useState(() => getNetworkInfo())
  const [ipInfo, setIpInfo] = useState(() => storage.get('ipInfo'))
  const [behaviorData, setBehaviorData] = useState(null)
  const [advancedFingerprint, setAdvancedFingerprint] = useState(null)
  const [realtimeMonitor, setRealtimeMonitor] = useState(null)
  const [realtimeData, setRealtimeData] = useState(null)
  
  const handleSignIn = async (providerType) => {
    try {
      const provider = providers[providerType]
      const result = await signIn(provider)
      const info = {
        operationType: result.operationType,
        providerId: result.providerId,
        timestamp: Date.now(),
        isNewUser: result.additionalUserInfo?.isNewUser,
        username: result.additionalUserInfo?.username,
        profile: result.additionalUserInfo?.profile,
        accessToken: result.accessToken,
        idToken: result.idToken
      }
      setUserInfo(info)
      setProviderData(result.additionalUserInfo)
      storage.set('userInfo', info)
      storage.set('providerData', result.additionalUserInfo)
      
      // Fetch extended data from provider APIs and additional sources
      const [apiData, location, ip, advanced] = await Promise.all([
        result.accessToken ? (
          providerType === 'google' 
            ? fetchGoogleUserData(result.accessToken)
            : fetchGitHubUserData(result.accessToken)
        ) : null,
        getLocationData(),
        ipInfo ? null : getIPInfo(),
        getAdvancedFingerprint()
      ])
      
      // Start behavior tracking and real-time monitoring
      const behavior = trackUserBehavior()
      setBehaviorData(behavior)
      storage.set('behaviorData', behavior)
      
      const monitor = createRealtimeMonitor()
      setRealtimeMonitor(monitor)
      
      // Update realtime data every 2 seconds
      const realtimeInterval = setInterval(() => {
        setRealtimeData(monitor.getData())
      }, 2000)
      
      if (apiData) {
        setExtendedData(apiData)
        storage.set('extendedData', apiData)
      }
      
      if (location) {
        setLocationData(location)
        storage.set('locationData', location)
      }
      
      if (ip && !ipInfo) {
        setIpInfo(ip)
        storage.set('ipInfo', ip)
      }
      
      if (advanced) {
        setAdvancedFingerprint(advanced)
        storage.set('advancedFingerprint', advanced)
      }
      
      // Store cleanup function
      window.authCleanup = () => {
        clearInterval(realtimeInterval)
        monitor.stop()
      }
      
      addToast(`Welcome ${result.user.displayName || 'User'}!`, 'success')
    } catch (error) {
      addToast(error.message, 'error')
    }
  }
  
  const handleSignOut = async () => {
    try {
      // Cleanup monitoring
      if (window.authCleanup) {
        window.authCleanup()
        delete window.authCleanup
      }
      
      await signOut()
      setUserInfo(null)
      setProviderData(null)
      setExtendedData(null)
      setLocationData(null)
      setBehaviorData(null)
      setAdvancedFingerprint(null)
      setRealtimeMonitor(null)
      setRealtimeData(null)
      storage.remove('userInfo')
      storage.remove('providerData')
      storage.remove('extendedData')
      storage.remove('locationData')
      addToast('Signed out successfully', 'info')
    } catch (error) {
      addToast('Sign out failed', 'error')
    }
  }

  if (loading) return <div className="loading">Authenticating...</div>
  
  return (
    <>
      <div className="app">
        <h1>🔐 Authentication Demo</h1>
        {error && <div className="error">Error: {error}</div>}
        {!user ? (
          <AuthButtons 
            onGoogleSignIn={() => handleSignIn('google')}
            onGithubSignIn={() => handleSignIn('github')}
            loading={loading}
          />
        ) : (
          <UserProfile 
            user={user} 
            userInfo={userInfo}
            providerData={providerData}
            extendedData={extendedData}
            deviceInfo={deviceInfo}
            locationData={locationData}
            networkInfo={networkInfo}
            ipInfo={ipInfo}
            behaviorData={behaviorData}
            advancedFingerprint={advancedFingerprint}
            realtimeData={realtimeData}
            onSignOut={handleSignOut}
          />
        )}
      </div>
      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  )
}

export default App
