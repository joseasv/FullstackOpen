import { Hospital } from "../../types";
import DiagnosesEntryData from "./DiagnosesEntryData";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import { Box } from "@mui/material";

interface Props {
  data: Hospital;
}

const HospitalEntry = ({ data }: Props) => {
  return (
    <Box sx={{ p: 2, border: 1, borderRadius: 1, margin: 1 }}>
      <div>
        {data.date} <LocalHospitalIcon />
      </div>
      <div>
        <i>{data.description}</i>
      </div>
      <div>
        <Box sx={{ p: 1 }}>
          <div>
            <b>Discharge</b>
          </div>
          <div>
            {data.discharge.date} {data.discharge.criteria}
          </div>
        </Box>
      </div>
      {data.diagnosisCodes && (
        <DiagnosesEntryData diagnosisCodes={data.diagnosisCodes} />
      )}
      <div>diagnose by {data.specialist}</div>
    </Box>
  );
};

export default HospitalEntry;