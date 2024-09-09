import express from "express";
import diagnosesService from "../services/diagnosesService";
import { Diagnosis } from "../types";
import { Response, Request } from "express";
import { DiagnosisSchema } from "../utils";
import { errorMiddleware } from "./middleware";
import { NextFunction } from "express";

const router = express.Router();

router.get("/", (_req, res: Response<Diagnosis[]>) => {
  res.send(diagnosesService.getDiagnoses());
});

router.get("/:code", (req, res: Response<Diagnosis>) => {
  const code: string = req.params.code;
  res.send(diagnosesService.getDiagnosis(code));
});

const newDiagnosisParser = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    DiagnosisSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/",
  newDiagnosisParser,
  (req: Request<unknown, unknown, Diagnosis>, res: Response<Diagnosis>) => {
    const addedDiagnosis = diagnosesService.addDiagnosis(req.body);
    res.json(addedDiagnosis);
  },
);

router.use(errorMiddleware);

export default router;