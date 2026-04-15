import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getScoreLevel } from '@/lib/habits'
import Link from 'next/link'

export default async function HistoryPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) redirect('/dashboard')

  // Get all logs grouped by date
  const logs = await db.log.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  })

  const habits = await db.habit.findMany()

  // Group logs by date
  const grouped: Record<string, typeof logs> = {}
  for (const log of logs) {
    const dateKey = new Date(log.date).toLocaleDateString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
    })
    if (!grouped[dateKey]) grouped[dateKey] = []
    grouped[dateKey].push(log)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          <span className="font-bold tracking-tight">DayScore</span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm text-zinc-400 hover:text-white transition-colors"
        >
          ← Back
        </Link>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold">📅 History</h1>

        {Object.keys(grouped).length === 0 ? (
          <div className="text-zinc-500 text-sm">No logs yet. Start tracking today!</div>
        ) : (
          Object.entries(grouped).map(([date, dayLogs]) => {
            const score = dayLogs.reduce((s, l) => s + l.points, 0)
            const level = getScoreLevel(score)
            return (
              <div key={date} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-zinc-400">{date}</p>
                  <span
                    className="text-lg font-bold"
                    style={{ color: level.color }}
                  >
                    {score > 0 ? '+' : ''}{score}
                  </span>
                </div>
                <div className="space-y-2">
                  {dayLogs.map((log, i) => {
                    const habit = habits.find((h) => h.id === log.habitId)
                    if (!habit) return null
                    return (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-zinc-300">
                          <span>{habit.icon}</span>
                          <span>{habit.name}</span>
                          {log.duration && (
                            <span className="text-zinc-600 text-xs">· {log.duration}</span>
                          )}
                        </div>
                        <span className={log.points > 0 ? 'text-green-400' : 'text-red-400'}>
                          {log.points > 0 ? '+' : ''}{log.points}
                        </span>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-zinc-600">{level.label}</p>
              </div>
            )
          })
        )}
      </main>
    </div>
  )
}