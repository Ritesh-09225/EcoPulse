"use client"

import { useEffect, useState } from "react"
import { LuMenu as Menu, LuLogOut as LogOut } from "react-icons/lu"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

export function DashboardHeader() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const userInitials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? "U"

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger
          className="shrink-0 lg:hidden inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <nav className="grid gap-2 text-lg font-medium">
            <span className="font-semibold text-primary mb-4">EcoPulse Navigation</span>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1" />

      <ModeToggle />

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            id="dashboard-user-menu"
            nativeButton={false}
            className="rounded-full ring-2 ring-emerald-500/30 hover:ring-emerald-500/60 transition-all outline-none bg-transparent border-0 p-0 cursor-pointer"
            render={
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.user_metadata?.avatar_url}
                  alt={user.user_metadata?.full_name ?? "User"}
                />
                <AvatarFallback className="bg-emerald-700 text-white text-xs font-bold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            }
          />
          <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-xl">
            <div className="px-3 py-2">
              <p className="text-sm font-semibold truncate">
                {user.user_metadata?.full_name ?? "EcoPulse User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </header>
  )
}
