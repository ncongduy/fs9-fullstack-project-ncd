import { createContext, useState } from 'react'
import { UserDocument } from '../types'

export const GlobalContext = createContext<any>(null)

function GlobalProvider({ children }: any) {
  const [user, setUser] = useState<UserDocument | null>(null)
  const [error, setError] = useState<string | null>(null)

  const value = {
    user,
    setUser,
    error,
    setError,
  }

  return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}

export default GlobalProvider
