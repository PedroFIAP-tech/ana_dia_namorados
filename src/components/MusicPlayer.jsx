import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Coloque seu arquivo de música em public/musica.mp3
// ou substitua pela URL da sua música abaixo
const MUSIC_SRC = 'public/musica.mp3'
const TRACK = {
  title: 'Nossa Música',
  artist: 'Melodia que nos conecta',
  cover: '/fotos/foto1.jpeg',
}

function fmt(t) {
  if (!t || isNaN(t)) return '0:00'
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

const IC = 'rgba(232,25,44,'
const RED = '#e8192c'
const PINK = '#ff6b8a'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const progressRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [error, setError] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => setDuration(audio.duration)
    const onEnded = () => setPlaying(false)
    const onError = () => setError(true)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    audio.volume = volume
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
    }
  }, [])

  const togglePlay = async () => {
    const audio = audioRef.current
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setError(true)
      }
    }
  }

  const seek = (e) => {
    if (!duration) return
    const rect = progressRef.current.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audioRef.current.currentTime = ratio * duration
    setCurrentTime(ratio * duration)
  }

  const changeVolume = (e) => {
    const v = parseFloat(e.target.value)
    setVolume(v)
    audioRef.current.volume = v
    if (v > 0) setMuted(false)
  }

  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    audioRef.current.muted = next
  }

  const skip = (delta) => {
    const audio = audioRef.current
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + delta))
  }

  const progress = duration ? (currentTime / duration) * 100 : 0

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ background: 'rgba(8,1,6,0.97)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${IC}0.15)` }}
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <audio ref={audioRef} src={MUSIC_SRC} preload="metadata" />

      {/* Progress bar */}
      <div
        ref={progressRef}
        className="h-1 w-full cursor-pointer group"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        onClick={seek}
      >
        <div
          className="h-full relative transition-all duration-100"
          style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${RED}, ${PINK})` }}
        >
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'white', boxShadow: `0 0 6px ${RED}` }}
          />
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-3 grid grid-cols-3 items-center gap-4">
        {/* Track info */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative flex-shrink-0">
            <img
              src={TRACK.cover}
              alt="cover"
              className="w-11 h-11 rounded-lg object-cover"
              style={{ border: `1px solid ${IC}0.3)` }}
            />
            {playing && (
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{ boxShadow: [`0 0 0px ${IC}0)`, `0 0 10px ${IC}0.5)`, `0 0 0px ${IC}0)`] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{TRACK.title}</p>
            <p className="text-white/40 text-xs truncate">
              {error ? '⚠ Adicione musica.mp3 em public/' : TRACK.artist}
            </p>
          </div>
          <button className="hidden md:block ml-2 flex-shrink-0 transition-transform hover:scale-110">
            <svg width="18" height="18" viewBox="0 0 24 24" fill={RED}
              style={{ filter: `drop-shadow(0 0 4px ${RED})` }}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <button
            onClick={() => skip(-10)}
            className="text-white/40 hover:text-white/80 transition-colors"
            title="Voltar 10s"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
            </svg>
          </button>

          <motion.button
            onClick={togglePlay}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
            style={{ background: `linear-gradient(135deg, ${RED}, ${PINK})`, boxShadow: `0 2px 12px ${IC}0.4)` }}
            whileHover={{ scale: 1.08, boxShadow: `0 4px 20px ${IC}0.6)` }}
            whileTap={{ scale: 0.95 }}
          >
            {playing ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white" style={{ marginLeft: 2 }}>
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </motion.button>

          <button
            onClick={() => skip(10)}
            className="text-white/40 hover:text-white/80 transition-colors"
            title="Avançar 10s"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z" />
            </svg>
          </button>
        </div>

        {/* Time + Volume */}
        <div className="flex items-center justify-end gap-3">
          <span className="hidden md:block text-white/35 text-xs tabular-nums">
            {fmt(currentTime)} / {fmt(duration)}
          </span>

          <button onClick={toggleMute} className="text-white/35 hover:text-white/70 transition-colors">
            {muted || volume === 0 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-3.22-7.82-7.41-8.36-.07.01-.59.08-.59.08v2.02s.47-.06.52-.07C16.71 5.97 19 8.76 19 12zm-8.71-6.29-3.54 3.54H4v5.5h3.25L11 18.29V5.71zM4.27 3 3 4.27l3 3H4v5.5h3.25L11 16.27V13.5l3.95 3.95.98-.97-1.27-1.26L6.73 3 4.27 3z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={muted ? 0 : volume}
            onChange={changeVolume}
            className="hidden md:block w-20 accent-rose-500 cursor-pointer"
            style={{ accentColor: RED }}
          />
        </div>
      </div>
    </motion.div>
  )
}
