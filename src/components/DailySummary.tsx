'use client'

interface Log {
  habitId: string
  points: number
  duration?: number | null
}

interface Habit {
  id: string
  name: string
  icon: string
  type: 'POSITIVE' | 'NEGATIVE'
}

interface DailySummaryProps {
  logs: Log[]
  habits: Habit[]
  score: number
}

export function DailySummary({ logs, habits, score }: DailySummaryProps) {
  const gained = logs.filter(l => l.points > 0).reduce((s, l) => s + l.points, 0)
  const lost = logs.filter(l => l.points < 0).reduce((s, l) => s + l.points, 0)

  const logsWithHabits = logs.map(log => {
    const habit = habits.find(h => h.id === log.habitId)
    return { ...log, habit }
  }).filter(l => l.habit)

  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.05] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <h3 className="text-[11px] uppercase tracking-[0.18em] font-bold text-white/40">
            Day Summary
          </h3>
        </div>
        <span
          className={`text-[13px] font-bold tabular-nums ${score >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {score > 0 ? '+' : ''}{score} pts
        </span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.04]">
        <div className="px-4 py-3 text-center">
          <p className="text-[11px] text-white/30 mb-0.5">Logged</p>
          <p className="text-[20px] font-bold text-white tabular-nums">{logs.length}</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-[11px] text-white/30 mb-0.5">Gained</p>
          <p className="text-[20px] font-bold text-emerald-400 tabular-nums">+{gained}</p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-[11px] text-white/30 mb-0.5">Lost</p>
          <p className="text-[20px] font-bold text-red-400 tabular-nums">{lost}</p>
        </div>
      </div>

      {/* Log list */}
      <div className="px-5 py-3 border-t border-white/[0.04] space-y-1.5">
        {logsWithHabits.map((log, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[15px] w-5 text-center">{log.habit!.icon}</span>
            <span className="flex-1 text-[13px] text-white/50">{log.habit!.name}</span>
            {log.duration && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-white/[0.05] text-white/30 font-medium">
                {log.duration >= 60 ? `${log.duration / 60}h` : `${log.duration}m`}
              </span>
            )}
            <span
              className={`text-[13px] font-semibold tabular-nums w-12 text-right ${
                log.points > 0 ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {log.points > 0 ? '+' : ''}{log.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}