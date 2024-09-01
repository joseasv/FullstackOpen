import { createEntry } from "../services/entryService";
import { Entry, NewEntry } from "../types";

interface NewEntryFormProps {
  updateEntries: Function;
}

const NewEntryForm = ({ updateEntries }: NewEntryFormProps) => {
  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();

    const date: string = event.target.date.value;
    const visibility: string = event.target.visibility.value;
    const weather: string = event.target.weather.value;
    const comment: string = event.target.comment.value;

    const newEntry: NewEntry = { date, visibility, weather, comment };

    createEntry(newEntry).then((data) => updateEntries(data));

    event.target.date.value = "";
    event.target.visibility.value = "";
    event.target.weather.value = "";
    event.target.comment.value = "";
  };

  return (
    <div>
      <h3>Add new entry</h3>
      <form onSubmit={addEntry}>
        <div>
          date: <input name="date" />
        </div>
        <div>
          visibility: <input name="visibility" />
        </div>
        <div>
          weather: <input name="weather" />
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