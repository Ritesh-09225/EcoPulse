import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogActivityModal } from '@/components/log-activity-modal'
import {
  LuUtensils as Utensils,
  LuLeaf as Leaf,
  LuCar as Car,
  LuZap as Zap,
  LuShoppingBag as ShoppingBag,
  LuPlaneTakeoff as Plane,
  LuMonitor as Monitor,
} from 'react-icons/lu'
import { getMyActivities } from '@/lib/data'
import { formatDistanceToNow } from '@/lib/time'

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  transport: <Car className="h-4 w-4 text-blue-400" />,
  food: <Utensils className="h-4 w-4 text-orange-400" />,
  energy: <Zap className="h-4 w-4 text-yellow-400" />,
  shopping: <ShoppingBag className="h-4 w-4 text-purple-400" />,
  travel: <Plane className="h-4 w-4 text-pink-400" />,
  digital: <Monitor className="h-4 w-4 text-cyan-400" />,
  other: <Leaf className="h-4 w-4 text-white/50" />,
}
const CATEGORY_BG: Record<string, string> = {
  transport: 'bg-blue-500/10',
  food: 'bg-orange-500/10',
  energy: 'bg-yellow-500/10',
  shopping: 'bg-purple-500/10',
  travel: 'bg-pink-500/10',
  digital: 'bg-cyan-500/10',
  other: 'bg-white/5',
}
const CATEGORY_LABEL: Record<string, string> = {
  transport: 'Transport',
  food: 'Food',
  energy: 'Energy',
  shopping: 'Shopping',
  travel: 'Travel',
  digital: 'Digital',
  other: 'Other',
}

export default async function ActivitiesPage() {
  const activities = await getMyActivities(100)

  const totalEmissions = activities.filter((a) => a.co2_kg > 0).reduce((s, a) => s + a.co2_kg, 0)
  const totalSavings = activities
    .filter((a) => a.co2_kg < 0)
    .reduce((s, a) => s + Math.abs(a.co2_kg), 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Activity Log</h2>
          <p className="text-muted-foreground">
            Detailed view of your tracked actions and their environmental impact.
          </p>
        </div>
        <LogActivityModal />
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground mb-1">Total Emissions Logged</p>
            <p className="text-2xl font-bold text-red-400">+{totalEmissions.toFixed(1)} kg</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground mb-1">Total CO₂ Saved</p>
            <p className="text-2xl font-bold text-emerald-400">-{totalSavings.toFixed(1)} kg</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
          <CardDescription>
            {activities.length > 0 ? `${activities.length} activities logged` : 'No activities yet'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Leaf className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No activities yet</p>
              <p className="text-sm mt-1">
                Use the &quot;Log Activity&quot; button to get started.
              </p>
            </div>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors"
              >
                <div
                  className={`${CATEGORY_BG[act.category] ?? 'bg-white/5'} p-2.5 rounded-xl shrink-0`}
                >
                  {CATEGORY_ICON[act.category] ?? <Leaf className="h-4 w-4" />}
                </div>
                <div className="space-y-0.5 flex-1 min-w-0">
                  <p className="text-sm font-medium leading-none truncate">{act.label}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="capitalize">
                      {CATEGORY_LABEL[act.category] ?? act.category}
                    </span>
                    <span>·</span>
                    <span>{formatDistanceToNow(act.created_at)}</span>
                  </p>
                </div>
                <div
                  className={`font-semibold text-sm shrink-0 ${act.co2_kg < 0 ? 'text-emerald-500' : 'text-red-400'}`}
                >
                  {act.co2_kg < 0 ? '−' : '+'}
                  {Math.abs(act.co2_kg)} kg CO₂
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
