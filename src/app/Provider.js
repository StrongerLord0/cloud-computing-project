"use client"
import { AppProvider } from '@/context/AppContext'
import { SessionProvider } from 'next-auth/react'

export function Providers({ children }) {
    return (
        <SessionProvider>
            <AppProvider>
                {children}
            </AppProvider>
        </SessionProvider>
    )
}