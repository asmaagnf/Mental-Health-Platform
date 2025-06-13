import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, User, MapPin, Clipboard, MessageSquare } from 'lucide-react';
import VideoCall from './VideoCall';
import toast from 'react-hot-toast';

interface UserInfo {
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

interface TherapistProfile {
  id: string;
  userId: string;
  specialites: string[];
  description: string;
  anneesExperience: number;
  diplomas: {
    title: string;
    institution: string;
    year: number;
    imageUrl: string;
  }[];
  languesParlees: string[];
  localisation: string;
  available: boolean;
  prixParHeure: number;
  statutProfil: string;
}

interface Seance {
  seanceId: string;
  therapeuteId: string;
  patientId: string;
  dateHeure: string;
  dureeMinutes: number;
  typeSeance: string;
  statutSeance: string;
  lienVisio: string;
  urlEnregistrement: string | null;
  noteTherapeute: string | null;
  createdAt: string;
  updatedAt: string;
  therapist?: UserInfo & { profile?: TherapistProfile };
}

const PatientSessionList: React.FC = () => {
  const [sessions, setSessions] = useState<Seance[]>([]);
  const [selectedSession, setSelectedSession] = useState<Seance | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
 
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const patientId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Fetch patient's sessions
        const response = await fetch(`http://localhost:8070/api/seances/patient/${patientId}`);
        if (!response.ok) throw new Error('Failed to fetch sessions');
        
        const data: Seance[] = await response.json();
        
        // Filter only upcoming sessions
        const now = new Date();
        const upcomingSessions = data.filter(s => 
          new Date(s.dateHeure) >= now || 
          s.statutSeance === 'PLANIFIEE'
        );
        
        // Fetch therapist details for each session
        const sessionsWithDetails = await Promise.all(
          upcomingSessions.map(async session => {
            const therapistResponse = await fetch(`http://localhost:8090/api/user/${session.therapeuteId}`);
            if (!therapistResponse.ok) return session;
            
            const therapistData = await therapistResponse.json();
            
            // Fetch therapist profile
            const therapistProfileResponse = await fetch(`http://localhost:8090/api/therapeutes/${session.therapeuteId}`);
            let therapistProfile = null;
            if (therapistProfileResponse.ok) {
              therapistProfile = await therapistProfileResponse.json();
            }
            
            return { 
              ...session, 
              therapist: { 
                ...therapistData, 
                profile: therapistProfile 
              } 
            };
          })
        );
        
        setSessions(sessionsWithDetails);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [patientId]);

  useEffect(() => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (selectedSession && selectedSession.statutSeance === 'PLANIFIEE') {
      const updateTimer = () => {
        const now = new Date();
        const sessionStart = new Date(selectedSession.dateHeure);
        const sessionEnd = new Date(sessionStart.getTime() + selectedSession.dureeMinutes * 60000);

        if (now < sessionStart) {
          // Session hasn't started yet
          const diff = sessionStart.getTime() - now.getTime();
          setTimeRemaining(-Math.floor(diff / 1000)); // Negative for countdown
        } else if (now < sessionEnd) {
          // Session in progress
          const diff = sessionEnd.getTime() - now.getTime();
          setTimeRemaining(Math.floor(diff / 1000));
        } else {
          // Session should have ended
          setTimeRemaining(0);
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    } else {
      setTimeRemaining(null);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [selectedSession]);

  const formatTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSessionSelect = (session: Seance) => {
    setSelectedSession(session);
    setShowVideoCall(false);
  };

  const startVideoCall = () => {
    if (!selectedSession) return;

    const now = new Date();
    const sessionStart = new Date(selectedSession.dateHeure);
    const sessionEnd = new Date(sessionStart.getTime() + selectedSession.dureeMinutes * 60000);

    if (now < sessionStart) {
      toast.error('Session has not started yet');
      return;
    }

    if (now > sessionEnd) {
      toast.error('Session time has already passed');
      return;
    }

    if (selectedSession.typeSeance === 'EN_LIGNE') {
      setShowVideoCall(true);
      toast.success('Starting video session');
    } else {
      toast.error('This is not an online session');
    }
  };

  const cancelSession = async () => {
    if (!selectedSession) return;
    
    try {
      const response = await fetch(
        `http://localhost:8070/api/seances/${selectedSession.seanceId}/annuler`,
        {
          method: 'POST',
        }
      );
      
      if (!response.ok) throw new Error('Failed to cancel session');
      
      // Update local state
      const updatedSessions = sessions.map(s => 
        s.seanceId === selectedSession.seanceId ? { ...s, statutSeance: 'ANNULEE' } : s
      );
      setSessions(updatedSessions);
      setSelectedSession({ ...selectedSession, statutSeance: 'ANNULEE' });
      
      toast.success('Session cancelled successfully');
    } catch (error) {
      console.error('Error cancelling session:', error);
      toast.error('Failed to cancel session');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with upcoming sessions */}
      <div className="w-1/3 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Upcoming Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-gray-500">No upcoming sessions</p>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <div 
                key={session.seanceId}
                onClick={() => handleSessionSelect(session)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedSession?.seanceId === session.seanceId 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {session.therapist?.name || 'Therapist'}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(session.dateHeure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {session.dureeMinutes} min
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    session.statutSeance === 'PLANIFIEE' ? 'bg-blue-100 text-blue-800' :
                    session.statutSeance === 'TERMINEE' ? 'bg-green-100 text-green-800' :
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
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedSession ? (
          showVideoCall && selectedSession.typeSeance === 'EN_LIGNE' ? (
            <VideoCall 
              roomName={selectedSession.lienVisio || ''}
              displayName={selectedSession.therapist?.name || 'Patient'}
              onLeave={() => setShowVideoCall(false)}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Session with {selectedSession.therapist?.name || 'Therapist'}
                  </h2>
                  <div className="flex items-center text-gray-500 mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(selectedSession.dateHeure).toLocaleDateString()}</span>
                    <Clock className="w-4 h-4 ml-3 mr-1" />
                    <span>
                      {new Date(selectedSession.dateHeure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(new Date(selectedSession.dateHeure).getTime() + selectedSession.dureeMinutes * 60000)
                        .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      ({selectedSession.dureeMinutes} min)
                    </span>
                  </div>
                  {timeRemaining !== null && (
                    <div className="mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        timeRemaining < 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : timeRemaining > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {timeRemaining < 0 
                          ? `Starts in ${formatTime(timeRemaining)}` 
                          : timeRemaining > 0 
                            ? `Time remaining: ${formatTime(timeRemaining)}` 
                            : 'Session time has ended'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-3">
                  {selectedSession.typeSeance === 'EN_LIGNE' && selectedSession.statutSeance === 'PLANIFIEE' && (
                    <button
                      onClick={startVideoCall}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                      disabled={timeRemaining !== null && timeRemaining < 0}
                    >
                      <Video className="w-5 h-5 mr-2" />
                      {timeRemaining !== null && timeRemaining > 0 ? 'Join Session' : 'Start Session'}
                    </button>
                  )}
                  {selectedSession.statutSeance === 'PLANIFIEE' && (
                    <button
                      onClick={cancelSession}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      Cancel Session
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Therapist Information
                  </h3>
                  {selectedSession.therapist && (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        {selectedSession.therapist.profilePictureUrl && (
                          <img 
                            src={`http://localhost:8090${selectedSession.therapist.profilePictureUrl}`} 
                            alt="Therapist" 
                            className="w-12 h-12 rounded-full mr-3 object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-medium">{selectedSession.therapist.name}</h4>
                          {selectedSession.therapist.profile && (
                            <p className="text-sm text-gray-500">
                              {selectedSession.therapist.profile.specialites.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      {selectedSession.therapist.profile && (
                        <>
                          <p>
                            <span className="font-medium">Experience:</span> {selectedSession.therapist.profile.anneesExperience} years
                          </p>
                          <p>
                            <span className="font-medium">Description:</span> {selectedSession.therapist.profile.description}
                          </p>
                          <p>
                            <span className="font-medium">Languages:</span> {selectedSession.therapist.profile.languesParlees.join(', ')}
                          </p>
                          <p>
                            <span className="font-medium">Location:</span> {selectedSession.therapist.profile.localisation}
                          </p>
                          <p>
                            <span className="font-medium">Rate:</span> {selectedSession.therapist.profile.prixParHeure} MAD/hour
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <Clipboard className="w-5 h-5 mr-2 text-blue-500" />
                    Session Details
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
                    <p><span className="font-medium">Status:</span> {selectedSession.statutSeance}</p>
                    {selectedSession.typeSeance === 'EN_LIGNE' && (
                      <p>
                        <span className="font-medium">Meeting Link:</span> {selectedSession.lienVisio}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {selectedSession.noteTherapeute && (
                <div>
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                    Therapist's Notes
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedSession.noteTherapeute}</p>
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <Clipboard className="w-12 h-12 mx-auto mb-4" />
              <p>Select a session to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientSessionList;