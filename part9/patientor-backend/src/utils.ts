import { NewPatient, Gender, HealthCheckRating } from "./types";
import { z } from "zod";

export const DiagnosisSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional(),
});

export const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const HealthCheckEntrySchema = BaseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

export const SickLeaveSchema = z.object({
  startDate: z.string().date(),
  endDate: z.string().date(),
});

export const DischargeSchema = z.object({
  date: z.string().date(),
  criteria: z.string(),
});

export const OccupationalHealthcareEntrySchema = BaseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: SickLeaveSchema.optional(),
});

export const HospitalSchema = BaseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: DischargeSchema,
});

export const EntrySchema = z.discriminatedUnion("type", [
  OccupationalHealthcareEntrySchema,
  HospitalSchema,
  HealthCheckEntrySchema,
]);

export const NewEntrySchema = z.discriminatedUnion("type", [
  OccupationalHealthcareEntrySchema.omit({ id: true }),
  HospitalSchema.omit({ id: true }),
  HealthCheckEntrySchema.omit({ id: true }),
]);

export const NewPatientSchema = z.object({
  name: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  dateOfBirth: z.string().date(),
  occupation: z.string(),
  entries: z.array(EntrySchema),
});

const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export default toNewPatient;