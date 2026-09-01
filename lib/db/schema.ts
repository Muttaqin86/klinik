import { pgTable, text, uuid, date, timestamp, integer } from 'drizzle-orm/pg-core'

export const patients = pgTable('patients', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  nationalId: text('national_id').notNull().unique(),
  birthDate: date('birth_date').notNull(),
  phone: text('phone').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const registrations = pgTable('registrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  patientId: uuid('patient_id').notNull(),
  clinic: text('clinic').notNull(),
  doctor: text('doctor').notNull(),
  visitDate: date('visit_date').notNull(),
  complaint: text('complaint').notNull(),
  status: text('status').default('Menunggu').notNull(),
  queueNumber: integer('queue_number').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
