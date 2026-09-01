import { NextResponse } from 'next/server'
import { desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { patients } from '@/lib/db/schema'

export async function GET() {
  try {
    const rows = await db.select({
      id: patients.id,
      name: patients.name,
      nationalId: patients.nationalId,
      birthDate: patients.birthDate,
      phone: patients.phone,
      createdAt: patients.createdAt,
    }).from(patients).orderBy(desc(patients.createdAt)).limit(100)
    return NextResponse.json({ patients: rows })
  } catch (error) {
    console.error('[v0] Patients API error', error)
    return NextResponse.json({ error: 'Data pasien gagal dimuat.' }, { status: 500 })
  }
}
