"use client"

import { useEffect, useRef, useState } from "react"

type AnimatedNumberProps = {
  value: number
  duration?: number // ms
  formatter?: (n: number) => string
  className?: string
}

export function AnimatedNumber({ value, duration = 800, formatter, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState<number>(value)
  const fromRef = useRef<number>(value)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return
    let raf = 0
    startRef.current = null

    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts
      const progress = Math.min(1, (ts - startRef.current) / duration)
      const current = from + (to - from) * easeOutCubic(progress)
      setDisplay(current)
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      } else {
        fromRef.current = to
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  const text = formatter ? formatter(display) : Math.round(display).toString()
  return <span className={className}>{text}</span>
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}
