"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LuX as X, LuPlus as Plus, LuUsers as Users, LuLeaf as Leaf, LuTag as Tag } from "react-icons/lu"
import { createClan } from "@/lib/data"

const CLAN_TAGS = [
  { value: 'Environment', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { value: 'Transport', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { value: 'Food', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  { value: 'Energy', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  { value: 'Community', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { value: 'Lifestyle', color: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
  { value: 'General', color: 'bg-white/5 text-white/60 border-white/10' },
]

export function CreateClanModal() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [tag, setTag] = useState("General")
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setName("")
    setDescription("")
    setTag("General")
    setSuccess(false)
    setError(null)
  }

  const close = () => {
    setOpen(false)
    setTimeout(reset, 300)
  }

  const handleSubmit = () => {
    if (!name.trim()) return
    setError(null)

    startTransition(async () => {
      try {
        await createClan({ name, description, tag })
        setSuccess(true)
        setTimeout(() => { close(); window.location.reload() }, 1200)
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to create clan'
        setError(message)
      }
    })
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        id="create-clan-btn"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#022C22] font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] text-sm"
      >
        <Plus className="h-4 w-4" />
        Create Clan
      </button>

      {/* Backdrop + Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-[#022C22] border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                  <div>
                    <h2 className="text-lg font-bold text-white">Create a Clan</h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      Start an eco-squad and invite others to join
                    </p>
                  </div>
                  <button onClick={close} className="text-white/40 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/5">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6">
                  {success ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-4 py-8 text-center"
                    >
                      <div className="h-16 w-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <Users className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">Clan created!</p>
                        <p className="text-white/50 text-sm mt-1">You are now the leader of &quot;{name}&quot;.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-5">
                      {/* Error */}
                      {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400">
                          {error}
                        </div>
                      )}

                      {/* Clan Name */}
                      <div>
                        <label className="text-sm text-white/70 font-medium mb-2 block">Clan Name *</label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          placeholder="e.g. Ocean Savers"
                          maxLength={40}
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all"
                        />
                        <p className="text-xs text-white/30 mt-1 text-right">{name.length}/40</p>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-sm text-white/70 font-medium mb-2 block">Description</label>
                        <textarea
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          placeholder="What's your clan about?"
                          rows={3}
                          maxLength={200}
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all resize-none"
                        />
                      </div>

                      {/* Tag Selection */}
                      <div>
                        <label className="text-sm text-white/70 font-medium mb-2 block flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5" /> Category Tag
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {CLAN_TAGS.map((t) => (
                            <button
                              key={t.value}
                              onClick={() => setTag(t.value)}
                              className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                                tag === t.value
                                  ? t.color + ' ring-1 ring-emerald-500/40'
                                  : 'border-white/8 bg-white/[0.02] text-white/50 hover:bg-white/[0.04]'
                              }`}
                            >
                              {t.value}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        onClick={handleSubmit}
                        disabled={!name.trim() || isPending}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#022C22] font-semibold py-3.5 rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-2"
                      >
                        {isPending ? (
                          <><div className="h-4 w-4 border-2 border-[#022C22]/30 border-t-[#022C22] rounded-full animate-spin" /> Creating...</>
                        ) : (
                          <><Leaf className="h-4 w-4" /> Create Clan</>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
