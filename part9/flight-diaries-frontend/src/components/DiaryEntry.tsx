import { Entry } from "../types";

interface DiaryEntryProps {
  entry: Entry;
}

const DiaryEntry = ({ entry }: DiaryEntryProps) => {
  return (
    <div>
      <h3>{entry.date}</h3>
      <div>visibility: {entry.visibility}</div>
      <div>weather: {entry.weather}</div>
    </div>
  );
};

export default DiaryEntry;