import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Udyogya Expert — India's Expert Network, In Your Pocket",
  description:
    'Connect with verified professionals in minutes. Chat free forever. GST-compliant invoices for every consultation. Download on Android.',
}

// The dark ground this page was designed on; it sat on <body> before udyogya.com became the umbrella page.
export default function ExpertLayout({ children }: { children: React.ReactNode }) {
  return <div data-expert className="min-h-screen bg-background text-white overflow-x-hidden">{children}</div>
}
