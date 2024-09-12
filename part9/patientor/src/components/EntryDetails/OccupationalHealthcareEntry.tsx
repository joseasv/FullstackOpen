import { OccupationalHealthcare } from "../../types";
import DiagnosesEntryData from "./DiagnosesEntryData";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import { Box } from "@mui/material";

interface Props {
  data: OccupationalHealthcare;
}

const OccupationalHealthcareEntry = ({ data }: Props) => {
  return (
    <Box sx={{ p: 2, border: 1, borderRadius: 1, margin: 1 }}>
      <div>
        {data.date} <MedicalInformationIcon />
      </div>
      <div>
        <i>{data.description}</i>
      </div>
      {data.sickLeave && (
        <Box sx={{ marginTop: 1 }}>
          <div>
            <b>Sick leave</b>
          </div>
          <div>Start: {data.sickLeave.startDate}</div>
          <div>End: {data.sickLeave.endDate}</div>
        </Box>
      )}

      <DiagnosesEntryData diagnosisCodes={data.diagnosisCodes} />
      <div>diagnose by {data.specialist}</div>
    </Box>
  );
};

export default OccupationalHealthcareEntry;