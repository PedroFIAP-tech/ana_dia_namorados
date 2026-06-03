import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const base = import.meta.env.BASE_URL

const fotos = [
  { src: `${base}fotos/foto1.jpeg`,  legenda: 'você é incrível' },
  { src: `${base}fotos/fotos.jpeg`,  legenda: 'essa foto é especial' },
  { src: `${base}fotos/foto3.jpeg`,  legenda: 'te amo assim' },
  { src: `${base}fotos/foto4.jpeg`,  legenda: 'momento perfeito' },
  { src: `${base}fotos/foto5.jpeg`,  legenda: 'tão linda' },
  { src: `${base}fotos/foto6.jpeg`,  legenda: 'aventuras com você' },
  { src: `${base}fotos/foto7.jpeg`,  legenda: 'minha favorita' },
  { src: `${base}fotos/foto8.jpeg`,  legenda: 'cada detalhe' },
  { src: `${base}fotos/foto9.jpeg`,  legenda: 'sorriso que me conquista' },
  { src: `${base}fotos/foto10.jpeg`, legenda: 'dias inesquecíveis' },
  { src: `${base}fotos/foto11.jpeg`, legenda: 'juntos é melhor' },
  { src: `${base}fotos/foto12.jpeg`, legenda: 'olha esse sorriso' },
  { src: `${base}fotos/foto13.jpeg`, legenda: 'você ilumina tudo' },
  { src: `${base}fotos/foto14.jpeg`, legenda: 'memória que guardo' },
  { src: `${base}fotos/foto15.jpeg`, legenda: 'pra sempre' },
  { src: `${base}fotos/foto16.jpeg`, legenda: 'do começo ao fim' },
  { src: `${base}fotos/foto17.jpeg`, legenda: 'onde tudo começou' },
]

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Gallery() {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true })

  return (
    <section className="py-24 bg-dark overflow-hidden">
      <motion.div
        ref={ref}
        className="text-center mb-16 px-6"
        variants={variants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <p className="font-sans text-xs tracking-[0.3em] text-gold/50 uppercase mb-4">galeria</p>
        <h2 className="font-serif text-4xl md:text-5xl text-[#f5f0eb] italic">nossa história</h2>
        <div className="w-16 h-px bg-gold/40 mx-auto mt-6" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          slidesPerView="auto"
          spaceBetween={16}
          centeredSlides={true}
          navigation
          className="gallery-swiper"
          style={{ paddingTop: '8px', paddingBottom: '8px' }}
        >
          {fotos.map((foto, i) => (
            <SwiperSlide key={i} style={{ width: '280px' }}>
              <div className="group relative overflow-hidden border border-gold/20 hover:border-gold/60 transition-all duration-700 cursor-pointer">
                <img
                  src={foto.src}
                  alt={foto.legenda}
                  className="w-full h-80 object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.02] transition-all duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-dark/60 group-hover:bg-dark/20 transition-all duration-700 flex items-end p-4">
                  <p className="font-sans text-xs tracking-widest text-gold/80 uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {foto.legenda}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  )
}
