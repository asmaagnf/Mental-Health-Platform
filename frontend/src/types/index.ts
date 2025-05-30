// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'patient' | 'therapist';
  profileImage?: string;
  createdAt: string;
}

export interface TherapistProfile extends User {
  specialty: string;
  education: string;
  experience: string;
  bio: string;
  location: string;
  price: string;
  rating: number;
  reviews: number;
  availability: Availability[];
}

export interface PatientProfile extends User {
  dateOfBirth?: string;
  emergencyContact?: string;
  medicalHistory?: string;
}

// Session Types
export interface Appointment {
  id: string;
  therapistId: string;
  patientId: string;
  date: string;
  time: string;
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed';
  type: 'video' | 'in-person';
  notes?: string;
}

export interface Availability {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
}

// Health Tracking Types
export interface MoodEntry {
  id: string;
  userId: string;
  date: string;
  value: number; // 1-5
  note?: string;
}

export interface SymptomEntry {
  id: string;
  userId: string;
  symptomId: string;
  date: string;
  severity: number; // 1-5
  note?: string;
}

export interface Symptom {
  id: string;
  name: string;
  description?: string;
}

// Payment Types
export interface Payment {
  id: string;
  appointmentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  userId: string;
  items: InvoiceItem[];
  total: number;
  status: 'unpaid' | 'paid' | 'cancelled';
  dueDate: string;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}