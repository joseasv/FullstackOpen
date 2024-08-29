import express from "express";
import patientService from "../services/patientService";
import { PublicFacingPatient } from "../types";
import { Response } from "express";

const router = express.Router();

router.get("/", (_req, res: Response<PublicFacingPatient[]>) => {
  res.send(patientService.getPublicFacingPatients());
});

router.post("/", (_req, res) => {
  res.send("Saving a patient!");
});

export default router;