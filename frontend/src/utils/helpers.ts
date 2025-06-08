import { SymptomData } from '../types/symptom.types';

export const calculateIntensityTrend = (entries: { date: string; intensite: number }[]) => {
  const relevantEntries = entries.slice(Math.max(0, entries.length - 7));
  if (relevantEntries.length < 2) return { status: 'stable', change: 0, percentageChange: 0 };

  const recent = relevantEntries.slice(-3);
  const averageRecent = recent.reduce((sum, entry) => sum + entry.intensite, 0) / recent.length;

  const previousEntries = relevantEntries.slice(0, Math.max(0, relevantEntries.length - 3));
  const averagePrevious = previousEntries.length > 0
    ? previousEntries.reduce((sum, entry) => sum + entry.intensite, 0) / previousEntries.length
    : averageRecent;

  const change = averageRecent - averagePrevious;
  const percentageChange = previousEntries.length > 0 && averagePrevious !== 0 
    ? (change / averagePrevious) * 100 
    : 0;

  let status: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (change > 0.5) status = 'increasing';
  if (change < -0.5) status = 'decreasing';

  return { status, change, percentageChange: Math.abs(percentageChange) };
};

export const calculateOverallSymptomTrend = (symptoms: SymptomData[]) => {
  if (symptoms.length === 0) {
    return { trend: 'stable', percentage: 0, symptomName: 'No symptoms yet' };
  }

  let totalChange = 0;
  let mostSignificantSymptom: SymptomData | null = null;
  let maxChange = 0;

  symptoms.forEach(symptom => {
    const { status, change, percentageChange } = calculateIntensityTrend(symptom.entries);
    totalChange += change;
    if (Math.abs(change) > Math.abs(maxChange)) {
      maxChange = change;
      mostSignificantSymptom = symptom;
    }
  });

  const averageChange = totalChange / symptoms.length;
  const overallPercentage = Math.abs(averageChange * 10);

  let trendStatus: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (averageChange > 0.1) trendStatus = 'increasing';
  else if (averageChange < -0.1) trendStatus = 'decreasing';

  return {
    trend: trendStatus,
    percentage: Math.round(overallPercentage),
    symptomName: mostSignificantSymptom ? mostSignificantSymptom.nom : 'Symptoms overall'
  };
};