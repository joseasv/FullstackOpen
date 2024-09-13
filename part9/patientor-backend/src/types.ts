import { z } from "zod";
import {
  NewPatientSchema,
  DiagnosisSchema,
  EntrySchema,
  NewEntrySchema,
} from "./utils";

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export type Diagnosis = z.infer<typeof DiagnosisSchema>;

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export type PublicFacingPatient = Omit<Patient, "ssn" | "entries">;

export type NewPatient = z.infer<typeof NewPatientSchema>;

export interface Patient extends NewPatient {
  id: string;
}

export type Entry = z.infer<typeof EntrySchema>;

// Define special omit for unions
// type UnionOmit<T, K extends string | number | symbol> = T extends unknown
//   ? Omit<T, K>
//   : never;
// Define Entry without the 'id' property
//export type NewEntry = UnionOmit<Entry, "id">;
export type NewEntry = z.infer<typeof NewEntrySchema>;
