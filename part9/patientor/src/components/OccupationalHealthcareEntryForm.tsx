import {
  Box,
  FormControl,
  Button,
  Collapse,
  TextField,
  Alert,
  Stack,
  InputLabel,
  FormLabel,
  AlertColor,
  SelectChangeEvent,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { NewEntry, Entry, Diagnosis } from "../types";
import patientsService from "../services/patients";
import axios from "axios";
import { ZodIssue } from "zod";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { CheckCircleOutline } from "@mui/icons-material";
import diagnosesService from "../services/diagnoses";

interface Props {
  updatePatient: (data: Entry) => void;
  patientId: string | undefined;
}

interface IFormData {
  description: string;
  date: string;
  specialist: string;
  startDate: string;
  endDate: string;
  employerName: string;
  diagnosisCodes: string[];
}

const initialFormState = {
  description: "",
  date: "",
  specialist: "",
  startDate: "",
  endDate: "",
  employerName: "",
  diagnosisCodes: [],
};

const OccupationalHealthcareEntryForm = ({
  updatePatient,
  patientId,
}: Props) => {
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
    const { id, value } = event.target;

    updateFormData(id, value);
  };

  const onChangeDiagnosisCodes = (event: SelectChangeEvent) => {
    const { value, name } = event.target;
    console.log("onChangeDiagnosisCodes name", name);
    console.log("onChangeDiagnosisCodes ", value);

    updateFormData(name, value);
  };

  let disabledAddButton: boolean =
    formData.description.length > 0 &&
    formData.date.length > 0 &&
    formData.employerName.length > 0 &&
    formData.specialist.length > 0;

  console.log("formData.description ", formData.description);
  console.log("formData.date ", formData.date);
  console.log("formData.specialist", formData.specialist);
  console.log("formData.employerName", formData.employerName);
  console.log("formData.startDate ", formData.startDate);
  console.log("formData.endDate ", formData.endDate);

  console.log("disabledAddButton ", disabledAddButton);

  let timeoutId: number | undefined = undefined;
  const clearNotificationTimeout = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  };

  const addNewOccupationalHealthcareEntry = (event: React.SyntheticEvent) => {
    console.log("adding new hospital entry");
    event.preventDefault();

    const target = event.target as typeof event.target & {
      description: { value: string };
      date: { value: string };
      specialist: { value: string };
      employerName: { value: string };
      startDate: { value: string };
      endDate: { value: string };
      diagnosisCodes: { value: string };
    };

    const description: string = target.description.value;
    const date: string = target.date.value;
    const specialist: string = target.specialist.value;
    const employerName: string = target.employerName.value;
    const startDate: string = target.startDate.value;
    const endDate: string = target.endDate.value;

    const diagnosisCodes: string[] | undefined =
      target.diagnosisCodes.value.length > 0
        ? target.diagnosisCodes.value.split(",")
        : undefined;

    const newEntry: NewEntry = {
      type: "OccupationalHealthcare",
      description,
      date,
      specialist,
      employerName,
      diagnosisCodes,
    };

    if (startDate.length > 0 && endDate.length > 0) {
      newEntry.sickLeave = {
        startDate,
        endDate,
      };
    }

    console.log("adding ", newEntry);

    if (patientId) {
      patientsService
        .addEntry(patientId, newEntry)
        .then((data: Entry) => {
          updatePatient(data);

          target.description.value = "";
          target.date.value = "";
          target.specialist.value = "";
          target.employerName.value = "";
          target.startDate.value = "";
          target.endDate.value = "";
          target.diagnosisCodes.value = "";

          disabledAddButton = false;

          setFormData(initialFormState);

          clearNotificationTimeout();
          setAlertProps({
            severity: "success",
            notification: `OccupationalHealthcare entry added succesfully`,
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
          Add Occupational Healthcare entry
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
          <form onSubmit={addNewOccupationalHealthcareEntry}>
            <FormControl fullWidth margin="normal">
              <Box
                sx={{
                  fontWeight: "bold",
                }}
              >
                New Occupational Healthcare entry
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
                type="date"
                required
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
              <TextField
                id="employerName"
                label="Employer's name"
                required
                variant="standard"
                onChange={onChange}
              />
              <Box sx={{ p: 1 }}>
                <FormControl>
                  <FormLabel>Sickleave</FormLabel>
                  <TextField
                    id="startDate"
                    label="start"
                    type="date"
                    variant="standard"
                    onChange={onChange}
                  />
                  <TextField
                    id="endDate"
                    label="end"
                    type="date"
                    variant="standard"
                    onChange={onChange}
                  />
                </FormControl>
              </Box>
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

export default OccupationalHealthcareEntryForm;