'use client'

import { Cinzel } from 'next/font/google'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] })

interface Props {
  score: number
  streak: number
}

export function GuidanceReport({ score, streak }: Props) {
  let advice = ''
  let status = ''
  let color = ''

  if (score < 30) {
    status = 'Low Vitality'
    advice = "The mist is closing in. Prioritize a quick 'Mindfulness' session or a healthy meal to restore your mana before attempting heavy tasks."
    color = '#f59e0b' 
  } else if (score < 80) {
    status = 'Steady Progress'
    advice = "Your grove is stabilizing. A 'Workout' now would grant you a massive strength multiplier. Keep the momentum going!"
    color = '#3b82f6' 
  } else {
    status = 'Peak Performance'
    advice = "Your magic is overflowing today! Be careful not to trigger 'Zone Hazards'. Guard your energy and end the day strong."
    color = '#10b981' 
  }

  return (
    <div className="mb-8 p-[1px] rounded-xl bg-gradient-to-r from-slate-800 to-slate-800/20">
      <div className="bg-[#09090b] rounded-xl p-5 flex gap-4 items-start relative overflow-hidden">
        
       
        <div 
          className="absolute top-0 left-0 w-32 h-32 opacity-10 blur-2xl pointer-events-none"
          style={{ background: color }}
        />

     
        <div className="w-12 h-12 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
          🧙‍♂️
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`${cinzel.className} text-slate-200 font-bold tracking-wide`}>
              Guild Master's Report
            </h4>
            <span 
              className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border"
              style={{ color: color, borderColor: `${color}40`, backgroundColor: `${color}10` }}
            >
              {status}
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            "{advice}"
          </p>
          {streak > 3 && (
            <p className="text-xs text-emerald-500 mt-2 font-medium">
              ✨ Your {streak}-day combo is inspiring the local villagers!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}