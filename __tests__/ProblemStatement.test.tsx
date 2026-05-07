import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('framer-motion', () => {
  const strip = (props: Record<string, unknown>) => {
    const { initial, animate, whileInView, viewport, transition, ...rest } = props
    void initial; void animate; void whileInView; void viewport; void transition
    return rest
  }
  return {
    motion: {
      div:  ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) =>
        <div {...strip(rest as Record<string, unknown>)}>{children}</div>,
      p:    ({ children, ...rest }: React.HTMLAttributes<HTMLParagraphElement> & Record<string, unknown>) =>
        <p {...strip(rest as Record<string, unknown>)}>{children}</p>,
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

// Mock GSAP — not available in jsdom
jest.mock('gsap', () => {
  const mock = {
    registerPlugin: jest.fn(),
    context: jest.fn(() => ({ revert: jest.fn() })),
    from: jest.fn(),
  }
  return { ...mock, gsap: mock, default: mock }
})
jest.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }), { virtual: true })

import ProblemStatement from '@/components/sections/ProblemStatement'

describe('ProblemStatement', () => {
  it('renders all 4 pain points', () => {
    render(<ProblemStatement />)
    expect(screen.getByText(/Generic Google searches/i)).toBeInTheDocument()
    expect(screen.getByText(/Hiring a consultant/i)).toBeInTheDocument()
    expect(screen.getByText(/never know if the advice/i)).toBeInTheDocument()
    expect(screen.getByText(/rarely come with proper documentation/i)).toBeInTheDocument()
  })

  it('renders the resolution line', () => {
    render(<ProblemStatement />)
    expect(screen.getByText(/Udyogya fixes all four/i)).toBeInTheDocument()
  })

  it('renders ❌ emoji for each pain point', () => {
    render(<ProblemStatement />)
    expect(screen.getAllByText('❌')).toHaveLength(4)
  })

  it('renders a section heading h2', () => {
    render(<ProblemStatement />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })
})
