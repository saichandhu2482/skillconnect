import { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase/config'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'

const SessionContext = createContext()

export function useSession() {
  return useContext(SessionContext)
}

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  const signup = (email, password, name) =>
    createUserWithEmailAndPassword(auth, email, password).then(res =>
      updateProfile(res.user, { displayName: name })
    )

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const logout = () => signOut(auth)

  return (
    <SessionContext.Provider value={{ user, signup, login, logout, loading }}>
      {!loading && children}
    </SessionContext.Provider>
  )
}
