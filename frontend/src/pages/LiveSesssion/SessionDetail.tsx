import React, { useState } from 'react';
import { Calendar, Clock, Video, User, MapPin, Clipboard, Star, Phone, MessageSquare } from 'lucide-react';


interface SessionDetailProps {
  session: any; // Replace with your Seance type
  onStartVideoCall: () => void;
  onSaveNotes: (notes: string) => void;
  onEndSession: () => void;
}

const SessionDetail: React.FC<SessionDetailProps> = ({
  session,
  onStartVideoCall,
  onSaveNotes,
  onEndSession
}) => {
  const [notes, setNotes] = useState(session.noteTherapeute || '');
  const [activeTab, setActiveTab] = useState('details');

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const saveNotes = () => {
    onSaveNotes(notes);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{session.patient.nom}</h2>
          <div className="flex items-center text-gray-500 mt-1">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(session.dateHeure).toLocaleDateString()}</span>
            <Clock className="w-4 h-4 ml-3 mr-1" />
            <span>
              {new Date(session.dateHeure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
              {new Date(new Date(session.dateHeure).getTime() + session.dureeMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              ({session.dureeMinutes} min)
            </span>
          </div>
        </div>

        <div className="flex space-x-3">
          {session.typeSeance === 'EN_LIGNE' && session.statutSeance === 'PLANIFIÉE' && (
            <button
              onClick={onStartVideoCall}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Video className="w-5 h-5 mr-2" />
              Commencer la séance
            </button>
          )}
          {session.statutSeance === 'PLANIFIÉE' && (
            <button
              onClick={onEndSession}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              Terminer la séance
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Détails du patient
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'notes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Notes de séance
          </button>
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-500" />
              Informations du patient
            </h3>
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {session.patient.email}</p>
              <p><span className="font-medium">Téléphone:</span> {session.patient.numéroTéléphone || 'Non renseigné'}</p>
              <p><span className="font-medium">Date de naissance:</span> {new Date(session.patient.dateNaissance).toLocaleDateString()}</p>
              <p><span className="font-medium">Genre:</span> {session.patient.genre}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <Clipboard className="w-5 h-5 mr-2 text-blue-500" />
              Détails de la séance
            </h3>
            <div className="space-y-2">
              <p className="flex items-center">
                {session.typeSeance === 'EN_LIGNE' ? (
                  <Video className="w-5 h-5 mr-2 text-purple-500" />
                ) : (
                  <MapPin className="w-5 h-5 mr-2 text-orange-500" />
                )}
                <span className="font-medium">Type:</span> {session.typeSeance}
              </p>
              <p><span className="font-medium">Statut:</span> {session.statutSeance}</p>
              <p><span className="font-medium">Thérapeute:</span> {session.therapeute.utilisateur.nom}</p>
              <p><span className="font-medium">Spécialités:</span> {session.therapeute.spécialités.join(', ')}</p>
            </div>
          </div>
        </div>
      )}

     
      {activeTab === 'notes' && (
        <div>
          <div className="mb-4">
            <label htmlFor="session-notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes de séance
            </label>
            <textarea
              id="session-notes"
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ajoutez vos notes sur cette séance..."
              value={notes}
              onChange={handleNotesChange}
            />
          </div>
          <button
            onClick={saveNotes}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Enregistrer les notes
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionDetail;