import React from 'react'
import { Provider } from 'react-redux'
import { store } from '@/app/store'

interface ProviderProps {
  children: React.ReactNode
}

export default function ReduxStoreProvider({ children }: ProviderProps) {
  return <Provider store={store}>{children}</Provider>
}
