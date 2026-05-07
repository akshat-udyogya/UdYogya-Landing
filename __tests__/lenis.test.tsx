import React from 'react'
import { render, screen } from '@testing-library/react'
import { LenisProvider } from '@/lib/lenis'

// Mock Lenis — it requires a real browser scroll environment
jest.mock('lenis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    raf: jest.fn(),
    destroy: jest.fn(),
  }))
})

// Mock GSAP
jest.mock('gsap', () => ({
  registerPlugin: jest.fn(),
  ticker: { add: jest.fn(), remove: jest.fn(), lagSmoothing: jest.fn() },
}))
jest.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { update: jest.fn() } }), { virtual: true })

describe('LenisProvider', () => {
  it('renders children without crashing', () => {
    render(
      <LenisProvider>
        <div data-testid="child">hello</div>
      </LenisProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('renders multiple children', () => {
    render(
      <LenisProvider>
        <span data-testid="a">A</span>
        <span data-testid="b">B</span>
      </LenisProvider>
    )
    expect(screen.getByTestId('a')).toBeInTheDocument()
    expect(screen.getByTestId('b')).toBeInTheDocument()
  })
})
