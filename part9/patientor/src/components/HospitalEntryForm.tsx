import {
  Box,
  FormControl,
  Button,
  Collapse,
  TextField,
  Alert,
  Stack,
  FormLabel,
  AlertColor,
} from "@mui/material";
import React, { useState } from "react";
import { NewEntry, Entry } from "../types";
import patientsService from "../services/patients";
import axios from "axios";
import { ZodIssue } from "zod";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { CheckCircleOutline } from "@mui/icons-material";
import { Label } from "@mui/icons-material";

interface Props {
  updatePatient: (data: Entry) => void;
  patientId: string | undefined;
}

interface FormData {
  description: string;
  date: string;
  specialist: string;
  dischargeDate: string;
  dischargeCriteria: string;
}

const initialFormState = {
  description: "",
  date: "",
  specialist: "",
  dischargeDate: "",
  dischargeCriteria: "",
};

const HospitalEntryForm = ({ updatePatient, patientId }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean | undefined>(false);
  const [alertProps, setAlertProps] = useState<{
    severity: AlertColor | undefined;
    notification: string;
  }>();
  const [formData, setFormData] = useState<FormData>(initialFormState);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    console.log(`${id} : ${value}`);
    setFormData({
      ...formData,
      [id]: value,
    });

    console.log("formData ", formData);
  };

  let disabledAddButton: boolean =
    formData.description.length > 0 &&
    formData.date.length > 0 &&
    formData.specialist.length > 0 &&
    formData.dischargeCriteria.length > 0 &&
    formData.dischargeDate.length > 0;

  console.log("formData.description ", formData.description);
  console.log("formData.date ", formData.date);
  console.log("formData.specified", formData.specialist);
  console.log("formData.dischargeCriteria ", formData.dischargeCriteria);
  console.log("formData.dischargeDate ", formData.dischargeDate);

  console.log("disabledAddButton ", disabledAddButton);

  let timeoutId: number | undefined = undefined;
  const clearNotificationTimeout = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  };

  const addNewHospitalEntry = (event: React.SyntheticEvent) => {
    console.log("adding new hospital entry");
    event.preventDefault();

    const target = event.target as typeof event.target & {
      description: { value: string };
      date: { value: string };
      specialist: { value: string };
      dischargeDate: { value: string };
      dischargeCriteria: { value: string };
      diagnosisCodes: { value: string };
    };

    const description: string = target.description.value;
    const date: string = target.date.value;
    const specialist: string = target.specialist.value;
    const dischargeDate: string = target.dischargeDate.value;
    const dischargeCriteria: string = target.dischargeCriteria.value;

    const diagnosisCodes: string[] | undefined =
      target.diagnosisCodes.value.length > 0
        ? target.diagnosisCodes.value.split(",")
        : undefined;

    const newEntry: NewEntry = {
      type: "Hospital",
      description,
      date,
      specialist,
      discharge: { date: dischargeDate, criteria: dischargeCriteria },
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
          target.dischargeDate.value = "";
          target.dischargeCriteria.value = "";
          target.diagnosisCodes.value = "";

          disabledAddButton = false;

          clearNotificationTimeout();
          setAlertProps({
            severity: "success",
            notification: `Hospital entry added succesfully`,
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

              clearNotificationTimeout();
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
          Add Hospital entry
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
          <form onSubmit={addNewHospitalEntry}>
            <FormControl fullWidth margin="normal">
              <Box
                sx={{
                  fontWeight: "bold",
                }}
              >
                New Hospital entry
              </Box>
              <TextField
                id="description"
                label="Description"
                variant="standard"
                onChange={onChange}
              />
              <TextField
                id="date"
                label="Date"
                variant="standard"
                onChange={onChange}
              />
              <TextField
                id="specialist"
                label="Specialist"
                variant="standard"
                onChange={onChange}
              />
              <Box sx={{ p: 1 }}>
                <FormControl>
                  <FormLabel>Discharge</FormLabel>
                  <TextField
                    id="dischargeDate"
                    label="Date"
                    variant="standard"
                    onChange={onChange}
                  />
                  <TextField
                    id="dischargeCriteria"
                    label="Criteria"
                    variant="standard"
                    onChange={onChange}
                  />
                </FormControl>
              </Box>
              <TextField
                id="diagnosisCodes"
                label="Diagnosis codes"
                variant="standard"
              />
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

export default HospitalEntryForm;