import './index.css'
import Hero from './components/Hero'
import Countdown from './components/Countdown'
import Gallery from './components/Gallery'
import Letter from './components/Letter'
import Timeline from './components/Timeline'
import Presente from './components/Presente'
import Footer from './components/Footer'

export default function App() {
  return (
    <main className="grain bg-dark text-[#f5f0eb] font-sans overflow-x-hidden">
      <Hero />
      <Countdown />
      <Gallery />
      <Letter />
      <Timeline />
      <Presente />
      <Footer />
    </main>
  )
}
