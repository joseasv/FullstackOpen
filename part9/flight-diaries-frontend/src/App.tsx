import { useState, useEffect } from "react";
import "./App.css";
import DiaryEntries from "./components/DiaryEntries";
import { getAllEntries } from "./services/entryService";
import NewEntryForm from "./components/NewEntryForm";

import { Entry } from "./types";

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    getAllEntries().then((data) => setEntries(data));
  }, []);

  const addEntryToState = (entry: Entry) => {
    setEntries(entries.concat(entry));
  };

  return (
    <>
      <NewEntryForm updateEntries={addEntryToState} />
      <DiaryEntries entries={entries} />
    </>
  );
}

export default App;
