import { User, Session, TherapistProfile, UserRole, SessionType, SessionStatus } from '../types/entities';

// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    nom: 'Dr. Sarah Martin',
    email: 'sarah.martin@therapie.fr',
    numeroTelephone: '+33 6 12 34 56 78',
    dateNaissance: new Date('1985-03-15'),
    adresse: '15 Rue de la Paix, 75001 Paris',
    genre: 'FEMME',
    role: 'THERAPEUTE',
    photoProfilUrl: 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    nom: 'Marie Dubois',
    email: 'marie.dubois@email.fr',
    numeroTelephone: '+33 6 87 65 43 21',
    dateNaissance: new Date('1990-07-22'),
    adresse: '42 Avenue des Champs, 75008 Paris',
    genre: 'FEMME',
    role: 'PATIENT',
    photoProfilUrl: 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '3',
    nom: 'Jean Michel',
    email: 'jean.michel@email.fr',
    numeroTelephone: '+33 6 98 76 54 32',
    dateNaissance: new Date('1987-11-08'),
    adresse: '23 Rue Victor Hugo, 69001 Lyon',
    genre: 'HOMME',
    role: 'PATIENT',
    photoProfilUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2024-01-05')
  }
];

// Mock therapist profiles
export const mockTherapistProfiles: TherapistProfile[] = [
  {
    id: '1',
    utilisateurId: '1',
    specialites: ['Psychologie Clinique', 'Thérapie Cognitive', 'Gestion du Stress'],
    languesParlees: ['Français', 'Anglais', 'Espagnol'],
    localisation: 'Paris, France',
    certifications: ['Diplôme de Psychologie Clinique', 'Certification TCC'],
    anneesExperience: 8,
    statut: 'VALIDE',
    prixParHeure: 85,
    createdAt: new Date('2023-01-15'),
    validatedAt: new Date('2023-01-20')
  }
];

// Mock sessions
export const mockSessions: Session[] = [
  {
    seanceId: '1',
    therapeuteId: '1',
    patientId: '2',
    dateHeure: new Date('2024-01-15T14:00:00'),
    typeSeance: 'EN_LIGNE',
    statutSeance: 'TERMINÉE',
    lienVisio: 'https://meet.jit.si/therapy-session-abc123',
    dureeMinutes: 60,
    noteTherapeute: 'Patient showed significant improvement in managing anxiety. Discussed coping strategies and assigned breathing exercises for homework. Good progress with cognitive restructuring techniques.',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15')
  },
  {
    seanceId: '2',
    therapeuteId: '1',
    patientId: '2',
    dateHeure: new Date('2024-01-22T15:30:00'),
    typeSeance: 'PRÉSENTIEL',
    statutSeance: 'TERMINÉE',
    dureeMinutes: 45,
    noteTherapeute: 'Worked on exposure therapy techniques. Patient expressed concerns about upcoming work presentation. Practiced relaxation techniques and role-playing scenarios.',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-22')
  },
  {
    seanceId: '3',
    therapeuteId: '1',
    patientId: '3',
    dateHeure: new Date('2024-01-20T10:00:00'),
    typeSeance: 'EN_LIGNE',
    statutSeance: 'TERMINÉE',
    lienVisio: 'https://meet.jit.si/therapy-session-def456',
    dureeMinutes: 60,
    noteTherapeute: 'First session with patient. Established rapport and conducted initial assessment. Patient presents with mild depression and work-related stress. Scheduled follow-up sessions.',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20')
  },
  {
    seanceId: '4',
    therapeuteId: '1',
    patientId: '2',
    dateHeure: new Date('2024-01-30T14:00:00'),
    typeSeance: 'EN_LIGNE',
    statutSeance: 'PLANIFIÉE',
    lienVisio: 'https://meet.jit.si/therapy-session-ghi789',
    dureeMinutes: 60,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25')
  },
  {
    seanceId: '5',
    therapeuteId: '1',
    patientId: '3',
    dateHeure: new Date('2024-02-02T16:00:00'),
    typeSeance: 'PRÉSENTIEL',
    statutSeance: 'PLANIFIÉE',
    dureeMinutes: 45,
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-26')
  },
  {
    seanceId: '6',
    therapeuteId: '1',
    patientId: '2',
    dateHeure: new Date('2024-01-29T11:00:00'),
    typeSeance: 'EN_LIGNE',
    statutSeance: 'PLANIFIÉE',
    lienVisio: 'https://meet.jit.si/therapy-session-live-now',
    dureeMinutes: 60,
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24')
  }
];

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getSessionsByTherapist = (therapeutId: string): Session[] => {
  return mockSessions.filter(session => session.therapeuteId === therapeutId);
};

export const getSessionsByPatient = (patientId: string): Session[] => {
  return mockSessions.filter(session => session.patientId === patientId);
};

export const getUpcomingSessions = (userId: string, role: UserRole): Session[] => {
  const now = new Date();
  return mockSessions.filter(session => {
    const isUpcoming = session.dateHeure > now && session.statutSeance === 'PLANIFIÉE';
    if (role === 'THERAPEUTE') {
      return isUpcoming && session.therapeuteId === userId;
    } else {
      return isUpcoming && session.patientId === userId;
    }
  });
};

export const getCurrentLiveSession = (userId: string, role: UserRole): Session | undefined => {
  const now = new Date();
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
  const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
  
  return mockSessions.find(session => {
    const isLive = session.dateHeure >= tenMinutesAgo && 
                   session.dateHeure <= tenMinutesFromNow && 
                   session.statutSeance === 'PLANIFIÉE' &&
                   session.typeSeance === 'EN_LIGNE';
    
    if (role === 'THERAPEUTE') {
      return isLive && session.therapeuteId === userId;
    } else {
      return isLive && session.patientId === userId;
    }
  });
};