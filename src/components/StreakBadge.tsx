'use client'

interface StreakBadgeProps {
  streak: number
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak === 0) return null

  const isHot = streak >= 7
  const isMilestone = streak % 10 === 0 && streak > 0

  return (
    <div
      className={`
        flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold
        border transition-all
        ${isMilestone
          ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
          : isHot
            ? 'bg-orange-500/10 border-orange-500/25 text-orange-400'
            : 'bg-white/[0.05] border-white/[0.08] text-white/50'
        }
      `}
    >
      <span className="text-[14px] leading-none">
        {isMilestone ? '🏆' : isHot ? '🔥' : '⚡'}
      </span>
      <span className="tabular-nums">{streak}</span>
      <span className="font-normal text-[11px] opacity-70">
        {streak === 1 ? 'day' : 'days'}
      </span>
    </div>
  )
}