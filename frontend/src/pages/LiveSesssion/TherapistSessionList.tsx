import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Video, User, MapPin, Clipboard, MessageSquare, Mail, Phone } from 'lucide-react';
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
  patient?: UserInfo;
  therapist?: UserInfo & { profile?: TherapistProfile };
}

const TherapistSessionList: React.FC = () => {
  const [sessions, setSessions] = useState<Seance[]>([]);
  const [selectedSession, setSelectedSession] = useState<Seance | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const therapistId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch(`http://localhost:8070/api/seances/therapeute/${therapistId}`);
        if (!response.ok) throw new Error('Failed to fetch sessions');
        
        const data: Seance[] = await response.json();
        const today = new Date().toISOString().split('T')[0];
        const filteredSessions = data.filter(s => 
          s.statutSeance === 'PLANIFIEE' && 
          s.dateHeure.startsWith(today)
        );
        
        const sessionsWithDetails = await Promise.all(
          filteredSessions.map(async session => {
            const patientResponse = await fetch(`http://localhost:8090/api/user/${session.patientId}`);
            if (!patientResponse.ok) return session;
            
            const patientData = await patientResponse.json();
            return { ...session, patient: patientData };
          })
        );
        
        setSessions(sessionsWithDetails);
        
        const therapistProfileResponse = await fetch(`http://localhost:8090/api/therapeutes/${therapistId}`);
        if (therapistProfileResponse.ok) {
          const therapistProfile = await therapistProfileResponse.json();
          setSessions(prev => prev.map(s => ({ ...s, therapist: { ...s.therapist, profile: therapistProfile } })));
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [therapistId]);

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

  const handleSessionSelect = (session: Seance) => {
    setSelectedSession(session);
    setNotes(session.noteTherapeute || '');
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

  const saveSessionNotes = async () => {
  if (!selectedSession) return;

  try {
    const response = await fetch(
      `http://localhost:8070/api/seances/${selectedSession.seanceId}/note`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: notes, // send raw string
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Failed to save notes');
    }

    const updatedSessions = sessions.map(s =>
      s.seanceId === selectedSession.seanceId ? { ...s, noteTherapeute: notes } : s
    );
    setSessions(updatedSessions);
    setSelectedSession({ ...selectedSession, noteTherapeute: notes });

    toast.success('Notes saved successfully');
  } catch (error) {
    console.error('Error saving notes:', error);
    toast.error((error as Error).message || 'Failed to save notes');
  }
};

  const endSession = async () => {
    if (!selectedSession) return;

    const now = new Date();
    const sessionStart = new Date(selectedSession.dateHeure);
    const sessionEnd = new Date(sessionStart.getTime() + selectedSession.dureeMinutes * 60000);

    if (now < sessionStart) {
      toast.error('Session has not started yet');
      return;
    }

    if (now < sessionEnd) {
      const remainingMinutes = Math.ceil((sessionEnd.getTime() - now.getTime()) / 60000);
      toast.error(`Session still has ${remainingMinutes} minutes remaining. Are you sure you want to end early?`, {
        duration: 5000,
        id: 'early-end-warning'
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8070/api/seances/${selectedSession.seanceId}/terminer`,
        { method: 'PUT' }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to end session');
      }

      const updatedSessions = sessions.map(s =>
        s.seanceId === selectedSession.seanceId ? { ...s, statutSeance: 'TERMINEE' } : s
      );
      setSessions(updatedSessions);
      setSelectedSession({ ...selectedSession, statutSeance: 'TERMINEE' });
      setShowVideoCall(false);

      toast.success('Session marked as completed');
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error((error as Error).message);
    }
  };

  const formatTime = (seconds: number) => {
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    return `${seconds < 0 ? 'Starts in ' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
      {/* Sidebar with today's sessions */}
      <div className="w-1/3 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Today's Sessions</h2>
        {sessions.length === 0 ? (
          <p className="text-gray-500">No sessions scheduled for today</p>
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
                      {session.patient?.name || 'Patient'}
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
              displayName={selectedSession.therapist?.name || 'Therapist'}
              onLeave={() => setShowVideoCall(false)}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedSession.patient?.name || 'Patient'}
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
                      onClick={endSession}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                      End Session
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-500" />
                    Patient Information
                  </h3>
                  {selectedSession.patient && (
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">Email:</span> {selectedSession.patient.email}
                      </p>
                      <p className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">Phone:</span> {selectedSession.patient.phoneNumber || 'Not provided'}
                      </p>
                      <p>
                        <span className="font-medium">Gender:</span> {selectedSession.patient.gender}
                      </p>
                      {selectedSession.patient.dateOfBirth && (
                        <p>
                          <span className="font-medium">Date of Birth:</span> {new Date(selectedSession.patient.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                      {selectedSession.patient.address && (
                        <p>
                          <span className="font-medium">Address:</span> {selectedSession.patient.address}
                        </p>
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
                    {selectedSession.therapist?.profile && (
                      <>
                        <p><span className="font-medium">Specialties:</span> {selectedSession.therapist.profile.specialites.join(', ')}</p>
                        <p><span className="font-medium">Experience:</span> {selectedSession.therapist.profile.anneesExperience} years</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-800 mb-3">Session Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={6}
                  placeholder="Add your notes about this session..."
                />
                <button
                  onClick={saveSessionNotes}
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Save Notes
                </button>
              </div>
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

export default TherapistSessionList;