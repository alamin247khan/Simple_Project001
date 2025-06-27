import { useState, useEffect } from 'react'
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup, signOut, onAuthStateChanged, getAdditionalUserInfo } from 'firebase/auth'
import { auth } from '../fairbase/fairbase.init.js'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [additionalInfo, setAdditionalInfo] = useState(null)

  const googleProvider = new GoogleAuthProvider()
  const githubProvider = new GithubAuthProvider()
  
  // Request maximum OAuth scopes for comprehensive user data
  googleProvider.addScope('https://www.googleapis.com/auth/userinfo.profile')
  googleProvider.addScope('https://www.googleapis.com/auth/userinfo.email')
  googleProvider.addScope('https://www.googleapis.com/auth/user.birthday.read')
  googleProvider.addScope('https://www.googleapis.com/auth/user.gender.read')
  googleProvider.addScope('https://www.googleapis.com/auth/user.phonenumbers.read')
  googleProvider.addScope('https://www.googleapis.com/auth/user.addresses.read')
  googleProvider.addScope('https://www.googleapis.com/auth/plus.me')
  googleProvider.setCustomParameters({
    prompt: 'consent',
    access_type: 'offline',
    include_granted_scopes: 'true'
  })
  
  githubProvider.addScope('user:email')
  githubProvider.addScope('read:user')
  githubProvider.addScope('user:follow')
  githubProvider.addScope('public_repo')
  githubProvider.addScope('repo')
  githubProvider.addScope('read:org')
  githubProvider.addScope('read:public_key')
  githubProvider.addScope('read:gpg_key')
  githubProvider.setCustomParameters({
    allow_signup: 'true'
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signIn = async (provider) => {
    setLoading(true)
    setError(null)
    try {
      const result = await signInWithPopup(auth, provider)
      const additionalUserInfo = getAdditionalUserInfo(result)
      setAdditionalInfo(additionalUserInfo)
      
      // Extract access token for API calls
      const credential = provider.providerId === 'google.com' 
        ? GoogleAuthProvider.credentialFromResult(result)
        : GithubAuthProvider.credentialFromResult(result)
      
      return { 
        ...result, 
        additionalUserInfo,
        accessToken: credential?.accessToken,
        idToken: credential?.idToken
      }
    } catch (error) {
      setError(error.message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      setError(error.message)
    }
  }

  return {
    user,
    loading,
    error,
    additionalInfo,
    signIn,
    signOut: signOutUser,
    providers: { google: googleProvider, github: githubProvider }
  }
}