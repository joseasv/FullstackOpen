import axios from "axios";
import { createEntry } from "../services/entryService";
import { NewEntry } from "../types";
import { useState } from "react";
import { ZodError, ZodIssue } from "zod";

interface NewEntryFormProps {
  updateEntries: (data: NewEntry) => void;
}

const NewEntryForm = ({ updateEntries }: NewEntryFormProps) => {
  const [notification, setNotification] = useState("");
  let timeoutId: number | undefined = undefined;
  const clearNotificationTimeout = () => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  };

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      date: { value: string };
      visibility: { value: string };
      weather: { value: string };
      comment: { value: string };
    };

    const date: string = target.date.value;
    const visibility: string = target.visibility.value;
    const weather: string = target.weather.value;
    const comment: string = target.comment.value;

    const newEntry: NewEntry = { date, visibility, weather, comment };

    createEntry(newEntry)
      .then((data) => {
        updateEntries(data);

        target.date.value = "";
        target.visibility.value = "";
        target.weather.value = "";
        target.comment.value = "";

        setNotification("");
        clearNotificationTimeout();
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
          const zodError = error.response?.data.error as ZodError;
          const firstError: ZodIssue = zodError.issues[0];
          console.log(firstError);

          if (firstError) {
            const fieldName: string = firstError.path[0] as string;
            const splittedMessage: string[] = firstError.message.split("'");
            const fieldValue: string =
              splittedMessage[splittedMessage.length - 2];

            console.log(fieldName);
            console.log(fieldValue);

            clearNotificationTimeout();
            setNotification(`Error: Invalid ${fieldName} value: ${fieldValue}`);
            timeoutId = setTimeout(() => {
              setNotification("");
            }, 3000);
          }
        }
      });
  };

  return (
    <div>
      <h3>Add new entry</h3>
      <div className="alert">{notification}</div>
      <form onSubmit={addEntry}>
        <div>
          date: <input type="date" name="date" />
        </div>
        <div>
          <span>visibility: </span>
          great
          <input type="radio" name="visibility" value="great" />
          good
          <input type="radio" name="visibility" value="good" />
          ok
          <input type="radio" name="visibility" value="ok" />
          poor
          <input type="radio" name="visibility" value="poor" />
        </div>
        <div>
          <span>weather: </span>
          sunny
          <input type="radio" name="weather" value="sunny" />
          rainy
          <input type="radio" name="weather" value="rainy" />
          cloudy
          <input type="radio" name="weather" value="cloudy" />
          stormy
          <input type="radio" name="weather" value="stormy" />
          windy
          <input type="radio" name="weather" value="windy" />
        </div>
        <div>
          comment: <input name="comment" />
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </div>
  );
};

export default NewEntryForm;