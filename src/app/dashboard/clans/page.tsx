import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LuUsers as Users, LuTrophy as Trophy, LuLeaf as Leaf, LuCrown as Crown, LuTarget as Target } from "react-icons/lu"
import { getMyClan, getClanLeaderboard, getClansToDiscover, getMyProfile } from "@/lib/data"
import { ClanActions } from "./clan-actions"
import { CreateClanModal } from "@/components/create-clan-modal"

export default async function ClansPage() {
  const [myClan, leaderboard, discoverClans, profile] = await Promise.all([
    getMyClan(),
    getClanLeaderboard(),
    getClansToDiscover(),
    getMyProfile(),
  ])

  // Filter out user's own clan from discover list
  const clansToJoin = discoverClans.filter(c => c.clan_id !== myClan?.id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clans &amp; Community</h2>
          <p className="text-muted-foreground">Team up with others to multiply your impact.</p>
        </div>
        {!myClan && <CreateClanModal />}
      </div>

      {/* My Clan Card */}
      {myClan ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {myClan.name}
                    <Badge variant="outline" className="text-xs px-2 py-0.5">{myClan.tag}</Badge>
                  </CardTitle>
                  <CardDescription>{myClan.description || 'No description'}</CardDescription>
                </div>
              </div>
              <ClanActions clanId={myClan.id} isLeader={myClan.created_by === profile?.id} />
            </div>
          </CardHeader>
          <CardContent>
            {/* Clan stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 rounded-xl bg-background/50 border border-border">
                <div className="text-2xl font-bold text-primary">{myClan.members.length}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Members</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-background/50 border border-border">
                <div className="text-2xl font-bold text-primary">{myClan.total_points.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Combined Pts</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-background/50 border border-border">
                <div className="text-2xl font-bold text-primary">{myClan.max_members}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Max Capacity</div>
              </div>
            </div>

            {/* Members list */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Members</h4>
              {myClan.members.map((member) => {
                const initials = member.profile?.full_name
                  ? member.profile.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                  : '??'
                return (
                  <div key={member.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/30 transition-colors">
                    <Avatar className="h-9 w-9 border shrink-0">
                      <AvatarImage src={member.profile?.avatar_url ?? undefined} alt={member.profile?.full_name ?? 'User'} />
                      <AvatarFallback className="bg-emerald-700 text-white text-xs font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none truncate flex items-center gap-2">
                        {member.profile?.full_name ?? 'Anonymous'}
                        {member.role === 'leader' && (
                          <Crown className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        )}
                        {member.user_id === profile?.id && (
                          <Badge variant="default" className="text-[10px] h-4 px-1 shrink-0">YOU</Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Level {member.profile?.level ?? 1} · {member.profile?.eco_points?.toLocaleString() ?? 0} pts
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed border-2 border-primary/20 bg-primary/5">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">You&apos;re not in a clan yet</h3>
              <p className="text-muted-foreground max-w-md text-sm leading-relaxed">
                Create your own eco-squad or join an existing one below to combine your impact with others.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Clan Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" /> Clan Leaderboard
            </CardTitle>
            <CardDescription>Top clans ranked by combined Eco Points.</CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Leaf className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No clans yet. Be the first to create one!
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((clan, idx) => {
                  const rank = idx + 1
                  const isMyRank = myClan?.id === clan.clan_id
                  return (
                    <div
                      key={clan.clan_id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        isMyRank ? 'bg-primary/10 border-primary/30' : 'bg-card hover:bg-muted/40 border-border'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 font-bold text-muted-foreground shrink-0">
                        {rank === 1 ? <span className="text-lg">🥇</span>
                        : rank === 2 ? <span className="text-lg">🥈</span>
                        : rank === 3 ? <span className="text-lg">🥉</span>
                        : <span className="text-sm">#{rank}</span>}
                      </div>
                      <div className="h-9 w-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-sm font-medium leading-none truncate flex items-center gap-2">
                          {clan.name}
                          {isMyRank && <Badge variant="default" className="text-[10px] h-4 px-1 shrink-0">YOUR CLAN</Badge>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {clan.member_count} members · {clan.tag}
                        </p>
                      </div>
                      <div className="font-bold text-primary shrink-0 text-sm">
                        {clan.total_points.toLocaleString()} pts
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Discover Clans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" /> Discover Clans
            </CardTitle>
            <CardDescription>Find a clan that matches your eco-goals.</CardDescription>
          </CardHeader>
          <CardContent>
            {clansToJoin.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No other clans available yet.
              </div>
            ) : (
              <div className="space-y-3">
                {clansToJoin.map((clan) => (
                  <div key={clan.clan_id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors">
                    <div className="h-9 w-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <Leaf className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <p className="text-sm font-medium leading-none truncate">{clan.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {clan.member_count} members · {clan.tag} · {clan.total_points.toLocaleString()} pts
                      </p>
                    </div>
                    {!myClan && (
                      <ClanActions clanId={clan.clan_id} joinMode />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
