import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'ett_auth'

function loadAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth)

  const value = useMemo(() => {
    const setSession = (session) => {
      setAuth(session)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    }

    const clearSession = () => {
      setAuth(null)
      localStorage.removeItem(STORAGE_KEY)
    }

    return {
      auth,
      setSession,
      clearSession,
      isAuthenticated: Boolean(auth?.token),
    }
  }, [auth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.')
  }
  return context
}