import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import axios, { type AxiosInstance } from 'axios'

export interface AuthUser {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  token: string | null
  user: AuthUser | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
  api: AxiosInstance
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const baseURL = window.location.origin.replace('5173', '5000');

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('iris_token'))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('iris_user')
    return stored ? (JSON.parse(stored) as AuthUser) : null
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem('iris_token', token)
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    } else {
      localStorage.removeItem('iris_token')
      delete api.defaults.headers.common.Authorization
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem('iris_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('iris_user')
    }
  }, [user])

  const login = (newToken: string, newUser: AuthUser) => {
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
      api,
    }),
    [token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
