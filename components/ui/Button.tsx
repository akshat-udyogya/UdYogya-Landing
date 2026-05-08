import Link from 'next/link'

interface ButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'cobalt'
  className?: string
  ariaLabel?: string
}

export function Button({ href, children, variant = 'primary', className = '', ariaLabel = 'Download Udyogya on Google Play' }: ButtonProps) {
  // Base: pill shape, Inter 600, 48px tall, positive tracking on label
  const base = 'inline-flex items-center justify-center font-sans font-semibold rounded-full px-7 h-12 text-base tracking-[0.015em] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'

  const variants = {
    // White pill on dark — Revolut primary CTA
    primary: 'bg-white text-black hover:bg-[#f4f4f4] active:bg-[#e8e8e8]',
    // Outlined pill on dark — secondary action
    ghost:   'border border-white text-white hover:bg-white hover:text-black',
    // Cobalt violet — featured CTAs in light sections
    cobalt:  'bg-primary text-white hover:bg-primary-deep',
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  )
}
