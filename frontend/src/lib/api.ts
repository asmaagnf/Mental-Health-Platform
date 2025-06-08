const API_BASE_URL = "http://localhost:8050/api/health-tracking";

// Types
export interface MoodEntry {
  id?: string;
  patientId: string;
  niveau: string; // e.g., "EXCELLENT", "GOOD", etc.
  note: string;
  date: string;
}

export interface SymptomEntry {
  id?: number;
  nom: string;
  patientId: string;
  emoji: string;
  entries: { date: string; severity: number }[];
}

export interface SymptomObservation {
  nomSymptome: string;
  intensite: number;
  date?: string; // optional
}

export interface SymptomHistory {
  nomSymptome: string;
  patientId: string;
  history: { date: string; intensite: number; timestamp: string }[];
  trend: number;
}

// API functions
export const api = {
  // Mood API
  async createMoodEntry(moodEntry: Omit<MoodEntry, "id">): Promise<MoodEntry> {
    const response = await fetch(`${API_BASE_URL}/mood-entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId: moodEntry.patientId,
        moodEntryRequest: {
          niveau: moodEntry.niveau,
          note: moodEntry.note,
          date: moodEntry.date,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create mood entry");
    }

    return response.json();
  },

  async getMoodEntries(patientId: string): Promise<MoodEntry[]> {
    const response = await fetch(`${API_BASE_URL}/mood-entries/patient/${patientId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch mood entries");
    }

    return response.json();
  },

  async getMoodAverage(patientId: string, lastDays = 7): Promise<number> {
    const response = await fetch(`${API_BASE_URL}/mood-entries/patient/${patientId}/average?lastDays=${lastDays}`);

    if (!response.ok) {
      throw new Error("Failed to fetch mood average");
    }

    return response.json();
  },

  // Symptoms API
  async addSymptom(patientId: string, symptomName: string): Promise<SymptomEntry> {
    const response = await fetch(`${API_BASE_URL}/symptoms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId,
        symptomRequest: {
          nom: symptomName,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add symptom");
    }

    return response.json();
  },

  async logSymptomObservation(patientId: string, observation: SymptomObservation): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/symptoms/observation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientId,
        symptomObservationRequest: {
          nomSymptome: observation.nomSymptome,
          intensite: observation.intensite,
          ...(observation.date && { date: observation.date }),
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to log symptom observation");
    }
  },

  async getSymptomHistory(patientId: string, symptomName: string, periodInDays = 7): Promise<SymptomHistory> {
    const response = await fetch(
      `${API_BASE_URL}/symptoms/patient/${patientId}/history/${encodeURIComponent(symptomName)}?periodInDays=${periodInDays}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch symptom history");
    }

    return response.json();
  },
  
};
export const getTrackedSymptoms = async (patientId: string) => {
  const response = await fetch(`http://localhost:8050/api/health-tracking/symptoms/patient/${patientId}`)
  if (!response.ok) throw new Error("Erreur lors de la récupération des symptômes suivis")
  return await response.json()
};
