import { useEffect, useState } from "react";
import { Diagnosis } from "../../types";
import diagnosesService from "../../services/diagnoses";

interface Props {
  diagnosisCodes: string[] | undefined;
}

const DiagnosesEntryData = ({ diagnosisCodes }: Props) => {
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnosesData: Diagnosis[] = await diagnosesService.getAll();
      //console.log(diagnosesData);
      setDiagnoses(diagnosesData);
    };

    fetchDiagnoses();
  }, []);


    return (
      <div>
        <ul>
          {diagnosisCodes?.map((code) => (
            <li key={code}>
              {code}{" "}
              {diagnoses.map((diagnosis) => {
                if (diagnosis.code === code) {
                  return diagnosis.name;
                }
              })}
            </li>
          ))}
        </ul>
      </div>
    );

};

export default DiagnosesEntryData;