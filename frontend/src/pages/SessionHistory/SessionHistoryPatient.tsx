import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Video, User, Star } from 'lucide-react';
import { SessionType, SessionStatus } from '../../types/entities';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import SessionRatingForm from '../../components/SessionRatingForm';

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  address: string;
  gender: string;
  role: string;
  profilePictureUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  seanceId: string;
  therapeuteId: string;
  patientId: string;
  dateHeure: string;
  dureeMinutes: number;
  typeSeance: SessionType;
  statutSeance: SessionStatus;
  lienVisio: string | null;
  urlEnregistrement: string | null;
  noteTherapeute: string | null;
  createdAt: string;
  updatedAt: string;
}

const SessionHistoryPatient: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [therapists, setTherapists] = useState<Record<string, User>>({});
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedSession, setSelectedSession] = useState<{
    sessionId: string;
    therapistId: string;
  } | null>(null);
  
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const userId = user?.id;

  const fetchSessions = async () => {
    try {
      const response = await axios.get(`http://localhost:8070/api/seances/patient/${userId}`);
      const completedSessions = response.data.filter((session: Session) => session.statutSeance === 'TERMINEE');
      setSessions(completedSessions);
      
      const therapistIds = [...new Set(completedSessions.map((session: Session) => session.therapeuteId))];
      const therapistsData: Record<string, User> = {};
      
      for (const id of therapistIds) {
        const therapistResponse = await axios.get(`http://localhost:8090/api/user/${id}`);
        therapistsData[id] = therapistResponse.data;
      }
      
      setTherapists(therapistsData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSessions();
    }
  }, [userId]);

  const handleRatingSubmitted = () => {
    fetchSessions(); // Rafraîchir les données après évaluation
  };

  const getStatusBadge = (status: SessionStatus) => {
    const styles = {
      'TERMINEE': 'bg-green-100 text-green-800',
      'PLANIFIEE': 'bg-blue-100 text-blue-800',
      'ANNULEE': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const getTypeIcon = (type: SessionType) => {
    return type === 'EN_LIGNE' ? 
      <Video className="w-4 h-4 text-teal-500" /> : 
      <MapPin className="w-4 h-4 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toaster position="top-right" />
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Mes séances</h2>
        <p className="text-slate-600">Consultez l'historique de vos séances avec vos thérapeutes</p>
      </div>

      <div className="space-y-6">
        {sessions.map((session) => {
          const therapist = therapists[session.therapeuteId];
          const sessionDate = new Date(session.dateHeure);
          
          return (
            <div key={session.seanceId} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={`http://localhost:8090${therapist?.profilePictureUrl}` || 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={therapist?.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                        {getTypeIcon(session.typeSeance)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{therapist?.name}</span>
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{sessionDate.toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{sessionDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <span className="text-slate-400">•</span>
                        <span>{session.dureeMinutes} min</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusBadge(session.statutSeance)}
                    <span className="text-sm text-slate-500">{session.typeSeance.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-slate-900 mb-2">Détails de la séance</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Type de séance:</span>
                      <p className="font-medium text-slate-700 flex items-center space-x-1">
                        {getTypeIcon(session.typeSeance)}
                        <span>{session.typeSeance === 'EN_LIGNE' ? 'En ligne' : 'Présentiel'}</span>
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500">Durée:</span>
                      <p className="font-medium text-slate-700">{session.dureeMinutes} minutes</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="text-sm text-slate-500">
                    Séance terminée le {sessionDate.toLocaleDateString('fr-FR')}
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedSession({
                        sessionId: session.seanceId,
                        therapistId: session.therapeuteId
                      });
                      setShowRatingForm(true);
                    }}
                    className="flex items-center space-x-1 text-teal-600 hover:text-teal-700 text-sm font-medium transition-colors"
                  >
                    <Star className="w-4 h-4" />
                    <span>Évaluer cette séance</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sessions.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune séance terminée</h3>
          <p className="text-slate-500">L'historique de vos séances apparaîtra ici une fois terminées.</p>
        </div>
      )}

      {showRatingForm && selectedSession && (
        <SessionRatingForm
          seanceId={selectedSession.sessionId}
          therapistId={selectedSession.therapistId}
          onClose={() => setShowRatingForm(false)}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
};

export default SessionHistoryPatient;