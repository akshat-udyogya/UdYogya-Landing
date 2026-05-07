import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('next/dynamic', () => (_: unknown) => () => <div data-testid="phone-cta-mock" />)

jest.mock('framer-motion', () => ({
  motion: {
    h2:  ({ children, initial, animate, whileInView, viewport, transition, ...rest }: React.HTMLAttributes<HTMLHeadingElement> & { initial?: unknown; animate?: unknown; whileInView?: unknown; viewport?: unknown; transition?: unknown }) => <h2  {...rest}>{children}</h2>,
    p:   ({ children, initial, animate, whileInView, viewport, transition, ...rest }: React.HTMLAttributes<HTMLParagraphElement> & { initial?: unknown; animate?: unknown; whileInView?: unknown; viewport?: unknown; transition?: unknown }) => <p   {...rest}>{children}</p>,
    div: ({ children, initial, animate, whileInView, viewport, transition, ...rest }: React.HTMLAttributes<HTMLDivElement> & { initial?: unknown; animate?: unknown; whileInView?: unknown; viewport?: unknown; transition?: unknown }) => <div {...rest}>{children}</div>,
  },
}))

import DownloadCTA from '@/components/sections/DownloadCTA'

describe('DownloadCTA', () => {
  it('renders the CTA headline', () => {
    render(<DownloadCTA />)
    expect(screen.getByText(/Start Solving Problems Today/i)).toBeInTheDocument()
  })

  it('renders sub-headline mentioning GST invoices and free chat', () => {
    render(<DownloadCTA />)
    expect(screen.getByText(/GST invoices/i)).toBeInTheDocument()
    expect(screen.getByText(/Chat free forever/i)).toBeInTheDocument()
  })

  it('renders the Play Store badge', () => {
    render(<DownloadCTA />)
    expect(screen.getByRole('link', { name: /download udyogya on google play/i })).toBeInTheDocument()
  })

  it('renders iOS fine print', () => {
    render(<DownloadCTA />)
    expect(screen.getByText(/iOS coming soon/i)).toBeInTheDocument()
  })

  it('renders the glowing phone canvas', () => {
    render(<DownloadCTA />)
    expect(screen.getByTestId('phone-cta-mock')).toBeInTheDocument()
  })

  it('renders footer copyright', () => {
    render(<DownloadCTA />)
    expect(screen.getByText(/Anarpakaya/i)).toBeInTheDocument()
  })
})
