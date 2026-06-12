"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LuX as X, LuPlus as Plus, LuLeaf as Leaf, LuCar as Car, LuUtensils as Utensils, LuZap as Zap, LuShoppingBag as ShoppingBag, LuPlaneTakeoff as Plane, LuMonitor as Monitor, LuCircleHelp as HelpCircle } from "react-icons/lu"
import { logActivity } from "@/lib/data"
import type { Category } from "@/lib/supabase/types"

const CATEGORIES: { value: Category; label: string; icon: React.ReactNode; color: string; examples: string }[] = [
  { value: 'transport', label: 'Transport', icon: <Car className="h-5 w-5" />, color: 'bg-blue-500/10 text-blue-400 border-blue-500/30', examples: 'Uber, driving, cycling, public transit' },
  { value: 'food', label: 'Food', icon: <Utensils className="h-5 w-5" />, color: 'bg-orange-500/10 text-orange-400 border-orange-500/30', examples: 'Delivery, vegan meal, local produce' },
  { value: 'energy', label: 'Energy', icon: <Zap className="h-5 w-5" />, color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', examples: 'Appliances, heating, solar use' },
  { value: 'shopping', label: 'Shopping', icon: <ShoppingBag className="h-5 w-5" />, color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', examples: 'Online orders, secondhand buying' },
  { value: 'travel', label: 'Travel', icon: <Plane className="h-5 w-5" />, color: 'bg-pink-500/10 text-pink-400 border-pink-500/30', examples: 'Flights, train journeys, road trips' },
  { value: 'digital', label: 'Digital', icon: <Monitor className="h-5 w-5" />, color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', examples: 'Streaming, cloud storage, video calls' },
  { value: 'other', label: 'Other', icon: <HelpCircle className="h-5 w-5" />, color: 'bg-white/5 text-white/60 border-white/10', examples: 'Anything else' },
]

interface Props {
  onSuccess?: () => void
}

export function LogActivityModal({ onSuccess }: Props) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [category, setCategory] = useState<Category | null>(null)
  const [label, setLabel] = useState("")
  const [co2Type, setCo2Type] = useState<'emission' | 'saving'>('emission')
  const [co2Value, setCo2Value] = useState("")
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState(false)

  const reset = () => {
    setStep(1)
    setCategory(null)
    setLabel("")
    setCo2Type('emission')
    setCo2Value("")
    setSuccess(false)
  }

  const close = () => {
    setOpen(false)
    setTimeout(reset, 300)
  }

  const handleSubmit = () => {
    if (!category || !label || !co2Value) return
    const co2_kg = co2Type === 'emission' ? Math.abs(Number(co2Value)) : -Math.abs(Number(co2Value))

    startTransition(async () => {
      try {
        await logActivity({ label, category, co2_kg })
        setSuccess(true)
        setTimeout(() => { close(); onSuccess?.() }, 1500)
      } catch (e) {
        console.error(e)
      }
    })
  }

  const selectedCat = CATEGORIES.find(c => c.value === category)

  return (
    <>
      {/* Trigger Button */}
      <button
        id="log-activity-btn"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#022C22] font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] text-sm"
      >
        <Plus className="h-4 w-4" />
        Log Activity
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
                    <h2 className="text-lg font-bold text-white">Log an Activity</h2>
                    <p className="text-xs text-white/50 mt-0.5">
                      {step === 1 ? 'Choose a category' : 'Add details'}
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
                        <Leaf className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-lg">Activity logged!</p>
                        <p className="text-white/50 text-sm mt-1">Your eco points have been updated.</p>
                      </div>
                    </motion.div>
                  ) : step === 1 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.value}
                          onClick={() => { setCategory(cat.value); setStep(2) }}
                          className={`flex items-center gap-3 p-4 rounded-2xl border transition-all duration-200 text-left hover:border-emerald-500/40 hover:bg-white/[0.03] ${category === cat.value ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/8 bg-white/[0.02]'}`}
                        >
                          <span className={`p-2 rounded-xl border ${cat.color}`}>{cat.icon}</span>
                          <div>
                            <div className="text-sm font-medium text-white">{cat.label}</div>
                            <div className="text-xs text-white/40 leading-tight mt-0.5">{cat.examples.split(',')[0]}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* Category pill */}
                      <button
                        onClick={() => setStep(1)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${selectedCat?.color} cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        {selectedCat?.icon}
                        {selectedCat?.label}
                        <span className="text-white/30 text-xs">← change</span>
                      </button>

                      {/* Activity label */}
                      <div>
                        <label className="text-sm text-white/70 font-medium mb-2 block">What did you do?</label>
                        <input
                          type="text"
                          value={label}
                          onChange={e => setLabel(e.target.value)}
                          placeholder={`e.g. ${selectedCat?.examples.split(',')[0]}`}
                          className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all"
                        />
                      </div>

                      {/* Emission or Saving */}
                      <div>
                        <label className="text-sm text-white/70 font-medium mb-2 block">Was this an emission or a saving?</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setCo2Type('emission')}
                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${co2Type === 'emission' ? 'border-red-400/50 bg-red-500/10 text-red-400' : 'border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.04]'}`}
                          >
                            🔴 Emission (CO₂ added)
                          </button>
                          <button
                            onClick={() => setCo2Type('saving')}
                            className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all ${co2Type === 'saving' ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/[0.04]'}`}
                          >
                            🟢 Saving (CO₂ avoided)
                          </button>
                        </div>
                      </div>

                      {/* CO2 amount */}
                      <div>
                        <label className="text-sm text-white/70 font-medium mb-2 block">Estimated CO₂ amount (kg)</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={co2Value}
                            onChange={e => setCo2Value(e.target.value)}
                            placeholder="e.g. 1.5"
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-sm">kg</span>
                        </div>
                        <p className="text-xs text-white/30 mt-1.5">
                          {co2Type === 'saving' ? '🟢 Savings earn more Eco Points!' : '🔴 Honest logging still earns 5 pts.'}
                        </p>
                      </div>

                      {/* Submit */}
                      <button
                        onClick={handleSubmit}
                        disabled={!label || !co2Value || isPending}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#022C22] font-semibold py-3.5 rounded-2xl transition-all duration-200 text-sm flex items-center justify-center gap-2"
                      >
                        {isPending ? (
                          <><div className="h-4 w-4 border-2 border-[#022C22]/30 border-t-[#022C22] rounded-full animate-spin" /> Saving...</>
                        ) : (
                          <><Leaf className="h-4 w-4" /> Log Activity</>
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
