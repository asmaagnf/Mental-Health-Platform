import { Therapist } from '../types/therapist';

export const mockTherapists: Therapist[] = [
  {
    id: '1',
    firstName: 'Dr. Sarah',
    lastName: 'Martinez',
    email: 'sarah.martinez@email.com',
    phone: '+33 6 12 34 56 78',
    specialization: ['Thérapie Cognitive Comportementale', 'Anxiété', 'Dépression'],
    experience: 8,
    education: 'Doctorat en Psychologie Clinique - Université Paris Descartes',
    licenseNumber: 'PSY-FR-2016-1234',
    bio: 'Psychologue clinicienne spécialisée dans les troubles anxieux et dépressifs. J\'utilise principalement les approches cognitivo-comportementales pour aider mes patients à surmonter leurs difficultés.',
    profileImage: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=400',
    certificates: [
      {
        id: 'cert1',
        name: 'Doctorat en Psychologie Clinique',
        institution: 'Université Paris Descartes',
        year: 2016,
        imageUrl: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'diploma'
      },
      {
        id: 'cert2',
        name: 'Certification TCC',
        institution: 'Institut Français de TCC',
        year: 2018,
        imageUrl: 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'certificate'
      }
    ],
    status: 'pending',
    submittedAt: '2024-01-15T10:30:00Z',
    location: 'Paris, France',
    languages: ['Français', 'Anglais', 'Espagnol'],
    consultationFee: 80
  },
  {
    id: '2',
    firstName: 'Dr. Michel',
    lastName: 'Dubois',
    email: 'michel.dubois@email.com',
    phone: '+33 6 87 65 43 21',
    specialization: ['Thérapie Familiale', 'Thérapie de Couple', 'Adolescents'],
    experience: 12,
    education: 'Master en Psychologie Systémique - Université Lyon 2',
    licenseNumber: 'PSY-FR-2012-5678',
    bio: 'Thérapeute familial et de couple avec plus de 12 ans d\'expérience. Je travaille avec une approche systémique pour aider les familles et couples à améliorer leur communication.',
    profileImage: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
    certificates: [
      {
        id: 'cert3',
        name: 'Master en Psychologie Systémique',
        institution: 'Université Lyon 2',
        year: 2012,
        imageUrl: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'diploma'
      },
      {
        id: 'cert4',
        name: 'Formation Thérapie Familiale',
        institution: 'École de Palo Alto',
        year: 2014,
        imageUrl: 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'certificate'
      }
    ],
    status: 'pending',
    submittedAt: '2024-01-14T14:20:00Z',
    location: 'Lyon, France',
    languages: ['Français', 'Anglais'],
    consultationFee: 75
  },
  {
    id: '3',
    firstName: 'Dr. Emma',
    lastName: 'Johnson',
    email: 'emma.johnson@email.com',
    phone: '+33 6 11 22 33 44',
    specialization: ['EMDR', 'Trauma', 'Stress Post-Traumatique'],
    experience: 6,
    education: 'Master en Psychologie Clinique - Université Bordeaux',
    licenseNumber: 'PSY-FR-2018-9012',
    bio: 'Psychologue spécialisée dans le traitement des traumatismes par EMDR. J\'accompagne les patients dans la guérison des blessures émotionnelles et des troubles post-traumatiques.',
    profileImage: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=400',
    certificates: [
      {
        id: 'cert5',
        name: 'Master en Psychologie Clinique',
        institution: 'Université Bordeaux',
        year: 2018,
        imageUrl: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'diploma'
      },
      {
        id: 'cert6',
        name: 'Certification EMDR Niveau II',
        institution: 'Association EMDR France',
        year: 2020,
        imageUrl: 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'certificate'
      }
    ],
    status: 'pending',
    submittedAt: '2024-01-13T09:15:00Z',
    location: 'Bordeaux, France',
    languages: ['Français', 'Anglais'],
    consultationFee: 70
  },
  {
    id: '4',
    firstName: 'Dr. Antoine',
    lastName: 'Moreau',
    email: 'antoine.moreau@email.com',
    phone: '+33 6 55 44 33 22',
    specialization: ['Hypnose Thérapeutique', 'Addictions', 'Gestion du Stress'],
    experience: 10,
    education: 'Doctorat en Psychologie - Université Toulouse',
    licenseNumber: 'PSY-FR-2014-3456',
    bio: 'Psychologue et hypnothérapeute certifié. Je combine les approches traditionnelles avec l\'hypnose thérapeutique pour traiter les addictions et les troubles anxieux.',
    profileImage: 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400',
    certificates: [
      {
        id: 'cert7',
        name: 'Doctorat en Psychologie',
        institution: 'Université Toulouse',
        year: 2014,
        imageUrl: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'diploma'
      },
      {
        id: 'cert8',
        name: 'Certification Hypnose Ericksonienne',
        institution: 'Institut Milton Erickson',
        year: 2016,
        imageUrl: 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&w=600',
        type: 'certificate'
      }
    ],
    status: 'pending',
    submittedAt: '2024-01-12T16:45:00Z',
    location: 'Toulouse, France',
    languages: ['Français', 'Italien'],
    consultationFee: 85
  }
];