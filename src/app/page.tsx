'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'
import { Cinzel, Raleway } from 'next/font/google'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700', '900'] })
const raleway = Raleway({ subsets: ['latin'], weight: ['300', '400', '600'] })

const FloatingLeaf = ({ x, y, delay, size, rotation }: { x: string; y: string; delay: number; size: string; rotation: number }) => (
  <motion.div
    className="absolute pointer-events-none select-none text-emerald-900/30"
    style={{ left: x, top: y }}
    animate={{
      y: [0, -30, 0],
      x: [0, 15, -10, 0],
      rotate: [rotation, rotation + 20, rotation - 10, rotation],
      opacity: [0.15, 0.35, 0.15],
    }}
    transition={{
      repeat: Infinity,
      duration: 6 + delay,
      delay,
      ease: 'easeInOut',
    }}
  >
    <svg width={size} height={size} viewBox="0 0 24 36" fill="none">
      <path d="M12 1 L3 14 L7 14 L2 24 L9 24 L9 35 L15 35 L15 24 L22 24 L17 14 L21 14 Z" fill="currentColor" />
    </svg>
  </motion.div>
)

const TreeRing = ({ delay, scale }: { delay: number; scale: number }) => (
  <motion.div
    className="absolute rounded-full border border-emerald-900/20"
    style={{
      width: `${scale}px`,
      height: `${scale}px`,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    }}
    animate={{ opacity: [0.05, 0.2, 0.05], scale: [1, 1.02, 1] }}
    transition={{ repeat: Infinity, duration: 4 + delay, delay, ease: 'easeInOut' }}
  />
)

export default function Home() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const fogY = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <div ref={containerRef} className={`${raleway.className} min-h-screen text-white overflow-hidden relative bg-[#050d08]`}>

      {/* === Deep Forest Atmosphere === */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020805] via-[#071410] to-[#0a0d06]" />

      {/* Bioluminescent glow core */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(16,120,60,0.18),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_60%_at_20%_80%,rgba(10,60,30,0.25),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_50%_at_80%_60%,rgba(5,80,40,0.15),transparent)]" />

      {/* Animated fog layer */}
      <motion.div
        style={{ y: fogY }}
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#071410]/80 to-transparent" />
        <div className="absolute top-1/3 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-[#0a1f14]/20 to-transparent" />
      </motion.div>

      {/* Floating SVG leaves */}
      <FloatingLeaf x="8%" y="15%" delay={0} size="14px" rotation={-20} />
      <FloatingLeaf x="15%" y="60%" delay={1.5} size="10px" rotation={30} />
      <FloatingLeaf x="80%" y="20%" delay={0.8} size="12px" rotation={15} />
      <FloatingLeaf x="88%" y="70%" delay={2.2} size="10px" rotation={-40} />
      <FloatingLeaf x="50%" y="5%" delay={3} size="11px" rotation={10} />
      <FloatingLeaf x="35%" y="85%" delay={1} size="13px" rotation={-15} />
      <FloatingLeaf x="65%" y="90%" delay={2.5} size="9px" rotation={25} />

      {/* Subtle radial tree rings bg decoration */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 pointer-events-none">
        <TreeRing delay={0} scale={600} />
        <TreeRing delay={1.5} scale={900} />
        <TreeRing delay={3} scale={1200} />

        {/* Static deep forest treeline — far background */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen pointer-events-none flex items-end justify-around opacity-[0.06]">
          {[80,140,100,160,90,130,75,150,110,95,145,85].map((h, i) => (
            <svg key={i} width="60" height={h} viewBox="0 0 60 160" fill="none" preserveAspectRatio="none">
              <path d="M30 2 L5 60 L16 60 L4 100 L20 100 L20 158 L40 158 L40 100 L56 100 L44 60 L55 60 Z" fill="#34d399"/>
            </svg>
          ))}
        </div>

        {/* Midground forest layer */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen pointer-events-none flex items-end justify-around opacity-[0.09]" style={{ transform: 'translateX(3%)' }}>
          {[110,70,130,85,155,95,120,65,140,100].map((h, i) => (
            <svg key={i} width="50" height={h} viewBox="0 0 50 160" fill="none" preserveAspectRatio="none">
              <path d="M25 2 L4 55 L13 55 L3 95 L17 95 L17 158 L33 158 L33 95 L47 95 L37 55 L46 55 Z" fill="#1a4a2e"/>
            </svg>
          ))}
        </div>

        {/* Foreground dark silhouette */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-screen pointer-events-none flex items-end justify-around opacity-[0.18]" style={{ transform: 'translateX(-2%)' }}>
          {[130,90,160,110,80,150,100,140,75,120].map((h, i) => (
            <svg key={i} width="70" height={h} viewBox="0 0 70 180" fill="none" preserveAspectRatio="none">
              <path d="M35 2 L6 65 L18 65 L4 112 L22 112 L22 178 L48 178 L48 112 L66 112 L52 65 L64 65 Z" fill="#071a0f"/>
            </svg>
          ))}
        </div>
      </div>

      {/* === NAV === */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-800 shadow-[0_0_12px_rgba(52,211,153,0.4)]" />
          <span className={`${cinzel.className} text-lg font-semibold tracking-widest text-emerald-100/90 uppercase`} style={{ letterSpacing: '0.2em' }}>
            LifeGarden
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-emerald-700 hover:text-emerald-300 text-sm tracking-wider transition-colors duration-300">
            Enter Forest
          </Link>
          <Link
            href="/sign-up"
            className="relative group overflow-hidden border border-emerald-700/60 text-emerald-300 px-5 py-2 rounded-full text-sm font-medium tracking-wider hover:border-emerald-400 transition-all duration-300"
          >
            <span className="relative z-10">Claim Your Grove</span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 to-emerald-800/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>
        </div>
      </nav>

      {/* === HERO === */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-28">

        {/* Ancient sigil / emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 relative"
        >
          <div className="w-20 h-20 rounded-full border border-emerald-700/40 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-dashed border-emerald-800/40"
            />
            <svg width="36" height="44" viewBox="0 0 36 44" fill="none" className="relative z-10">
              <path d="M18 2 L6 18 L11 18 L4 30 L14 30 L14 42 L22 42 L22 30 L32 30 L25 18 L30 18 Z" fill="none" stroke="#34d399" strokeWidth="1.2" strokeLinejoin="round" opacity="0.8"/>
              <motion.path
                d="M18 2 L6 18 L11 18 L4 30 L14 30 L14 42 L22 42 L22 30 L32 30 L25 18 L30 18 Z"
                fill="rgba(16,185,129,0.08)"
                animate={{ opacity: [0.08, 0.18, 0.08] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />
            </svg>
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ boxShadow: ['0 0 0px rgba(52,211,153,0)', '0 0 24px rgba(52,211,153,0.25)', '0 0 0px rgba(52,211,153,0)'] }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
          </div>
        </motion.div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-emerald-600 text-xs tracking-[0.35em] uppercase mb-5 font-medium"
        >
          Your habits shape your world
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`${cinzel.className} text-5xl sm:text-7xl font-bold tracking-tight max-w-3xl leading-[1.05] mb-7`}
        >
          <span className="text-[#c8ddc0]">Every habit</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-emerald-500">
            shapes your forest
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-[#4a7a5a] text-base sm:text-lg max-w-lg mb-12 leading-relaxed"
        >
          Build virtuous habits and your forest flourishes — ancient trees rise,
          glowing flora spreads. Let darkness in, and the rot claims it back.
          Your life, made visible.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-5"
        >
          <Link
            href="/sign-up"
            className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 text-emerald-50 px-9 py-3.5 rounded-full font-semibold tracking-wide hover:from-emerald-500 hover:to-emerald-700 transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
          >
            <span className="relative z-10">Plant Your First Seed</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear', repeatDelay: 2 }}
            />
          </Link>

          <Link href="/sign-in" className="text-emerald-800 hover:text-emerald-500 text-sm tracking-wider transition-colors duration-300 underline underline-offset-4 decoration-emerald-900">
            Return to my forest
          </Link>
        </motion.div>

        {/* === FOREST DUALITY VISUALIZATION === */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 w-full max-w-2xl"
        >
          <div className={`${cinzel.className} text-emerald-800 text-xs tracking-[0.3em] uppercase mb-6`}>The Two Paths</div>

          <div className="grid grid-cols-2 gap-4">
            {/* THRIVING SIDE */}
            <div className="relative rounded-2xl overflow-hidden border border-emerald-800/40 bg-gradient-to-b from-[#071810]/80 to-[#040d08]/90 p-6">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(16,185,129,0.08),transparent)]" />
              <div className="relative z-10">
                <div className={`${cinzel.className} text-emerald-600 text-xs tracking-[0.25em] uppercase mb-4`}>Good Habits</div>

                {/* Thriving forest SVG trees */}
                <div className="flex items-end justify-center gap-1 h-20 mb-5">
                  {[
                    { h: 40, glow: true },
                    { h: 64, glow: true },
                    { h: 80, glow: true },
                    { h: 56, glow: true },
                    { h: 32, glow: false },
                  ].map((tree, i) => (
                    <motion.div
                      key={i}
                      className="relative flex items-end"
                      animate={{ scaleY: [0.97, 1, 0.97] }}
                      transition={{ repeat: Infinity, duration: 3 + i * 0.4, delay: i * 0.2 }}
                      style={{ transformOrigin: 'bottom' }}
                    >
                      <svg width="18" height={tree.h} viewBox="0 0 18 80" fill="none" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`tg${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#34d399" stopOpacity="0.9"/>
                            <stop offset="100%" stopColor="#065f46" stopOpacity="1"/>
                          </linearGradient>
                        </defs>
                        <path d="M9 2 L1 28 L5 28 L1 52 L6 52 L6 78 L12 78 L12 52 L17 52 L13 28 L17 28 Z" fill={`url(#tg${i})`}/>
                      </svg>
                      {tree.glow && (
                        <motion.div
                          className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-300"
                          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
                          transition={{ repeat: Infinity, duration: 2 + i * 0.3 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-2">
                  {['Deep Reading', 'Morning Run', 'Meditation'].map((label) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-emerald-700">{label}</span>
                      <span className="text-emerald-400 font-mono">+ grows</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-emerald-900/60 flex items-center justify-between">
                  <span className="text-emerald-700 text-xs">Forest Health</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-3 rounded-full bg-emerald-500"
                        animate={{ scaleY: [0.7, 1, 0.7], opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* DECAYING SIDE */}
            <div className="relative rounded-2xl overflow-hidden border border-red-950/40 bg-gradient-to-b from-[#120507]/80 to-[#080404]/90 p-6">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(120,20,20,0.08),transparent)]" />
              <div className="relative z-10">
                <div className={`${cinzel.className} text-red-900 text-xs tracking-[0.25em] uppercase mb-4`}>Bad Habits</div>

                {/* Dying forest SVG trees */}
                <div className="flex items-end justify-center gap-1 h-20 mb-5">
                  {[
                    { h: 20, dead: true },
                    { h: 32, dead: false },
                    { h: 48, dead: true },
                    { h: 24, dead: true },
                    { h: 16, dead: true },
                  ].map((tree, i) => (
                    <motion.div
                      key={i}
                      className="relative flex items-end"
                      animate={{ skewX: tree.dead ? [0, 1.5, 0] : [0] }}
                      transition={{ repeat: Infinity, duration: 4 + i * 0.5, delay: i * 0.3 }}
                      style={{ transformOrigin: 'bottom' }}
                    >
                      <svg width="18" height={tree.h} viewBox="0 0 18 80" fill="none" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`dg${i}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#44403c" stopOpacity={tree.dead ? "0.5" : "0.7"}/>
                            <stop offset="100%" stopColor="#1c1917" stopOpacity="1"/>
                          </linearGradient>
                        </defs>
                        <path d="M9 2 L1 28 L5 28 L1 52 L6 52 L6 78 L12 78 L12 52 L17 52 L13 28 L17 28 Z" fill={`url(#dg${i})`}/>
                      </svg>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-2">
                  {['Mindless Scrolling', 'Skipped Sleep', 'Junk Food'].map((label) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-stone-600">{label}</span>
                      <span className="text-red-900 font-mono">− decays</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-red-950/40 flex items-center justify-between">
                  <span className="text-stone-700 text-xs">Forest Health</span>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div
                        key={i}
                        className={`w-1.5 h-3 rounded-full ${i <= 2 ? 'bg-red-950' : 'bg-stone-800'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* === FEATURES === */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl w-full">
          {[
            {
              svg: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="11" r="10" stroke="#34d399" strokeWidth="1" opacity="0.4"/>
                  <path d="M11 3 L11 11 M11 11 L6 8 M11 11 L16 8" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              ),
              title: 'Living Ecosystem',
              desc: 'Your habits breathe life into a forest that grows or withers in real time.',
            },
            {
              svg: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M2 18 Q5 8 11 6 Q17 4 20 18" stroke="#34d399" strokeWidth="1.2" fill="none" opacity="0.6"/>
                  <path d="M11 6 L11 18" stroke="#34d399" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
                </svg>
              ),
              title: 'Root Streaks',
              desc: 'Consistent days lay deep roots. Break the chain and the canopy thins.',
            },
            {
              svg: (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <rect x="3" y="3" width="16" height="16" rx="3" stroke="#34d399" strokeWidth="1" opacity="0.4"/>
                  <path d="M7 11 L10 14 L15 8" stroke="#34d399" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ),
              title: 'Ancient Ledger',
              desc: 'Track every act of growth and decay. The forest remembers everything.',
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              viewport={{ once: true }}
              className="group bg-[#07130a]/60 border border-emerald-900/30 rounded-2xl p-6 hover:border-emerald-700/40 transition-all duration-500"
            >
              <div className="mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                {f.svg}
              </div>
              <div className={`${cinzel.className} font-semibold mb-2 text-[#b0c8b0] text-sm tracking-wide`}>
                {f.title}
              </div>
              <div className="text-[#3a5a40] text-sm leading-relaxed">{f.desc}</div>
            </motion.div>
          ))}
        </div>

        {/* === FINAL CTA BANNER === */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mt-28 relative max-w-xl w-full"
        >
          <div className="absolute inset-0 rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent)]" />
          <div className="relative border border-emerald-900/40 rounded-3xl p-10 text-center">
            <div className={`${cinzel.className} text-emerald-900 text-xs tracking-[0.35em] uppercase mb-4`}>The Forest Awaits</div>
            <h2 className={`${cinzel.className} text-2xl font-bold text-[#c8ddc0] mb-3`}>
              What will you grow today?
            </h2>
            <p className="text-[#3a5a40] text-sm mb-7 leading-relaxed">
              Every great forest began with a single seed. Plant yours now.
            </p>
            <Link
              href="/sign-up"
              className="inline-block bg-gradient-to-br from-emerald-700 to-emerald-900 text-emerald-100 px-8 py-3 rounded-full text-sm font-semibold tracking-wider hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              Begin the Journey
            </Link>
          </div>
        </motion.div>
      </main>

      {/* === FOOTER === */}
      <footer className={`${cinzel.className} relative z-10 text-center text-emerald-900/60 text-xs py-8 tracking-widest uppercase`}>
        LifeGarden · {new Date().getFullYear()} · Grow or Wither
      </footer>
    </div>
  )
}