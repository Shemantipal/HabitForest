import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { DEFAULT_HABITS, getScoreLevel } from '@/lib/habits'
import { HabitCard } from '@/components/HabitCard'
import { ScoreDisplay } from '@/components/ScoreDisplay'
import { StreakBadge } from '@/components/StreakBadge'
import { DailySummary } from '@/components/DailySummary'
import { TrackerGrid } from '@/components/TrackerGrid'
import { UserButton } from '@clerk/nextjs'
import { GardenScene } from '@/components/GardenScene'
import { Cinzel, Raleway } from 'next/font/google'
import { GuidanceReport } from '@/components/GuidanceReport'

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700', '900'] })
const raleway = Raleway({ subsets: ['latin'], weight: ['300', '400', '600', '700'] })

function normalizeLog<T extends { duration: string | number | null | undefined }>(
  log: T
): Omit<T, 'duration'> & { duration: number | null } {
  return {
    ...log,
    duration: log.duration != null && log.duration !== '' ? Number(log.duration) : null,
  }
}

// Gamified Ranks based on score (Synced with GardenScene themes)
function getPlayerRank(score: number) {
  if (score >= 80)  return { title: 'S-Rank: Archdruid', msg: 'Ancient magic awakened!', color: '#10b981', glow: 'rgba(16,185,129,0.5)' } 
  if (score >= 40)  return { title: 'A-Rank: Warden', msg: 'The grove thickens.', color: '#34d399', glow: 'rgba(52,211,153,0.4)' }
  if (score >= 10)  return { title: 'B-Rank: Hydromancer', msg: 'Healing waters flow.', color: '#3b82f6', glow: 'rgba(59,130,246,0.5)' }
  return { title: 'C-Rank: Parched', msg: 'The earth scorches. Seek water!', color: '#b45309', glow: 'rgba(180,83,9,0.5)' }
}

function getQuestFlavor(habitName: string, isPositive: boolean) {
  if (!isPositive) {
    const neg: Record<string, string> = {
      'Junk food':          '-10 Agility (Poisoned)',
      'Excess social media':'Mind Control active: Focus drops',
      'Smoking':            'Max HP reduced',
      'Alcohol':            'Confusion debuff applied',
    }
    return neg[habitName] ?? 'Warning: Hazard detected'
  }
  const pos: Record<string, string> = {
    'Reading':    '+15 Intelligence (Wisdom gained)',
    'Workout':    '+20 Strength (Buff active)',
    'Meditation': 'Mana restored (+Focus)',
    'Sleep 8h':   'Full HP Recovery',
    'Hydration':  'Stamina Regen +5%',
    'Journaling': 'Save Point created',
  }
  return pos[habitName] ?? 'Quest objective completed'
}

export default async function DashboardPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  let user = await db.user.findUnique({ where: { clerkId: userId } })
  if (!user) user = await db.user.create({ data: { clerkId: userId } })

  const habitCount = await db.habit.count()
  if (habitCount === 0) await db.habit.createMany({ data: DEFAULT_HABITS })

  const habits = await db.habit.findMany()

  const today    = new Date(); today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)

  const rawTodayLogs = await db.log.findMany({
    where: { userId: user.id, date: { gte: today, lt: tomorrow } },
  })
  const todayLogs = rawTodayLogs.map(normalizeLog)

  const totalScore  = todayLogs.reduce((sum, log) => sum + log.points, 0)
  const playerRank  = getPlayerRank(totalScore)

  const rawAllLogs = await db.log.findMany({
    where: { userId: user.id },
    orderBy: { date: 'desc' },
  })
  const allLogs = rawAllLogs.map(normalizeLog)

  let streak = 0
  const checkDate = new Date(); checkDate.setHours(0, 0, 0, 0)
  while (true) {
    const dayStart = new Date(checkDate)
    const dayEnd   = new Date(checkDate); dayEnd.setDate(dayEnd.getDate() + 1)
    const hasLog   = allLogs.some(l => new Date(l.date) >= dayStart && new Date(l.date) < dayEnd)
    if (!hasLog) break
    streak++
    checkDate.setDate(checkDate.getDate() - 1)
  }

  // Gamification: Calculate a pseudo "Level" based on streak (1 level per 3 streak days)
  const playerLevel = Math.floor(streak / 3) + 1

  const habitsWithLogs = habits.map(habit => ({
    ...habit,
    logged:  todayLogs.find(l => l.habitId === habit.id) ?? null,
    flavor:  getQuestFlavor(habit.name, habit.type === 'POSITIVE'),
  }))

  const positiveHabits   = habitsWithLogs.filter(h => h.type === 'POSITIVE')
  const negativeHabits   = habitsWithLogs.filter(h => h.type === 'NEGATIVE')
  const completedCount   = todayLogs.filter(l => l.points > 0).length
  const maxScore         = 130

  return (
    <div className={`${raleway.className} min-h-screen text-slate-200 overflow-x-hidden relative bg-[#040906]`}>
      
      {/* ☁️ Mystical Cloudy Night Sky Background */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        {/* Base Gradient */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{
            background: 'radial-gradient(ellipse at 50% -20%, rgba(16, 55, 40, 0.4) 0%, rgba(4, 9, 6, 1) 70%)'
          }}
        />
        {/* SVG Noise / Fog Layer */}
        <div 
          className="absolute inset-0 opacity-20 mix-blend-screen"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.015' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover'
          }}
        />
        {/* Subtle glowing orbs in the background */}
        <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-emerald-900/10 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[10%] w-80 h-80 bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      {/* ⚔️ RPG Top Nav Menu */}
      <header className="relative z-20 px-6 py-4 border-b border-emerald-900/20 bg-black/40 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(16,185,129,0.2)] bg-gradient-to-br from-emerald-900 to-black border border-emerald-500/30">
              🌿
            </div>
            <div>
              <span className={`${cinzel.className} text-2xl text-emerald-100 font-bold block leading-none drop-shadow-md`}>
                LifeGarden RPG
              </span>
              <span className="text-[11px] text-emerald-400/80 uppercase tracking-[0.2em] font-bold">
                Level {playerLevel} Adventurer
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Current Combo</span>
              <div className="flex items-center gap-1.5">
                <span className="text-emerald-400 font-black text-lg drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">{streak}x</span>
                <span className="text-xl">🔥</span>
              </div>
            </div>
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 to-blue-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:scale-105 transition-transform">
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      {/* 🛡️ Main Dashboard Grid Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* --------------------------------------------------- */}
        {/* LEFT COLUMN: Player Status & Environment (col-span-5) */}
        {/* --------------------------------------------------- */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* 1. Vitality Score HUD */}
          <ScoreDisplay 
            score={totalScore}
            maxScore={maxScore}
            rankTitle={playerRank.title}
            rankMsg={playerRank.msg}
            rankColor={playerRank.color}
            rankGlow={playerRank.glow}
            completedCount={completedCount}
            totalCount={habits.length}
          />

          {/* 2. The Visual Garden Scene */}
          <div className="rounded-2xl overflow-hidden border border-slate-800/80 relative shadow-[0_10px_40px_rgba(0,0,0,0.5)] group">
            <div className="absolute top-4 left-4 z-20 bg-black/70 backdrop-blur-md text-[10px] px-3 py-1.5 rounded-md text-slate-300 font-bold tracking-[0.2em] border border-white/5 shadow-lg group-hover:bg-black/90 transition-colors">
              ZONE: Ethereal Grove
            </div>
            <GardenScene score={totalScore} />
          </div>

          {/* 3. Guild Master's Report */}
          <GuidanceReport score={totalScore} streak={streak} />
        </div>

        {/* --------------------------------------------------- */}
        {/* RIGHT COLUMN: Action Board & Quests (col-span-7) */}
        {/* --------------------------------------------------- */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          
          {/* Side Quests (Trackers) */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2.5 h-2.5 rounded-sm rotate-45 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              <h3 className={`${cinzel.className} text-xl text-slate-100 tracking-wider font-bold`}>Guild Side Quests</h3>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-900/50 to-transparent" />
            </div>
            <TrackerGrid userId={user.id} />
          </section>

          {/* Dual Column for Daily Quests & Hazards on large screens inside the right column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Daily Quests (Positive) */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2.5 h-2.5 rounded-sm rotate-45 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse" />
                <h3 className={`${cinzel.className} text-lg text-emerald-50 tracking-wider font-bold`}>Daily Quests</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-emerald-900/50 to-transparent" />
              </div>
              <div className="flex flex-col gap-3">
                {positiveHabits.map(habit => (
                  <div key={habit.id} className="transform transition-all hover:-translate-y-1 hover:shadow-lg">
                    <HabitCard habit={habit} userId={user.id} logged={habit.logged} flavor={habit.flavor} />
                  </div>
                ))}
              </div>
            </section>

            {/* Zone Hazards (Negative) */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-2.5 h-2.5 rounded-sm rotate-45 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                <h3 className={`${cinzel.className} text-lg text-red-50 tracking-wider font-bold`}>Zone Hazards</h3>
                <div className="flex-1 h-px bg-gradient-to-r from-red-900/40 to-transparent" />
              </div>
              <div className="flex flex-col gap-3">
                {negativeHabits.map(habit => (
                  <div key={habit.id} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-red-900 to-orange-900 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                    <HabitCard habit={habit} userId={user.id} logged={habit.logged} flavor={habit.flavor} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Battle Log (Summary) */}
          {todayLogs.length > 0 && (
            <section className="mt-4 pt-8 border-t border-slate-800/60 relative">
              {/* Subtle top glow for the separator */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-900/50 to-transparent" />
              
              <div className="flex flex-col items-center mb-6">
                <h3 className={`${cinzel.className} text-xl font-bold text-slate-300 tracking-widest uppercase`}>Battle Log</h3>
                <p className="text-xs text-slate-500 mt-1 tracking-wider">A record of today's deeds</p>
              </div>
              <DailySummary logs={todayLogs} habits={habits} score={totalScore} />
            </section>
          )}

        </div>
      </main>
    </div>
  )
}