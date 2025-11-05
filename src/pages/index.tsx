// pages/index.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('userToken')
    if (token) {
      router.replace('/dashboard') // token varsa direkt dashboard
    } else {
      router.replace('/login') // yoksa login
    }
  }, [router])

  return null
}
