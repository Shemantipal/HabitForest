'use client'

import { Cinzel } from 'next/font/google'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700', '900'] })

interface ScoreDisplayProps {
  score: number
  maxScore?: number
  rankTitle: string
  rankMsg: string
  rankColor: string
  rankGlow: string
  completedCount: number
  totalCount: number
}

export function ScoreDisplay({ 
  score, 
  maxScore = 130,
  rankTitle,
  rankMsg,
  rankColor,
  rankGlow,
  completedCount,
  totalCount
}: ScoreDisplayProps) {
  const clampedScore = Math.max(0, Math.min(score, maxScore))
  const pct = (clampedScore / maxScore) * 100

  return (
    <div className="mb-8 rounded-2xl bg-slate-900/50 border border-slate-700/50 p-6 backdrop-blur-sm relative overflow-hidden group">
      
      {/* Animated background glow on hover - perfectly synced with rank color */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-3xl" 
        style={{ background: `radial-gradient(circle at 50% -20%, ${rankGlow}, transparent 70%)` }}
      />
      
      <div className="flex justify-between items-end mb-5 relative z-10">
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Daily Vitality</p>
          <div className="flex items-baseline gap-2">
            <h2 
              className={`${cinzel.className} text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-colors duration-500`}
              style={{ textShadow: `0 0 20px ${rankGlow}` }}
            >
              {score > 0 ? '+' : ''}{score}
            </h2>
            <span className="text-[15px] font-medium text-slate-500 font-sans">/ {maxScore} XP</span>
          </div>
        </div>
        <div className="text-right">
          <div 
            className="inline-block px-3 py-1.5 rounded border text-[11px] font-bold tracking-widest uppercase mb-1.5 shadow-lg transition-colors duration-500"
            style={{ 
              backgroundColor: `${rankColor}15`, 
              color: rankColor, 
              borderColor: `${rankColor}40`, 
              boxShadow: `0 0 15px ${rankGlow}, inset 0 0 10px ${rankGlow}` 
            }}
          >
            {rankTitle}
          </div>
          <p className="text-[11px] text-slate-400">{rankMsg}</p>
        </div>
      </div>

      {/* Gamified Progress Bar */}
      <div className="space-y-2 relative z-10">
        <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-[2px]">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative"
            style={{
              width: `${pct}%`,
              // FIX: Now seamlessly blends from a dark transparent version of the rank color!
              background: `linear-gradient(90deg, ${rankColor}20, ${rankColor})`,
              boxShadow: `0 0 10px ${rankColor}`
            }}
          >
            {/* Overlay stripes for a "gaming bar" look */}
            <div 
              className="absolute inset-0 opacity-20" 
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}
            />
            {/* Shimmer effect inside the bar */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
        
        {/* Tick marks */}
        <div className="flex justify-between px-1">
          {[0, 30, 60, 90, 110, 130].map((tick) => (
            <span key={tick} className="text-[10px] text-slate-500 font-medium tabular-nums">{tick}</span>
          ))}
        </div>
      </div>
      
      {/* Quests Summary Block */}
      <div className="mt-5 flex gap-4 relative z-10">
         <div className="flex-1 bg-slate-950/60 rounded-lg p-3.5 border border-white/5 flex items-center justify-between shadow-inner">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Quests Completed</span>
            <span className="font-bold text-lg transition-colors duration-500" style={{ color: rankColor }}>
              {completedCount} <span className="text-sm font-medium text-slate-500">/ {totalCount}</span>
            </span>
         </div>
      </div>

      {/* Tailwind Animation for the Shimmer */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  )
}