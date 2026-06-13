'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LuLeaf as Leaf, LuLogOut as LogOut, LuLayoutDashboard as Dashboard } from 'react-icons/lu'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? 'U')

  return (
    <header className="sticky top-0 z-50 w-full bg-[#022C22]/80 backdrop-blur-md border-b border-white/5">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-500/10 p-2 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
            <Leaf className="h-6 w-6 text-emerald-500" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">EcoPulse</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#why-it-matters"
            className="text-sm text-white/70 hover:text-white transition-colors duration-200"
          >
            Why It Matters
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm text-white/70 hover:text-white transition-colors duration-200"
          >
            How It Works
          </Link>
          <Link
            href="#impact"
            className="text-sm text-white/70 hover:text-white transition-colors duration-200"
          >
            Impact
          </Link>
          <Link
            href="#testimonials"
            className="text-sm text-white/70 hover:text-white transition-colors duration-200"
          >
            Testimonials
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-24 rounded-full bg-white/5 animate-pulse" />
          ) : user ? (
            /* Signed-in state */
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 text-sm text-white/70 hover:text-white px-4 py-2 transition-colors"
              >
                <Dashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger
                  id="user-menu-btn"
                  nativeButton={false}
                  className="rounded-full ring-2 ring-emerald-500/40 hover:ring-emerald-500/70 transition-all duration-200 outline-none bg-transparent border-0 p-0 cursor-pointer"
                  render={
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name ?? 'User'}
                      />
                      <AvatarFallback className="bg-emerald-700 text-white text-xs font-bold">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  }
                />
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-[#022C22] border border-white/10 text-white rounded-2xl shadow-2xl p-1"
                >
                  <div className="px-3 py-2 mb-1">
                    <p className="text-sm font-semibold text-white truncate">
                      {user.user_metadata?.full_name ?? 'EcoPulse User'}
                    </p>
                    <p className="text-xs text-white/50 truncate">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-white/10 my-1" />
                  <DropdownMenuItem
                    render={<Link href="/dashboard" />}
                    className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white hover:bg-white/5 rounded-xl px-3 py-2 text-sm transition-colors"
                  >
                    <Dashboard className="h-4 w-4 text-emerald-400" />
                    Go to Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10 my-1" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl px-3 py-2 text-sm transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            /* Signed-out state */
            <>
              <Link
                href="/sign-in"
                className="hidden sm:inline-flex text-sm text-white/70 hover:text-white px-4 py-2 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/sign-in"
                className="text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-[#022C22] px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
