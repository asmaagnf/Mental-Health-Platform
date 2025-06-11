import React, { useState, useMemo } from 'react';
import { Therapist } from '../../types/therapist';
import { mockTherapists } from '../../data/mockTherapists';
import TherapistCard from './TherapistCard';
import { 
  Search, 
  Filter, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download,
  RefreshCw,
  Settings
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [therapists, setTherapists] = useState<Therapist[]>(mockTherapists);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialization, setFilterSpecialization] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'experience'>('date');
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);

  // Get unique specializations for filter
  const specializations = useMemo(() => {
    const allSpecs = therapists.flatMap(t => t.specialization);
    return Array.from(new Set(allSpecs));
  }, [therapists]);

  // Filter and sort therapists
  const filteredTherapists = useMemo(() => {
    let filtered = therapists.filter(therapist => {
      const matchesSearch = 
        therapist.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialization = 
        !filterSpecialization || 
        therapist.specialization.some(spec => 
          spec.toLowerCase().includes(filterSpecialization.toLowerCase())
        );

      return matchesSearch && matchesSpecialization && therapist.status === 'pending';
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case 'experience':
          return b.experience - a.experience;
        case 'date':
        default:
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      }
    });

    return filtered;
  }, [therapists, searchTerm, filterSpecialization, sortBy]);

  const handleApprove = (id: string) => {
    setTherapists(prev => 
      prev.map(t => 
        t.id === id ? { ...t, status: 'approved' as const } : t
      )
    );
    const therapist = therapists.find(t => t.id === id);
    setShowSuccessMessage(`${therapist?.firstName} ${therapist?.lastName} a été approuvé(e) avec succès!`);
    setTimeout(() => setShowSuccessMessage(null), 3000);
  };

  const handleReject = (id: string, reason?: string) => {
    setTherapists(prev => 
      prev.map(t => 
        t.id === id ? { ...t, status: 'rejected' as const } : t
      )
    );
    const therapist = therapists.find(t => t.id === id);
    setShowSuccessMessage(`${therapist?.firstName} ${therapist?.lastName} a été rejeté(e).`);
    setTimeout(() => setShowSuccessMessage(null), 3000);
  };

  const pendingCount = therapists.filter(t => t.status === 'pending').length;
  const approvedCount = therapists.filter(t => t.status === 'approved').length;
  const rejectedCount = therapists.filter(t => t.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Panneau d'Administration
                </h1>
                <p className="text-teal-100 mt-1">
                  Gestion des candidatures de thérapeutes
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="p-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-colors">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {showSuccessMessage}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-slate-500 text-sm">En attente</p>
                <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-slate-500 text-sm">Approuvés</p>
                <p className="text-2xl font-bold text-slate-900">{approvedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-slate-500 text-sm">Rejetés</p>
                <p className="text-2xl font-bold text-slate-900">{rejectedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-slate-500 text-sm">Total</p>
                <p className="text-2xl font-bold text-slate-900">{therapists.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un thérapeute..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
              >
                <option value="">Toutes spécialisations</option>
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'date' | 'experience')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="date">Trier par date</option>
                <option value="name">Trier par nom</option>
                <option value="experience">Trier par expérience</option>
              </select>
            </div>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Candidatures en attente ({filteredTherapists.length})
          </h2>
          <p className="text-slate-600">
            {filteredTherapists.length === 0 
              ? "Aucune candidature ne correspond à vos critères de recherche."
              : `${filteredTherapists.length} candidature(s) trouvée(s).`
            }
          </p>
        </div>

        {/* Therapist Cards */}
        {filteredTherapists.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-slate-200">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Aucune candidature trouvée
            </h3>
            <p className="text-slate-500">
              Modifiez vos critères de recherche pour voir plus de résultats.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {filteredTherapists.map((therapist) => (
              <TherapistCard
                key={therapist.id}
                therapist={therapist}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;