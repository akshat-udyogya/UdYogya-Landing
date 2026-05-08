import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('next/dynamic', () => (_: unknown) => () => <div data-testid="dynamic-mock" />)
jest.mock('@/components/sections/Hero',             () => () => <div data-testid="hero" />)
jest.mock('@/components/sections/ProblemStatement', () => () => <div data-testid="problem" />)
jest.mock('@/components/sections/HowItWorks',       () => () => <div data-testid="howitworks" />)
jest.mock('@/components/sections/Features',         () => () => <div data-testid="features" />)
jest.mock('@/components/sections/ExpertSpotlight',  () => () => <div data-testid="experts" />)
jest.mock('@/components/sections/Testimonials',     () => () => <div data-testid="testimonials" />)
jest.mock('@/components/sections/Stats',            () => () => <div data-testid="stats" />)
jest.mock('@/components/sections/DownloadCTA',      () => () => <div data-testid="cta" />)

import Page from '@/app/page'

describe('Page', () => {
  it('renders all 8 sections in order', () => {
    const { container } = render(<Page />)
    const ids = ['hero', 'problem', 'howitworks', 'features', 'experts', 'testimonials', 'stats', 'cta']
    ids.forEach(id => {
      expect(container.querySelector(`[data-testid="${id}"]`)).toBeInTheDocument()
    })
  })

  it('renders sections inside a main element', () => {
    const { container } = render(<Page />)
    expect(container.querySelector('main')).toBeInTheDocument()
  })
})
