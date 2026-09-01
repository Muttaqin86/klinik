import { pgTable, text, uuid, date, timestamp, integer, time, boolean } from 'drizzle-orm/pg-core'

export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(), name: text('name').notNull(), nationalId: text('national_id').notNull().unique(), birthDate: date('birth_date').notNull(), phone: text('phone').notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const registrations = pgTable('registrations', {
  id: uuid('id').defaultRandom().primaryKey(), patientId: uuid('patient_id').notNull(), clinic: text('clinic').notNull(), doctor: text('doctor').notNull(), visitDate: date('visit_date').notNull(), complaint: text('complaint').notNull(), status: text('status').default('Menunggu').notNull(), queueNumber: integer('queue_number').notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const doctors = pgTable('doctors', {
  id: uuid('id').defaultRandom().primaryKey(), name: text('name').notNull(), specialty: text('specialty').notNull(), room: text('room').notNull(), color: text('color').default('teal').notNull(), active: boolean('active').default(true).notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const doctorSchedules = pgTable('doctor_schedules', {
  id: uuid('id').defaultRandom().primaryKey(), doctorId: uuid('doctor_id').notNull(), dayOfWeek: integer('day_of_week').notNull(), startTime: time('start_time').notNull(), endTime: time('end_time').notNull(), active: boolean('active').default(true).notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const medicalRecords = pgTable('medical_records', {
  id: uuid('id').defaultRandom().primaryKey(), patientId: uuid('patient_id').notNull(), registrationId: uuid('registration_id'), visitDate: date('visit_date').defaultNow().notNull(), diagnosis: text('diagnosis').notNull(), treatment: text('treatment').notNull(), doctor: text('doctor').notNull(), notes: text('notes').default('').notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
