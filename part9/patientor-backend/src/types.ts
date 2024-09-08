import { z } from "zod";
import { NewPatientSchema, DiagnosisSchema } from "./utils";

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
