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

// udyogya.com is the umbrella over the products (app/page.tsx); each product's page lives on its own subdomain.
export const metadata: Metadata = {
  title: 'Udyogya — software for the people who keep factories running',
  description:
    'Udyogya Expert for industrial expertise on demand, MERP for running a manufacturing plant, and Store, a seller network coming next.',
  openGraph: {
    title:       'Udyogya',
    description: 'Expert, MERP and Store — software for the people who keep factories running.',
    url:         'https://udyogya.com',
    siteName:    'Udyogya',
    locale:      'en_IN',
    type:        'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakartaSans.variable} ${orbitron.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
