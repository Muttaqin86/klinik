import { NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { medicalRecords, patients } from '@/lib/db/schema'

export async function GET() {
  try {
    const records = await db.select({
      id: medicalRecords.id,
      patientId: medicalRecords.patientId,
      patientName: patients.name,
      visitDate: medicalRecords.visitDate,
      diagnosis: medicalRecords.diagnosis,
      treatment: medicalRecords.treatment,
      doctor: medicalRecords.doctor,
      notes: medicalRecords.notes,
    }).from(medicalRecords)
      .leftJoin(patients, eq(medicalRecords.patientId, patients.id))
      .orderBy(desc(medicalRecords.visitDate), desc(medicalRecords.createdAt))
      .limit(100)
    return NextResponse.json({ records })
  } catch (error) {
    console.error('[v0] Medical records list error', error)
    return NextResponse.json({ error: 'Data rekam medis gagal dimuat.' }, { status: 500 })
  }
}
