import { TIME_MULTIPLIERS } from './habits'

export function calculatePoints(basePoints: number, duration: string): number {
  const multiplier = TIME_MULTIPLIERS[duration] ?? 1
  return Math.round(basePoints * multiplier)
}

export function calculateDailyScore(logs: { points: number }[]): number {
  return logs.reduce((sum, log) => sum + log.points, 0)
}