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
      <div
        className={`${height} inline-flex items-center gap-3 bg-white text-black rounded-full px-6 py-2 hover:bg-[#f4f4f4] active:bg-[#e8e8e8] transition-colors`}
      >
        {/*
          Google Play icon — 5 paths that tile the full play-triangle shape.
          The left "spine" (MDI path 1) is split at y=12 into a top-blue half
          and a bottom-red half, matching the real Google Play logo exactly.

          Colors (matching the reference):
            Top-left  → cyan-blue  #4FC3F7
            Bot-left  → red        #F44336
            Top-right → green      #43A047
            Tip       → green      #43A047  (merged into one <path>)
            Bot-right → yellow     #FBBC04
        */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 flex-shrink-0"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-left spine — cyan/blue */}
          <path
            fill="#4FC3F7"
            d="M3 12V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12H3z"
          />
          {/* Bottom-left spine — red */}
          <path
            fill="#F44336"
            d="M3 12h10.69L3.84 21.85C3.34 21.6 3 21.09 3 20.5V12z"
          />
          {/* Top-right triangle + right tip — green (two sub-paths, one fill) */}
          <path
            fill="#43A047"
            d="M6.05 2.66 16.81 8.88 14.54 11.15 6.05 2.66z
               M20.16 10.81c.34.27.59.69.59 1.19s-.25.92-.59 1.19L17.89 14.5 15.39 12l2.5-2.5 2.27 1.31z"
          />
          {/* Bottom-right triangle — yellow */}
          <path
            fill="#FBBC04"
            d="M16.81 15.12 6.05 21.34 14.54 12.85 16.81 15.12z"
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
