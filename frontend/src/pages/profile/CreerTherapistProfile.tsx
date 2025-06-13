import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Award, Clock, DollarSign, Camera, Save, X, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Diploma {
  title: string;
  institution: string;
  year: number;
  imageUrl: string | null;
}

interface TherapistProfile {
  specialites: string[];
  description: string;
  anneesExperience: number;
  diplomas: Diploma[];
  languesParlees: string[];
  localisation: string;
  available: boolean;
  prixParHeure: number;
}

const CreerTherapistProfile: React.FC = () => {
      const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profileData, setProfileData] = useState<TherapistProfile>({
    specialites: [],
    description: '',
    anneesExperience: 0,
    diplomas: [],
    languesParlees: [],
    localisation: '',
    available: true,
    prixParHeure: 0
  });
  const [newSpecialite, setNewSpecialite] = useState('');
  const [newLangue, setNewLangue] = useState('');
  const [newDiploma, setNewDiploma] = useState({
    title: '',
    institution: '',
    year: new Date().getFullYear(),
    imageUrl: null as string | null
  });
  const [diplomaImage, setDiplomaImage] = useState<File | null>(null);
  const [therapistId, setTherapistId] = useState('');

  useEffect(() => {
    // Get therapist ID from localStorage
    const user = JSON.parse(localStorage.getItem("user") || '{}');
    if (user?.id) {
      setTherapistId(user.id);
      fetchProfileData(user.id);
    }
  }, []);

  const fetchProfileData = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:8040/api/therapeutes/profiles/initial-create/${id}`);
      setProfileData(response.data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Initialize with empty data if no profile exists
      setProfileData({
        specialites: [],
        description: '',
        anneesExperience: 0,
        diplomas: [],
        languesParlees: [],
        localisation: '',
        available: true,
        prixParHeure: 0
      });
    }
  };

  const handleInputChange = (field: keyof TherapistProfile, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleDiplomaChange = (index: number, field: keyof Diploma, value: any) => {
    const updatedDiplomas = [...profileData.diplomas];
    updatedDiplomas[index] = {
      ...updatedDiplomas[index],
      [field]: value
    };
    handleInputChange('diplomas', updatedDiplomas);
  };

  const addSpecialite = () => {
    if (newSpecialite.trim() && !profileData.specialites.includes(newSpecialite.trim())) {
      handleInputChange('specialites', [...profileData.specialites, newSpecialite.trim()]);
      setNewSpecialite('');
    }
  };

  const removeSpecialite = (index: number) => {
    const updated = [...profileData.specialites];
    updated.splice(index, 1);
    handleInputChange('specialites', updated);
  };

  const addLangue = () => {
    if (newLangue.trim() && !profileData.languesParlees.includes(newLangue.trim())) {
      handleInputChange('languesParlees', [...profileData.languesParlees, newLangue.trim()]);
      setNewLangue('');
    }
  };

  const removeLangue = (index: number) => {
    const updated = [...profileData.languesParlees];
    updated.splice(index, 1);
    handleInputChange('languesParlees', updated);
  };

  const addDiploma = () => {
    if (newDiploma.title.trim() && newDiploma.institution.trim()) {
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
    const updated = [...profileData.diplomas];
    updated.splice(index, 1);
    handleInputChange('diplomas', updated);
  };

  const handleImageUpload = async (diplomaTitle: string) => {
    if (!diplomaImage || !therapistId) return;

    const formData = new FormData();
    formData.append('file', diplomaImage);
    formData.append('diplomaTitle', diplomaTitle);

    try {
      const response = await axios.post(
        `http://localhost:8040/api/therapeutes/profiles/${therapistId}/diplomas/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading diploma image:', error);
      return null;
    }
  };

  const handleSave = async () => {
    try {
      // First upload any diploma images
      const updatedDiplomas = await Promise.all(
        profileData.diplomas.map(async (diploma) => {
          if (diplomaImage && !diploma.imageUrl) {
            const imageUrl = await handleImageUpload(diploma.title);
            return { ...diploma, imageUrl };
          }
          return diploma;
        })
      );

      // Update profile data with new image URLs if any
      const dataToSave = {
        ...profileData,
        diplomas: updatedDiplomas
      };

      // Save the profile data
      await axios.post(
        `http://localhost:8040/api/therapeutes/profiles/initial-create/${therapistId}`,
        dataToSave
      );

      setHasChanges(false);
      setIsEditing(false);
      // Refresh data
      fetchProfileData(therapistId);
      toast('Profile saved successfully!');
      navigate('/therapeute/en-attente');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  const handleCancel = () => {
    fetchProfileData(therapistId);
    setHasChanges(false);
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <style>
        {`
        .card {
            background-color: #fff;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            font-weight: 500;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
        }
        .btn-primary {
            background-color: #0d9488;
            color: #fff;
            border: 1px solid #0d9488;
        }
        .btn-primary:hover {
            background-color: #0f766e;
        }
        .btn-outline {
            background-color: #fff;
            color: #475569;
            border: 1px solid #cbd5e1;
        }
        .btn-outline:hover {
            background-color: #f8fafc;
        }
        .form-input, .form-select, .form-textarea {
            display: block;
            width: 100%;
            padding: 0.5rem 0.75rem;
            border: 1px solid #cbd5e1;
            border-radius: 0.375rem;
            font-size: 1rem;
            line-height: 1.5;
            color: #1e293b;
            background-color: #fff;
            transition: all 0.15s ease-in-out;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none;
            border-color: #14b8a6;
            box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.1);
        }
        .form-input:disabled, .form-select:disabled, .form-textarea:disabled {
            background-color: #f8fafc;
            color: #64748b;
        }
        .tag {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        .tag-primary {
            background-color: #ccfbf1;
            color: #0d9488;
        }
        `}
      </style>

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
            {!isEditing && (
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
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {therapistId ? therapistId.charAt(0).toUpperCase() : 'T'}
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Your Therapist Profile</h3>
            <p className="text-slate-600">{profileData.specialites.join(', ') || 'No specialties yet'}</p>
            <p className="text-sm text-slate-500">{profileData.anneesExperience} years of experience</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-8">
        <nav className="flex -mb-px">
          {[
            { id: 'personal', label: 'Personal Information', icon: User },
            { id: 'professional', label: 'Professional Details', icon: Award },
            { id: 'services', label: 'Services & Pricing', icon: DollarSign },
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-slate-400 mr-2" />
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.localisation}
                    onChange={(e) => handleInputChange('localisation', e.target.value)}
                    disabled={!isEditing}
                    placeholder="City or region where you practice"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  value={profileData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Tell potential patients about yourself, your approach, and experience..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Professional Details Tab */}
        {activeTab === 'professional' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Specialties</h3>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.specialites.map((spec, index) => (
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
                  {profileData.languesParlees.map((lang, index) => (
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
              <h3 className="text-lg font-medium text-slate-900 mb-6">Education & Diplomas</h3>
              <div className="space-y-4 mb-6">
                {profileData.diplomas.map((diploma, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg">
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
                    {diploma.imageUrl && (
                      <div className="mt-2">
                        <img 
                          src={diploma.imageUrl} 
                          alt={`Diploma ${diploma.title}`} 
                          className="h-32 object-contain border rounded"
                        />
                      </div>
                    )}
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

            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Experience</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profileData.anneesExperience}
                    onChange={(e) => handleInputChange('anneesExperience', parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Services & Pricing Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Session Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Hourly Rate (MAD)</label>
                  <div className="relative">
                    
                    <input
                      type="number"
                      className="form-input pl-10"
                      value={profileData.prixParHeure}
                      onChange={(e) => handleInputChange('prixParHeure', parseFloat(e.target.value))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Availability</label>
                  <select
                    className="form-select"
                    value={profileData.available ? 'available' : 'not-available'}
                    onChange={(e) => handleInputChange('available', e.target.value === 'available')}
                    disabled={!isEditing}
                  >
                    <option value="available">Available for new clients</option>
                    <option value="not-available">Not currently available</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreerTherapistProfile;