import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
