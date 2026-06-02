import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const marcos = [
  { data: 'primeiro encontro',          desc: 'o início de tudo',          foto: '/fotos/foto7.jpeg' },
  { data: 'nosso segundo melhor encontro',             desc: 'muito tenso pra saber se vc ia gostar',             foto: '/fotos/foto16.jpeg' },
  { data: 'primeira viagem',            desc: 'melhor aventura',           foto: '/fotos/foto11.jpeg'  },
  { data: 'primeiro natal',             desc: 'família completa',          foto: '/fotos/foto12.jpeg' },
  { data: 'Melhor jantar do ano', desc: 'eternizado aqui',           foto: '/fotos/foto3.jpeg'  },
  { data: 'hoje',                       desc: 'e tudo que ainda vem',      foto: '/fotos/foto15.jpeg'  },
]

function TimelineItem({ marco, index }) {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true })
  const isLeft = index % 2 === 0

  return (
    <div ref={ref} className="relative flex items-center justify-center mb-16 last:mb-0">
      {/* dot on center line */}
      <div className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gold border-2 border-dark-2 z-10" />

      <motion.div
        className={`w-5/12 ${isLeft ? 'mr-auto pr-8 text-right' : 'ml-auto pl-8 text-left'} hidden md:block`}
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h3 className="font-serif text-xl text-gold italic mb-1">{marco.data}</h3>
        <p className="font-sans text-sm text-[#f5f0eb]/60 tracking-wide mb-3">{marco.desc}</p>
        <img
          src={marco.foto}
          alt={marco.data}
          className="w-24 h-24 object-cover rounded-sm border border-gold/20 inline-block"
        />
      </motion.div>

      {/* mobile: full width */}
      <motion.div
        className="w-full pl-8 md:hidden"
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        <h3 className="font-serif text-xl text-gold italic mb-1">{marco.data}</h3>
        <p className="font-sans text-sm text-[#f5f0eb]/60 tracking-wide mb-3">{marco.desc}</p>
        <img
          src={marco.foto}
          alt={marco.data}
          className="w-24 h-24 object-cover rounded-sm border border-gold/20"
        />
      </motion.div>
    </div>
  )
}

export default function Timeline() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section className="min-h-screen bg-dark-2 py-24 px-6">
      <motion.div
        ref={ref}
        className="text-center mb-20"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <p className="font-sans text-xs tracking-[0.3em] text-gold/50 uppercase mb-4">memórias</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#f5f0eb] italic">
          momentos que guardarei pra sempre
        </h2>
        <div className="w-16 h-px bg-gold/40 mx-auto mt-6" />
      </motion.div>

      <div className="relative max-w-3xl mx-auto">
        {/* vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gold/20 -translate-x-1/2 hidden md:block" />
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gold/20 md:hidden" />

        {marcos.map((marco, i) => (
          <TimelineItem key={i} marco={marco} index={i} />
        ))}
      </div>
    </section>
  )
}
