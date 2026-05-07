import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      initial,
      animate,
      whileInView,
      viewport,
      transition,
      onViewportEnter,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
      initial?: unknown
      animate?: unknown
      whileInView?: unknown
      viewport?: unknown
      transition?: unknown
      onViewportEnter?: () => void
    }) => <div {...rest}>{children}</div>,
  },
}))

import Testimonials from '@/components/sections/Testimonials'

describe('Testimonials', () => {
  it('renders section heading', () => {
    render(<Testimonials />)
    expect(screen.getByText(/What People Are Saying/i)).toBeInTheDocument()
  })

  it('renders testimonial quotes (at least one)', () => {
    render(<Testimonials />)
    // Check a few specific quotes
    expect(screen.getAllByText(/resolved in 20 minutes/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/GST invoice/i).length).toBeGreaterThan(0)
  })

  it('renders at least 12 star ratings (6 per row × 2 rows, duplicated)', () => {
    render(<Testimonials />)
    const stars = screen.getAllByText('★★★★★')
    expect(stars.length).toBeGreaterThanOrEqual(12)
  })

  it('renders testimonial author names', () => {
    render(<Testimonials />)
    expect(screen.getAllByText(/Deepak M\./i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Kavita R\./i).length).toBeGreaterThan(0)
  })
})
