import express from "express";
import patientService from "../services/patientService";
import {
  Entry,
  NewEntry,
  NewPatient,
  Patient,
  PublicFacingPatient,
} from "../types";
import { Response, Request, NextFunction } from "express";
import { errorMiddleware } from "./middleware";
import { NewEntrySchema, NewPatientSchema } from "../utils";

const router = express.Router();

router.get("/:id", (req: Request, res: Response<Patient>) => {
  const id: string = req.params.id;
  res.send(patientService.getPatient(id));
});

router.get("/", (_req, res: Response<PublicFacingPatient[]>) => {
  res.send(patientService.getPublicFacingPatients());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  },
);

const newEntryParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    console.log("newEntryParser body", req.body);
    NewEntrySchema.parse(req.body);

    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/:id/entries",
  newEntryParser,
  (req: Request<{ id: string }, unknown, NewEntry>, res: Response<Entry>) => {
    console.log("id entries post body", req.body);
    const id: string = req.params.id;
    console.log("adding entry to patient ", id);
    const addedEntry = patientService.addEntry(id, req.body);
    res.json(addedEntry);
  },
);

router.use(errorMiddleware);

export default router;