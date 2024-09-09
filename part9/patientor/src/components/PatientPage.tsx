import { Diagnosis, Gender, Patient } from "../types";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import patientService from "../services/patients";
import diagnosesService from "../services/diagnoses";

import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";

type PatientParams = {
  id: string;
};

const PatientPage = () => {
  const [data, setData] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const { id } = useParams<PatientParams>();

  //console.log("data ", data);
  useEffect(() => {
    //console.log("useEffect");
    const fetchPatient = async () => {
      //console.log("id ", id);
      const patient = await patientService.getPatient(id);
      setData(patient);

      const diagnosesData: Diagnosis[] = await diagnosesService.getAll();
      //console.log(diagnosesData);
      setDiagnoses(diagnosesData);
    };

    void fetchPatient();
  }, []);

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
        <h3>entries</h3>
        {data.entries.map((entry) => (
          <div>
            <div>
              {entry.date} <i>{entry.description}</i>
            </div>
            <ul>
              {entry.diagnosisCodes?.map((code) => (
                <li>
                  {code}{" "}
                  {diagnoses.map((diagnosis) => {
                    //console.log(code, " ", diagnosis.code);
                    if (code === diagnosis.code) return diagnosis.name;
                  })}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  } else {
    return <></>;
  }
};

export default PatientPage;