import { HealthCheck } from "../../types";
import DiagnosesEntryData from "./DiagnosesEntryData";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { HealthCheckRating } from "../../types";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { Box } from "@mui/material";

interface Props {
  data: HealthCheck;
}

const HealthCheckEntry = ({ data }: Props) => {
  return (
    <Box sx={{ p: 2, border: 1, borderRadius: 1, margin: 1 }}>
      <div>
        {data.date} <MedicalServicesIcon />
      </div>
      <div>
        <i>{data.description}</i>
      </div>
      <div>
        {data.healthCheckRating === HealthCheckRating.Healthy && (
          <FavoriteIcon sx={{ color: "green" }} />
        )}
        {data.healthCheckRating === HealthCheckRating.LowRisk && (
          <FavoriteIcon sx={{ color: "yellow" }} />
        )}
        {data.healthCheckRating === HealthCheckRating.HighRisk && (
          <FavoriteIcon sx={{ color: "orange" }} />
        )}
        {data.healthCheckRating === HealthCheckRating.CriticalRisk && (
          <FavoriteIcon sx={{ color: "red" }} />
        )}
      </div>
      {data.diagnosisCodes && (
        <DiagnosesEntryData diagnosisCodes={data.diagnosisCodes} />
      )}
      <div>diagnose by {data.specialist}</div>
    </Box>
  );
};

export default HealthCheckEntry;