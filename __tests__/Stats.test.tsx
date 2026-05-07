import React from 'react'
import { render, screen } from '@testing-library/react'

// AnimatedCounter uses framer-motion hooks — mock the display
jest.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) => <span {...rest}>{children}</span>,
  },
  useInView:   () => false,
  useSpring:   (v: number) => ({ set: jest.fn(), get: () => v }),
  useTransform: (_: unknown, fn: (v: number) => string) => fn(0),
}))

import Stats from '@/components/sections/Stats'

describe('Stats', () => {
  it('renders all 4 stat labels', () => {
    render(<Stats />)
    expect(screen.getByText('Verified Experts')).toBeInTheDocument()
    expect(screen.getByText('Consultations Completed')).toBeInTheDocument()
    expect(screen.getByText('Professional Categories')).toBeInTheDocument()
    expect(screen.getByText('Expert Chat — Forever')).toBeInTheDocument()
  })

  it('renders all 4 stat suffixes', () => {
    render(<Stats />)
    const plusSigns = screen.getAllByText('+')
    expect(plusSigns.length).toBe(3) // Three stats use + suffix
    expect(screen.getByText('% Free')).toBeInTheDocument()
  })
})
