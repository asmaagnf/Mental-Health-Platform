export interface SymptomData {
  nom: string;
  patientId: string;
  emoji?: string;
  entries: { date: string; intensite: number }[];
  id?: number;
}