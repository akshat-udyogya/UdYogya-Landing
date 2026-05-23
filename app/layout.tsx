import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans, Orbitron } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// Aeonik Pro substitute — humanist geometric, same warm editorial character
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
})

// Orbitron — futuristic industrial heading font for Digital Twin Hub
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
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
    <html lang="en" className={`${inter.variable} ${jakartaSans.variable} ${orbitron.variable}`}>
      <body className="bg-background text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
