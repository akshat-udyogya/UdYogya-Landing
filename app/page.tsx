import { Instrument_Sans, Instrument_Serif, IBM_Plex_Mono } from 'next/font/google'
import s from './umbrella.module.css'

// udyogya.com — the umbrella (owner 2026-11-01): every Udyogya product listed, each row a door to that
// product's own homepage. The type matches merp.udyogya.com's homepage so the family reads as one.
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--u-serif', display: 'swap' })
const sans = Instrument_Sans({ subsets: ['latin'], variable: '--u-sans', display: 'swap' })
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--u-mono', display: 'swap' })

type Product = { key: 'expert' | 'merp' | 'store'; name: string; host: string; line: string; live: boolean }

const PRODUCTS: Product[] = [
  {
    key: 'expert', name: 'Expert', host: 'expert.udyogya.com', live: true,
    line: 'Industrial expertise on demand. Verified engineers for PLCs, SCADA, drives, robotics and instrumentation — for a consultation when a machine stops, or for a whole project.',
  },
  {
    key: 'merp', name: 'MERP', host: 'merp.udyogya.com', live: true,
    line: 'ERP software for manufacturers. Purchase, stores, production, quality, maintenance, payroll and accounts on one set of records, from the shop floor up.',
  },
  {
    key: 'store', name: 'Store', host: 'store.udyogya.com', live: false,
    line: 'A network of sellers who compete for your orders. Post what you need, sellers bid the price down, and you choose who supplies it.',
  },
]

export default function Umbrella() {
  return (
    <div className={`${s.page} ${serif.variable} ${sans.variable} ${mono.variable}`}>
      <header className={s.top}>
        <span className={s.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/udyogya-mark.svg" alt="" width={28} height={28} />
          UdYogya
        </span>
      </header>

      <main className={s.main}>
        <section className={s.hero}>
          <p className={s.eyebrow}>Udyogya · three products, one team</p>
          <h1 className={s.title}>Software for the people who keep <em>factories running.</em></h1>
          <p className={s.lede}>
            An expert on call when a machine stops, the system that runs the plant, and soon a market where
            sellers compete for your orders. Choose where you are going.
          </p>
        </section>

        <section aria-labelledby="products" className={s.board}>
          <h2 id="products" className={s.label}>Products</h2>
          <ul className={s.rows}>
            {PRODUCTS.map((p) => {
              const body = (
                <>
                  <span className={s.host}>{p.host}</span>
                  <span className={s.what}>
                    <span className={s.name}>{p.name}</span>
                    <span className={s.line}>{p.line}</span>
                  </span>
                  {p.live
                    ? <span className={s.go}>Go to {p.name} <span aria-hidden="true">→</span></span>
                    : <span className={s.soon}>Not open yet — we are building it now</span>}
                </>
              )
              return (
                <li key={p.key} className={`${s.row} ${s[p.key]}`}>
                  {p.live ? <a className={s.door} href={`https://${p.host}/`}>{body}</a> : <div className={`${s.door} ${s.shut}`}>{body}</div>}
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="together" className={s.together}>
          <h2 id="together" className={s.label}>How they work together</h2>
          <ul className={s.links}>
            <li>
              <span className={s.tag}>Live</span>
              <span>When a breakdown in MERP has kept a machine down for more than two hours (each plant can change the time), MERP offers a way to reach an engineer on Expert.</span>
            </li>
            <li>
              <span className={`${s.tag} ${s.planned}`}>Planned</span>
              <span>When Store opens, buying from MERP will go to Store, where sellers bid for the order.</span>
            </li>
          </ul>
        </section>
      </main>

      <footer className={s.foot}>
        <span className={s.stamp}>Proudly made in India by ANARPAKAYA</span>
        <a href="mailto:admin@udyogya.com">admin@udyogya.com</a>
        <span>© {new Date().getFullYear()} Udyogya</span>
      </footer>
    </div>
  )
}
