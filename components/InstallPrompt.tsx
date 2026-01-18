'use client'

import { useEffect, useState } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Save the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show install button
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    // Show the install prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    }

    // Clear the deferredPrompt so it can only be used once
    setDeferredPrompt(null)
    setShowInstallButton(false)
  }

  if (!showInstallButton) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50">
      <div className="bg-white/90 backdrop-blur-md border border-white/50 rounded-lg shadow-lg p-4 flex items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#1a1a1a]">Install Athan Notes</p>
          <p className="text-xs text-[#5A5A5A] mt-0.5">Add to home screen for quick access</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowInstallButton(false)}
            className="px-3 py-1.5 text-sm text-[#5A5A5A] hover:text-[#1a1a1a] transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleInstallClick}
            className="px-4 py-1.5 text-sm bg-[#1a1a1a] text-white rounded-md hover:bg-[#333] active:bg-[#000] transition-colors shadow-sm"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
