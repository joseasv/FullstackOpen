import { Gender, Patient } from "../types";
import { useParams } from "react-router-dom";
import { Component, useEffect, useState } from "react";
import patientService from "../services/patients";

import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import TransgenderIcon from "@mui/icons-material/Transgender";
import { SvgIconClasses } from "@mui/material";

type PatientParams = {
  id: string;
};

const PatientPage = () => {
  const [data, setData] = useState<Patient>();

  const { id } = useParams<PatientParams>();

  console.log("data ", data);
  useEffect(() => {
    console.log("useEffect");
    const fetchPatient = async () => {
      console.log("id ", id);
      const patient = await patientService.getPatient(id);
      setData(patient);
    };

    void fetchPatient();
  }, []);

  if (data) {
    const genderIcon =
      data.gender === Gender.Other
        ? TransgenderIcon
        : data.gender === Gender.Female
          ? FemaleIcon
          : MaleIcon;

    return (
      <div>
        <h3>
          {data.name} {data.gender === Gender.Male && <MaleIcon />}
          {data.gender === Gender.Female && <FemaleIcon />}
          {data.gender === Gender.Other && <TransgenderIcon />}
        </h3>

        <div>ssn: {data.ssn}</div>
        <div>occupation: {data.occupation}</div>
      </div>
    );
  } else {
    return <></>;
  }
};

export default PatientPage;