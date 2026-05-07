import Link from 'next/link'

interface ButtonProps {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
}

export function Button({ href, children, variant = 'primary', className = '' }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-display font-semibold rounded-full px-8 py-4 text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background'

  const variants = {
    primary: 'bg-primary text-white hover:bg-primaryDark shadow-[0_0_20px_rgba(26,115,232,0.5)] hover:shadow-[0_0_35px_rgba(26,115,232,0.8)]',
    ghost:   'border border-primary text-primary hover:bg-primary hover:text-white',
  }

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Udyogya on Google Play"
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  )
}
