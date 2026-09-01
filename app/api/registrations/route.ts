import { NextResponse } from 'next/server'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/lib/db'
import { patients, registrations } from '@/lib/db/schema'

const registrationSchema = z.object({
  name: z.string().trim().min(2).max(120),
  nationalId: z.string().trim().min(5).max(32).optional(),
  birthDate: z.string().date(),
  phone: z.string().trim().min(8).max(24),
  clinic: z.string().trim().min(2).max(80).optional(),
  doctor: z.string().trim().min(2).max(120).optional(),
  visitDate: z.string().date().optional(),
  complaint: z.string().trim().min(2).max(500).optional(),
})

export async function POST(request: Request) {
  try {
    const parsed = registrationSchema.safeParse(await request.json())
    if (!parsed.success) return NextResponse.json({ error: 'Nama, tanggal lahir, dan nomor telepon wajib diisi dengan benar.' }, { status: 400 })
    const input = parsed.data
    const data = {
      ...input,
      clinic: input.clinic || 'Poli Umum',
      nationalId: input.nationalId || `PHONE-${input.phone}`,
      doctor: input.doctor || 'Dokter jaga',
      visitDate: input.visitDate || new Date().toISOString().slice(0, 10),
      complaint: input.complaint || 'Pemeriksaan umum',
    }
    const existing = await db.select({ id: patients.id }).from(patients).where(eq(patients.nationalId, data.nationalId)).limit(1)
    const patient = existing[0] ?? (await db.insert(patients).values({ name: data.name, nationalId: data.nationalId, birthDate: data.birthDate, phone: data.phone }).returning({ id: patients.id }))[0]
    const latest = await db.select({ queueNumber: registrations.queueNumber }).from(registrations).where(eq(registrations.visitDate, data.visitDate)).orderBy(desc(registrations.queueNumber)).limit(1)
    const queueNumber = (latest[0]?.queueNumber ?? 0) + 1
    const [registration] = await db.insert(registrations).values({
      patientId: patient.id,
      clinic: data.clinic,
      doctor: data.doctor,
      visitDate: data.visitDate,
      complaint: data.complaint,
      queueNumber,
    }).returning({ id: registrations.id, queueNumber: registrations.queueNumber })
    return NextResponse.json({ registration }, { status: 201 })
  } catch (error) {
    console.error('[v0] Registration API error', error)
    return NextResponse.json({ error: 'Pendaftaran gagal disimpan.' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const rows = await db
      .select({
        id: registrations.id,
        patientId: registrations.patientId,
        patientName: patients.name,
        phone: patients.phone,
        clinic: registrations.clinic,
        doctor: registrations.doctor,
        visitDate: registrations.visitDate,
        complaint: registrations.complaint,
        status: registrations.status,
        queueNumber: registrations.queueNumber,
        createdAt: registrations.createdAt,
      })
      .from(registrations)
      .leftJoin(patients, eq(registrations.patientId, patients.id))
      .orderBy(desc(registrations.createdAt))
      .limit(50)
    return NextResponse.json({ registrations: rows })
  } catch (error) {
    console.error('[v0] Registration list error', error)
    return NextResponse.json({ error: 'Data pendaftaran gagal dimuat.' }, { status: 500 })
  }
}
