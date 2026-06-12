"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { LuLeaf as Leaf, LuLayoutDashboard as LayoutDashboard, LuTarget as Target, LuTrophy as Trophy, LuUsers as Users, LuActivity as Activity } from "react-icons/lu"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { getLevelName, getPointsForNextLevel } from "@/lib/supabase/types"
import type { Profile } from "@/lib/supabase/types"

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Activities", href: "/dashboard/activities", icon: Activity },
  { name: "Challenges", href: "/dashboard/challenges", icon: Target },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { name: "Clans", href: "/dashboard/clans", icon: Users },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
      setProfile(data)
    })
  }, [])

  const level = profile?.level ?? 1
  const { percent } = profile ? getPointsForNextLevel(profile.eco_points, level) : { percent: 0 }

  return (
    <div className="hidden border-r bg-muted/40 lg:block lg:w-64 lg:shrink-0">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <Leaf className="h-6 w-6" />
            <span>EcoPulse</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive && "bg-muted text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Live profile card */}
        <div className="mt-auto p-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-4">
            {profile ? (
              <>
                <div className="mb-1 text-sm font-semibold">{getLevelName(level)}</div>
                <div className="text-xs text-muted-foreground mb-3">
                  Level {level} · {profile.eco_points.toLocaleString()} pts
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 text-right">{percent}% to next level</div>
              </>
            ) : (
              <div className="space-y-2 animate-pulse">
                <div className="h-3 bg-muted rounded w-2/3" />
                <div className="h-2 bg-muted rounded w-1/2" />
                <div className="h-2 bg-muted rounded-full mt-3" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
