import Link from 'next/link'
import Image from 'next/image'
import { PLAY_STORE_URL } from '@/lib/constants'

interface PlayStoreBadgeProps {
  size?: 'sm' | 'lg'
}

export function PlayStoreBadge({ size = 'lg' }: PlayStoreBadgeProps) {
  const width  = size === 'lg' ? 200 : 155
  const height = size === 'lg' ? 78  : 60

  return (
    <Link
      href={PLAY_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Download Udyogya on Google Play"
      className="inline-block transition-opacity hover:opacity-90 active:opacity-75"
    >
      <Image
        src="/google-play-badge.png"
        alt="Get it on Google Play"
        width={width}
        height={height}
        priority
      />
    </Link>
  )
}
