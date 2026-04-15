export type HabitType = 'POSITIVE' | 'NEGATIVE'

export interface Habit {
  id: string
  name: string
  icon: string
  type: HabitType
  points: number
  isDefault: boolean
}

export interface Log {
  id: string
  userId: string
  habitId: string
  duration: string | null
  points: number
  date: string
}

export interface HabitWithLog extends Habit {
  logged?: {
    duration: string | null
    points: number
  }
}