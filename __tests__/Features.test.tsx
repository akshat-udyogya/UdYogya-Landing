import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('next/dynamic', () => (_: unknown) => () => <div data-testid="phone-mock" />)

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onViewportEnter, ...rest }: React.HTMLAttributes<HTMLDivElement> & { onViewportEnter?: () => void }) =>
      <div {...rest}>{children}</div>,
  },
}))

import Features from '@/components/sections/Features'

describe('Features', () => {
  it('renders all 6 feature titles', () => {
    render(<Features />)
    expect(screen.getByText(/Free Expert Chat/i)).toBeInTheDocument()
    expect(screen.getByText(/Ustaad Chatbot/i)).toBeInTheDocument()
    expect(screen.getByText(/Live Video Consultations/i)).toBeInTheDocument()
    expect(screen.getByText(/Verified Expert Profiles/i)).toBeInTheDocument()
    expect(screen.getByText(/Secure In-App Wallet/i)).toBeInTheDocument()
    expect(screen.getByText(/GST-Compliant Invoices/i)).toBeInTheDocument()
  })

  it('renders feature body text for free chat card', () => {
    render(<Features />)
    expect(screen.getByText(/No tokens, no subscription/i)).toBeInTheDocument()
  })

  it('renders feature body text for GST invoice card', () => {
    render(<Features />)
    expect(screen.getByText(/zero paperwork/i)).toBeInTheDocument()
  })

  it('renders the section heading', () => {
    render(<Features />)
    expect(screen.getByText('Everything You Need')).toBeInTheDocument()
  })

  it('renders the phone mockup canvas', () => {
    render(<Features />)
    expect(screen.getByTestId('phone-mock')).toBeInTheDocument()
  })
})
