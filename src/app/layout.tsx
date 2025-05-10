import type { Metadata } from "next"
import { Inter } from "next/font/google"
import '@/styles/globals.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "PetMatch",
  description: "Encontre seu melhor amigo",
}

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