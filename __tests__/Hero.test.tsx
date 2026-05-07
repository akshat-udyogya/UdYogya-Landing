import React from 'react'
import { render, screen } from '@testing-library/react'

// Mock next/dynamic — R3F Canvas won't run in jsdom
jest.mock('next/dynamic', () => (_: unknown) => () => <div data-testid="canvas-mock" />)

// Mock next/image
jest.mock('next/image', () => ({ __esModule: true, default: ({ alt }: { alt: string }) => <img alt={alt} /> }))

jest.mock('framer-motion', () => ({
  motion: {
    nav:  ({ children, ...rest }: React.HTMLAttributes<HTMLElement>) => <nav {...rest}>{children}</nav>,
    div:  ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => <div {...rest}>{children}</div>,
    span: ({ children, ...rest }: React.HTMLAttributes<HTMLSpanElement>) => <span {...rest}>{children}</span>,
    p:    ({ children, ...rest }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...rest}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import Hero from '@/components/sections/Hero'

describe('Hero', () => {
  it('renders the main headline', () => {
    render(<Hero />)
    expect(screen.getByText(/India's Expert Network/i)).toBeInTheDocument()
  })

  it('renders the sub-headline mentioning free chat', () => {
    render(<Hero />)
    expect(screen.getByText(/Chat with verified experts/i)).toBeInTheDocument()
  })

  it('renders the Play Store badge', () => {
    render(<Hero />)
    expect(screen.getByRole('link', { name: /download udyogya on google play/i })).toBeInTheDocument()
  })

  it('renders nav links', () => {
    render(<Hero />)
    expect(screen.getByText('Features')).toBeInTheDocument()
    expect(screen.getByText('How It Works')).toBeInTheDocument()
  })

  it('renders the logo image', () => {
    render(<Hero />)
    expect(screen.getByAltText('Udyogya')).toBeInTheDocument()
  })

  it('nav has aria-label for accessibility', () => {
    render(<Hero />)
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
  })
})
