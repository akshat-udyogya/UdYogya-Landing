import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { LenisProvider } from '@/lib/lenis'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Udyogya — India's Expert Network, In Your Pocket",
  description:
    'Connect with verified professionals in minutes. Chat free forever. GST-compliant invoices for every consultation. Download on Android.',
  openGraph: {
    title:       "Udyogya — India's Expert Network",
    description: 'Chat with verified experts — free, forever.',
    url:         'https://udyogya.com',
    siteName:    'Udyogya',
    locale:      'en_IN',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-background text-white antialiased overflow-x-hidden">
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}
