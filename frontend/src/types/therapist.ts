export interface Therapist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  education: string;
  licenseNumber: string;
  bio: string;
  profileImage: string;
  certificates: Certificate[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  location: string;
  languages: string[];
  consultationFee: number;
}

export interface Certificate {
  id: string;
  name: string;
  institution: string;
  year: number;
  imageUrl: string;
  type: 'diploma' | 'certificate' | 'license';
}

export interface AdminAction {
  therapistId: string;
  action: 'approve' | 'reject';
  reason?: string;
}