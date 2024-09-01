import { Entry } from "../types";
import DiaryEntry from "./DiaryEntry";

interface DiaryEntriesProps {
  entries: Entry[];
}

const DiaryEntries = ({ entries }: DiaryEntriesProps) => {
  return (
    <div>
      <h3>Diary entries</h3>
      {entries.map((entry) => (
        <DiaryEntry key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default DiaryEntries;