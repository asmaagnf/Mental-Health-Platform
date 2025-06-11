// Entity types based on the provided schema
export type UserRole = 'PATIENT' | 'THERAPIST' | 'ADMIN';
export type Gender = 'HOMME' | 'FEMME';
export type TherapistStatus = 'VALIDE' | 'EN_ATTENTE' | 'REJETE';
export type SessionType = 'PRÉSENTIEL' | 'EN_LIGNE';
export type SessionStatus = 'PLANIFIÉE' | 'TERMINÉE' | 'ANNULÉE';
export type PaymentStatus = 'RÉUSSI' | 'ÉCHOUÉ' | 'EN_ATTENTE';
export type NotificationStatus = 'ENVOYÉ' | 'NON_ENVOYÉ' | 'LU';

export interface User {
  id: string;
  nom: string;
  email: string;
  numeroTelephone?: string;
  dateNaissance: Date;
  adresse?: string;
  genre: Gender;
  role: UserRole;
  photoProfilUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TherapistProfile {
  id: string;
  utilisateurId: string;
  specialites: string[];
  languesParlees: string[];
  localisation?: string;
  certifications?: string[];
  anneesExperience: number;
  statut: TherapistStatus;
  prixParHeure?: number;
  createdAt: Date;
  validatedAt?: Date;
}

export interface Session {
  seanceId: string;
  therapeuteId: string;
  patientId: string;
  dateHeure: Date;
  typeSeance: SessionType;
  statutSeance: SessionStatus;
  lienVisio?: string;
  urlEnregistrement?: string;
  dureeMinutes: number;
  noteTherapeute?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  id: string;
  seanceId: string;
  patientId: string;
  therapeuteId: string;
  note: number; // 1-5
  commentaire?: string;
  dateEnvoi: Date;
}

export interface Payment {
  id: string;
  patientId: string;
  therapeuteId: string;
  seanceId: string;
  montant: number;
  statutPaiement: PaymentStatus;
  transactionId: string;
  datePaiement: Date;
}