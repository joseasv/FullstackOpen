import {
  Box,
  FormControl,
  Button,
  Collapse,
  TextField,
  Alert,
  Select,
  Stack,
  InputLabel,
  AlertColor,
  FormControlClasses,
  SelectChangeEvent,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { NewEntry, Entry, Diagnosis, HealthCheckRating } from "../types";
import patientsService from "../services/patients";
import axios from "axios";
import { ZodIssue } from "zod";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { CheckCircleOutline } from "@mui/icons-material";
import MenuItem from "@mui/material/MenuItem";
import diagnosesService from "../services/diagnoses";

interface Props {
  updatePatient: (data: Entry) => void;
  patientId: string | undefined;
}

interface IFormData {
  description: string;
  date: string;
  specialist: string;
  healthCheckRating: string;
  diagnosisCodes: string[];
}

const initialFormState = {
  description: "",
  date: "",
  specialist: "",
  healthCheckRating: "",
  diagnosisCodes: [],
};

const HealthCheckEntryForm = ({ updatePatient, patientId }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean | undefined>(false);
  const [diagnosesFromServer, setDiagnosesFromServer] = useState<Diagnosis[]>(
    [],
  );
  const [alertProps, setAlertProps] = useState<{
    severity: AlertColor | undefined;
    notification: string;
  }>();
  const [formData, setFormData] = useState<IFormData>(initialFormState);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      const diagnosesData: Diagnosis[] = await diagnosesService.getAll();

      setDiagnosesFromServer(diagnosesData);
    };

    fetchDiagnoses();
  }, []);

  const updateFormData = (id: string, value: string | string[]) => {
    console.log(`${id} : ${value}`);
    if (id !== undefined) {
      setFormData({
        ...formData,
        [id]: value,
      });

      console.log("formData ", formData);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let { id, value } = event.target;

    console.log(`${id} : ${value}`);
    updateFormData(id, value);
  };

  const onChangeHealthcheckRating = (event: SelectChangeEvent) => {
    let { value } = event.target;
    console.log("onChangeHealthcheckRating ", value);
    updateFormData("healthCheckRating", value);
  };

  const onChangeDiagnosisCodes = (event: SelectChangeEvent) => {
    let { value } = event.target;
    console.log("onChangeDiagnosisCodes ", value);

    updateFormData("diagnosisCodes", value);
  };

  //const onChangeSelect= (event: React.ChangeEventHandler<HTMLSelectElement>)

  let disabledAddButton: boolean =
    formData.description.length > 0 &&
    formData.date.length > 0 &&
    formData.specialist.length > 0 &&
    formData.healthCheckRating.length > 0;

  console.log(
    "formData.description ",
    formData.description,
    formData.description.length > 0,
  );

  console.log("disabledAddButton ", disabledAddButton);

  let timeoutId: number | undefined = undefined;
  const clearNotificationTimeout = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  };

  const addNewHealthCheckEntry = (event: React.SyntheticEvent) => {
    console.log("adding new healthcheck entry");
    console.log(event);
    console.log(formData);

    event.preventDefault();

    const target = event.target as typeof event.target & {
      description: { value: string };
      date: { value: string };
      specialist: { value: string };
      healthCheckRating: { value: string };
      diagnosisCodes: { value: string };
    };

    console.log(target.diagnosisCodes.value);

    const description: string = target.description.value;
    const date: string = target.date.value;
    const specialist: string = target.specialist.value;
    const healthCheckRating: number = Number(target.healthCheckRating.value);

    const diagnosisCodes: string[] | undefined =
      target.diagnosisCodes.value.length > 0
        ? target.diagnosisCodes.value.split(",")
        : undefined;

    const newEntry: NewEntry = {
      type: "HealthCheck",
      description,
      date,
      specialist,
      healthCheckRating,
      diagnosisCodes,
    };

    console.log("adding ", newEntry);

    if (patientId) {
      patientsService
        .addEntry(patientId, newEntry)
        .then((data: Entry) => {
          updatePatient(data);

          target.description.value = "";
          target.date.value = "";
          target.specialist.value = "";
          target.healthCheckRating.value = "";
          target.diagnosisCodes.value = "";

          disabledAddButton = false;

          setFormData(initialFormState);

          clearNotificationTimeout();
          setAlertProps({
            severity: "success",
            notification: `HealthCheck entry added succesfully`,
          });
          timeoutId = setTimeout(() => {
            setAlertProps(undefined);
          }, 3000);
        })
        .catch((error) => {
          if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
            const firstError: ZodIssue = error.response?.data
              .error[0] as ZodIssue;

            console.log("firstError ");
            console.log(firstError);

            if (firstError) {
              const fieldName: string = firstError.path[0] as string;
              const splittedMessage: string[] = firstError.message.split("'");
              const fieldValue: string =
                splittedMessage[splittedMessage.length - 2];

              console.log(fieldName);
              console.log(fieldValue);

              setAlertProps({
                severity: "error",
                notification: `Error: Invalid ${fieldName} value: ${fieldValue}`,
              });

              timeoutId = setTimeout(() => {
                setAlertProps(undefined);
              }, 3000);
            }
          }
        });
    }
  };

  return (
    <div>
      <Collapse in={!isOpen} unmountOnExit timeout="auto">
        <Button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          Add HealthCheck entry
        </Button>
      </Collapse>
      {alertProps && (
        <Alert
          iconMapping={{
            success: <CheckCircleOutline fontSize="inherit" />,
            error: <ErrorOutlineIcon fontSize="inherit" />,
          }}
          severity={alertProps.severity}
        >
          {alertProps.notification}
        </Alert>
      )}

      <Collapse in={isOpen} unmountOnExit timeout="auto">
        <Box sx={{ p: 2, border: "1px dashed black" }}>
          <form onSubmit={addNewHealthCheckEntry}>
            <FormControl fullWidth margin="normal">
              <Box
                sx={{
                  fontWeight: "bold",
                }}
              >
                New HealthCheck entry
              </Box>
              <TextField
                id="description"
                label="Description"
                required
                variant="standard"
                onChange={onChange}
              />
              <TextField
                id="date"
                label="Date"
                required
                type="date"
                variant="standard"
                onChange={onChange}
              />
              <TextField
                id="specialist"
                label="Specialist"
                required
                variant="standard"
                onChange={onChange}
              />
              <FormControl sx={{ m: 2 }}>
                <InputLabel required id="healthCheckRating-label">
                  HealthCheck Rating
                </InputLabel>
                <Select
                  labelId="healthCheckRating-label"
                  id="healthCheckRating"
                  name="healthCheckRating"
                  value={formData.healthCheckRating}
                  label="HealthCheck Rating"
                  onChange={onChangeHealthcheckRating}
                >
                  <MenuItem key={0} value={"0"}>
                    Healthy{" "}
                  </MenuItem>
                  <MenuItem key={1} value={"1"}>
                    LowRisk{" "}
                  </MenuItem>
                  <MenuItem key={2} value={"2"}>
                    HighRisk{" "}
                  </MenuItem>
                  <MenuItem key={3} value={"3"}>
                    CriticalRisk{" "}
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ m: 2 }}>
                <InputLabel id="diagnosisCodes-label">
                  Diagnosis codes
                </InputLabel>
                <Select
                  labelId="diagnosisCodes-label"
                  id="diagnosisCodes"
                  name="diagnosisCodes"
                  multiple
                  value={formData.diagnosisCodes}
                  label="Diagnosis codes"
                  onChange={onChangeDiagnosisCodes}
                >
                  {diagnosesFromServer.map((diagnosis) => (
                    <MenuItem key={diagnosis.code} value={diagnosis.code}>
                      {diagnosis.code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FormControl>
            <Stack
              direction="row"
              sx={{
                justifyContent: "space-between",
              }}
            >
              <Button
                sx={{ float: "left" }}
                variant="contained"
                color="error"
                onClick={() => {
                  setIsOpen(false);
                  setFormData(initialFormState);
                }}
              >
                Cancel
              </Button>
              <Button
                sx={{ float: "right" }}
                variant="contained"
                type="submit"
                disabled={!disabledAddButton}
              >
                Add
              </Button>
            </Stack>
          </form>
        </Box>
      </Collapse>
    </div>
  );
};

export default HealthCheckEntryForm;