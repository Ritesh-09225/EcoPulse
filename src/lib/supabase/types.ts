export type Category = 'transport' | 'food' | 'energy' | 'shopping' | 'travel' | 'digital' | 'other'
export type ChallengeType = 'daily' | 'weekly' | 'seasonal'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  eco_points: number
  level: number
  streak_days: number
  total_co2_saved_kg: number
  created_at: string
}

export interface Activity {
  id: string
  user_id: string
  label: string
  category: Category
  co2_kg: number
  created_at: string
}

export interface Challenge {
  id: string
  title: string
  description: string | null
  type: ChallengeType
  points_reward: number
  target_value: number
  unit: string
  created_at: string
}

export interface UserChallenge {
  id: string
  user_id: string
  challenge_id: string
  progress: number
  completed: boolean
  completed_at: string | null
  assigned_at: string
  challenge: Challenge
}

export interface Achievement {
  id: string
  name: string
  description: string | null
  icon: string
  color: string
  created_at: string
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  earned_at: string
  achievement: Achievement
}

export interface LeaderboardEntry {
  id: string
  full_name: string | null
  avatar_url: string | null
  eco_points: number
  level: number
  total_co2_saved_kg: number
}

export type ClanRole = 'leader' | 'member'

export interface Clan {
  id: string
  name: string
  description: string | null
  tag: string
  created_by: string
  max_members: number
  created_at: string
}

export interface ClanMember {
  id: string
  clan_id: string
  user_id: string
  role: ClanRole
  joined_at: string
  profile: Profile
}

export interface ClanLeaderboardEntry {
  clan_id: string
  name: string
  description: string | null
  tag: string
  created_by: string
  member_count: number
  total_points: number
  total_co2_saved_kg: number
}

export interface ClanWithMembers extends Clan {
  members: ClanMember[]
  total_points: number
}

// Level name mapping
export const LEVEL_NAMES: Record<number, string> = {
  1: 'Seedling',
  2: 'Sapling',
  3: 'Tree',
  4: 'Forest Guardian',
  5: 'Planet Protector',
  6: 'Earth Champion',
  7: 'Climate Hero',
  8: 'Eco Legend',
}

export function getLevelName(level: number): string {
  return LEVEL_NAMES[level] ?? `Level ${level}`
}

export function getPointsForNextLevel(currentPoints: number, level: number): { current: number; required: number; percent: number } {
  const required = level * 1000
  const base = (level - 1) * 1000
  const current = currentPoints - base
  return {
    current,
    required: required - base,
    percent: Math.min(100, Math.round((current / (required - base)) * 100)),
  }
}
