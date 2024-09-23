import { Entry, Gender, Patient } from "../types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import patientService from "../services/patients";
import EntryDetails from "./EntryDetails";
import HealthCheckEntryForm from "./HealthCheckEntryForm";

import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import HospitalEntryForm from "./HospitalEntryForm";
import OccupationalHealthcareEntryForm from "./OccupationalHealthcareEntryForm";

type PatientParams = {
  id: string;
};

const PatientPage = () => {
  const [data, setData] = useState<Patient>();

  const { id } = useParams<PatientParams>();

  console.log("data ", data);
  useEffect(() => {
    //console.log("useEffect");
    const fetchPatient = async () => {
      //console.log("id ", id);
      const patient = await patientService.getPatient(id);
      setData(patient);
    };

    void fetchPatient();
  });

  const updatePatient = (newEntry: Entry) => {
    if (data !== undefined) {
      const newEntries = data?.entries.concat(newEntry);

      setData({
        ...data,
        entries: newEntries,
      });
    }
  };

  if (data) {
    return (
      <div>
        <h2>
          {data.name} {data.gender === Gender.Male && <MaleIcon />}
          {data.gender === Gender.Female && <FemaleIcon />}
          {data.gender === Gender.Other && <TransgenderIcon />}
        </h2>

        <div>ssn: {data.ssn}</div>
        <div>occupation: {data.occupation}</div>
        <HealthCheckEntryForm updatePatient={updatePatient} patientId={id} />
        <HospitalEntryForm updatePatient={updatePatient} patientId={id} />
        <OccupationalHealthcareEntryForm
          updatePatient={updatePatient}
          patientId={id}
        />
        <h3>entries</h3>
        {data.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} />
        ))}
      </div>
    );
  } else {
    return <></>;
  }
};

export default PatientPage;