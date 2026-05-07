import { COLORS, COPY, FEATURES, EXPERTS, TESTIMONIALS, PLAY_STORE_URL } from '@/lib/constants'

describe('constants', () => {
  it('exports COLORS with required brand tokens', () => {
    expect(COLORS.primary).toBe('#1A73E8')
    expect(COLORS.secondary).toBe('#FF6B35')
    expect(COLORS.background).toBe('#050A18')
  })

  it('exports 4 copy pain points', () => {
    expect(COPY.problem.pains).toHaveLength(4)
  })

  it('exports 4 stats entries', () => {
    expect(COPY.stats).toHaveLength(4)
  })

  it('exports 6 features', () => {
    expect(FEATURES).toHaveLength(6)
  })

  it('exports 4 placeholder experts', () => {
    expect(EXPERTS).toHaveLength(4)
  })

  it('exports 12 testimonials (6 per row)', () => {
    expect(TESTIMONIALS).toHaveLength(12)
  })

  it('exports PLAY_STORE_URL as a string', () => {
    expect(typeof PLAY_STORE_URL).toBe('string')
    expect(PLAY_STORE_URL.length).toBeGreaterThan(0)
  })
})
