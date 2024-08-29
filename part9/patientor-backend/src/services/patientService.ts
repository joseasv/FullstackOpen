import patientsData from "../../data/patients";
import { PublicFacingPatient, Patient } from "../types";

const getPatients = (): Patient[] => {
  return patientsData;
};

const getPublicFacingPatients = (): PublicFacingPatient[] => {
  return patientsData.map(({ id, dateOfBirth, gender, occupation, name }) => ({
    id,
    dateOfBirth,
    gender,
    occupation,
    name,
  }));
};

const addPatient = () => {
  return null;
};

export default {
  getPatients,
  addPatient,
  getPublicFacingPatients,
};