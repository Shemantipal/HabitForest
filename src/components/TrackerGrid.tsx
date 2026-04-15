'use client'

import { useState } from 'react'

const TRACKERS = [
  {
    id: 'gym', label: 'Gym Log', icon: '💪', color: '#3b82f6', badge: 'WORKOUT',
    opts: ['Chest & Triceps','Back & Biceps','Legs','Shoulders','Full Body','Cardio','HIIT','Rest Day'],
    modalTitle: 'Log Workout', modalSub: 'What did you train today?',
  },
  {
    id: 'food', label: 'Food Log', icon: '🍽️', color: '#10b981', badge: 'NUTRITION',
    opts: ['Clean & Balanced','High Protein','Vegetarian','Vegan','Cheat Meal','Skipped Meal','Intermittent Fast','Ate Out'],
    modalTitle: 'Log Meal', modalSub: 'How healthy was your eating?',
  },
  {
    id: 'med', label: 'Meditation', icon: '🧘', color: '#a855f7', badge: 'MINDFULNESS',
    opts: ['5 min','10 min','15 min','20 min','30 min','45 min','60 min'],
    modalTitle: 'Log Meditation', modalSub: 'How long did you meditate?',
  },
  {
    id: 'temper', label: 'Temper Log', icon: '😤', color: '#ef4444', badge: 'EMOTIONAL',
    opts: ['Traffic / Commute','Work Stress','Argument','Social Media','Overwhelmed','Family','Fatigue','Minor Frustration'],
    modalTitle: 'Log Incident', modalSub: 'What triggered it?',
  },
]

export function TrackerGrid({ userId }: { userId: string }) {
  const [state, setState] = useState<Record<string, any>>({
    gym: null, food: 0, med: 0, temper: 0,
  })
  const [modal, setModal] = useState<{ tracker: typeof TRACKERS[0] | null; selected: string | null }>({
    tracker: null, selected: null,
  })

  function openModal(t: typeof TRACKERS[0]) {
    setModal({ tracker: t, selected: null })
  }

  function confirmLog() {
    if (!modal.tracker || !modal.selected) return
    const { id } = modal.tracker
    const val = modal.selected
    setState(prev => {
      if (id === 'gym') return { ...prev, gym: val }
      if (id === 'food') return { ...prev, food: (prev.food || 0) + 1 }
      if (id === 'med') return { ...prev, med: (prev.med || 0) + parseInt(val) }
      if (id === 'temper') return { ...prev, temper: (prev.temper || 0) + 1 }
      return prev
    })
    setModal({ tracker: null, selected: null })
    // TODO: persist to DB via server action
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        {TRACKERS.map(t => {
          const val = state[t.id]
          const hasVal = t.id === 'gym' ? !!val : val > 0
          return (
            <div
              key={t.id}
              onClick={() => openModal(t)}
              className="rounded-2xl border bg-[#0f0f0f] p-4 cursor-pointer transition-all hover:-translate-y-px"
              style={{ borderColor: hasVal ? `${t.color}40` : 'rgba(255,255,255,0.07)' }}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-[18px]"
                  style={{ background: `${t.color}12`, border: `1px solid ${t.color}20` }}>
                  {t.icon}
                </div>
                <span className="text-[10px] font-bold tracking-wide px-2 py-1 rounded-md"
                  style={{ border: `1px solid ${t.color}30`, color: t.color }}>
                  {t.badge}
                </span>
              </div>
              <div className="text-[12px] font-bold mb-1">{t.label}</div>
              <div className="text-[22px] font-extrabold tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
                {t.id === 'gym' ? (val ? '1' : '—') : val}
                <span className="text-[12px] font-normal text-white/30 ml-1" style={{ fontFamily: 'inherit' }}>
                  {t.id === 'gym' ? 'logged' : t.id === 'food' ? 'meals' : t.id === 'med' ? 'min' : 'incidents'}
                </span>
              </div>
              <div className="h-1 rounded-full mt-2.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{
                    background: t.color,
                    width: t.id === 'gym' ? (val ? '100%' : '0%')
                      : t.id === 'food' ? `${Math.min(val / 3 * 100, 100)}%`
                      : t.id === 'med' ? `${Math.min(val / 30 * 100, 100)}%`
                      : `${Math.min(val / 3 * 100, 100)}%`,
                  }} />
              </div>
              <button
                onClick={e => { e.stopPropagation(); openModal(t) }}
                className="mt-3 w-full py-2 rounded-lg text-[11px] font-semibold tracking-wide transition-all"
                style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', background: 'transparent' }}
              >
                + Log {t.id === 'food' ? 'meal' : t.id === 'temper' ? 'incident' : t.id === 'gym' ? 'workout' : 'session'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Modal */}
      {modal.tracker && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setModal({ tracker: null, selected: null })}
        >
          <div
            className="bg-[#111] border border-white/10 rounded-2xl p-6 w-[340px] max-w-[90vw]"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-[18px] font-extrabold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
              {modal.tracker.modalTitle}
            </div>
            <div className="text-[12px] text-white/30 mb-5">{modal.tracker.modalSub}</div>
            <div className="flex flex-wrap gap-2 mb-5">
              {modal.tracker.opts.map(o => (
                <button
                  key={o}
                  onClick={() => setModal(m => ({ ...m, selected: o }))}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
                  style={{
                    border: '1px solid',
                    borderColor: modal.selected === o ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
                    background: modal.selected === o ? 'rgba(255,255,255,0.1)' : 'transparent',
                    color: modal.selected === o ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setModal({ tracker: null, selected: null })}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-white/40"
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'transparent' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmLog}
                disabled={!modal.selected}
                className="flex-[2] py-2.5 rounded-xl text-[13px] font-bold text-black disabled:opacity-40"
                style={{ background: modal.tracker.color }}
              >
                Log it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}