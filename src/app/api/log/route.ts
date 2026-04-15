import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, habitId, duration, points } = body

    if (!userId || !habitId || points == null) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // ✅ Prevent duplicate logs for the same habit on the same day
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existing = await db.log.findFirst({
      where: {
        userId,
        habitId,
        date: { gte: today, lt: tomorrow },
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Already logged today' }, { status: 409 })
    }

    const log = await db.log.create({
      data: {
        userId,
        habitId,
        duration: duration ?? null,
        points,
      },
    })

    return NextResponse.json(log)
  } catch (error) {
    console.error('[POST /api/log]', error)
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const logs = await db.log.findMany({
      where: {
        userId,
        date: { gte: today, lt: tomorrow },
      },
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('[GET /api/log]', error)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}