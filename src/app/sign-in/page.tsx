'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LuLeaf as Leaf, LuTriangleAlert as AlertCircle } from 'react-icons/lu'
import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function SignInContent() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    // No need to setIsLoading(false) — user will be redirected
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#022C22] text-white selection:bg-emerald-500/30 overflow-hidden">
      {/* Ambient glows */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full bg-emerald-500/20 blur-[120px] opacity-70" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[100px] opacity-40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/5 blur-[80px]" />
      </div>

      {/* Logo top-left */}
      <div className="relative z-10 p-6 md:p-8">
        <Link href="/" className="inline-flex items-center gap-2 group">
          <div className="bg-emerald-500/10 p-2 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
            <Leaf className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="text-lg font-bold tracking-tighter text-white">EcoPulse</span>
        </Link>
      </div>

      {/* Main centered content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/30">
            {/* Icon + Heading */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.5, type: 'spring' }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6 mx-auto"
              >
                <Leaf className="h-8 w-8 text-emerald-400" />
              </motion.div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Welcome to EcoPulse
              </h1>
              <p className="text-white/60 text-sm leading-relaxed">
                Track your carbon footprint, earn rewards, and join
                <br className="hidden sm:block" /> the movement toward a sustainable future.
              </p>
            </div>

            {/* Error state */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6"
              >
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">Authentication failed. Please try again.</p>
              </motion.div>
            )}

            {/* Google Sign-In Button */}
            <motion.button
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold px-6 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              {isLoading ? 'Redirecting to Google...' : 'Continue with Google'}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs uppercase tracking-widest">secured by</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 text-white/40 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                No password needed
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Free forever
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Privacy-first
              </div>
            </div>

            {/* Terms */}
            <p className="text-center text-white/30 text-xs mt-6 leading-relaxed">
              By continuing, you agree to our{' '}
              <Link
                href="#"
                className="text-emerald-400/80 hover:text-emerald-400 underline underline-offset-2 transition-colors"
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href="#"
                className="text-emerald-400/80 hover:text-emerald-400 underline underline-offset-2 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Back link */}
          <div className="text-center mt-6">
            <Link href="/" className="text-white/40 hover:text-white/70 text-sm transition-colors">
              ← Back to homepage
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating stats at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative z-10 pb-8 px-4"
      >
        <div className="max-w-md mx-auto grid grid-cols-3 gap-4 text-center">
          {[
            { num: '84K+', label: 'Active Users' },
            { num: '2.4M', label: 'kg CO₂ Saved' },
            { num: '6,700', label: 'Challenges Met' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/[0.02] border border-white/5 rounded-2xl p-3">
              <div className="text-lg font-bold text-emerald-400">{stat.num}</div>
              <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  )
}
