import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardCharts } from "@/components/dashboard-charts"
import { LogActivityModal } from "@/components/log-activity-modal"
import { LuZap as Zap, LuTrendingDown as TrendingDown, LuLeaf as Leaf, LuUtensils as Utensils, LuCar as Car, LuShoppingBag as ShoppingBag, LuMonitor as Monitor, LuPlaneTakeoff as Plane } from "react-icons/lu"
import { getMyProfile, getMyActivities, getMyChallenges, ensureChallengesAssigned } from "@/lib/data"
import { getLevelName } from "@/lib/supabase/types"
import { formatDistanceToNow } from "@/lib/time"

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  transport: <Car className="h-4 w-4 text-blue-400" />,
  food:      <Utensils className="h-4 w-4 text-orange-400" />,
  energy:    <Zap className="h-4 w-4 text-yellow-400" />,
  shopping:  <ShoppingBag className="h-4 w-4 text-purple-400" />,
  travel:    <Plane className="h-4 w-4 text-pink-400" />,
  digital:   <Monitor className="h-4 w-4 text-cyan-400" />,
  other:     <Leaf className="h-4 w-4 text-white/50" />,
}
const CATEGORY_BG: Record<string, string> = {
  transport: 'bg-blue-500/10',
  food:      'bg-orange-500/10',
  energy:    'bg-yellow-500/10',
  shopping:  'bg-purple-500/10',
  travel:    'bg-pink-500/10',
  digital:   'bg-cyan-500/10',
  other:     'bg-white/5',
}

export default async function DashboardPage() {
  const profile = await getMyProfile()
  await ensureChallengesAssigned()

  const [activities, challenges] = await Promise.all([
    getMyActivities(5),
    getMyChallenges(),
  ])

  // Rest of the component uses profile, activities, challenges...

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const activeQuests = challenges.filter(c => !c.completed).length
  const completedQuests = challenges.filter(c => c.completed).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}!</h2>
          <p className="text-muted-foreground">Here is your carbon impact summary.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-4 py-1 text-sm bg-primary/10 text-primary border-primary/20">
            <Leaf className="h-4 w-4 mr-2" /> {getLevelName(profile?.level ?? 1)} (Level {profile?.level ?? 1})
          </Badge>
          <LogActivityModal />
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total CO₂ Saved</CardTitle>
            <TrendingDown className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.total_co2_saved_kg.toFixed(1) ?? '0.0'} kg</div>
            <p className="text-xs text-muted-foreground">Every kg counts 🌱</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Eco Points</CardTitle>
            <Leaf className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(profile?.eco_points ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{profile?.streak_days ?? 0} day streak 🔥</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Quests</CardTitle>
            <Zap className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedQuests} / {challenges.length}</div>
            <p className="text-xs text-muted-foreground">{activeQuests} pending completions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Emissions Breakdown</CardTitle>
            <CardDescription>Your carbon footprint over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardCharts />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Real-time tracked actions and their impact.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Leaf className="h-8 w-8 mx-auto mb-3 opacity-30" />
                No activities yet. Log your first one!
              </div>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex items-center gap-4">
                  <div className={`${CATEGORY_BG[act.category] ?? 'bg-white/5'} p-2 rounded-full shrink-0`}>
                    {CATEGORY_ICON[act.category] ?? <Leaf className="h-4 w-4" />}
                  </div>
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">{act.label}</p>
                    <p className="text-xs text-muted-foreground">{formatDistanceToNow(act.created_at)}</p>
                  </div>
                  <div className={`font-medium text-sm shrink-0 ${act.co2_kg < 0 ? 'text-emerald-500' : 'text-destructive'}`}>
                    {act.co2_kg < 0 ? '-' : '+'}{Math.abs(act.co2_kg)} kg
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
