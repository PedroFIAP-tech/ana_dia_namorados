import { useState, useEffect } from 'react'

export function useCountdown(targetDate) {
  const calcTime = () => {
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0, isFinished: true }
    return {
      dias:       Math.floor(diff / 86400000),
      horas:      Math.floor((diff % 86400000) / 3600000),
      minutos:    Math.floor((diff % 3600000) / 60000),
      segundos:   Math.floor((diff % 60000) / 1000),
      isFinished: false,
    }
  }

  const [time, setTime] = useState(calcTime)

  useEffect(() => {
    const id = setInterval(() => setTime(calcTime()), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return time
}
