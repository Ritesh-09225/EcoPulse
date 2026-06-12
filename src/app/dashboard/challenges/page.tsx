import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { LuShield as Shield, LuZap as Zap, LuTarget as Target, LuCheck as CheckCircle2, LuAward as Award, LuTreePine as TreePine, LuFlame as Flame, LuLeaf as Leaf, LuStar as Star } from "react-icons/lu"
import { getMyChallenges, getMyAchievements, getMyProfile, ensureChallengesAssigned } from "@/lib/data"
import { getLevelName, getPointsForNextLevel, LEVEL_NAMES } from "@/lib/supabase/types"

const ICON_MAP: Record<string, React.ReactNode> = {
  shield:    <Shield className="h-6 w-6" />,
  'tree-pine': <TreePine className="h-6 w-6" />,
  zap:       <Zap className="h-6 w-6" />,
  award:     <Award className="h-6 w-6" />,
  leaf:      <Leaf className="h-6 w-6" />,
  flame:     <Flame className="h-6 w-6" />,
  star:      <Star className="h-6 w-6" />,
}
const COLOR_MAP: Record<string, string> = {
  blue:    'bg-blue-100 dark:bg-blue-900/40 text-blue-500',
  green:   'bg-green-100 dark:bg-green-900/40 text-green-500',
  purple:  'bg-purple-100 dark:bg-purple-900/40 text-purple-500',
  amber:   'bg-amber-100 dark:bg-amber-900/40 text-amber-500',
  emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500',
  orange:  'bg-orange-100 dark:bg-orange-900/40 text-orange-500',
  yellow:  'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-500',
}

export default async function ChallengesPage() {
  const profile = await getMyProfile()
  await ensureChallengesAssigned()
  
  const [userChallenges, achievements] = await Promise.all([
    getMyChallenges(),
    getMyAchievements(),
  ])

  const points = profile?.eco_points ?? 0
  const level = profile?.level ?? 1
  const { current, required, percent } = getPointsForNextLevel(points, level)
  const nextLevelName = LEVEL_NAMES[level + 1] ?? `Level ${level + 1}`

  const active = userChallenges.filter(c => !c.completed)
  const completed = userChallenges.filter(c => c.completed)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gamification & Quests</h2>
        <p className="text-muted-foreground">Complete challenges to earn points, unlock levels, and save the planet.</p>
      </div>

      {/* Level & Points Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border-4 border-primary">
              <TreePine className="h-10 w-10 text-primary" />
            </div>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h3 className="text-2xl font-bold">{getLevelName(level)}</h3>
                <Badge variant="default" className="bg-emerald-500">Level {level}</Badge>
              </div>
              <p className="text-muted-foreground">{current.toLocaleString()} / {required.toLocaleString()} Eco Points</p>
              <Progress value={percent} className="h-3 w-full max-w-md mx-auto md:mx-0" />
              <p className="text-xs text-muted-foreground">{(required - current).toLocaleString()} points to next level: &apos;{nextLevelName}&apos;</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 bg-background p-2 rounded-lg border shadow-sm">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-sm">{profile?.streak_days ?? 0} Day Streak</span>
              </div>
              <div className="flex items-center gap-2 bg-background p-2 rounded-lg border shadow-sm">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold text-sm">{completed.length} Quests Done</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Quests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-500" /> Active Quests
            </CardTitle>
            <CardDescription>Complete these to earn Eco Points.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {active.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-500 opacity-60" />
                All quests completed! Check back tomorrow.
              </div>
            ) : (
              active.map((uc) => {
                const progressPct = Math.min(100, Math.round((uc.progress / uc.challenge.target_value) * 100))
                return (
                  <div key={uc.id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium">{uc.challenge.title} ({uc.challenge.type})</span>
                      <span className="text-primary font-bold">+{uc.challenge.points_reward} pts</span>
                    </div>
                    <Progress value={progressPct} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {uc.progress} / {uc.challenge.target_value} {uc.challenge.unit}
                    </p>
                  </div>
                )
              })
            )}

            {completed.length > 0 && (
              <div className="pt-2 border-t border-border space-y-3">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Completed</p>
                {completed.slice(0, 3).map((uc) => (
                  <div key={uc.id} className="flex justify-between items-center text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground line-through">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 no-underline" style={{textDecoration:'none'}} />
                      {uc.challenge.title}
                    </span>
                    <span className="text-emerald-500 text-xs font-medium">+{uc.challenge.points_reward} pts</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" /> Achievements
            </CardTitle>
            <CardDescription>Badges earned along your journey.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {achievements.map(({ achievement, earned }) => (
                <div
                  key={achievement.id}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all ${
                    earned
                      ? 'bg-muted/50 border-border'
                      : 'bg-muted/20 border-dashed border-border opacity-50 grayscale'
                  }`}
                >
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${COLOR_MAP[achievement.color] ?? 'bg-muted text-muted-foreground'}`}>
                    {ICON_MAP[achievement.icon] ?? <Award className="h-6 w-6" />}
                  </div>
                  <span className="text-xs font-semibold leading-tight">{achievement.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
