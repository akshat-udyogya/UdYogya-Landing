import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => <div {...rest}>{children}</div>,
  },
}))

import HowItWorks from '@/components/sections/HowItWorks'

describe('HowItWorks', () => {
  it('renders all 3 step titles', () => {
    render(<HowItWorks />)
    expect(screen.getByText('Search')).toBeInTheDocument()
    expect(screen.getByText('Connect')).toBeInTheDocument()
    expect(screen.getByText('Resolve')).toBeInTheDocument()
  })

  it('renders step numbers 1, 2, 3', () => {
    render(<HowItWorks />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('mentions GST-compliant invoice in step 3 description', () => {
    render(<HowItWorks />)
    expect(screen.getByText(/GST-compliant invoice/i)).toBeInTheDocument()
  })

  it('renders section heading', () => {
    render(<HowItWorks />)
    expect(screen.getByText('How It Works')).toBeInTheDocument()
  })
})
