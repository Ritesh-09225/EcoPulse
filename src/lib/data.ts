'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  Category,
  Profile,
  Activity,
  UserChallenge,
  Achievement,
  LeaderboardEntry,
  ClanMember,
  ClanWithMembers,
  ClanLeaderboardEntry,
} from '@/lib/supabase/types'

// ─────────────────────────────────────────────────────────────
// READ: Current authenticated user's profile
// ─────────────────────────────────────────────────────────────
export async function getMyProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  let { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile) {
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'EcoPulse User'
    const avatar = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

    const { data: newProfile } = await supabase
      .from('profiles')
      .insert({ id: user.id, full_name: fullName, avatar_url: avatar })
      .select()
      .single()

    profile = newProfile
  }

  return profile as Profile
}

// ─────────────────────────────────────────────────────────────
// READ: Activities for the current user
// ─────────────────────────────────────────────────────────────
export async function getMyActivities(limit = 50): Promise<Activity[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data ?? []
}

// ─────────────────────────────────────────────────────────────
// READ: User challenges with challenge details
// ─────────────────────────────────────────────────────────────
export async function getMyChallenges(): Promise<UserChallenge[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('user_challenges')
    .select('*, challenge:challenges(*)')
    .eq('user_id', user.id)
    .order('assigned_at', { ascending: false })

  return (data ?? []) as UserChallenge[]
}

// ─────────────────────────────────────────────────────────────
// READ: All achievements + which ones the user has earned
// ─────────────────────────────────────────────────────────────
export async function getMyAchievements(): Promise<
  { achievement: Achievement; earned: boolean; earned_at?: string }[]
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const [{ data: allAchievements }, { data: earned }] = await Promise.all([
    supabase.from('achievements').select('*').order('created_at'),
    supabase
      .from('user_achievements')
      .select('*, achievement:achievements(*)')
      .eq('user_id', user.id),
  ])

  const earnedIds = new Set((earned ?? []).map((e) => e.achievement_id))
  const earnedMap = new Map((earned ?? []).map((e) => [e.achievement_id, e.earned_at]))

  return (allAchievements ?? []).map((a) => ({
    achievement: a,
    earned: earnedIds.has(a.id),
    earned_at: earnedMap.get(a.id),
  }))
}

// ─────────────────────────────────────────────────────────────
// READ: Leaderboard (top 20 by eco_points)
// ─────────────────────────────────────────────────────────────
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, eco_points, level, total_co2_saved_kg')
    .order('eco_points', { ascending: false })
    .limit(20)

  return (data ?? []) as LeaderboardEntry[]
}

// ─────────────────────────────────────────────────────────────
// WRITE: Log a new activity (Server Action)
// ─────────────────────────────────────────────────────────────
export async function logActivity(formData: { label: string; category: Category; co2_kg: number }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const co2 = Number(formData.co2_kg)

  // Insert activity
  const { error: actError } = await supabase.from('activities').insert({
    user_id: user.id,
    label: formData.label,
    category: formData.category,
    co2_kg: co2,
  })
  if (actError) throw actError

  // Fetch current profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('eco_points, level, total_co2_saved_kg')
    .eq('id', user.id)
    .single()

  if (profile) {
    // Award eco points: savings earn points, emissions cost nothing (just logged)
    const pointsEarned = co2 < 0 ? Math.round(Math.abs(co2) * 10) : 5
    const newPoints = profile.eco_points + pointsEarned
    const newLevel = Math.floor(newPoints / 1000) + 1
    const newCo2Saved = Number(profile.total_co2_saved_kg) + (co2 < 0 ? Math.abs(co2) : 0)

    await supabase
      .from('profiles')
      .update({
        eco_points: newPoints,
        level: newLevel,
        total_co2_saved_kg: newCo2Saved,
      })
      .eq('id', user.id)
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/activities')
}

// ─────────────────────────────────────────────────────────────
// WRITE: Update challenge progress (Server Action)
// ─────────────────────────────────────────────────────────────
export async function updateChallengeProgress(
  userChallengeId: string,
  newProgress: number,
  targetValue: number,
  pointsReward: number,
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const completed = newProgress >= targetValue

  await supabase
    .from('user_challenges')
    .update({
      progress: newProgress,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', userChallengeId)
    .eq('user_id', user.id)

  if (completed) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('eco_points')
      .eq('id', user.id)
      .single()

    if (profile) {
      await supabase
        .from('profiles')
        .update({ eco_points: profile.eco_points + pointsReward })
        .eq('id', user.id)
    }
  }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/challenges')
}

// ─────────────────────────────────────────────────────────────
// WRITE: Ensure user has challenges assigned (call on first visit)
// ─────────────────────────────────────────────────────────────
export async function ensureChallengesAssigned() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return

  await supabase.rpc('assign_challenges_to_user', { p_user_id: user.id })
}

// ─────────────────────────────────────────────────────────────
// READ: Current user's clan with members
// ─────────────────────────────────────────────────────────────
export async function getMyClan(): Promise<ClanWithMembers | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  // Find user's clan membership
  const { data: membership } = await supabase
    .from('clan_members')
    .select('clan_id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) return null

  // Fetch the clan
  const { data: clan } = await supabase
    .from('clans')
    .select('*')
    .eq('id', membership.clan_id)
    .single()

  if (!clan) return null

  // Fetch all members with profiles
  const { data: members } = await supabase
    .from('clan_members')
    .select('*, profile:profiles(*)')
    .eq('clan_id', clan.id)
    .order('joined_at', { ascending: true })

  const membersList = (members ?? []) as ClanMember[]
  const totalPoints = membersList.reduce((sum, m) => sum + (m.profile?.eco_points ?? 0), 0)

  return {
    ...clan,
    members: membersList,
    total_points: totalPoints,
  } as ClanWithMembers
}

// ─────────────────────────────────────────────────────────────
// READ: Clans to discover (not joined by user)
// ─────────────────────────────────────────────────────────────
export async function getClansToDiscover(limit = 20): Promise<ClanLeaderboardEntry[]> {
  const supabase = await createClient()

  const { data } = await supabase.from('clan_leaderboard').select('*').limit(limit)

  return (data ?? []) as ClanLeaderboardEntry[]
}

// ─────────────────────────────────────────────────────────────
// READ: Clan leaderboard (top 20)
// ─────────────────────────────────────────────────────────────
export async function getClanLeaderboard(): Promise<ClanLeaderboardEntry[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('clan_leaderboard')
    .select('*')
    .order('total_points', { ascending: false })
    .limit(20)

  return (data ?? []) as ClanLeaderboardEntry[]
}

// ─────────────────────────────────────────────────────────────
// WRITE: Create a new clan (Server Action)
// ─────────────────────────────────────────────────────────────
export async function createClan(formData: { name: string; description: string; tag: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check user isn't already in a clan
  const { data: existing } = await supabase
    .from('clan_members')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) throw new Error('You are already in a clan. Leave your current clan first.')

  // Create the clan
  const { data: clan, error: clanError } = await supabase
    .from('clans')
    .insert({
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      tag: formData.tag.trim() || 'General',
      created_by: user.id,
    })
    .select()
    .single()

  if (clanError) throw clanError

  // Add creator as leader
  const { error: memberError } = await supabase.from('clan_members').insert({
    clan_id: clan.id,
    user_id: user.id,
    role: 'leader',
  })

  if (memberError) {
    // Rollback clan creation
    await supabase.from('clans').delete().eq('id', clan.id)
    throw memberError
  }

  revalidatePath('/dashboard/clans')
}

// ─────────────────────────────────────────────────────────────
// WRITE: Join a clan (Server Action)
// ─────────────────────────────────────────────────────────────
export async function joinClan(clanId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Check user isn't already in a clan
  const { data: existing } = await supabase
    .from('clan_members')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) throw new Error('You are already in a clan.')

  // Check clan exists and has room
  const { data: clan } = await supabase
    .from('clans')
    .select('id, max_members')
    .eq('id', clanId)
    .single()

  if (!clan) throw new Error('Clan not found.')

  const { count } = await supabase
    .from('clan_members')
    .select('id', { count: 'exact', head: true })
    .eq('clan_id', clanId)

  if ((count ?? 0) >= clan.max_members) throw new Error('This clan is full.')

  const { error } = await supabase.from('clan_members').insert({
    clan_id: clanId,
    user_id: user.id,
    role: 'member',
  })

  if (error) throw error

  revalidatePath('/dashboard/clans')
}

// ─────────────────────────────────────────────────────────────
// WRITE: Leave a clan (Server Action)
// ─────────────────────────────────────────────────────────────
export async function leaveClan() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Find current membership
  const { data: membership } = await supabase
    .from('clan_members')
    .select('id, clan_id, role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!membership) throw new Error('You are not in a clan.')

  if (membership.role === 'leader') {
    // Check if there are other members
    const { count } = await supabase
      .from('clan_members')
      .select('id', { count: 'exact', head: true })
      .eq('clan_id', membership.clan_id)

    if ((count ?? 0) <= 1) {
      // Only member — delete the entire clan (cascade deletes membership)
      await supabase.from('clans').delete().eq('id', membership.clan_id)
    } else {
      // Transfer leadership to the next member and leave
      const { data: nextMember } = await supabase
        .from('clan_members')
        .select('id, user_id')
        .eq('clan_id', membership.clan_id)
        .neq('user_id', user.id)
        .order('joined_at', { ascending: true })
        .limit(1)
        .single()

      if (nextMember) {
        // Update clan created_by and promote next member
        await supabase
          .from('clans')
          .update({ created_by: nextMember.user_id })
          .eq('id', membership.clan_id)
        await supabase.from('clan_members').update({ role: 'leader' }).eq('id', nextMember.id)
      }

      // Remove self
      await supabase.from('clan_members').delete().eq('id', membership.id)
    }
  } else {
    // Regular member — just leave
    await supabase.from('clan_members').delete().eq('id', membership.id)
  }

  revalidatePath('/dashboard/clans')
}
