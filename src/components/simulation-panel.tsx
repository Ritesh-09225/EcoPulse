"use client"

import { useState } from "react"
import { LuBug as Bug, LuUtensils as Utensils, LuCar as Car, LuZap as Zap } from "react-icons/lu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { logActivity } from "@/lib/data"
import type { Category } from "@/lib/supabase/types"

type SimAction = {
  label: string
  description: string
  category: Category
  co2_kg: number
  variant: "emission" | "saving"
}

const FOOD_ACTIONS: SimAction[] = [
  { label: "Zomato Delivery (15km away)", description: "+0.8 kg CO₂ added", category: "food", co2_kg: 0.8, variant: "emission" },
  { label: "Cooked Vegan Meal at Home", description: "-1.2 kg CO₂ avoided", category: "food", co2_kg: -1.2, variant: "saving" },
]
const TRANSIT_ACTIONS: SimAction[] = [
  { label: "Uber Ride (10km)", description: "+1.5 kg CO₂ added", category: "transport", co2_kg: 1.5, variant: "emission" },
  { label: "Public Bus Ride", description: "-0.8 kg CO₂ avoided", category: "transport", co2_kg: -0.8, variant: "saving" },
  { label: "Cycled to Work", description: "-2.1 kg CO₂ avoided", category: "transport", co2_kg: -2.1, variant: "saving" },
]
const ENERGY_ACTIONS: SimAction[] = [
  { label: "Air Conditioner on for 4h", description: "+1.2 kg CO₂ added", category: "energy", co2_kg: 1.2, variant: "emission" },
  { label: "Turned off unused electronics", description: "-0.3 kg CO₂ avoided", category: "energy", co2_kg: -0.3, variant: "saving" },
]

export function SimulationPanel() {
  const [loading, setLoading] = useState<string | null>(null)

  const simulate = async (action: SimAction) => {
    setLoading(action.label)
    try {
      await logActivity({
        label: action.label,
        category: action.category,
        co2_kg: action.co2_kg,
      })
      if (action.variant === "saving") {
        toast.success(`Logged: ${action.label}`, { description: action.description })
      } else {
        toast.error(`Logged: ${action.label}`, { description: action.description })
      }
    } catch {
      toast.error("Failed to log activity. Are you signed in?")
    } finally {
      setLoading(null)
    }
  }

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="outline" size="icon" className="fixed bottom-24 right-6 h-12 w-12 rounded-full shadow-lg border-primary/20 bg-background/80 backdrop-blur-md z-50">
            <Bug className="h-6 w-6 text-primary" />
          </Button>
        }
      />
      <SheetContent side="right" className="w-[400px] sm:w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Bug className="h-5 w-5" /> Quick Log Panel</SheetTitle>
          <SheetDescription>
            Tap any action to instantly log it to your activity feed and earn Eco Points.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Utensils className="h-4 w-4 text-orange-400" /> Food & Delivery</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {FOOD_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className={`justify-start w-full text-left h-auto py-2.5 px-3 flex flex-col items-start gap-0.5 ${action.variant === "saving" ? "text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/5" : "text-destructive border-destructive/20 hover:bg-destructive/5"}`}
                  onClick={() => simulate(action)}
                  disabled={loading === action.label}
                >
                  <span className="font-medium text-sm">{action.label}</span>
                  <span className="text-xs opacity-70">{action.description}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Car className="h-4 w-4 text-blue-400" /> Transit</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {TRANSIT_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className={`justify-start w-full text-left h-auto py-2.5 px-3 flex flex-col items-start gap-0.5 ${action.variant === "saving" ? "text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/5" : "text-destructive border-destructive/20 hover:bg-destructive/5"}`}
                  onClick={() => simulate(action)}
                  disabled={loading === action.label}
                >
                  <span className="font-medium text-sm">{action.label}</span>
                  <span className="text-xs opacity-70">{action.description}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Zap className="h-4 w-4 text-yellow-400" /> Energy</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              {ENERGY_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className={`justify-start w-full text-left h-auto py-2.5 px-3 flex flex-col items-start gap-0.5 ${action.variant === "saving" ? "text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/5" : "text-destructive border-destructive/20 hover:bg-destructive/5"}`}
                  onClick={() => simulate(action)}
                  disabled={loading === action.label}
                >
                  <span className="font-medium text-sm">{action.label}</span>
                  <span className="text-xs opacity-70">{action.description}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
