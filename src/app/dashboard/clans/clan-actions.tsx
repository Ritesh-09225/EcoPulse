"use client"

import { useTransition } from "react"
import { joinClan, leaveClan } from "@/lib/data"
import { LuLogOut as LogOut, LuUserPlus as UserPlus } from "react-icons/lu"

interface ClanActionsProps {
  clanId: string
  isLeader?: boolean
  joinMode?: boolean
}

export function ClanActions({ clanId, isLeader, joinMode }: ClanActionsProps) {
  const [isPending, startTransition] = useTransition()

  if (joinMode) {
    return (
      <button
        id={`join-clan-${clanId}`}
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            try {
              await joinClan(clanId)
              window.location.reload()
            } catch (e) {
              console.error(e)
              alert(e instanceof Error ? e.message : 'Failed to join')
            }
          })
        }}
        className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-[#022C22] font-semibold px-3.5 py-1.5 rounded-full transition-all duration-200 text-xs shrink-0"
      >
        {isPending ? (
          <div className="h-3 w-3 border-2 border-[#022C22]/30 border-t-[#022C22] rounded-full animate-spin" />
        ) : (
          <UserPlus className="h-3.5 w-3.5" />
        )}
        Join
      </button>
    )
  }

  return (
    <button
      id="leave-clan-btn"
      disabled={isPending}
      onClick={() => {
        const msg = isLeader
          ? 'As the leader, leaving will transfer leadership (or delete the clan if you are the only member). Continue?'
          : 'Are you sure you want to leave this clan?'
        if (!confirm(msg)) return

        startTransition(async () => {
          try {
            await leaveClan()
            window.location.reload()
          } catch (e) {
            console.error(e)
            alert(e instanceof Error ? e.message : 'Failed to leave')
          }
        })
      }}
      className="inline-flex items-center gap-1.5 border border-destructive/30 text-destructive hover:bg-destructive/10 disabled:opacity-50 font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 text-xs shrink-0"
    >
      {isPending ? (
        <div className="h-3 w-3 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
      ) : (
        <LogOut className="h-3.5 w-3.5" />
      )}
      Leave
    </button>
  )
}
