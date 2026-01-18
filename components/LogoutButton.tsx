'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/login')
      } else {
        console.error('Logout failed')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="px-4 py-2 text-sm font-medium text-[#37352f] bg-white/80 border border-[#d3d1cb] rounded-md hover:bg-white transition-all duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  )
}
