import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Particles from './Particles'

export default function Hero() {
  const sectionRef = useRef(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const onScroll = () => setOffsetY(window.scrollY * 0.35)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center bg-dark overflow-hidden"
    >
      <Particles />

      <div
        className="relative z-10 text-center px-6"
        style={{ transform: `translateY(${offsetY}px)` }}
      >
        <motion.h1
          className="font-serif text-6xl md:text-8xl text-gold leading-none"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Ana Luísa
        </motion.h1>

        <motion.div
          className="w-24 h-px bg-gold mx-auto my-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        />

        <motion.p
          className="font-sans text-sm tracking-[0.3em] text-rose uppercase"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          o amor da minha vida
        </motion.p>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="font-sans text-xs tracking-widest text-gold/40 uppercase">scroll</span>
        <div className="w-px h-8 bg-gold/30 animate-scroll-hint" />
      </motion.div>
    </section>
  )
}
