import React from 'react';
import { Calendar, Clock, MapPin, Video, FileText, User } from 'lucide-react';
import { getSessionsByTherapist, getUserById } from '../../data/mockData';
import { SessionType, SessionStatus } from '../../types/entities';

const SessionHistoryTherapist: React.FC = () => {
  const sessions = getSessionsByTherapist('1'); // Current therapist ID
  const completedSessions = sessions.filter(session => session.statutSeance === 'TERMINÉE');

  const getStatusBadge = (status: SessionStatus) => {
    const styles = {
      'TERMINÉE': 'bg-green-100 text-green-800',
      'PLANIFIÉE': 'bg-blue-100 text-blue-800',
      'ANNULÉE': 'bg-red-100 text-red-800'
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Historique des séances</h2>
        <p className="text-slate-600">Consultez l'historique complet de vos séances avec vos notes personnelles</p>
      </div>

      <div className="space-y-6">
        {completedSessions.map((session) => {
          const patient = getUserById(session.patientId);
          
          return (
            <div key={session.seanceId} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={patient?.photoProfilUrl || 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={patient?.nom}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                        {getTypeIcon(session.typeSeance)}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{patient?.nom}</span>
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-slate-500 mt-1">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{session.dateHeure.toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{session.dateHeure.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
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
                  <h4 className="font-medium text-slate-900 mb-2">Informations du patient</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500">Email:</span>
                      <p className="font-medium text-slate-700">{patient?.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Téléphone:</span>
                      <p className="font-medium text-slate-700">{patient?.numeroTelephone}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Âge:</span>
                      <p className="font-medium text-slate-700">
                        {patient?.dateNaissance ? 
                          new Date().getFullYear() - patient.dateNaissance.getFullYear() + ' ans' : 
                          'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {session.noteTherapeute && (
                  <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                    <div className="flex items-center space-x-2 mb-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <h4 className="font-medium text-teal-800">Notes de séance</h4>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{session.noteTherapeute}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completedSessions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune séance terminée</h3>
          <p className="text-slate-500">L'historique de vos séances apparaîtra ici une fois terminées.</p>
        </div>
      )}
    </div>
  );
};

export default SessionHistoryTherapist;