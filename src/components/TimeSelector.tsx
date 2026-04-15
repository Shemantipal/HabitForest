'use client'

import { useState } from 'react'

const TIME_OPTIONS = [
  { label: '15m', value: 15 },
  { label: '30m', value: 30 },
  { label: '1h',  value: 60 },
  { label: '2h+', value: 120 },
]

interface Props {
  onSelect: (duration: number) => void
  loading?: boolean
}

export function TimeSelector({ onSelect, loading }: Props) {
  return (
    <div
      style={{
        marginTop: 0,
        paddingTop: 12,
        borderTop: '1px solid rgba(196,184,168,0.07)',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <p
        style={{
          fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.15em',
          color: '#6b7c6b', marginBottom: 10,
        }}
      >
        How long?
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {TIME_OPTIONS.map(opt => (
          <TimePill
            key={opt.value}
            label={opt.label}
            disabled={loading}
            onSelect={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}

function TimePill({
  label,
  disabled,
  onSelect,
}: {
  label: string
  disabled?: boolean
  onSelect: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '6px 16px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: "'DM Sans', sans-serif",
        transition: 'all 0.15s',
        background: hovered ? 'rgba(74,124,63,0.18)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hovered ? 'rgba(122,182,72,0.3)' : 'rgba(196,184,168,0.1)'}`,
        color: hovered ? '#7ab648' : 'rgba(196,184,168,0.5)',
      }}
    >
      {opt.label}
    </button>
  )
}