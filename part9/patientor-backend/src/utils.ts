import { NewPatient } from "./types";
import { Gender } from "./types";
import { z } from "zod";

export const EntrySchema = z.object({
  description: z.string(),
  creationDate: z.string().date(),
  createdBy: z.string(),
});

export const NewPatientSchema = z.object({
  name: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  dateOfBirth: z.string().date(),
  occupation: z.string(),
  entries: z.array(EntrySchema).default([]),
});

const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export default toNewPatient;