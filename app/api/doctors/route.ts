import { NextResponse } from 'next/server'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { doctors, doctorSchedules } from '@/lib/db/schema'

export async function GET() {
  try {
    const rows = await db.select({ id: doctors.id, name: doctors.name, specialty: doctors.specialty, room: doctors.room, color: doctors.color, dayOfWeek: doctorSchedules.dayOfWeek, startTime: doctorSchedules.startTime, endTime: doctorSchedules.endTime }).from(doctors).innerJoin(doctorSchedules, eq(doctorSchedules.doctorId, doctors.id)).where(eq(doctors.active, true)).orderBy(asc(doctorSchedules.dayOfWeek), asc(doctorSchedules.startTime))
    return NextResponse.json({ doctors: rows })
  } catch (error) {
    console.error('[v0] Doctor schedule API error', error)
    return NextResponse.json({ error: 'Jadwal dokter gagal dimuat.' }, { status: 500 })
  }
}
