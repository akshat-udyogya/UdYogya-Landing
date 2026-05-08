import Link from 'next/link'
import { PLAY_STORE_URL } from '@/lib/constants'

interface PlayStoreBadgeProps {
  size?: 'sm' | 'lg'
}

export function PlayStoreBadge({ size = 'lg' }: PlayStoreBadgeProps) {
  const height = size === 'lg' ? 'h-14' : 'h-11'

  return (
    <Link
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Udyogya on Google Play"
      className="inline-block"
    >
      {/* Revolut download-tile style: white pill on dark canvas */}
      <div
        className={`${height} inline-flex items-center gap-3 bg-white text-black rounded-full px-6 py-2 hover:bg-[#f4f4f4] active:bg-[#e8e8e8] transition-colors`}
      >
        {/*
          Google Play Store icon — 4 separate paths, each with its correct brand colour.
          Combining them as a single fill-black path made them blend/disappear.
          MDI 24x24 paths, official Google brand colours (red / yellow / green / blue).

          Path layout:
            1. Left spine  → green  (#01875F) — the rounded left edge of the play arrow
            2. Top triangle  → blue   (#4285F4) — upper-right triangle
            3. Right tip     → red    (#EA4335) — the pointed arrow tip
            4. Bottom triangle → yellow (#FBBC04) — lower-right triangle
        */}
        <svg viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Left spine — green */}
          <path
            fill="#01875F"
            d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12 3.84 21.85A1.5 1.5 0 0 1 3 20.5z"
          />
          {/* Top triangle — blue */}
          <path
            fill="#4285F4"
            d="M6.05 2.66 16.81 8.88 14.54 11.15 6.05 2.66z"
          />
          {/* Right tip — red */}
          <path
            fill="#EA4335"
            d="M20.16 10.81c.34.27.59.69.59 1.19s-.25.92-.59 1.19L17.89 14.5 15.39 12l2.5-2.5 2.27 1.31z"
          />
          {/* Bottom triangle — yellow */}
          <path
            fill="#FBBC04"
            d="M16.81 15.12 6.05 21.34l8.49-8.49 2.27 2.27z"
          />
        </svg>

        <div className="text-left">
          <div className="text-black/50 text-[10px] leading-none font-sans tracking-[0.08em] uppercase">
            Get it on
          </div>
          <div className="text-black font-sans font-semibold text-base leading-tight tracking-[0.015em]">
            Google Play
          </div>
        </div>
      </div>
    </Link>
  )
}
