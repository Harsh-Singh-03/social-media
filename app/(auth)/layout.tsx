import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from "@clerk/nextjs"
import { dark } from '@clerk/themes'
import { Toaster } from '@/components/ui/toaster'
import { LoaderProvider } from '@/components/ui/LoaderContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Threads | Auth',
  description: 'Authentication of next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark
    }}>
      <LoaderProvider>
        <html lang="en">
          <meta name="theme-color" content="#121417" />
          <body className={`${inter.className} bg-dark-1`}>
            {children}
            <Toaster />
          </body>
        </html>
      </LoaderProvider>
    </ClerkProvider>
  )
}
