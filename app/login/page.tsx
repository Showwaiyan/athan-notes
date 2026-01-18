'use client'

import { useState, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Pinyon_Script } from 'next/font/google'

const pinyonScript = Pinyon_Script({
  weight: '400',
  subsets: ['latin'],
})

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Login successful - redirect to intended page
        router.push(redirectTo)
        router.refresh()
      } else {
        // Login failed - show error
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F0F2F4] overflow-hidden">
      {/* Grain Noise Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg' %3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")`
        }}
      />

      {/* Global Background Particles - Dense Scatter of Medium/Tiny Dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[5]"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <svg className="w-full h-full">
          {/* Fixed scattered dots to avoid hydration mismatch */}
          {[
            { x: '5%', y: '10%', r: 2 }, { x: '15%', y: '25%', r: 3 }, { x: '25%', y: '5%', r: 2 },
            { x: '35%', y: '20%', r: 4 }, { x: '45%', y: '15%', r: 3 }, { x: '55%', y: '30%', r: 2 },
            { x: '65%', y: '10%', r: 4 }, { x: '75%', y: '25%', r: 3 }, { x: '85%', y: '5%', r: 2 },
            { x: '95%', y: '15%', r: 3 }, { x: '10%', y: '40%', r: 3 }, { x: '20%', y: '55%', r: 2 },
            { x: '30%', y: '50%', r: 4 }, { x: '40%', y: '45%', r: 8 }, { x: '50%', y: '60%', r: 3 },
            { x: '60%', y: '40%', r: 7 }, { x: '70%', y: '55%', r: 2 }, { x: '80%', y: '50%', r: 9 },
            { x: '90%', y: '45%', r: 3 }, { x: '5%', y: '70%', r: 2 }, { x: '15%', y: '85%', r: 3 },
            { x: '25%', y: '75%', r: 2 }, { x: '35%', y: '90%', r: 4 }, { x: '45%', y: '80%', r: 10 },
            { x: '55%', y: '95%', r: 2 }, { x: '65%', y: '70%', r: 3 }, { x: '75%', y: '85%', r: 8 },
            { x: '85%', y: '75%', r: 2 }, { x: '95%', y: '90%', r: 3 }, { x: '50%', y: '50%', r: 12 },
            { x: '48%', y: '52%', r: 4 }, { x: '52%', y: '48%', r: 2 }, { x: '45%', y: '45%', r: 3 },
            { x: '55%', y: '55%', r: 5 }, { x: '12%', y: '12%', r: 1 }, { x: '88%', y: '88%', r: 1 },
            { x: '20%', y: '80%', r: 2 }, { x: '80%', y: '20%', r: 3 }, { x: '40%', y: '10%', r: 2 },
            { x: '60%', y: '90%', r: 4 }, { x: '5%', y: '30%', r: 2 }, { x: '95%', y: '70%', r: 3 },
            { x: '30%', y: '5%', r: 1 }, { x: '70%', y: '95%', r: 2 }, { x: '50%', y: '25%', r: 6 },
            { x: '50%', y: '75%', r: 5 }, { x: '25%', y: '50%', r: 7 }, { x: '75%', y: '50%', r: 8 },
            { x: '15%', y: '15%', r: 2 }, { x: '85%', y: '85%', r: 3 }, { x: '33%', y: '33%', r: 2 },
            { x: '66%', y: '66%', r: 3 }, { x: '10%', y: '90%', r: 2 }, { x: '90%', y: '10%', r: 3 },
            { x: '40%', y: '60%', r: 4 }, { x: '60%', y: '40%', r: 3 }, { x: '20%', y: '20%', r: 2 },
            { x: '80%', y: '80%', r: 3 }, { x: '50%', y: '5%', r: 1 }, { x: '50%', y: '95%', r: 2 },
            { x: '5%', y: '50%', r: 1 }, { x: '95%', y: '50%', r: 2 }, { x: '25%', y: '25%', r: 4 },
            { x: '75%', y: '75%', r: 3 }, { x: '15%', y: '75%', r: 2 }, { x: '85%', y: '25%', r: 3 },
            { x: '75%', y: '15%', r: 2 }, { x: '25%', y: '85%', r: 3 }, { x: '10%', y: '60%', r: 2 },
            { x: '90%', y: '40%', r: 3 }, { x: '40%', y: '90%', r: 2 }, { x: '60%', y: '10%', r: 3 },
            { x: '30%', y: '30%', r: 5 }, { x: '70%', y: '70%', r: 4 }, { x: '20%', y: '40%', r: 2 },
            { x: '80%', y: '60%', r: 3 }, { x: '40%', y: '20%', r: 2 }, { x: '60%', y: '80%', r: 3 },
            { x: '50%', y: '40%', r: 4 }, { x: '50%', y: '60%', r: 3 }, { x: '40%', y: '50%', r: 2 },
            { x: '60%', y: '50%', r: 3 }, { x: '10%', y: '10%', r: 1 }, { x: '90%', y: '90%', r: 2 },
            { x: '5%', y: '95%', r: 1 }, { x: '95%', y: '5%', r: 2 }, { x: '20%', y: '10%', r: 2 },
            { x: '80%', y: '90%', r: 3 }, { x: '10%', y: '80%', r: 2 }, { x: '90%', y: '20%', r: 3 },
          ].map((dot, i) => (
            <circle
              key={i}
              cx={dot.x}
              cy={dot.y}
              r={dot.r}
              fill="#000"
              opacity={dot.r > 5 ? 0.2 : 0.4}
            />
          ))}
        </svg>
      </div>

      <div 
        className="w-full max-w-md px-6 relative z-10"
        style={{
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'calc(1.5rem + env(safe-area-inset-left))',
          paddingRight: 'calc(1.5rem + env(safe-area-inset-right))',
        }}
      >
        {/* Logo/Title */}
        <div className="text-center mb-12 relative">
          <h1 className={`${pinyonScript.className} text-7xl text-[#1a1a1a] mb-2 relative flex items-center justify-center`}>
            <span className="text-9xl leading-[0.8] mr-[0.02em]">A</span>than Notes
          </h1>
          <p className="text-[#5A5A5A] text-sm mt-4 tracking-wide">
            Sign in to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-lg p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#37352f] mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/80 border border-[#d3d1cb] rounded-md 
                         text-[#37352f] placeholder-[#9b9a97]
                         focus:outline-none focus:ring-2 focus:ring-[#2383e2] focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-150"
                placeholder="Enter your username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#37352f] mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/80 border border-[#d3d1cb] rounded-md 
                         text-[#37352f] placeholder-[#9b9a97]
                         focus:outline-none focus:ring-2 focus:ring-[#2383e2] focus:border-transparent
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-all duration-150"
                placeholder="Enter your password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-[#fbe4e4] border border-[#f1aeb5] rounded-md p-3">
                <p className="text-sm text-[#eb5757]">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#1a1a1a] text-white py-3 rounded-md font-medium
                       hover:bg-[#333] active:bg-[#000]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-150 shadow-sm"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          {/* Helper Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-[#787774]">
              Single-user authentication for Athan Notes
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-[#787774]">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
