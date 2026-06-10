import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './index.css'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import Gallery from './components/Gallery'
import Letter from './components/Letter'
import Timeline from './components/Timeline'
import Presente from './components/Presente'
import Footer from './components/Footer'
import SurpresaPage from './components/SurpresaPage'

export default function App() {
  const [fase, setFase] = useState('site1')

  return (
    <AnimatePresence mode="wait">
      {fase === 'site1' ? (
        <motion.main
          key="site1"
          className="grain bg-dark text-[#f5f0eb] font-sans overflow-x-hidden"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <Hero />
          <Countdown onFim={() => setFase('site2')} />
          <Gallery />
          <Letter />
          <Timeline />
          <Presente />
          <Footer />
        </motion.main>
      ) : (
        <motion.div
          key="site2"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <SurpresaPage />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
