import { Entry } from "../../types";
import HospitalEntry from "./HospitalEntry";
import OccupationalHealthcareEntry from "./OccupationalHealthcareEntry";
import HealthCheckEntry from "./HealthCheckEntry";

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  console.log(entry);

  switch (entry.type) {
    case "Hospital":
      return <HospitalEntry data={entry} />;
    case "OccupationalHealthcare":
      return <OccupationalHealthcareEntry data={entry} />;
    case "HealthCheck":
      return <HealthCheckEntry data={entry} />;
  }
};

export default EntryDetails;