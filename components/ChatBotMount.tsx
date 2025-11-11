"use client"

import React from 'react'
import dynamic from 'next/dynamic'

const LazyChatBot = dynamic(() => import('@/components/EnhancedChatBot'), {
  ssr: false,
  loading: () => null,
})

export default function ChatBotMount() {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    let timeout: any
    const onFirstInteract = () => {
      setReady(true)
      window.removeEventListener('scroll', onFirstInteract)
      window.removeEventListener('pointerdown', onFirstInteract)
      window.removeEventListener('keydown', onFirstInteract)
    }
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      (window as any).requestIdleCallback(() => setReady(true), { timeout: 3000 })
    } else {
      timeout = setTimeout(() => setReady(true), 2500)
    }
    window.addEventListener('scroll', onFirstInteract, { passive: true, once: true })
    window.addEventListener('pointerdown', onFirstInteract, { once: true })
    window.addEventListener('keydown', onFirstInteract, { once: true })
    return () => {
      if (timeout) clearTimeout(timeout)
      window.removeEventListener('scroll', onFirstInteract)
      window.removeEventListener('pointerdown', onFirstInteract)
      window.removeEventListener('keydown', onFirstInteract)
    }
  }, [])

  return ready ? <LazyChatBot /> : null
}
