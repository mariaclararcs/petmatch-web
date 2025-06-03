'use client'

import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
// import { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

/* export const metadata: Metadata = {
  title: "PetMatch",
  description: "Encontre seu melhor amigo",
} */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt_BR">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}