import Image from 'next/image'

interface PlayStoreBadgeProps {
  size?: 'sm' | 'lg'
}

/**
 * Android app is not on the Play Store yet — the badge is shown dimmed and
 * non-clickable with a "LAUNCHING SOON" pill. When the listing goes live,
 * restore the <Link href={PLAY_STORE_URL}> wrapper (see lib/constants.ts).
 */
export function PlayStoreBadge({ size = 'lg' }: PlayStoreBadgeProps) {
  const width  = size === 'lg' ? 200 : 155
  const height = size === 'lg' ? 78  : 60

  return (
    <span
      aria-label="Udyogya Android app — launching soon on Google Play"
      style={{ position: 'relative', display: 'inline-block', cursor: 'default' }}
    >
      <Image
        src="/google-play-badge.png"
        alt="Google Play"
        width={width}
        height={height}
        priority
        style={{ opacity: 0.45, filter: 'grayscale(35%)' }}
      />
      <span
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-4deg)',
          whiteSpace: 'nowrap',
          padding: size === 'lg' ? '5px 14px' : '4px 10px',
          borderRadius: 999,
          background: 'rgba(5,10,24,0.92)',
          border: '1px solid rgba(0,255,255,0.45)',
          color: '#00FFFF',
          fontFamily: 'var(--font-mono, monospace)',
          fontWeight: 700,
          fontSize: size === 'lg' ? 12 : 10,
          letterSpacing: '0.12em',
          boxShadow: '0 0 14px rgba(0,255,255,0.18)',
        }}
      >
        LAUNCHING SOON
      </span>
    </span>
  )
}
