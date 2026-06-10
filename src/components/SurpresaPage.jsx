import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import MusicPlayer from './MusicPlayer'

// ─── Design tokens ────────────────────────────────────────────────────────────
const RED   = '#e8192c'
const PINK  = '#ff6b8a'
const BG    = '#0a0208'
const BG2   = '#0f0312'
const CARD  = 'rgba(255,255,255,0.04)'
const RBORDER = 'rgba(232,25,44,0.14)'

// ─── Heart SVG ────────────────────────────────────────────────────────────────
function Heart({ size = 24, color = RED, glow = false, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      className={className}
      style={glow ? { filter: `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 10px ${color})` } : undefined}
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

// ─── Background floating hearts (static config) ───────────────────────────────
const BG_HEARTS = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left:    `${(i * 19 + 7) % 92}%`,
  top:     `${(i * 31 + 11) % 88}%`,
  size:    8 + (i % 5) * 5,
  dur:     2.8 + (i % 5) * 0.9,
  delay:   (i % 7) * 0.5,
  opacity: 0.06 + (i % 5) * 0.04,
}))

// ─── NAV BAR ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { label: 'Início',     id: 'inicio' },
  { label: 'Mensagem',   id: 'mensagem' },
  { label: 'Surpresas',  id: 'surpresas' },
  { label: 'Nosso Amor', id: 'nosso-amor' },
  { label: 'Playlist',   id: 'playlist' },
]

function go(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function NavBar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [active, setActive]       = useState('inicio')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
      const ids = NAV_ITEMS.map(n => n.id)
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i])
        if (el && window.scrollY >= el.offsetTop - 130) {
          setActive(ids[i])
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background:    scrolled ? 'rgba(10,2,8,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom:  scrolled ? `1px solid ${RBORDER}` : 'none',
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Heart size={26} glow />

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(({ label, id }) => (
            <li key={id}>
              <button
                onClick={() => go(id)}
                className="text-sm transition-colors duration-200 relative group"
                style={{ color: active === id ? RED : 'rgba(255,255,255,0.6)' }}
              >
                {label}
                <span
                  className="absolute -bottom-1 left-0 h-px transition-all duration-300 group-hover:w-full"
                  style={{ width: active === id ? '100%' : 0, background: RED }}
                />
              </button>
            </li>
          ))}
        </ul>

        {/* CTA button */}
        <button
          onClick={() => go('surpresas')}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-300 hover:scale-105"
          style={{ border: `1px solid rgba(232,25,44,0.35)`, color: 'rgba(255,255,255,0.75)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(232,25,44,0.1)'; e.currentTarget.style.borderColor = RED }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(232,25,44,0.35)' }}
        >
          Para você <Heart size={13} />
        </button>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white/60" onClick={() => setMenuOpen(o => !o)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6"  y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              : <><line x1="3"  y1="6" x2="21" y2="6"  /><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden overflow-hidden"
            style={{ background: 'rgba(10,2,8,0.98)' }}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="px-6 pb-5 flex flex-col gap-1 pt-2">
              {NAV_ITEMS.map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => { go(id); setMenuOpen(false) }}
                    className="w-full text-left py-3 text-sm border-b transition-colors duration-200"
                    style={{ color: active === id ? RED : 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.06)' }}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── GLOWING HEART FRAME ──────────────────────────────────────────────────────
// Heart path: symmetric, based on 340x340 viewBox
const HEART_PATH = 'M170,315 C100,258 25,198 25,110 C25,55 65,18 110,18 C140,18 158,34 170,54 C182,34 200,18 230,18 C275,18 315,55 315,110 C315,198 240,258 170,315 Z'

function GlowingHeartFrame() {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: 340, height: 340 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Outer pulse rings */}
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 3, delay: i * 0.9, repeat: Infinity }}
        >
          <svg viewBox="0 0 340 340" width="100%" height="100%">
            <path
              d={HEART_PATH}
              fill="none"
              stroke={RED}
              strokeWidth={1.5 - i * 0.3}
              transform={`scale(${1 + i * 0.08}) translate(${-170 * 0.08 * i / 1}, ${-170 * 0.08 * i / 1})`}
              style={{ transformOrigin: '170px 170px', filter: `drop-shadow(0 0 3px ${RED})` }}
            />
          </svg>
        </motion.div>
      ))}

      {/* Main SVG: clipped photo + neon border */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: [1, 1.012, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg viewBox="0 0 340 340" width="100%" height="100%">
          <defs>
            <clipPath id="heartClip">
              <path d={HEART_PATH} />
            </clipPath>
            <radialGradient id="heartOverlay" cx="50%" cy="30%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
            </radialGradient>
          </defs>

          {/* Photo clipped to heart */}
          <image
            href="/fotos/foto1.jpeg"
            x="10" y="10"
            width="320" height="310"
            clipPath="url(#heartClip)"
            preserveAspectRatio="xMidYMid slice"
          />

          {/* Inner shimmer overlay */}
          <path d={HEART_PATH} fill="url(#heartOverlay)" clipPath="url(#heartClip)" />

          {/* Neon border */}
          <path
            d={HEART_PATH}
            fill="none"
            stroke={RED}
            strokeWidth="3.5"
            style={{
              filter: `drop-shadow(0 0 6px ${RED}) drop-shadow(0 0 18px ${RED}) drop-shadow(0 0 36px ${PINK})`,
            }}
          />
          {/* White inner highlight */}
          <path d={HEART_PATH} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Mini hearts orbiting the frame */}
      {[
        { t: '4%',  l: '12%', s: 13, d: 0.0 },
        { t: '8%',  r: '10%', s: 18, d: 0.7 },
        { t: '40%', l: '0%',  s: 10, d: 1.3 },
        { t: '38%', r: '1%',  s: 22, d: 0.35 },
        { b: '22%', l: '8%',  s: 15, d: 1.0 },
        { b: '18%', r: '7%',  s: 11, d: 1.8 },
        { t: '22%', l: '6%',  s: 8,  d: 2.1 },
        { t: '18%', r: '5%',  s: 16, d: 0.9 },
      ].map((h, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: h.t, left: h.l, right: h.r, bottom: h.b }}
          animate={{ y: [0, -9, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 2.2 + i * 0.25, repeat: Infinity, delay: h.d, ease: 'easeInOut' }}
        >
          <Heart size={h.s} glow />
        </motion.div>
      ))}
    </motion.div>
  )
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
  const [sparks, setSparks] = useState([])

  const burst = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setSparks(
      Array.from({ length: 14 }, (_, i) => ({
        id: Date.now() + i,
        cx,
        cy,
        angle: (360 / 14) * i,
        color: [RED, PINK, '#fff', '#ffcc44', '#ff8c55'][i % 5],
      }))
    )
    setTimeout(() => setSparks([]), 900)
    go('surpresas')
  }

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: `radial-gradient(ellipse at 65% 45%, #200310 0%, ${BG} 68%)` }}
    >
      {/* Background floating hearts */}
      {BG_HEARTS.map(h => (
        <motion.div
          key={h.id}
          className="absolute pointer-events-none"
          style={{ left: h.left, top: h.top }}
          animate={{ y: [0, -14, 0], opacity: [h.opacity, h.opacity * 0.3, h.opacity] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={h.size} glow={h.size > 20} />
        </motion.div>
      ))}

      {/* Click spark particles */}
      {sparks.map(sp => (
        <motion.div
          key={sp.id}
          className="fixed pointer-events-none z-50 rounded-full"
          style={{ left: sp.cx, top: sp.cy, width: 6, height: 6, background: sp.color, marginLeft: -3, marginTop: -3 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((sp.angle * Math.PI) / 180) * 90,
            y: Math.sin((sp.angle * Math.PI) / 180) * 90,
            opacity: 0,
            scale: 0.4,
          }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Left: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h1
            className="font-serif font-bold leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5rem)' }}
          >
            <span className="text-white block">Feliz Dia dos</span>
            <span
              className="block"
              style={{ color: RED, textShadow: `0 0 24px rgba(232,25,44,0.55), 0 0 50px rgba(232,25,44,0.25)` }}
            >
              Namorados!
            </span>
          </h1>

          <p className="text-white/55 text-base md:text-lg leading-relaxed mb-1">
            Hoje e sempre, celebro você e tudo que
          </p>
          <p className="text-white/55 text-base md:text-lg leading-relaxed mb-10">
            nos faz tão especiais.{' '}
            <span style={{ color: RED }} className="font-medium">Te amo mais que tudo!</span>
          </p>

          <motion.button
            onClick={burst}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium text-white text-base"
            style={{
              background: `linear-gradient(135deg, ${RED}, ${PINK})`,
              boxShadow: `0 4px 20px rgba(232,25,44,0.35)`,
            }}
            whileHover={{ scale: 1.05, boxShadow: `0 8px 32px rgba(232,25,44,0.55)` }}
            whileTap={{ scale: 0.96 }}
          >
            <Heart size={18} color="white" />
            Abrir Surpresa Especial
          </motion.button>
        </motion.div>

        {/* Right: Heart frame */}
        <div className="flex justify-center md:justify-end">
          <GlowingHeartFrame />
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0], opacity: [0.35, 0.8, 0.35] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>
    </section>
  )
}

// ─── CARDS SECTION ────────────────────────────────────────────────────────────
const CARDS_DATA = [
  {
    title:  'Momentos',
    sub:    'Nossas melhores lembranças',
    badge:  '12',
    photo:  '/fotos/foto4.jpeg',
    target: 'nosso-amor',
    rotate: -4,
  },
  {
    title:  'Carta para você',
    sub:    'Palavras que vêm do coração',
    badge:  '♥',
    photo:  null,
    target: 'mensagem',
    rotate: 0,
  },
  {
    title:  'Nosso Amor',
    sub:    'Nossa história até aqui',
    badge:  '∞',
    photo:  '/fotos/foto5.jpeg',
    target: 'nosso-amor',
    rotate: 4,
  },
]

function PreviewCard({ title, sub, badge, photo, target, rotate, index }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      ref={ref}
      onClick={() => go(target)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden rounded-2xl cursor-pointer flex-shrink-0"
      style={{
        width: 200,
        height: 265,
        background: photo ? 'transparent' : `linear-gradient(145deg, #1c0618, #2e0828)`,
        border: `1px solid ${hovered ? 'rgba(232,25,44,0.35)' : 'rgba(232,25,44,0.12)'}`,
        boxShadow: hovered ? `0 12px 40px rgba(232,25,44,0.25)` : '0 4px 16px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.3s, border-color 0.3s',
      }}
      initial={{ opacity: 0, y: 40, rotate }}
      animate={inView ? { opacity: 1, y: 0, rotate: hovered ? 0 : rotate } : {}}
      transition={{ duration: 0.65, delay: index * 0.14 }}
      whileHover={{ scale: 1.06, zIndex: 20 }}
    >
      {/* Photo bg */}
      {photo ? (
        <img src={photo} alt={title} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 gap-3">
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <Heart size={44} glow />
          </motion.div>
          <p className="font-serif text-base text-white/55 italic text-center leading-snug">
            "Para você,<br />todo amor"
          </p>
        </div>
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(10,2,8,0.88) 38%, rgba(10,2,8,0.1) 70%, transparent)' }}
      />

      {/* Badge */}
      <div
        className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
        style={{ background: RED, boxShadow: `0 0 10px ${RED}` }}
      >
        {badge}
      </div>

      {/* Text footer */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
        <p className="text-white font-medium text-sm mb-0.5">{title}</p>
        <p className="text-white/45 text-xs leading-tight">{sub}</p>
      </div>
    </motion.div>
  )
}

function CardsSection() {
  const [ref, inView] = useInView({ threshold: 0.15, triggerOnce: true })

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${BG} 0%, #100215 100%)` }}
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left text */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Heart size={13} glow />
            <span
              className="text-xs tracking-[0.28em] uppercase font-medium"
              style={{ color: RED }}
            >
              Para você
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl leading-snug mb-5 text-white">
            Cada detalhe nosso<br />
            <span style={{ color: RED }}>importa</span> pra mim.
          </h2>
          <p className="text-white/45 text-sm leading-relaxed mb-8 max-w-xs">
            Relembre momentos, palavras e motivos que me fazem amar você todos os dias.
          </p>
          <motion.button
            onClick={() => go('nosso-amor')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium text-white/70 border transition-all duration-300"
            style={{ borderColor: 'rgba(255,255,255,0.14)' }}
            whileHover={{ borderColor: RED, color: 'white', scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Ver tudo que preparei
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </motion.button>
        </motion.div>

        {/* Cards row */}
        <div className="flex items-end justify-center md:justify-end gap-3 md:gap-4">
          {CARDS_DATA.map((card, i) => (
            <PreviewCard key={card.title} {...card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const [ref, inView] = useInView({ threshold: 0.5, triggerOnce: true })

  useEffect(() => {
    if (!inView) return
    const dur = 2000
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(eased * target))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{val.toLocaleString('pt-BR')}{suffix}</span>
}

// ─── STATS SECTION ────────────────────────────────────────────────────────────
const STATS = [
  {
    icon: <Heart size={28} glow />,
    value: null,
    display: '∞',
    label: 'Amor Infinito',
    sub: 'E pra sempre',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill={RED}>
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-7-9H7v5h5v-5z" />
      </svg>
    ),
    value: 365,
    suffix: '+',
    label: 'Dias ao seu lado',
    sub: 'E contando...',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill={RED}>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
      </svg>
    ),
    value: 1000,
    suffix: '+',
    label: 'Motivos pra te amar',
    sub: 'E não é exagero',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill={RED}>
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" />
      </svg>
    ),
    value: 1,
    label: 'Pessoa única',
    sub: 'Você.',
  },
]

// Confetti config (static)
const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left:  `${(i * 11 + 3) % 96}%`,
  size:  3 + (i % 5) * 3,
  color: [RED, PINK, '#ffcc44', '#fff', '#ff9933', '#55ddff'][i % 6],
  dur:   7 + (i % 5) * 2,
  delay: (i % 9) * 1.1,
  shape: ['circle', 'square', 'heart'][i % 3],
}))

function StatsSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section
      id="surpresas"
      className="relative py-28 overflow-hidden"
      style={{ background: `radial-gradient(ellipse at 25% 55%, #1e0416 0%, ${BG} 60%)` }}
    >
      {/* Falling confetti */}
      {CONFETTI.map(c => (
        <motion.div
          key={c.id}
          className="absolute pointer-events-none top-0"
          style={{
            left:         c.left,
            width:        c.size,
            height:       c.size,
            background:   c.shape !== 'heart' ? c.color : 'transparent',
            borderRadius: c.shape === 'circle' ? '50%' : c.shape === 'square' ? '2px' : 0,
          }}
          animate={{ y: ['−5vh', '108vh'], rotate: [0, 540], opacity: [0.9, 0] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: 'linear' }}
        >
          {c.shape === 'heart' && <Heart size={c.size + 4} color={c.color} />}
        </motion.div>
      ))}

      {/* Balloon decoration */}
      <motion.div
        className="absolute right-6 md:right-16 top-8 pointer-events-none"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative flex flex-col items-center">
          <div
            className="w-14 h-18 rounded-full"
            style={{
              width: 56, height: 72,
              background: `radial-gradient(circle at 35% 30%, ${PINK} 0%, ${RED} 70%)`,
              boxShadow: `0 0 20px rgba(232,25,44,0.45)`,
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            }}
          />
          <div style={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: `8px solid ${RED}` }} />
          <div style={{ width: 1, height: 52, background: 'rgba(255,255,255,0.25)' }} />
        </div>
      </motion.div>

      {/* Gift decoration */}
      <motion.div
        className="absolute left-6 md:left-16 bottom-12 pointer-events-none opacity-40"
        animate={{ rotate: [-3, 3, -3], y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative w-16 h-16">
          <div className="w-full h-10 rounded-b-lg absolute bottom-0" style={{ background: `linear-gradient(135deg, ${RED}, ${PINK})` }} />
          <div className="w-full h-4 absolute top-6" style={{ background: 'rgba(255,255,255,0.25)' }} />
          <div className="w-4 h-full absolute left-1/2 -translate-x-1/2" style={{ background: 'rgba(255,255,255,0.25)' }} />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-5 h-5 rounded-full border-2 border-white/50" />
            <div className="w-5 h-5 rounded-full border-2 border-white/50" />
          </div>
        </div>
      </motion.div>

      <div ref={ref} className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xl">🎁</span>
            <span
              className="text-xs tracking-[0.28em] uppercase font-medium"
              style={{ color: RED }}
            >
              Surpresa Especial
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl leading-snug mb-4 text-white">
            Uma surpresa feita<br />
            <span style={{ color: RED }}>especialmente</span> para você
          </h2>
          <p className="text-white/40 text-base mb-16">Algo único, assim como você.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="rounded-2xl p-6 flex flex-col items-center gap-2 cursor-default"
              style={{ background: CARD, border: `1px solid ${RBORDER}`, transition: 'all 0.3s' }}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{
                background: 'rgba(232,25,44,0.07)',
                borderColor: 'rgba(232,25,44,0.38)',
                scale: 1.04,
                boxShadow: `0 8px 32px rgba(232,25,44,0.2)`,
              }}
            >
              <span>{s.icon}</span>
              <span className="font-serif text-3xl md:text-4xl font-bold text-white tabular-nums">
                {s.display
                  ? s.display
                  : <AnimatedCounter target={s.value} suffix={s.suffix || ''} />}
              </span>
              <p className="text-white/80 text-sm font-medium text-center leading-tight">{s.label}</p>
              <p className="text-white/30 text-xs">{s.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── MENSAGEM SECTION ─────────────────────────────────────────────────────────
function MensagemSection() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  const paragraphs = [
    'Ana Luísa,',
    'Existem momentos que a gente não consegue descrever com palavras — aqueles em que o coração simplesmente sabe que está no lugar certo. Ao seu lado, eu descobri o que é isso.',
    'Cada risada nossa, cada olhar trocado, cada abraço que parece não querer acabar — tudo isso se tornou o meu lugar favorito no mundo. Você transformou os dias comuns em memórias que vou guardar para sempre.',
    'Neste Dia dos Namorados, quero que você saiba que cada segundo ao seu lado é um presente que não mereço, mas pelo qual sou imensamente grato por ter.',
    'Você é minha parceira, minha melhor amiga, minha casa. Te amo hoje, amanhã e em todos os dias que ainda virão.',
  ]

  return (
    <section
      id="mensagem"
      className="py-28"
      style={{ background: `linear-gradient(180deg, ${BG} 0%, #0d0218 50%, ${BG} 100%)` }}
    >
      <div className="max-w-3xl mx-auto px-6" ref={ref}>
        {/* Heading */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Heart size={30} glow className="mx-auto mb-4" />
          <h2 className="font-serif text-3xl md:text-4xl text-white">Mensagem</h2>
          <div className="w-14 h-px mx-auto mt-4" style={{ background: `linear-gradient(90deg, transparent, ${RED}, transparent)` }} />
        </motion.div>

        {/* Letter card */}
        <motion.div
          className="rounded-3xl relative overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border:     `1px solid ${RBORDER}`,
            boxShadow:  `inset 0 1px 0 rgba(255,255,255,0.05)`,
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          {/* Background decorative hearts */}
          <div className="absolute top-4 right-4 opacity-[0.04] pointer-events-none">
            <Heart size={140} />
          </div>
          <div className="absolute bottom-4 left-4 opacity-[0.03] pointer-events-none">
            <Heart size={90} color={PINK} />
          </div>

          {/* Letter content */}
          <div className="relative z-10 px-8 md:px-14 py-10 md:py-14">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                className="font-serif italic leading-loose text-white/70"
                style={{
                  fontSize:    i === 0 ? '1.1rem' : '1.05rem',
                  marginBottom: i === paragraphs.length - 1 ? 0 : '1.4rem',
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.3 + i * 0.15 }}
              >
                {p}
              </motion.p>
            ))}

            <motion.div
              className="mt-10 pt-8 border-t"
              style={{ borderColor: 'rgba(232,25,44,0.1)' }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 1.2 }}
            >
              <p className="font-sans text-xs tracking-widest uppercase text-white/30 mb-2">
                Com todo meu amor,
              </p>
              <p
                className="font-serif text-2xl"
                style={{ color: RED, textShadow: `0 0 12px rgba(232,25,44,0.4)` }}
              >
                Pedro ♥
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── NOSSO AMOR SECTION ───────────────────────────────────────────────────────
const FOTOS_GRID = Array.from({ length: 12 }, (_, i) => ({
  src:   `/fotos/foto${i + 1}.jpeg`,
  label: [
    'O começo de tudo',
    'Sempre juntos',
    'Nossa aventura',
    'Você me faz sorrir',
    'Momentos únicos',
    'Te amo assim',
    'Cada detalhe',
    'Nossa história',
    'Hoje e sempre',
    'Meu lugar favorito',
    'Com você',
    'Para sempre',
  ][i],
}))

function NossoAmorSection() {
  const [selected, setSelected] = useState(null)
  const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true })

  // Close lightbox on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navigate = (dir) => {
    const idx = FOTOS_GRID.findIndex(f => f.src === selected.src)
    const next = FOTOS_GRID[(idx + dir + FOTOS_GRID.length) % FOTOS_GRID.length]
    setSelected(next)
  }

  return (
    <section id="nosso-amor" className="py-28" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          ref={ref}
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart size={13} glow />
            <span className="text-xs tracking-[0.28em] uppercase font-medium" style={{ color: RED }}>
              Nosso Amor
            </span>
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-white">Nossos Momentos</h2>
          <div className="w-14 h-px mx-auto mt-4" style={{ background: `linear-gradient(90deg, transparent, ${RED}, transparent)` }} />
        </motion.div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {FOTOS_GRID.map((foto, i) => (
            <motion.div
              key={foto.src}
              className="relative overflow-hidden rounded-xl cursor-pointer group"
              style={{ aspectRatio: '1/1' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.6) }}
              whileHover={{ scale: 1.04, zIndex: 10 }}
              onClick={() => setSelected(foto)}
            >
              <img
                src={foto.src}
                alt={foto.label}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(10,2,8,0.88) 40%, transparent)' }}
              >
                <p className="text-white text-xs font-medium leading-tight">{foto.label}</p>
              </div>
              <div
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart size={14} glow />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.93)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative max-w-2xl w-full"
              initial={{ scale: 0.88, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selected.src}
                alt={selected.label}
                className="w-full rounded-2xl"
                style={{ border: `2px solid rgba(232,25,44,0.4)`, boxShadow: `0 0 40px rgba(232,25,44,0.2)` }}
              />
              <p className="text-center mt-3 text-white/60 font-serif italic text-lg">
                {selected.label}
              </p>

              {/* Close */}
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ background: RED, boxShadow: `0 0 12px ${RED}` }}
              >
                ✕
              </button>

              {/* Prev */}
              <button
                onClick={() => navigate(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all"
                style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid rgba(255,255,255,0.15)` }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              {/* Next */}
              <button
                onClick={() => navigate(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all"
                style={{ background: 'rgba(0,0,0,0.6)', border: `1px solid rgba(255,255,255,0.15)` }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── PLAYLIST SECTION ─────────────────────────────────────────────────────────
function PlaylistSection() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section id="playlist" className="py-24 text-center" style={{ background: `linear-gradient(180deg, ${BG} 0%, ${BG2} 100%)` }}>
      <motion.div
        ref={ref}
        className="max-w-md mx-auto px-6"
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-4xl mb-4"
        >
          🎵
        </motion.div>
        <h2 className="font-serif text-2xl md:text-3xl text-white mb-3">Nossa Playlist</h2>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          Essa música toca toda vez que penso em você.<br />
          Espero que também faça seu coração sorrir.
        </p>
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{ background: CARD, border: `1px solid ${RBORDER}` }}
        >
          <img
            src="/fotos/foto1.jpeg"
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
            style={{ border: `1px solid rgba(232,25,44,0.3)` }}
            alt="cover"
          />
          <div className="text-left min-w-0">
            <p className="text-white font-medium text-sm">Nossa Música</p>
            <p className="text-white/40 text-xs">A melodia que nos conecta</p>
          </div>
          <motion.div
            className="ml-auto flex-shrink-0"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart size={20} glow />
          </motion.div>
        </div>
        <p className="text-white/20 text-xs mt-4 tracking-wider">↓ player sempre disponível no rodapé ↓</p>
      </motion.div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function SurpresaFooter() {
  return (
    <footer
      className="py-10 text-center"
      style={{ borderTop: `1px solid rgba(232,25,44,0.08)`, background: BG }}
    >
      <Heart size={18} glow className="mx-auto mb-3" />
      <p className="text-white/25 text-xs tracking-[0.3em] uppercase">feito com muito amor</p>
      <p className="text-white/15 text-xs mt-1">Pedro → Ana Luísa · 12.06.2026</p>
    </footer>
  )
}

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export default function SurpresaPage() {
  return (
    <div style={{ background: BG, color: 'white' }} className="overflow-x-hidden pb-24">
      <NavBar />
      <HeroSection />
      <CardsSection />
      <StatsSection />
      <MensagemSection />
      <NossoAmorSection />
      <PlaylistSection />
      <SurpresaFooter />
      <MusicPlayer />
    </div>
  )
}
