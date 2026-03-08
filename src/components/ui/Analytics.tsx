'use client'
import { useEffect } from 'react'

export default function Analytics() {
  useEffect(() => {
    // Track page view
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'page_view',
        metadata: { path: window.location.pathname },
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {})
  }, [])

  return null
}

export function trackEvent(type: string, metadata?: Record<string, string>) {
  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, metadata, userAgent: navigator.userAgent }),
  }).catch(() => {})
}
