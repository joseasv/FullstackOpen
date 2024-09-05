import patientsData from "../../data/patients";
import { PublicFacingPatient, Patient, NewPatient } from "../types";
import { v1 as uuid } from "uuid";

const getPatient = (id: string): Patient | undefined => {
  const patientFound: Patient | undefined = patientsData.find(
    (patient) => patient.id === id,
  );

  console.log(patientFound);
  return patientFound;
};

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

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };

  patientsData.push(newPatient);

  return newPatient;
};

export default {
  getPatients,
  addPatient,
  getPublicFacingPatients,
  getPatient,
};