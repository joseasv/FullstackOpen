import { NewPatient } from "./types";
import { Gender } from "./types";
import { z } from "zod";

export const NewPatientSchema = z.object({
  name: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  dateOfBirth: z.string().date(),
  occupation: z.string(),
});

const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export default toNewPatient;