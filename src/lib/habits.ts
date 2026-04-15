export const DEFAULT_HABITS = [
  { name: 'Reading',        icon: '📚', type: 'POSITIVE' as const, points: 20,  hasTimer: true  },
  { name: 'Walking',        icon: '🚶', type: 'POSITIVE' as const, points: 15,  hasTimer: true  },
  { name: 'Workout',        icon: '💪', type: 'POSITIVE' as const, points: 30,  hasTimer: true  },
  { name: 'Healthy Eating', icon: '🥗', type: 'POSITIVE' as const, points: 25,  hasTimer: false },
  { name: 'Meditation',     icon: '🧘', type: 'POSITIVE' as const, points: 20,  hasTimer: true  },
  { name: 'Social Media',   icon: '📱', type: 'NEGATIVE' as const, points: -20, hasTimer: true  },
  { name: 'Junk Food',      icon: '🍔', type: 'NEGATIVE' as const, points: -15, hasTimer: false },
  { name: 'Binge Watching', icon: '📺', type: 'NEGATIVE' as const, points: -25, hasTimer: true  },
]

export const TIME_MULTIPLIERS: Record<string, number> = {
  '15m': 0.5,
  '30m': 0.75,
  '1h':  1.0,
  '2h+': 1.5,
}

export const SCORE_LEVELS = [
  { min: 60,   color: '#22c55e', label: 'Great Day 🌟' },
  { min: 30,   color: '#84cc16', label: 'Good Day 😊'  },
  { min: 0,    color: '#eab308', label: 'Okay Day 😐'  },
  { min: -999, color: '#ef4444', label: 'Tough Day 😔' },
]

export function getScoreLevel(score: number) {
  return SCORE_LEVELS.find(l => score >= l.min) ?? SCORE_LEVELS[SCORE_LEVELS.length - 1]
}