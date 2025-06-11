import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  ExternalLink,
  Phone,
  Video,
  Clock,
} from 'lucide-react';

declare global {
  interface Window {
    JitsiMeetExternalAPI: any;
  }
}

interface Session {
  id: string;
  type: 'en ligne' | 'présentiel';
  roomName?: string;
  patient: { nom: string };
  therapeute: { nom: string };
  dateHeure: Date;
  dureeMinutes: number;
}

const fakeSessions: Session[] = [
  {
    id: 's1',
    type: 'en ligne',
    roomName: 'testroom5xzwgfmx',
    patient: { nom: 'Alice Martin' },
    therapeute: { nom: 'Dr. Bernard' },
    dateHeure: new Date(),
    dureeMinutes: 30,
  },
  {
    id: 's2',
    type: 'présentiel',
    patient: { nom: 'Lucas Petit' },
    therapeute: { nom: 'Dr. Sophie' },
    dateHeure: new Date(),
    dureeMinutes: 45,
  },
];

const TodaysSessions: React.FC = () => {
  // State to track which sessions have active Jitsi instances
  const [joinedSessions, setJoinedSessions] = useState<Set<string>>(new Set());
  // Map of session ID -> Jitsi API instance
  const apiRefs = useRef<{ [sessionId: string]: any }>({});
  // Refs for container divs where Jitsi embeds go
  const containerRefs = useRef<{ [sessionId: string]: HTMLDivElement | null }>({});
  // Notes per session
  const [notes, setNotes] = useState<{ [sessionId: string]: string }>({});
  // Jitsi script loaded state
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Jitsi script once
  useEffect(() => {
    if (!document.getElementById('jitsi-script')) {
      const script = document.createElement('script');
      script.id = 'jitsi-script';
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => console.error('Failed to load Jitsi script');
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  // Cleanup all Jitsi instances on unmount
  useEffect(() => {
    return () => {
      Object.values(apiRefs.current).forEach((api) => {
        if (api) api.dispose();
      });
      apiRefs.current = {};
    };
  }, []);

  const handleJoin = useCallback((session: Session) => {
    if (!scriptLoaded) {
      alert('La bibliothèque Jitsi n’est pas encore chargée');
      return;
    }
    if (!window.JitsiMeetExternalAPI) {
      alert('API Jitsi non disponible');
      return;
    }
    if (!session.roomName) {
      alert('La salle de réunion n’est pas définie');
      return;
    }
    if (!containerRefs.current[session.id]) {
      alert('Conteneur vidéo introuvable');
      return;
    }

    // If already joined, do nothing
    if (joinedSessions.has(session.id)) return;

    const domain = 'meet.jit.si';
    const options = {
      roomName: session.roomName,
      parentNode: containerRefs.current[session.id],
      width: '100%',
      height: 400,
      configOverwrite: {
        startWithVideoMuted: false,
        startWithAudioMuted: false,
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
      },
      userInfo: {
        displayName: session.therapeute.nom,
      },
    };

    try {
      const api = new window.JitsiMeetExternalAPI(domain, options);
      apiRefs.current[session.id] = api;
      setJoinedSessions((prev) => new Set(prev).add(session.id));
    } catch (error) {
      alert('Erreur lors du lancement de la session Jitsi');
      console.error(error);
    }
  }, [joinedSessions, scriptLoaded]);

  const handleLeave = useCallback((sessionId: string) => {
    const api = apiRefs.current[sessionId];
    if (api) {
      api.dispose();
      delete apiRefs.current[sessionId];
      setJoinedSessions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    }
  }, []);

  const handleEnd = (sessionId: string) => {
    if (joinedSessions.has(sessionId)) {
      handleLeave(sessionId);
    }
    alert(`Séance ${sessionId} terminée avec note : "${notes[sessionId] || '(vide)'}"`);
  };

  const handleNoteChange = (sessionId: string, text: string) => {
    setNotes((prev) => ({ ...prev, [sessionId]: text }));
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Séances d'aujourd'hui</h2>
      <div className="space-y-8">
        {fakeSessions.map((session) => (
          <div
            key={session.id}
            className="bg-white border rounded-xl shadow p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  Patient : {session.patient.nom} — Thérapeute : {session.therapeute.nom}
                </p>
                <p className="text-sm text-slate-500">Type : {session.type}</p>
              </div>
              <div className="flex space-x-2">
                {session.type === 'en ligne' && !joinedSessions.has(session.id) && (
                  <button
                    onClick={() => handleJoin(session)}
                    className="bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-700 transition"
                    type="button"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Rejoindre</span>
                  </button>
                )}
                {session.type === 'en ligne' && joinedSessions.has(session.id) && (
                  <button
                    onClick={() => handleLeave(session.id)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-yellow-700 transition"
                    type="button"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Quitter</span>
                  </button>
                )}
                <button
                  onClick={() => handleEnd(session.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-red-700 transition"
                  type="button"
                >
                  <Phone className="w-4 h-4" />
                  <span>Terminer</span>
                </button>
              </div>
            </div>

            {/* Video container for online sessions */}
            {session.type === 'en ligne' && (
              <div
                ref={(el) => (containerRefs.current[session.id] = el)}
                className="w-full h-[400px] bg-slate-100 rounded-lg overflow-hidden"
              />
            )}

            {/* Notes area for all sessions */}
            <div>
              <label
                htmlFor={`notes-${session.id}`}
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                Notes de la séance
              </label>
              <textarea
                id={`notes-${session.id}`}
                value={notes[session.id] || ''}
                onChange={(e) => handleNoteChange(session.id, e.target.value)}
                className="w-full border rounded p-2 text-sm resize-y"
                rows={3}
                placeholder="Saisissez vos notes ici..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysSessions;
