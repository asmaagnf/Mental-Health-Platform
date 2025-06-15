import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Euro,
  GraduationCap,
  Award,
  Calendar,
  X,
  User,
  Maximize2
} from 'lucide-react';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string | null;
}

interface Diploma {
  title: string;
  institution: string;
  year: number;
  imageUrl: string | null;
}

interface TherapistProfile {
  id: string;
  userId: string;
  specialites: string[];
  description: string;
  anneesExperience: number;
  diplomas: Diploma[];
  languesParlees: string[];
  localisation: string;
  available: boolean;
  prixParHeure: number;
  statutProfil: 'EN_ATTENTE' | 'VALIDE' | 'REJETE';
  user?: UserInfo; // Added user info
}

const TherapistValidationDashboard: React.FC = () => {
  const [therapists, setTherapists] = useState<TherapistProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'EN_ATTENTE' | 'VALIDE' | 'REJETE' | 'ALL'>('EN_ATTENTE');
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [selectedTherapist, setSelectedTherapist] = useState<TherapistProfile | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info for a therapist
  const fetchUserInfo = async (userId: string): Promise<UserInfo> => {
    try {
      const response = await axios.get(`http://localhost:8090/api/user/${userId}`);
      const user = response.data;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePictureUrl: user.profilePictureUrl 
          ? `http://localhost:8090${user.profilePictureUrl}`
          : null
      };
    } catch (error) {
      console.error('Error fetching user info:', error);
      return {
        id: userId,
        name: 'Unknown',
        email: '',
        phoneNumber: '',
        profilePictureUrl: null
      };
    }
  };

  // Fetch all therapist profiles with user info
  const fetchTherapists = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8040/api/therapeutes/profiles');
      const therapistsData = response.data;

      // Fetch user info for each therapist
      const therapistsWithUserInfo = await Promise.all(
        therapistsData.map(async (therapist: TherapistProfile) => {
          const userInfo = await fetchUserInfo(therapist.userId);
          return { ...therapist, user: userInfo };
        })
      );

      setTherapists(therapistsWithUserInfo);
    } catch (error) {
      console.error('Error fetching therapists:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapists();
  }, []);

  // Get initials from name
  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  // Filter therapists based on search and status
  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = 
      therapist.localisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      therapist.specialites.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
      therapist.languesParlees.some(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = 
      filterStatus === 'ALL' || 
      therapist.statutProfil === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Count therapists by status
  const pendingCount = therapists.filter(t => t.statutProfil === 'EN_ATTENTE').length;
  const approvedCount = therapists.filter(t => t.statutProfil === 'VALIDE').length;
  const rejectedCount = therapists.filter(t => t.statutProfil === 'REJETE').length;

  // Validate a therapist profile
  const handleValidate = async (id: string) => {
    try {
      await axios.put(`http://localhost:8040/api/therapeutes/profiles/${id}/validate`);
      setShowSuccessMessage('Profile validated successfully!');
      fetchTherapists();
      setTimeout(() => setShowSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error validating profile:', error);
    }
  };

  // Reject a therapist profile
  const handleReject = async (id: string, reason?: string) => {
    try {
      await axios.put(`http://localhost:8040/api/therapeutes/profiles/${id}/reject`, { reason });
      setShowSuccessMessage('Profile rejected successfully!');
      setSelectedTherapist(null);
      setRejectReason('');
      fetchTherapists();
      setTimeout(() => setShowSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error rejecting profile:', error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Handle image click
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Therapist Profile Validation
                </h1>
                <p className="text-teal-100 mt-1">
                  Review and validate therapist profiles
                </p>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={fetchTherapists}
                  className="p-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-colors"
                >
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
          <div 
            className={`bg-white rounded-xl shadow-lg p-6 border ${filterStatus === 'EN_ATTENTE' ? 'border-teal-500' : 'border-slate-200'} cursor-pointer`}
            onClick={() => setFilterStatus('EN_ATTENTE')}
          >
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-slate-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div 
            className={`bg-white rounded-xl shadow-lg p-6 border ${filterStatus === 'VALIDE' ? 'border-teal-500' : 'border-slate-200'} cursor-pointer`}
            onClick={() => setFilterStatus('VALIDE')}
          >
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-slate-500 text-sm">Approved</p>
                <p className="text-2xl font-bold text-slate-900">{approvedCount}</p>
              </div>
            </div>
          </div>
          <div 
            className={`bg-white rounded-xl shadow-lg p-6 border ${filterStatus === 'REJETE' ? 'border-teal-500' : 'border-slate-200'} cursor-pointer`}
            onClick={() => setFilterStatus('REJETE')}
          >
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-slate-500 text-sm">Rejected</p>
                <p className="text-2xl font-bold text-slate-900">{rejectedCount}</p>
              </div>
            </div>
          </div>
          <div 
            className={`bg-white rounded-xl shadow-lg p-6 border ${filterStatus === 'ALL' ? 'border-teal-500' : 'border-slate-200'} cursor-pointer`}
            onClick={() => setFilterStatus('ALL')}
          >
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search therapists..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
              >
                <option value="EN_ATTENTE">Pending</option>
                <option value="VALIDE">Approved</option>
                <option value="REJETE">Rejected</option>
                <option value="ALL">All</option>
              </select>
            </div>
            <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Results */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {filterStatus === 'ALL' ? 'All Profiles' : 
             filterStatus === 'EN_ATTENTE' ? 'Pending Profiles' :
             filterStatus === 'VALIDE' ? 'Approved Profiles' : 'Rejected Profiles'} ({filteredTherapists.length})
          </h2>
        </div>

        {/* Therapist Cards */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mx-auto" />
            <p className="mt-2 text-slate-600">Loading therapists...</p>
          </div>
        ) : filteredTherapists.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-slate-200">
            <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No profiles found
            </h3>
            <p className="text-slate-500">
              Adjust your search criteria to see more results.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredTherapists.map((therapist) => (
              <div key={therapist.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden">
                {/* Header with therapist info */}
                <div className={`p-6 text-white ${
                  therapist.statutProfil === 'VALIDE' ? 'bg-green-600' :
                  therapist.statutProfil === 'REJETE' ? 'bg-red-600' : 'bg-blue-600'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Profile picture or initials */}
                      {therapist.user?.profilePictureUrl ? (
                        <img
                          src={therapist.user.profilePictureUrl}
                          alt={therapist.user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-2 border-white">
                          <span className="text-lg font-bold">
                            {therapist.user ? getInitials(therapist.user.name) : '?'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-bold">
                          {therapist.user?.name || 'Unknown Therapist'}
                        </h3>
                        <div className="flex items-center mt-1 text-sm opacity-90">
                          <Clock className="w-4 h-4 mr-1" />
                          {therapist.anneesExperience} years of experience
                        </div>
                        <div className="flex items-center mt-1 text-sm opacity-90">
                          <Phone className="w-4 h-4 mr-1" />
                          {therapist.user?.phoneNumber || 'Phone not available'}
                        </div>
                      </div>
                    </div>
                    <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium">
                        {therapist.statutProfil === 'VALIDE' ? 'Approved' :
                         therapist.statutProfil === 'REJETE' ? 'Rejected' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rest of the therapist card content - keep the same */}
                <div className="p-6">
                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-3">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {therapist.specialites.map((spec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact info */}
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center text-slate-600">
                      <Mail className="w-4 h-4 mr-2 text-teal-500" />
                      <span className="text-sm">{therapist.user?.email || 'Email not available'}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Phone className="w-4 h-4 mr-2 text-teal-500" />
                      <span className="text-sm">{therapist.user?.phoneNumber || 'Phone not available'}</span>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <span className="font-medium text-slate-900">Languages:</span>
                    </div>
                    <p className="text-slate-600 text-sm">{therapist.languesParlees.join(', ')}</p>
                  </div>

                  {/* Location & Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-slate-600">
                      <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                      <span className="text-sm">{therapist.localisation}</span>
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Euro className="w-4 h-4 mr-2 text-teal-500" />
                      <span className="text-sm">{therapist.prixParHeure} MAD/hour</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-slate-900 mb-2">Description</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{therapist.description}</p>
                  </div>

                  {/* Diplomas */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <Award className="w-5 h-5 mr-2 text-purple-600" />
                      <h4 className="font-semibold text-slate-900">Diplomas</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {therapist.diplomas.map((diploma, index) => (
                        <div
                          key={index}
                          className="border border-slate-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-slate-900 text-sm">{diploma.title}</h5>
                            <span className="text-xs text-slate-500">{diploma.year}</span>
                          </div>
                          <p className="text-slate-600 text-xs">{diploma.institution}</p>
                          {diploma.imageUrl && (
                            <div className="mt-2 relative">
                              <img
                                src={`http://localhost:8040${diploma.imageUrl}`}
                                alt={diploma.title}
                                className="w-full h-20 object-cover rounded border cursor-pointer"
                                onClick={() => handleImageClick(`http://localhost:8040${diploma.imageUrl}`)}
                              />
                              <button 
                                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
                                onClick={() => handleImageClick(`http://localhost:8040${diploma.imageUrl}`)}
                              >
                                <Maximize2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {therapist.statutProfil === 'EN_ATTENTE' && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleValidate(therapist.id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedTherapist(therapist)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {selectedTherapist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Reject Profile
            </h3>
            <p className="text-slate-600 mb-4">
              Are you sure you want to reject this profile?
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (optional)"
              className="w-full p-3 border border-slate-300 rounded-lg mb-4 resize-none"
              rows={3}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedTherapist(null);
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedTherapist.id, rejectReason)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Diploma"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default TherapistValidationDashboard;