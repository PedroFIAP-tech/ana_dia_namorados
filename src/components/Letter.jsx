import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const FULL_TEXT = `Desde o primeiro dia que te vi,
soube que você era diferente de tudo.

Você tem esse sorriso que bagunça
qualquer ambiente que entra.
Aqueles olhos verdes que eu poderia
olhar pra sempre sem cansar.

Cada momento ao seu lado virou
uma memória que não troco por nada.

Obrigado por ser minha parceira,
minha melhor amiga,
e o amor da minha vida.

Te amo, Ana Luísa.`

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Letter() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (inView && !started) setStarted(true)
  }, [inView, started])

  useEffect(() => {
    if (!started) return
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(FULL_TEXT.slice(0, i))
      if (i >= FULL_TEXT.length) {
        clearInterval(id)
        setTimeout(() => setDone(true), 400)
      }
    }, 30)
    return () => clearInterval(id)
  }, [started])

  return (
    <section className="min-h-screen bg-dark flex items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          variants={variants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          <p className="font-sans text-xs tracking-[0.3em] text-gold/50 uppercase mb-4">carta</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#f5f0eb] italic">pra você</h2>
          <div className="w-16 h-px bg-gold/40 mx-auto mt-6" />
        </motion.div>

        <div className="font-serif text-lg md:text-xl text-[#f5f0eb]/80 leading-relaxed whitespace-pre-line">
          {displayed}
          {!done && <span className="typewriter-cursor" />}
        </div>

        {done && (
          <motion.p
            className="font-serif italic text-gold text-xl mt-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            — Pedro
          </motion.p>
        )}
      </div>
    </section>
  )
}
