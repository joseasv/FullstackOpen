import { NewDiaryEntry } from "./types";
import { Weather, Visibility } from "./types";
import { z } from "zod";

export const NewEntrySchema = z.object({
  weather: z.nativeEnum(Weather),
  visibility: z.nativeEnum(Visibility),
  date: z.string().date(),
  comment: z.string().optional(),
});

const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  return NewEntrySchema.parse(object);
};

export default toNewDiaryEntry;