import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Video, User, X, AlertTriangle } from 'lucide-react';
import { UserRole, SessionType, Session } from '../../types/entities';

interface UserInfo {
  id: string;
  name: string;
  profilePictureUrl: string;
}

const UpcomingSessions: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [otherUsers, setOtherUsers] = useState<Record<string, UserInfo>>({});
  const [cancelingSession, setCancelingSession] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole: UserRole = currentUser.role;
  const userId: string = currentUser.id;

  const getTypeIcon = (type: SessionType) => {
    return type === 'EN_LIGNE'
      ? <Video className="w-4 h-4 text-teal-500" />
      : <MapPin className="w-4 h-4 text-blue-500" />;
  };

  const formatTimeUntil = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `Dans ${days} jour${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Dans ${hours}h`;
    return 'Très bientôt';
  };

  const fetchUserInfo = async (userId: string): Promise<UserInfo | null> => {
    try {
      const res = await fetch(`http://localhost:8090/api/user/${userId}`);
      if (!res.ok) throw new Error("User fetch failed");
      const user = await res.json();
      return {
        id: user.id,
        name: user.name,
       profilePictureUrl: user.profilePictureUrl
        ? `http://localhost:8090${user.profilePictureUrl}`
        : 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400',
    };
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
      return null;
    }
  };

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const endpoint = userRole === 'THERAPIST'
        ? `http://localhost:8070/api/seances/therapeute/${userId}`
        : `http://localhost:8070/api/seances/patient/${userId}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      const upcoming = data
        .filter((s: any) => s.statutSeance === 'PLANIFIEE')
        .map((s: any) => ({ ...s, dateHeure: new Date(s.dateHeure) }));

      setSessions(upcoming);

      // Fetch info about other participants
      const userIds = new Set<string>();
      for (const session of upcoming) {
        const otherId = userRole === 'THERAPIST' ? session.patientId : session.therapeuteId;
        if (!otherUsers[otherId]) userIds.add(otherId);
      }

      const userFetches = Array.from(userIds).map(id => fetchUserInfo(id));
      const userInfos = await Promise.all(userFetches);

      const updatedMap = { ...otherUsers };
      for (const info of userInfos) {
        if (info) {
          updatedMap[info.id] = info;
        }
      }
      setOtherUsers(updatedMap);
    } catch (error) {
      console.error('Erreur de chargement des séances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await fetch(`http://localhost:8070/api/seances/${sessionId}/annuler`, {
        method: 'PUT',
      });
      setSessions(prev => prev.filter(session => session.seanceId !== sessionId));
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
    } finally {
      setCancelingSession(null);
    }
  };

  useEffect(() => {
    if (userId && userRole) {
      fetchSessions();
    }
  }, [userId, userRole]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Séances à venir</h2>
        <p className="text-slate-600">
          {userRole === 'THERAPIST'
            ? 'Gérez vos prochaines séances avec vos patients'
            : 'Vos prochaines séances thérapeutiques'}
        </p>
      </div>

      {loading ? (
        <p className="text-center text-slate-500">Chargement des séances...</p>
      ) : sessions.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Aucune séance à venir</h3>
          <p className="text-slate-500">
            {userRole === 'THERAPIST'
              ? 'Vos prochaines séances apparaîtront ici une fois planifiées.'
              : 'Vos prochaines séances avec vos thérapeutes apparaîtront ici.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => {
            const otherId = userRole === 'THERAPIST' ? session.patientId : session.therapeuteId;
            const otherUser = otherUsers[otherId];

            return (
              <div key={session.seanceId} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="relative">
                        <img
                          src={otherUser?.profilePictureUrl || 'https://images.pexels.com/photos/3768911/pexels-photo-3768911.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={otherUser?.name || 'Utilisateur'}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                          {getTypeIcon(session.typeSeance)}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 flex items-center space-x-2">
                          <User className="w-4 h-4 text-slate-400" />
                          <span>{otherUser?.name || 'Chargement...'}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-sm font-normal text-slate-500">
                            {userRole === 'THERAPIST' ? 'PATIENT' : 'Thérapeute'}
                          </span>
                        </h3>

                        <div className="flex items-center space-x-6 text-sm text-slate-500 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{session.dateHeure.toLocaleDateString('fr-FR', {
                              weekday: 'long', day: 'numeric', month: 'long'
                            })}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{session.dateHeure.toLocaleTimeString('fr-FR', {
                              hour: '2-digit', minute: '2-digit'
                            })}</span>
                          </div>
                          <span>{session.dureeMinutes} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-900">
                          {formatTimeUntil(session.dateHeure)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {session.typeSeance === 'EN_LIGNE' ? 'En ligne' : 'Présentiel'}
                        </div>
                      </div>

                      <button
                        onClick={() => setCancelingSession(session.seanceId)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {cancelingSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Annuler la séance</h3>
            </div>

            <p className="text-slate-600 mb-6">
              Êtes-vous sûr de vouloir annuler cette séance ? Cette action ne peut pas être annulée.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => setCancelingSession(null)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Garder la séance
              </button>
              <button
                onClick={() => handleCancelSession(cancelingSession)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Annuler la séance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpcomingSessions;
