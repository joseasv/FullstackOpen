import diagnosesData from "../../data/diagnoses";

import { Diagnosis } from "../types";

const diagnoses: Diagnosis[] = diagnosesData;

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const getDiagnosis = (code: string): Diagnosis | undefined => {
  return diagnoses.find((diagnosis) => diagnosis.code === code);
};

const addDiagnosis = (diagnosis: Diagnosis) => {
  diagnoses.push(diagnosis);
  return diagnosis;
};

export default {
  getDiagnoses,
  addDiagnosis,
  getDiagnosis,
};