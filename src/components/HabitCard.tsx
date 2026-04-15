'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Habit {
  id: string
  name: string
  icon: string
  points: number
  type: 'POSITIVE' | 'NEGATIVE'
  hasTimer?: boolean | null
}

interface Log {
  id: string
  duration?: number | null
}

interface HabitCardProps {
  habit: Habit
  userId: string
  logged: Log | null
  flavor?: string   // garden flavor text, e.g. "your oak grows taller"
}

const DURATION_OPTIONS = [
  { label: '15m', value: 15 },
  { label: '30m', value: 30 },
  { label: '1h',  value: 60 },
  { label: '2h+', value: 120 },
]

interface FloatItem { id: number; text: string }

export function HabitCard({ habit, userId, logged, flavor }: HabitCardProps) {
  const router        = useRouter()
  const [loading, setLoading]   = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [floats, setFloats]     = useState<FloatItem[]>([])
  const floatCounter            = useRef(0)

  const isPositive = habit.type === 'POSITIVE'
  const isDone     = !!logged

  // Garden accent colors
  const accentColor = isPositive ? '#7ab648' : '#c8503c'
  const doneBg      = isPositive ? 'rgba(74,124,63,0.08)'   : 'rgba(139,58,42,0.08)'
  const doneBorder  = isPositive ? 'rgba(122,182,72,0.15)'  : 'rgba(200,80,60,0.15)'
  const iconBg      = isPositive ? 'rgba(74,124,63,0.2)'    : 'rgba(139,58,42,0.2)'
  const ptColor     = isPositive ? 'rgba(122,182,72,0.65)'  : 'rgba(200,80,60,0.65)'

  function spawnFloat() {
    const id   = floatCounter.current++
    const text = `${isPositive ? '+' : ''}${habit.points}`
    setFloats(prev => [...prev, { id, text }])
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 800)
  }

  async function logHabit(duration?: number) {
    setLoading(true)
    setExpanded(false)
    const res = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ habitId: habit.id, userId, duration: duration ?? null, points: habit.points }),
    })
    if (res.ok) spawnFloat()
    else console.error('[HabitCard] log failed:', await res.json())
    router.refresh()
    setLoading(false)
  }

  async function unlogHabit() {
    if (!logged) return
    setLoading(true)
    await fetch(`/api/log/${logged.id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <div>
      <div
        style={{
          position: 'relative',
          borderRadius: '14px',
          border: `1px solid ${isDone ? doneBorder : 'rgba(196,184,168,0.06)'}`,
          background: isDone ? doneBg : 'rgba(255,255,255,0.025)',
          padding: '14px 16px 14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          opacity: loading ? 0.6 : 1,
          pointerEvents: loading ? 'none' : 'auto',
          transition: 'background 0.2s, border-color 0.2s',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Float animations */}
        {floats.map(f => (
          <span
            key={f.id}
            style={{
              position: 'absolute', right: 16, top: 4,
              fontSize: 14, fontWeight: 700, color: accentColor,
              pointerEvents: 'none', zIndex: 20,
              animation: 'floatUp 0.8s ease-out forwards',
            }}
          >
            {f.text}
          </span>
        ))}

        {/* Left accent bar */}
        {isDone && (
          <div
            style={{
              position: 'absolute', left: 0, top: 10, bottom: 10,
              width: 3, borderRadius: 2, background: accentColor,
            }}
          />
        )}

        {/* Icon */}
        <div
          style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 17,
            background: isDone ? iconBg : 'rgba(255,255,255,0.04)',
            opacity: isDone ? 1 : 0.5,
            transition: 'opacity 0.2s',
          }}
        >
          {habit.icon}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <p
              style={{
                fontSize: 14, fontWeight: 400,
                color: isDone ? '#e8dcc8' : 'rgba(232,220,200,0.5)',
                margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                transition: 'color 0.2s',
              }}
            >
              {habit.name}
            </p>
            {isDone && logged?.duration != null && !isNaN(logged.duration) && (
              <span
                style={{
                  fontSize: 11, padding: '2px 6px', borderRadius: 6,
                  background: 'rgba(255,255,255,0.05)', color: 'rgba(196,184,168,0.35)',
                  fontWeight: 500, flexShrink: 0,
                }}
              >
                {logged.duration >= 60 ? `${logged.duration / 60}h` : `${logged.duration}m`}
              </span>
            )}
          </div>
          <p style={{ fontSize: 12, marginTop: 2, fontWeight: 500, color: ptColor }}>
            {isPositive ? '+' : ''}{habit.points} pts
            {isDone && flavor && (
              <span style={{ color: 'rgba(196,184,168,0.3)', fontWeight: 400 }}> · {flavor}</span>
            )}
          </p>
        </div>

        {/* Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {isDone ? (
            <>
              <span style={{ fontSize: 12, fontWeight: 700, color: accentColor }}>
                {isPositive ? '+' : ''}{habit.points}
              </span>
              <button
                onClick={unlogHabit}
                style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: '1px solid rgba(196,184,168,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(196,184,168,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, cursor: 'pointer',
                  transition: 'color 0.15s, border-color 0.15s',
                }}
              >
                ✕
              </button>
            </>
          ) : habit.hasTimer ? (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                fontSize: 12, color: 'rgba(196,184,168,0.35)',
                padding: '4px 8px', borderRadius: 8,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'color 0.15s',
              }}
            >
              Log ›
            </button>
          ) : (
            <button
              onClick={() => logHabit()}
              style={{
                fontSize: 12, color: 'rgba(196,184,168,0.35)',
                padding: '4px 8px', borderRadius: 8,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'color 0.15s',
              }}
            >
              Log ›
            </button>
          )}
        </div>
      </div>

      {/* Duration picker — garden-styled */}
      {expanded && !isDone && (
        <div
          style={{
            marginTop: -8,
            borderRadius: '0 0 14px 14px',
            border: '1px solid rgba(196,184,168,0.06)',
            borderTop: 'none',
            background: 'rgba(255,255,255,0.015)',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span
            style={{
              fontSize: 10, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.15em',
              color: '#6b7c6b', marginRight: 4,
            }}
          >
            Duration
          </span>
          {DURATION_OPTIONS.map(opt => (
            <TimeSelector key={opt.value} opt={opt} onSelect={() => logHabit(opt.value)} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes floatUp {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-24px); }
        }
      `}</style>
    </div>
  )
}

function TimeSelector({ opt, onSelect }: { opt: { label: string; value: number }; onSelect: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
        cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
        background: hovered ? 'rgba(74,124,63,0.15)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(122,182,72,0.25)' : 'rgba(196,184,168,0.08)'}`,
        color: hovered ? '#7ab648' : 'rgba(196,184,168,0.5)',
        transition: 'all 0.15s',
      }}
    >
      {opt.label}
    </button>
  )
}