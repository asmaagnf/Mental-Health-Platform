// Mood Levels
export const MOOD_LEVELS = [
  { value: 1, label: 'Very Low', color: 'bg-red-500', emoji: '😢', gradient: 'from-red-500 to-red-400' },
  { value: 2, label: 'Low', color: 'bg-orange-500', emoji: '😔', gradient: 'from-orange-500 to-orange-400' },
  { value: 3, label: 'Average', color: 'bg-yellow-500', emoji: '😐', gradient: 'from-yellow-500 to-yellow-400' },
  { value: 4, label: 'Good', color: 'bg-green-500', emoji: '😊', gradient: 'from-green-500 to-green-400' },
  { value: 5, label: 'Excellent', color: 'bg-teal-500', emoji: '😄', gradient: 'from-teal-500 to-teal-400' },
];

// Suggested Symptoms
export const SUGGESTED_SYMPTOMS = [
  { nom: 'Anxiety', emoji: '😥' },
  { nom: 'Insomnia', emoji: '😴' },
  { nom: 'Fatigue', emoji: '😴' },
  { nom: 'Headache', emoji: '🤕' },
  { nom: 'Stress', emoji: '😩' },
  { nom: 'Sadness', emoji: '😞' },
  { nom: 'Irritability', emoji: '😠' },
  { nom: 'Nausea', emoji: '🤢' },
  { nom: 'Dizziness', emoji: '💫' },
  { nom: 'Muscle Pain', emoji: '💪' },
  { nom: 'Stomach Ache', emoji: '😖' },
];

// Severity Labels
export const SYMPTOM_SEVERITY_LABELS = {
  1: 'Minimal',
  2: 'Mild',
  3: 'Moderate',
  4: 'Severe',
  5: 'Critical',
};