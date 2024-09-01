export interface Entry {
  weather: string;
  visibility: string;
  date: string;
  comment?: string;
  id: string;
}

export type NewEntry = Omit<Entry, "id">;