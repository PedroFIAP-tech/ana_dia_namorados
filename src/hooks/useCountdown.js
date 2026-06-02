import { useState, useEffect } from 'react'

export function useCountdown(targetDate) {
  const [time, setTime] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 })

  useEffect(() => {
    const update = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTime({ dias: 0, horas: 0, minutos: 0, segundos: 0 })
      setTime({
        dias:     Math.floor(diff / 86400000),
        horas:    Math.floor((diff % 86400000) / 3600000),
        minutos:  Math.floor((diff % 3600000) / 60000),
        segundos: Math.floor((diff % 60000) / 1000),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return time
}
