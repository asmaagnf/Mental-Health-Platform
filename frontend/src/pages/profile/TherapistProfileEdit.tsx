import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  User, Mail, Phone, MapPin, Calendar, Award, Clock, 
  DollarSign, Camera, Save, X, Plus, Trash2, Check, XCircle,
  Loader2
} from 'lucide-react';

interface Diploma {
  title: string;
  institution: string;
  year: number;
  imageUrl: string | null;
}

interface Availability {
  id?: string;
  jour: string;
  plageHoraire: {
    heureDebut: string;
    heureFin: string;
  };
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
  statutProfil: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  address: string | null;
  gender: string;
  role: string;
  profilePictureUrl: string;
  createdAt: string;
  updatedAt: string;
}

const TherapistProfileEdit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState<TherapistProfile | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [newSpecialite, setNewSpecialite] = useState('');
  const [newLangue, setNewLangue] = useState('');
  const [newDiploma, setNewDiploma] = useState({
    title: '',
    institution: '',
    year: new Date().getFullYear(),
    imageUrl: null as string | null
  });
  const [diplomaImage, setDiplomaImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [newAvailability, setNewAvailability] = useState({
    jour: 'MONDAY',
    plageHoraire: {
      heureDebut: '09:00',
      heureFin: '17:00'
    }
  });
  const [loading, setLoading] = useState(true);
  const [localAvailabilities, setLocalAvailabilities] = useState<Availability[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get therapist ID from localStorage
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const therapistId = user?.id;

  // Fetch therapist profile data
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const [profileRes, userRes, availabilitiesRes] = await Promise.all([
        axios.get(`http://localhost:8040/api/therapeutes/profiles/user/${therapistId}`),
        axios.get(`http://localhost:8090/api/user/${therapistId}`),
        axios.get(`http://localhost:8040/api/therapeutes/${therapistId}/disponibilites`)
      ]);
      
      setProfileData(profileRes.data);
      setUserData(userRes.data);
      setAvailabilities(availabilitiesRes.data);
      setLocalAvailabilities(availabilitiesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (therapistId) {
      fetchProfileData();
    }
  }, [therapistId]);

  const handleInputChange = (field: keyof TherapistProfile, value: any) => {
    if (profileData) {
      setProfileData({
        ...profileData,
        [field]: value
      });
      setHasChanges(true);
    }
  };

  const handleUserInputChange = (field: keyof UserData, value: any) => {
    if (userData) {
      setUserData({
        ...userData,
        [field]: value
      });
      setHasChanges(true);
    }
  };

  const handleDiplomaChange = (index: number, field: keyof Diploma, value: any) => {
    if (profileData) {
      const updatedDiplomas = [...profileData.diplomas];
      updatedDiplomas[index] = {
        ...updatedDiplomas[index],
        [field]: value
      };
      handleInputChange('diplomas', updatedDiplomas);
    }
  };

  const handleAvailabilityChange = (index: number, field: keyof Availability, value: any) => {
    const updatedAvailabilities = [...localAvailabilities];
    updatedAvailabilities[index] = {
      ...updatedAvailabilities[index],
      [field]: value
    };
    setLocalAvailabilities(updatedAvailabilities);
    setHasChanges(true);
  };

  const handleTimeChange = (index: number, field: 'heureDebut' | 'heureFin', value: string) => {
    const updatedAvailabilities = [...localAvailabilities];
    updatedAvailabilities[index] = {
      ...updatedAvailabilities[index],
      plageHoraire: {
        ...updatedAvailabilities[index].plageHoraire,
        [field]: value + ':00'
      }
    };
    setLocalAvailabilities(updatedAvailabilities);
    setHasChanges(true);
  };

  const addSpecialite = () => {
    if (newSpecialite.trim() && profileData && !profileData.specialites.includes(newSpecialite.trim())) {
      handleInputChange('specialites', [...profileData.specialites, newSpecialite.trim()]);
      setNewSpecialite('');
    }
  };

  const removeSpecialite = (index: number) => {
    if (profileData) {
      const updated = [...profileData.specialites];
      updated.splice(index, 1);
      handleInputChange('specialites', updated);
    }
  };

  const addLangue = () => {
    if (newLangue.trim() && profileData && !profileData.languesParlees.includes(newLangue.trim())) {
      handleInputChange('languesParlees', [...profileData.languesParlees, newLangue.trim()]);
      setNewLangue('');
    }
  };

  const removeLangue = (index: number) => {
    if (profileData) {
      const updated = [...profileData.languesParlees];
      updated.splice(index, 1);
      handleInputChange('languesParlees', updated);
    }
  };

  const addDiploma = () => {
    if (newDiploma.title.trim() && newDiploma.institution.trim() && profileData) {
      handleInputChange('diplomas', [...profileData.diplomas, { ...newDiploma }]);
      setNewDiploma({
        title: '',
        institution: '',
        year: new Date().getFullYear(),
        imageUrl: null
      });
    }
  };

  const removeDiploma = (index: number) => {
    if (profileData) {
      const updated = [...profileData.diplomas];
      updated.splice(index, 1);
      handleInputChange('diplomas', updated);
    }
  };

  // Add new availability to local state
  const addNewAvailability = () => {
    setLocalAvailabilities([
      ...localAvailabilities,
      {
        ...newAvailability,
        plageHoraire: {
          heureDebut: newAvailability.plageHoraire.heureDebut + ':00',
          heureFin: newAvailability.plageHoraire.heureFin + ':00'
        }
      }
    ]);
    setNewAvailability({
      jour: 'MONDAY',
      plageHoraire: {
        heureDebut: '09:00',
        heureFin: '17:00'
      }
    });
    setHasChanges(true);
  };

  // Delete an availability from local state
  const deleteAvailability = (index: number) => {
    const updated = [...localAvailabilities];
    updated.splice(index, 1);
    setLocalAvailabilities(updated);
    setHasChanges(true);
  };

  const handleImageUpload = async (file: File, isProfilePicture: boolean = false) => {
    if (!file || !therapistId) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const endpoint = isProfilePicture 
        ? `http://localhost:8090/api/user/${therapistId}/upload-profile-picture`
        : `http://localhost:8040/api/therapeutes/profiles/${therapistId}/diplomas/upload`;
      
      const response = await axios.post(
        endpoint,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return isProfilePicture 
        ? response.data.profilePictureUrl 
        : response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file (JPEG, PNG)');
            return;
        }

        // Validate file size (e.g., 2MB max)
        if (file.size > 2 * 1024 * 1024) {
            alert('Image size should be less than 2MB');
            return;
        }

        setProfileImage(file);
        
        // Preview the image
        const reader = new FileReader();
        reader.onload = (event) => {
            if (userData && event.target?.result) {
                setUserData({
                    ...userData,
                    profilePictureUrl: event.target.result as string
                });
            }
        };
        reader.readAsDataURL(file);
        
        setHasChanges(true);
    }
};
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSave = async () => {
    if (!profileData || !userData || !therapistId) return;

try {
        // First upload profile picture if changed
        let profilePictureUrl = userData.profilePictureUrl;
        if (profileImage) {
            const uploadedUrl = await handleImageUpload(profileImage, true);
            if (uploadedUrl) {
                profilePictureUrl = uploadedUrl;
            } else {
                throw new Error('Failed to upload profile picture');
            }
        }


      // Then upload any diploma images
      const updatedDiplomas = await Promise.all(
        profileData.diplomas.map(async (diploma) => {
          if (diplomaImage && !diploma.imageUrl) {
            const imageUrl = await handleImageUpload(diplomaImage);
            return { ...diploma, imageUrl };
          }
          return diploma;
        })
      );

      // Update profile data
      const updatedProfile = {
        ...profileData,
        diplomas: updatedDiplomas
      };

      // Save availabilities
      const availabilityPromises = localAvailabilities.map(avail => {
        if (avail.id) {
          return axios.put(
            `http://localhost:8040/api/therapeutes/disponibilites/${avail.id}`,
            avail
          );
        } else {
          return axios.post(
            `http://localhost:8040/api/therapeutes/${therapistId}/disponibilites`,
            avail
          );
        }
      });

      // Save all data
      await Promise.all([
        axios.put(`http://localhost:8040/api/therapeutes/profiles/${therapistId}`, updatedProfile),
        axios.put(`http://localhost:8090/api/user/update/${therapistId}`, {
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          dateOfBirth: userData.dateOfBirth,
          address: userData.address,
          gender: userData.gender,
          profilePictureUrl
        }),
        ...availabilityPromises
      ]);

      setHasChanges(false);
      setIsEditing(false);
      fetchProfileData(); // Refresh all data
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleCancel = () => {
    fetchProfileData();
    setHasChanges(false);
    setIsEditing(false);
    setProfileImage(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!profileData || !userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <XCircle className="h-12 w-12 mx-auto text-red-500" />
          <h2 className="text-xl font-semibold mt-4">Failed to load profile data</h2>
          <button 
            onClick={fetchProfileData}
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile Settings</h1>
            <p className="text-lg text-slate-600">Manage your professional profile and settings</p>
          </div>
          <div className="flex space-x-3">
            {hasChanges && (
              <>
                <button onClick={handleCancel} className="btn btn-outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
                <button onClick={handleSave} className="btn btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </>
            )}
            {!isEditing && !hasChanges && (
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Photo Section */}
      <div className="card p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="relative">
            {userData?.profilePictureUrl ? (
              <img 
                src={userData.profilePictureUrl.startsWith('http') 
                  ? userData.profilePictureUrl 
                  : `http://localhost:8090${userData.profilePictureUrl}`}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {userData?.name?.charAt(0) || 'T'}
              </div>
            )}
            {isEditing && (
              <>
                <button 
                  onClick={triggerFileInput}
                  className="absolute -bottom-2 -right-2 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfileImageChange}
                  className="hidden"
                  accept="image/*"
                />
              </>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {isEditing ? (
                <input
                  type="text"
                  className="form-input font-bold text-xl"
                  value={userData?.name || ''}
                  onChange={(e) => handleUserInputChange('name', e.target.value)}
                />
              ) : (
                userData?.name || 'Therapist'
              )}
            </h3>
            <p className="text-slate-600">{(profileData?.specialites || []).join(', ') || 'No specialties'}</p>
            <p className="text-sm text-slate-500">{profileData?.anneesExperience || 0} years of experience</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-8">
        <nav className="flex -mb-px">
          {[
            { id: 'personal', label: 'Personal Information', icon: User },
            { id: 'professional', label: 'Professional Details', icon: Award },
            { id: 'services', label: 'Services & Availability', icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Personal Information Tab */}
        {activeTab === 'personal' && (
          <div className="card p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={userData?.name || ''}
                  onChange={(e) => handleUserInputChange('name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={userData?.email || ''}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={userData?.phoneNumber || ''}
                  onChange={(e) => handleUserInputChange('phoneNumber', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={userData?.dateOfBirth || ''}
                  onChange={(e) => handleUserInputChange('dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                <select
                  className="form-select"
                  value={userData?.gender || 'FEMALE'}
                  onChange={(e) => handleUserInputChange('gender', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="FEMALE">Female</option>
                  <option value="MALE">Male</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={userData?.address || ''}
                  onChange={(e) => handleUserInputChange('address', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        )}

        {/* Professional Details Tab */}
        {activeTab === 'professional' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profileData?.anneesExperience || 0}
                    onChange={(e) => handleInputChange('anneesExperience', parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hourly Rate (MAD)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profileData?.prixParHeure || 0}
                    onChange={(e) => handleInputChange('prixParHeure', parseFloat(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Specialties</h3>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(profileData?.specialites || []).map((spec, index) => (
                    <div key={index} className="tag tag-primary flex items-center">
                      {spec}
                      {isEditing && (
                        <button 
                          onClick={() => removeSpecialite(index)} 
                          className="ml-1 text-teal-700 hover:text-teal-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="form-input flex-1"
                      value={newSpecialite}
                      onChange={(e) => setNewSpecialite(e.target.value)}
                      placeholder="Add a new specialty"
                    />
                    <button 
                      onClick={addSpecialite}
                      className="btn btn-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Languages Spoken</h3>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {(profileData?.languesParlees || []).map((lang, index) => (
                    <div key={index} className="tag tag-primary flex items-center">
                      {lang}
                      {isEditing && (
                        <button 
                          onClick={() => removeLangue(index)} 
                          className="ml-1 text-teal-700 hover:text-teal-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="form-input flex-1"
                      value={newLangue}
                      onChange={(e) => setNewLangue(e.target.value)}
                      placeholder="Add a new language"
                    />
                    <button 
                      onClick={addLangue}
                      className="btn btn-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Description</h3>
              <textarea
                rows={4}
                className="form-textarea"
                value={profileData?.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!isEditing}
                placeholder="Tell potential patients about yourself, your approach, and experience..."
              />
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Diplomas</h3>
              <div className="space-y-4 mb-6">
                {(profileData?.diplomas || []).map((diploma, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-slate-900">
                          <input
                            type="text"
                            className="form-input font-medium text-slate-900 mb-1"
                            value={diploma.title}
                            onChange={(e) => handleDiplomaChange(index, 'title', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Degree title"
                          />
                        </h4>
                        <p className="text-slate-600">
                          <input
                            type="text"
                            className="form-input text-slate-600"
                            value={diploma.institution}
                            onChange={(e) => handleDiplomaChange(index, 'institution', e.target.value)}
                            disabled={!isEditing}
                            placeholder="Institution name"
                          />
                        </p>
                      </div>
                      {isEditing && (
                        <button 
                          onClick={() => removeDiploma(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <input
                        type="number"
                        className="form-input w-24"
                        value={diploma.year}
                        onChange={(e) => handleDiplomaChange(index, 'year', parseInt(e.target.value))}
                        disabled={!isEditing}
                      />
                      {diploma.imageUrl && (
                        <div className="mt-2">
                          <img
                            src={`http://localhost:8040${diploma.imageUrl}`}
                            alt={diploma.title}
                            className="w-full h-20 object-cover rounded border"
                          />
                        </div>
                      )}
                      {isEditing && (
                        <div>
                          <label className="inline-flex items-center">
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setDiplomaImage(e.target.files[0]);
                                  handleDiplomaChange(index, 'imageUrl', URL.createObjectURL(e.target.files[0]));
                                }
                              }}
                            />
                            <span className="btn btn-outline text-sm">
                              <Camera className="h-4 w-4 mr-1" />
                              {diploma.imageUrl ? 'Change Image' : 'Upload Image'}
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-slate-900 mb-4">Add New Diploma</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Degree Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newDiploma.title}
                        onChange={(e) => setNewDiploma({...newDiploma, title: e.target.value})}
                        placeholder="e.g. Master in Psychology"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Institution</label>
                      <input
                        type="text"
                        className="form-input"
                        value={newDiploma.institution}
                        onChange={(e) => setNewDiploma({...newDiploma, institution: e.target.value})}
                        placeholder="University name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                      <input
                        type="number"
                        className="form-input"
                        value={newDiploma.year}
                        onChange={(e) => setNewDiploma({...newDiploma, year: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={addDiploma}
                    className="btn btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Diploma
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Services & Availability Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Availability</h3>
              <div className="space-y-4">
                {localAvailabilities.map((availability, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <select
                        className="form-select w-32"
                        value={availability.jour}
                        onChange={(e) => handleAvailabilityChange(index, 'jour', e.target.value)}
                        disabled={!isEditing}
                      >
                        <option value="MONDAY">Monday</option>
                        <option value="TUESDAY">Tuesday</option>
                        <option value="WEDNESDAY">Wednesday</option>
                        <option value="THURSDAY">Thursday</option>
                        <option value="FRIDAY">Friday</option>
                        <option value="SATURDAY">Saturday</option>
                        <option value="SUNDAY">Sunday</option>
                      </select>
                      {isEditing && (
                        <button 
                          onClick={() => deleteAvailability(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        className="form-input w-32"
                        value={availability.plageHoraire.heureDebut.split(':').slice(0, 2).join(':')}
                        onChange={(e) => handleTimeChange(index, 'heureDebut', e.target.value)}
                        disabled={!isEditing}
                      />
                      <span className="text-slate-500">to</span>
                      <input
                        type="time"
                        className="form-input w-32"
                        value={availability.plageHoraire.heureFin.split(':').slice(0, 2).join(':')}
                        onChange={(e) => handleTimeChange(index, 'heureFin', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {isEditing && (
                <div className="mt-6">
                  <h4 className="font-medium text-slate-900 mb-4">Add New Availability</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Day</label>
                      <select
                        className="form-select"
                        value={newAvailability.jour}
                        onChange={(e) => setNewAvailability({...newAvailability, jour: e.target.value})}
                      >
                        <option value="MONDAY">Monday</option>
                        <option value="TUESDAY">Tuesday</option>
                        <option value="WEDNESDAY">Wednesday</option>
                        <option value="THURSDAY">Thursday</option>
                        <option value="FRIDAY">Friday</option>
                        <option value="SATURDAY">Saturday</option>
                        <option value="SUNDAY">Sunday</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                      <input
                        type="time"
                        className="form-input"
                        value={newAvailability.plageHoraire.heureDebut}
                        onChange={(e) => setNewAvailability({
                          ...newAvailability,
                          plageHoraire: {
                            ...newAvailability.plageHoraire,
                            heureDebut: e.target.value
                          }
                        })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                      <input
                        type="time"
                        className="form-input"
                        value={newAvailability.plageHoraire.heureFin}
                        onChange={(e) => setNewAvailability({
                          ...newAvailability,
                          plageHoraire: {
                            ...newAvailability.plageHoraire,
                            heureFin: e.target.value
                          }
                        })}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={addNewAvailability}
                    className="btn btn-primary"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Availability
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistProfileEdit;