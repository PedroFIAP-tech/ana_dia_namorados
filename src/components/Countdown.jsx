import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useCountdown } from '../hooks/useCountdown'

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function Unit({ value, label, delay }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center"
      variants={variants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ delay }}
    >
      <span className="font-serif text-6xl md:text-8xl text-gold leading-none tabular-nums">
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-sans text-xs tracking-[0.25em] text-gold/50 uppercase mt-2">
        {label}
      </span>
    </motion.div>
  )
}

export default function Countdown({ onFim }) {
  const { dias, horas, minutos, segundos, isFinished } = useCountdown('2026-06-12T00:00:00')

  useEffect(() => {
    if (isFinished && onFim) onFim()
  }, [isFinished])
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section className="min-h-screen bg-dark-wine flex flex-col items-center justify-center px-6 py-24">
      <motion.div
        ref={ref}
        className="text-center mb-16"
        variants={variants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <p className="font-sans text-xs tracking-[0.3em] text-gold/50 uppercase mb-4">faltam</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#f5f0eb]/80 italic">
          para o nosso dia
        </h2>
      </motion.div>

      <div className="flex items-center gap-6 md:gap-12">
        <Unit value={dias}    label="dias"    delay={0.1} />
        <span className="font-serif text-4xl text-gold/30 mb-6">|</span>
        <Unit value={horas}   label="horas"   delay={0.2} />
        <span className="font-serif text-4xl text-gold/30 mb-6">|</span>
        <Unit value={minutos} label="min"     delay={0.3} />
        <span className="font-serif text-4xl text-gold/30 mb-6">|</span>
        <Unit value={segundos} label="seg"   delay={0.4} />
      </div>

      <motion.div
        className="mt-16 w-24 h-px bg-gold/30 mx-auto"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={inView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.8 }}
      />
    </section>
  )
}
