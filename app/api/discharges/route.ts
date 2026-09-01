import { NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { patientDischarges, patients, registrations } from '@/lib/db/schema'

export async function GET() {
  try {
    const registrationsList = await db.select({ id: registrations.id, registrationId: registrations.id, patientId: registrations.patientId, patientName: patients.name, phone: patients.phone, clinic: registrations.clinic, doctor: registrations.doctor, visitDate: registrations.visitDate, queueNumber: registrations.queueNumber, dischargeId: patientDischarges.id, status: patientDischarges.status, dischargedAt: patientDischarges.dischargedAt, approvedBy: patientDischarges.approvedBy, notes: patientDischarges.notes }).from(registrations).leftJoin(patients, eq(registrations.patientId, patients.id)).leftJoin(patientDischarges, eq(patientDischarges.registrationId, registrations.id)).orderBy(desc(registrations.createdAt)).limit(100)
    return NextResponse.json({ registrations: registrationsList })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Data kepulangan gagal dimuat.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { patientId, registrationId, notes } = await request.json()
    if (!patientId) return NextResponse.json({ error: 'Pasien wajib dipilih.' }, { status: 400 })
    const [discharge] = await db.insert(patientDischarges).values({ patientId, registrationId: registrationId || null, notes: notes || '' }).returning()
    return NextResponse.json({ discharge }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Action kepulangan gagal disimpan.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, approvedBy, notes } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID kepulangan wajib diisi.' }, { status: 400 })
    const [discharge] = await db.update(patientDischarges).set({ status: 'Disahkan', dischargedAt: new Date(), approvedBy: approvedBy || 'Admin Klinik', notes: notes || '' }).where(eq(patientDischarges.id, id)).returning()
    if (!discharge) return NextResponse.json({ error: 'Data kepulangan tidak ditemukan.' }, { status: 404 })
    if (discharge.registrationId) await db.update(registrations).set({ status: 'Selesai' }).where(eq(registrations.id, discharge.registrationId))
    return NextResponse.json({ discharge })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Pengesahan gagal disimpan.' }, { status: 500 })
  }
}
