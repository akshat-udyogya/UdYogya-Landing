import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('framer-motion', () => ({
  motion: {
    div:  ({ children, initial, animate, whileInView, viewport, transition, ...rest }: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>) => <div {...rest}>{children}</div>,
    span: ({ children, initial, animate, whileInView, viewport, transition, ...rest }: React.HTMLAttributes<HTMLSpanElement> & Record<string, unknown>) => <span {...rest}>{children}</span>,
  },
  useInView:    () => false,
  useSpring:    () => ({ set: jest.fn() }),
  useTransform: (_: unknown, fn: (v: number) => string) => fn(0),
}))
import { Button } from '@/components/ui/Button'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PlayStoreBadge } from '@/components/ui/PlayStoreBadge'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

describe('Button', () => {
  it('renders label', () => {
    render(<Button href="#">Download</Button>)
    expect(screen.getByText('Download')).toBeInTheDocument()
  })
  it('has correct href', () => {
    render(<Button href="https://play.google.com">Get App</Button>)
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://play.google.com')
  })
})

describe('SectionHeading', () => {
  it('renders heading and sub', () => {
    render(<SectionHeading heading="Hello" sub="World" />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('World')).toBeInTheDocument()
  })
  it('renders heading without sub', () => {
    render(<SectionHeading heading="Only Heading" />)
    expect(screen.getByText('Only Heading')).toBeInTheDocument()
  })
})

describe('PlayStoreBadge', () => {
  it('renders a link to the Play Store', () => {
    render(<PlayStoreBadge />)
    const link = screen.getByRole('link', { name: /download udyogya on google play/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=com.udyogya.app')
  })
})

describe('AnimatedCounter', () => {
  it('renders the label', () => {
    render(<AnimatedCounter value={500} suffix="+" label="Experts" />)
    expect(screen.getByText('Experts')).toBeInTheDocument()
  })
  it('renders the suffix', () => {
    render(<AnimatedCounter value={100} suffix="% Free" label="Chat" />)
    expect(screen.getByText('% Free')).toBeInTheDocument()
  })
})
