import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

function Petals() {
  const petals = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    duration: `${Math.random() * 6 + 4}s`,
    delay: `${Math.random() * 4}s`,
    size: `${Math.random() * 8 + 6}px`,
    opacity: Math.random() * 0.6 + 0.3,
  }))

  return (
    <>
      {petals.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </>
  )
}

function Confetti({ active }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const ctx = canvas.getContext('2d')
    const colors = ['#c9a96e', '#e8829a', '#e8d5b0', '#fff', '#f5a0b5']
    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: Math.random() * 3 + 1,
      vx: (Math.random() - 0.5) * 2,
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 6,
    }))

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.save()
        ctx.translate(p.x + p.w / 2, p.y + p.h / 2)
        ctx.rotate((p.rot * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
        ctx.restore()
        p.y += p.vy
        p.x += p.vx
        p.rot += p.rotV
        if (p.y > canvas.height) p.y = -p.h
      })
      animId = requestAnimationFrame(draw)
    }
    draw()
    const stop = setTimeout(() => cancelAnimationFrame(animId), 4000)
    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(stop)
    }
  }, [active])

  if (!active) return null
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  )
}

export default function Presente() {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  const handleOpen = () => {
    setIsOpen(true)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 4500)
  }

  return (
    <section className="relative min-h-screen bg-dark flex items-center justify-center px-6 py-24 overflow-hidden">
      <Petals />
      <Confetti active={showConfetti} />

      <div className="relative z-10 text-center max-w-lg">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="font-sans text-xs tracking-[0.3em] text-gold/50 uppercase mb-4">especial</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#f5f0eb] italic mb-4">
            uma surpresa pra você
          </h2>
          <div className="w-16 h-px bg-gold/40 mx-auto mb-12" />
        </motion.div>

        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              key="btn"
              onClick={handleOpen}
              className="font-sans text-sm tracking-[0.3em] text-gold border border-gold px-12 py-4 uppercase hover:bg-gold/10 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              abrir presente
            </motion.button>
          ) : (
            <motion.div
              key="msg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="space-y-6"
            >
              <p className="font-serif text-2xl md:text-3xl text-[#f5f0eb]/90 italic leading-relaxed">
                Meu presente pra você é
              </p>
              <p className="font-serif text-2xl md:text-3xl text-gold italic leading-relaxed">
                Eu ainda vou me casar com você, Ana Luísa. <br />
                E vai ser a melhor festa de todas, com todo mundo que a gente ama.
              </p>
              <div className="w-16 h-px bg-gold/30 mx-auto" />
              <p className="font-sans text-sm tracking-widest text-[#f5f0eb]/60 uppercase">
                Feliz Dia dos Namorados, meu amor.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
