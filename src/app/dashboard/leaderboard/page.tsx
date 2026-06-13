import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LuTrophy as Trophy, LuGlobe as Globe, LuLeaf as Leaf } from 'react-icons/lu'
import { getLeaderboard, getMyProfile } from '@/lib/data'
import { getLevelName } from '@/lib/supabase/types'

export default async function LeaderboardPage() {
  const [leaderboard, myProfile] = await Promise.all([getLeaderboard(), getMyProfile()])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Leaderboards</h2>
        <p className="text-muted-foreground">See how you stack up against the community.</p>
      </div>

      <Tabs defaultValue="global" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-1">
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> Global
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" /> Global Top 20
              </CardTitle>
              <CardDescription>
                The most sustainable individuals worldwide, ranked by Eco Points.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Leaf className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p>No users yet — be the first to log activities!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((entry, idx) => {
                    const rank = idx + 1
                    const isMe = myProfile?.id === entry.id
                    const initials = entry.full_name
                      ? entry.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : '??'

                    return (
                      <div
                        key={entry.id}
                        className={`flex items-center gap-4 p-3 rounded-xl border transition-colors ${
                          isMe
                            ? 'bg-primary/10 border-primary/30'
                            : 'bg-card hover:bg-muted/40 border-border'
                        }`}
                      >
                        {/* Rank */}
                        <div className="flex items-center justify-center w-9 font-bold text-muted-foreground shrink-0">
                          {rank === 1 ? (
                            <span className="text-xl">🥇</span>
                          ) : rank === 2 ? (
                            <span className="text-xl">🥈</span>
                          ) : rank === 3 ? (
                            <span className="text-xl">🥉</span>
                          ) : (
                            <span className="text-sm">#{rank}</span>
                          )}
                        </div>

                        {/* Avatar */}
                        <Avatar className="h-10 w-10 border shrink-0">
                          <AvatarImage
                            src={entry.avatar_url ?? undefined}
                            alt={entry.full_name ?? 'User'}
                          />
                          <AvatarFallback className="bg-emerald-700 text-white text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        {/* Info */}
                        <div className="flex-1 space-y-0.5 min-w-0">
                          <p className="text-sm font-medium leading-none flex items-center gap-2 flex-wrap">
                            <span className="truncate">{entry.full_name ?? 'Anonymous'}</span>
                            {isMe && (
                              <Badge variant="default" className="text-[10px] h-4 px-1 shrink-0">
                                YOU
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getLevelName(entry.level)} · {entry.total_co2_saved_kg.toFixed(1)} kg
                            saved
                          </p>
                        </div>

                        {/* Points */}
                        <div className="font-bold text-primary shrink-0 text-sm">
                          {entry.eco_points.toLocaleString()} pts
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
