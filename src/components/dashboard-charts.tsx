'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { createClient } from '@/lib/supabase/client'

type ChartPoint = { name: string; saved: number; emitted: number }

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function DashboardCharts() {
  const [data, setData] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      // Fetch last 7 days of activities
      const since = new Date()
      since.setDate(since.getDate() - 6)
      since.setHours(0, 0, 0, 0)

      const { data: activities } = await supabase
        .from('activities')
        .select('co2_kg, created_at')
        .eq('user_id', user.id)
        .gte('created_at', since.toISOString())

      // Build 7-day buckets
      const buckets: Record<string, { saved: number; emitted: number }> = {}
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        buckets[d.toDateString()] = { saved: 0, emitted: 0 }
      }

      for (const act of activities ?? []) {
        const key = new Date(act.created_at).toDateString()
        if (buckets[key]) {
          if (act.co2_kg < 0) buckets[key].saved += Math.abs(act.co2_kg)
          else buckets[key].emitted += act.co2_kg
        }
      }

      const chartData: ChartPoint[] = Object.entries(buckets).map(([dateStr, vals]) => ({
        name: DAYS[new Date(dateStr).getDay()],
        saved: Math.round(vals.saved * 10) / 10,
        emitted: Math.round(vals.emitted * 10) / 10,
      }))

      setData(chartData)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const isEmpty = data.every((d) => d.saved === 0 && d.emitted === 0)

  if (isEmpty) {
    return (
      <div className="h-[350px] flex flex-col items-center justify-center text-muted-foreground gap-3">
        <div className="text-4xl">📊</div>
        <p className="text-sm">No activity data yet for this week.</p>
        <p className="text-xs">Log activities to see your chart fill up!</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} barGap={4}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${v}kg`}
        />
        <Tooltip
          cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 6px -1px rgb(0 0 0/0.1)',
          }}
          formatter={(value, name) => [
            `${Number(value).toFixed(1)} kg`,
            name === 'saved' ? 'CO₂ Saved' : 'CO₂ Emitted',
          ]}
        />
        <Bar dataKey="emitted" fill="#f87171" radius={[4, 4, 0, 0]} name="emitted" />
        <Bar dataKey="saved" fill="#34d399" radius={[4, 4, 0, 0]} name="saved" />
      </BarChart>
    </ResponsiveContainer>
  )
}
