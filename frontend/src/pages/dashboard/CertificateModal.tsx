import React from 'react';
import { Certificate } from '../types/therapist';
import { X, Download, Award } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  onClose: () => void;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const getCertificateTypeLabel = (type: string) => {
    switch (type) {
      case 'diploma':
        return 'Diplôme';
      case 'certificate':
        return 'Certificat';
      case 'license':
        return 'Licence';
      default:
        return 'Document';
    }
  };

  const getCertificateTypeColor = (type: string) => {
    switch (type) {
      case 'diploma':
        return 'bg-purple-100 text-purple-700';
      case 'certificate':
        return 'bg-teal-100 text-teal-700';
      case 'license':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">{certificate.name}</h2>
                <p className="text-teal-100">{certificate.institution}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCertificateTypeColor(certificate.type)}`}>
                {getCertificateTypeLabel(certificate.type)}
              </span>
              <span className="text-slate-600">Année: {certificate.year}</span>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Télécharger</span>
            </button>
          </div>

          {/* Certificate Image */}
          <div className="bg-slate-50 rounded-lg p-4 flex justify-center">
            <img
              src={certificate.imageUrl}
              alt={certificate.name}
              className="max-w-full max-h-96 object-contain rounded shadow-lg"
            />
          </div>

          {/* Certificate Details */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Détails du certificat</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-slate-500">Nom</dt>
                  <dd className="text-sm text-slate-900">{certificate.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Institution</dt>
                  <dd className="text-sm text-slate-900">{certificate.institution}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Type</dt>
                  <dd className="text-sm text-slate-900">{getCertificateTypeLabel(certificate.type)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-slate-500">Année d'obtention</dt>
                  <dd className="text-sm text-slate-900">{certificate.year}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Valider le certificat
                </button>
                <button className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                  Demander clarification
                </button>
                <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Marquer comme invalide
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;