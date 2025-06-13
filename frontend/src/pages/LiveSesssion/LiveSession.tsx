import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, User, MapPin, Clipboard } from 'lucide-react';
import VideoCall from './VideoCall';

interface User {
  id: string;
  nom: string;
  email: string;
  numéroTéléphone?: string;
  dateNaissance: Date;
  genre: 'HOMME' | 'FEMME' | 'AUTRE';
  photoProfilUrl?: string;
}

interface Therapeute {
  id: string;
  utilisateur: User;
  spécialités: string[];
  annéesExperience: number;
  prixParHeure: number;
}

interface Seance {
  id: string;
  therapeute: Therapeute;
  patient: User;
  dateHeure: Date;
  typeSeance: 'PRÉSENTIEL' | 'EN_LIGNE';
  statutSeance: 'PLANIFIÉE' | 'TERMINÉE' | 'ANNULÉE';
  lienVisio?: string;
  dureeMinutes: number;
  noteTherapeute?: string;
}

const SessionList: React.FC = () => {
  const [sessions, setSessions] = useState<Seance[]>([]);
  const [selectedSession, setSelectedSession] = useState<Seance | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const navigate = useNavigate();

  // Mock data - replace with API calls
  useEffect(() => {
    const mockSessions: Seance[] = [
      {
        id: '1',
        therapeute: {
          id: 't1',
          utilisateur: {
            id: 'u1',
            nom: 'Dr. Sophie Martin',
            email: 'sophie.martin@example.com',
            dateNaissance: new Date('1980-05-15'),
            genre: 'FEMME',
            photoProfilUrl: '/profile1.jpg'
          },
          spécialités: ['Anxiété', 'Dépression'],
          annéesExperience: 10,
          prixParHeure: 80
        },
        patient: {
          id: 'p1',
          nom: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          numéroTéléphone: '+33612345678',
          dateNaissance: new Date('1990-08-20'),
          genre: 'HOMME',
          photoProfilUrl: '/profile2.jpg'
        },
        dateHeure: new Date(),
        typeSeance: 'EN_LIGNE',
        statutSeance: 'PLANIFIÉE',
        lienVisio: 'https://meet.jit.si/mental-health-session-123',
        dureeMinutes: 45
      },
      {
        id: '2',
        therapeute: {
          id: 't1',
          utilisateur: {
            id: 'u1',
            nom: 'Dr. Sophie Martin',
            email: 'sophie.martin@example.com',
            dateNaissance: new Date('1980-05-15'),
            genre: 'FEMME',
            photoProfilUrl: '/profile1.jpg'
          },
          spécialités: ['Anxiété', 'Dépression'],
          annéesExperience: 10,
          prixParHeure: 80
        },
        patient: {
          id: 'p2',
          nom: 'Marie Lambert',
          email: 'marie.lambert@example.com',
          dateNaissance: new Date('1985-11-30'),
          genre: 'FEMME',
          photoProfilUrl: '/profile3.jpg'
        },
        dateHeure: new Date(),
        typeSeance: 'PRÉSENTIEL',
        statutSeance: 'PLANIFIÉE',
        dureeMinutes: 60
      }
    ];

    setSessions(mockSessions);
  }, []);

  const handleSessionSelect = (session: Seance) => {
    setSelectedSession(session);
    setShowVideoCall(false);
  };

  const startVideoCall = () => {
    if (selectedSession?.typeSeance === 'EN_LIGNE') {
      setShowVideoCall(true);
    }
  };

  const saveSessionNotes = (notes: string) => {
    if (selectedSession) {
      const updatedSessions = sessions.map(s => 
        s.id === selectedSession.id ? { ...s, noteTherapeute: notes } : s
      );
      setSessions(updatedSessions);
      setSelectedSession({ ...selectedSession, noteTherapeute: notes });
    }
  };

  const endSession = () => {
    if (selectedSession) {
      const updatedSessions = sessions.map(s => 
        s.id === selectedSession.id ? { ...s, statutSeance: 'TERMINÉE' } : s
      );
      setSessions(updatedSessions);
      setSelectedSession({ ...selectedSession, statutSeance: 'TERMINÉE' });
      setShowVideoCall(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with today's sessions */}
      <div className="w-1/3 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Séances d'aujourd'hui</h2>
        <div className="space-y-3">
          {sessions.filter(s => 
            new Date(s.dateHeure).toDateString() === new Date().toDateString()
          ).map(session => (
            <div 
              key={session.id}
              onClick={() => handleSessionSelect(session)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedSession?.id === session.id ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200 hover:bg-gray-50'}`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">{session.patient.nom}</h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {new Date(session.dateHeure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' - '}
                    {session.dureeMinutes} min
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  session.statutSeance === 'PLANIFIÉE' ? 'bg-blue-100 text-blue-800' :
                  session.statutSeance === 'TERMINÉE' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {session.statutSeance}
                </span>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                {session.typeSeance === 'EN_LIGNE' ? (
                  <Video className="w-4 h-4 mr-1 text-purple-500" />
                ) : (
                  <MapPin className="w-4 h-4 mr-1 text-orange-500" />
                )}
                {session.typeSeance}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedSession ? (
          showVideoCall && selectedSession.typeSeance === 'EN_LIGNE' ? (
            <VideoCall 
              roomName={selectedSession.lienVisio || ''}
              displayName={selectedSession.therapeute.utilisateur.nom}
              onLeave={() => setShowVideoCall(false)}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedSession.patient.nom}</h2>
                  <div className="flex items-center text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(selectedSession.dateHeure).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    <span>
                      {new Date(selectedSession.dateHeure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(new Date(selectedSession.dateHeure).getTime() + selectedSession.dureeMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      ({selectedSession.dureeMinutes} min)
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {selectedSession.typeSeance === 'EN_LIGNE' && selectedSession.statutSeance === 'PLANIFIÉE' && (
                    <button
                      onClick={startVideoCall}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      <Video className="w-5 h-5 mr-2" />
                      Commencer la séance
                    </button>
                  )}
                  {selectedSession.statutSeance === 'PLANIFIÉE' && (
                    <button
                      onClick={endSession}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      Terminer la séance
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Informations du patient
                  </h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Email:</span> {selectedSession.patient.email}</p>
                    <p><span className="font-medium">Téléphone:</span> {selectedSession.patient.numéroTéléphone || 'Non renseigné'}</p>
                    <p><span className="font-medium">Date de naissance:</span> {new Date(selectedSession.patient.dateNaissance).toLocaleDateString()}</p>
                    <p><span className="font-medium">Genre:</span> {selectedSession.patient.genre}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Clipboard className="w-5 h-5 mr-2 text-blue-500" />
                    Détails de la séance
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      {selectedSession.typeSeance === 'EN_LIGNE' ? (
                        <Video className="w-5 h-5 mr-2 text-purple-500" />
                      ) : (
                        <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                      )}
                      <span className="font-medium">Type:</span> {selectedSession.typeSeance}
                    </p>
                    <p><span className="font-medium">Statut:</span> {selectedSession.statutSeance}</p>
                    <p><span className="font-medium">Thérapeute:</span> {selectedSession.therapeute.utilisateur.nom}</p>
                    <p><span className="font-medium">Spécialités:</span> {selectedSession.therapeute.spécialités.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-3">Notes de séance</h3>
                <textarea
                  value={selectedSession.noteTherapeute || ''}
                  onChange={(e) => saveSessionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  placeholder="Ajoutez vos notes sur cette séance..."
                />
                <button
                  onClick={() => saveSessionNotes(selectedSession.noteTherapeute || '')}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Enregistrer les notes
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <Clipboard className="w-12 h-12 mx-auto mb-4" />
              <p>Sélectionnez une séance pour voir les détails</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionList;