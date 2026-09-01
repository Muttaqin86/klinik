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

export const patientDischarges = pgTable('patient_discharges', {
  id: uuid('id').defaultRandom().primaryKey(), patientId: uuid('patient_id').notNull(), registrationId: uuid('registration_id'), status: text('status').default('Menunggu pengesahan').notNull(), dischargedAt: timestamp('discharged_at', { withTimezone: true }), approvedBy: text('approved_by'), actionDetails: text('action_details').default('').notNull(), medicineDetails: text('medicine_details').default('').notNull(), serviceDetails: text('service_details').default('').notNull(), actionCost: integer('action_cost').default(0).notNull(), medicineCost: integer('medicine_cost').default(0).notNull(), serviceCost: integer('service_cost').default(0).notNull(), notes: text('notes').default('').notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const medicalRecords = pgTable('medical_records', {
  id: uuid('id').defaultRandom().primaryKey(), patientId: uuid('patient_id').notNull(), registrationId: uuid('registration_id'), visitDate: date('visit_date').defaultNow().notNull(), diagnosis: text('diagnosis').notNull(), treatment: text('treatment').notNull(), doctor: text('doctor').notNull(), notes: text('notes').default('').notNull(), createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
