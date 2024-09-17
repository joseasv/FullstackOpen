import {
  EntrySchema,
  HealthCheckEntrySchema,
  HospitalSchema,
  NewEntrySchema,
  OccupationalHealthcareEntrySchema,
} from "./utils";
import { z } from "zod";

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export type Entry = z.infer<typeof EntrySchema>;

export type NewEntry = z.infer<typeof NewEntrySchema>;

export type Hospital = z.infer<typeof HospitalSchema>;

export type OccupationalHealthcare = z.infer<
  typeof OccupationalHealthcareEntrySchema
>;

export type HealthCheck = z.infer<typeof HealthCheckEntrySchema>;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;