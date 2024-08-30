import express from "express";
import patientService from "../services/patientService";
import { PublicFacingPatient } from "../types";
import { Response } from "express";
import toNewPatient from "../utils";

const router = express.Router();

router.get("/", (_req, res: Response<PublicFacingPatient[]>) => {
  res.send(patientService.getPublicFacingPatients());
});

router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);

    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;