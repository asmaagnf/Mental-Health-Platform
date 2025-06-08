import axios from 'axios';
import { useEffect, useState } from 'react';
import { getPatientIdFromToken } from '../utils/auth';

const API_URL = 'http://localhost:8050/api/health-tracking';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useHealthTrackingApi = () => {
  const [patientId, setPatientId] = useState<string | null>(null);

  useEffect(() => {
    const id = getPatientIdFromToken();
    setPatientId(id);
  }, []);

  const addSymptom = async (nom: string): Promise<any> => {
    if (!patientId) throw new Error("No patient ID found");
    const response = await apiClient.post('/symptoms', {
      patientId,
      symptomRequest: { nom },
    });
    return response.data;
  };

  const logSymptomObservation = async (nomSymptome: string, intensite: number): Promise<void> => {
    if (!patientId) throw new Error("No patient ID found");
    await apiClient.post('/symptoms/observation', {
      patientId,
      symptomObservationRequest: { nomSymptome, intensite },
    });
  };

  const getSymptomHistory = async (nomSymptome: string): Promise<any> => {
    if (!patientId) throw new Error("No patient ID found");
    const response = await apiClient.get(`/symptoms/patient/${patientId}/history/${nomSymptome}`);
    return response.data;
  };

  const addMoodEntry = async (moodValue: number, note: string): Promise<void> => {
    if (!patientId) throw new Error("No patient ID found");
    const today = new Date().toISOString().split('T')[0];
    const niveau = MOOD_LEVELS.find(m => m.value === moodValue)?.label ?? 'AVERAGE';
    await apiClient.post('/mood-entries', {
      patientId,
      moodEntryRequest: { date: today, niveau, note },
    });
  };

  const getMoodAverage = async (days = 7): Promise<number> => {
    if (!patientId) throw new Error("No patient ID found");
    const response = await apiClient.get(`/mood-entries/patient/${patientId}/average?lastDays=${days}`);
    return response.data.average;
  };

  const getAllMoodEntries = async (): Promise<any[]> => {
    if (!patientId) throw new Error("No patient ID found");
    const response = await apiClient.get(`/mood-entries/patient/${patientId}`);
    return response.data;
  };

  return {
    patientId,
    addSymptom,
    logSymptomObservation,
    getSymptomHistory,
    addMoodEntry,
    getMoodAverage,
    getAllMoodEntries,
  };
};