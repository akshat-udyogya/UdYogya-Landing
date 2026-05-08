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
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.18 23.76a2 2 0 0 0 2.09-.21l12.09-6.98-3.4-3.41L3.18 23.76zm-1.45-19.9A2 2 0 0 0 1.5 5.5v13a2 2 0 0 0 .23 1.64l.09.09 7.28-7.27v-.18L1.64 5.77l.09-.09zM21.26 10.7l-2.57-1.49-3.81 3.82 3.81 3.82 2.59-1.49a2 2 0 0 0 0-3.46l-.02-.2zM3.18.24l10.78 10.78-3.4 3.4L3.18.45A2 2 0 0 1 3.18.24z"/>
        </svg>
        <div className="text-left">
          <div className="text-black/50 text-[10px] leading-none font-sans tracking-[0.08em] uppercase">Get it on</div>
          <div className="text-black font-sans font-semibold text-base leading-tight tracking-[0.015em]">Google Play</div>
        </div>
      </div>
    </Link>
  )
}
