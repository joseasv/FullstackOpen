export type Gender = "male" | "female" | "other";

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface Patient {
  id: string;
  name: string;
  ssn: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
}

export type PublicFacingPatient = Omit<Patient, "ssn">;