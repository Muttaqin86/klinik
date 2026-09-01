import { NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { patientDischarges, patients, registrations } from '@/lib/db/schema'

export async function GET() {
  try {
    const registrationsList = await db.select({ id: registrations.id, registrationId: registrations.id, patientId: registrations.patientId, patientName: patients.name, phone: patients.phone, clinic: registrations.clinic, doctor: registrations.doctor, visitDate: registrations.visitDate, queueNumber: registrations.queueNumber, dischargeId: patientDischarges.id, status: patientDischarges.status, dischargedAt: patientDischarges.dischargedAt, approvedBy: patientDischarges.approvedBy, actionDetails: patientDischarges.actionDetails, medicineDetails: patientDischarges.medicineDetails, serviceDetails: patientDischarges.serviceDetails, actionCost: patientDischarges.actionCost, medicineCost: patientDischarges.medicineCost, serviceCost: patientDischarges.serviceCost, notes: patientDischarges.notes }).from(registrations).leftJoin(patients, eq(registrations.patientId, patients.id)).leftJoin(patientDischarges, eq(patientDischarges.registrationId, registrations.id)).orderBy(desc(registrations.createdAt)).limit(100)
    return NextResponse.json({ registrations: registrationsList })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Data kepulangan gagal dimuat.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { patientId, registrationId, notes, actionDetails, medicineDetails, serviceDetails, actionCost, medicineCost, serviceCost } = await request.json()
    if (!patientId) return NextResponse.json({ error: 'Pasien wajib dipilih.' }, { status: 400 })
    const costs = [actionCost, medicineCost, serviceCost].map((value) => Number(value || 0))
    if (costs.some((value) => !Number.isInteger(value) || value < 0)) return NextResponse.json({ error: 'Biaya harus berupa angka bulat positif atau nol.' }, { status: 400 })
    const [discharge] = await db.insert(patientDischarges).values({ patientId, registrationId: registrationId || null, actionDetails: actionDetails || '', medicineDetails: medicineDetails || '', serviceDetails: serviceDetails || '', actionCost: costs[0], medicineCost: costs[1], serviceCost: costs[2], notes: notes || '' }).returning()
    return NextResponse.json({ discharge }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Action kepulangan gagal disimpan.' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, approvedBy, notes, actionDetails, medicineDetails, serviceDetails, actionCost, medicineCost, serviceCost } = await request.json()
    const costs = [actionCost, medicineCost, serviceCost].map((value) => value === undefined ? undefined : Number(value))
    if (costs.some((value) => value !== undefined && (!Number.isInteger(value) || value < 0))) return NextResponse.json({ error: 'Biaya harus berupa angka bulat positif atau nol.' }, { status: 400 })
    if (!id) return NextResponse.json({ error: 'ID kepulangan wajib diisi.' }, { status: 400 })
    const [discharge] = await db.update(patientDischarges).set({ status: 'Disahkan', dischargedAt: new Date(), approvedBy: approvedBy || 'Admin Klinik', actionDetails: actionDetails || '', medicineDetails: medicineDetails || '', serviceDetails: serviceDetails || '', ...(costs[0] !== undefined ? { actionCost: costs[0] } : {}), ...(costs[1] !== undefined ? { medicineCost: costs[1] } : {}), ...(costs[2] !== undefined ? { serviceCost: costs[2] } : {}), notes: notes || '' }).where(eq(patientDischarges.id, id)).returning()
    if (!discharge) return NextResponse.json({ error: 'Data kepulangan tidak ditemukan.' }, { status: 404 })
    if (discharge.registrationId) await db.update(registrations).set({ status: 'Selesai' }).where(eq(registrations.id, discharge.registrationId))
    return NextResponse.json({ discharge })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Pengesahan gagal disimpan.' }, { status: 500 })
  }
}
