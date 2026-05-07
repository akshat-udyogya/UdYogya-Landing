import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      initial, animate, whileInView, viewport, transition, whileHover,
      onViewportEnter, onMouseEnter, onMouseLeave,
      ...rest
    }: React.HTMLAttributes<HTMLDivElement> & {
      initial?: unknown; animate?: unknown; whileInView?: unknown;
      viewport?: unknown; transition?: unknown; whileHover?: unknown;
      onViewportEnter?: () => void; onMouseEnter?: () => void; onMouseLeave?: () => void;
    }) => <div {...rest}>{children}</div>,
  },
  useAnimationControls: () => ({
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn(),
  }),
}))

import ExpertSpotlight from '@/components/sections/ExpertSpotlight'

describe('ExpertSpotlight', () => {
  it('renders section heading', () => {
    render(<ExpertSpotlight />)
    expect(screen.getByText(/Meet the Experts/i)).toBeInTheDocument()
  })

  it('renders all 4 expert names', () => {
    render(<ExpertSpotlight />)
    // Names appear twice (duplicated for seamless loop), so getAllByText
    expect(screen.getAllByText('Rajesh Kumar').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Priya Sharma').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Amir Siddiqui').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Sunita Verma').length).toBeGreaterThan(0)
  })

  it('renders all 4 expert roles', () => {
    render(<ExpertSpotlight />)
    expect(screen.getAllByText('Civil Engineer').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Tax Consultant').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Legal Advisor').length).toBeGreaterThan(0)
    expect(screen.getAllByText('HR Specialist').length).toBeGreaterThan(0)
  })

  it('renders star ratings', () => {
    render(<ExpertSpotlight />)
    // Rating numbers appear for each expert
    const ratings = screen.getAllByText(/4\.[7-9]/i)
    expect(ratings.length).toBeGreaterThan(0)
  })
})
