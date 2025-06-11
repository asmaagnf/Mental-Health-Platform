import React, { useState } from 'react';
import { Therapist, Certificate } from '../types/therapist';
import { Calendar, MapPin, Languages, Euro, GraduationCap, Award, Clock, Mail, Phone } from 'lucide-react';
import CertificateModal from './CertificateModal';

interface TherapistCardProps {
  therapist: Therapist;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onApprove, onReject }) => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReject = () => {
    onReject(therapist.id, rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={therapist.profileImage}
                alt={`${therapist.firstName} ${therapist.lastName}`}
                className="w-16 h-16 rounded-full border-3 border-white shadow-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">{therapist.firstName} {therapist.lastName}</h3>
                <p className="text-teal-100 font-medium">{therapist.licenseNumber}</p>
                <div className="flex items-center mt-1 text-sm text-teal-100">
                  <Clock className="w-4 h-4 mr-1" />
                  {therapist.experience} ans d'expérience
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">En attente</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-slate-600">
              <Mail className="w-4 h-4 mr-2 text-teal-500" />
              <span className="text-sm">{therapist.email}</span>
            </div>
            <div className="flex items-center text-slate-600">
              <Phone className="w-4 h-4 mr-2 text-teal-500" />
              <span className="text-sm">{therapist.phone}</span>
            </div>
            <div className="flex items-center text-slate-600">
              <MapPin className="w-4 h-4 mr-2 text-teal-500" />
              <span className="text-sm">{therapist.location}</span>
            </div>
            <div className="flex items-center text-slate-600">
              <Euro className="w-4 h-4 mr-2 text-teal-500" />
              <span className="text-sm">{therapist.consultationFee}€/séance</span>
            </div>
          </div>

          {/* Education */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
              <h4 className="font-semibold text-slate-900">Formation</h4>
            </div>
            <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg">{therapist.education}</p>
          </div>

          {/* Specializations */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-900 mb-3">Spécialisations</h4>
            <div className="flex flex-wrap gap-2">
              {therapist.specialization.map((spec, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <Languages className="w-4 h-4 mr-2 text-blue-600" />
              <span className="font-medium text-slate-900">Langues:</span>
            </div>
            <p className="text-slate-600 text-sm">{therapist.languages.join(', ')}</p>
          </div>

          {/* Bio */}
          <div className="mb-6">
            <h4 className="font-semibold text-slate-900 mb-2">Présentation</h4>
            <p className="text-slate-600 text-sm leading-relaxed">{therapist.bio}</p>
          </div>

          {/* Certificates */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              <h4 className="font-semibold text-slate-900">Certificats et Diplômes</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {therapist.certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="border border-slate-200 rounded-lg p-4 hover:border-teal-300 cursor-pointer transition-colors"
                  onClick={() => setSelectedCertificate(cert)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-slate-900 text-sm">{cert.name}</h5>
                    <span className="text-xs text-slate-500">{cert.year}</span>
                  </div>
                  <p className="text-slate-600 text-xs">{cert.institution}</p>
                  <div className="mt-2">
                    <img
                      src={cert.imageUrl}
                      alt={cert.name}
                      className="w-full h-20 object-cover rounded border"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Date */}
          <div className="flex items-center text-slate-500 text-sm mb-6">
            <Calendar className="w-4 h-4 mr-2" />
            Soumis le {formatDate(therapist.submittedAt)}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => onApprove(therapist.id)}
              className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Approuver
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Rejeter
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCertificate && (
        <CertificateModal
          certificate={selectedCertificate}
          onClose={() => setSelectedCertificate(null)}
        />
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Rejeter la candidature
            </h3>
            <p className="text-slate-600 mb-4">
              Voulez-vous vraiment rejeter la candidature de {therapist.firstName} {therapist.lastName} ?
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Raison du rejet (optionnel)"
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 resize-none"
              rows={3}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TherapistCard;