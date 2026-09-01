import { NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { patientDischarges, patients } from '@/lib/db/schema'

export async function GET() {
  try {
    const discharges = await db.select({ id: patientDischarges.id, patientId: patientDischarges.patientId, patientName: patients.name, status: patientDischarges.status, dischargedAt: patientDischarges.dischargedAt, approvedBy: patientDischarges.approvedBy, notes: patientDischarges.notes, createdAt: patientDischarges.createdAt }).from(patientDischarges).leftJoin(patients, eq(patientDischarges.patientId, patients.id)).orderBy(desc(patientDischarges.createdAt))
    return NextResponse.json({ discharges })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Data kepulangan gagal dimuat.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, approvedBy, notes } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID kepulangan wajib diisi.' }, { status: 400 })
    const [discharge] = await db.update(patientDischarges).set({ status: 'Disahkan', dischargedAt: new Date(), approvedBy: approvedBy || 'Admin Klinik', notes: notes || '' }).where(eq(patientDischarges.id, id)).returning()
    if (!discharge) return NextResponse.json({ error: 'Data kepulangan tidak ditemukan.' }, { status: 404 })
    return NextResponse.json({ discharge })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Pengesahan gagal disimpan.' }, { status: 500 })
  }
}
