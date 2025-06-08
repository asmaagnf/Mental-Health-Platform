import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Award, Clock, DollarSign, Camera, Save, X } from 'lucide-react';

// Mock data for therapist profile
const MOCK_THERAPIST_DATA = {
  personalInfo: {
    firstName: 'Dr. Jane',
    lastName: 'Smith',
    email: 'jane.smith@therapy.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1985-03-15',
    gender: 'Female',
    address: '123 Wellness Street, Health City, HC 12345',
    bio: 'Experienced clinical psychologist specializing in cognitive behavioral therapy and trauma treatment. Passionate about helping individuals overcome challenges and achieve mental wellness.'
  },
  professionalInfo: {
    licenseNumber: 'PSY-12345-CA',
    specializations: ['Cognitive Behavioral Therapy', 'Trauma Treatment', 'Anxiety Disorders', 'Depression'],
    yearsOfExperience: 12,
    education: [
      {
        degree: 'Ph.D. in Clinical Psychology',
        institution: 'University of California, Los Angeles',
        year: '2012'
      },
      {
        degree: 'M.A. in Psychology',
        institution: 'Stanford University',
        year: '2008'
      }
    ],
    certifications: [
      'Licensed Clinical Psychologist',
      'Certified CBT Therapist',
      'EMDR Certified Therapist'
    ]
  },
  serviceInfo: {
    sessionTypes: ['Video Call', 'Phone Call', 'In-Person'],
    sessionDuration: [30, 45, 60],
    hourlyRates: {
      individual: 150,
      couples: 200,
      group: 80
    },
    availability: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '10:00', end: '14:00', available: false },
      sunday: { start: '10:00', end: '14:00', available: false }
    }
  }
};

const TherapistProfileEdit: React.FC = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState(MOCK_THERAPIST_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (section: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setProfileData(prev => ({
      ...prev,
      serviceInfo: {
        ...prev.serviceInfo,
        availability: {
          ...prev.serviceInfo.availability,
          [day]: {
            ...prev.serviceInfo.availability[day as keyof typeof prev.serviceInfo.availability],
            [field]: value
          }
        }
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile data:', profileData);
    setHasChanges(false);
    setIsEditing(false);
    // Show success message
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData(MOCK_THERAPIST_DATA);
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
              {profileData.personalInfo.firstName.charAt(0)}{profileData.personalInfo.lastName.charAt(0)}
            </div>
            {isEditing && (
              <button className="absolute -bottom-2 -right-2 p-2 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              {profileData.personalInfo.firstName} {profileData.personalInfo.lastName}
            </h3>
            <p className="text-slate-600">Licensed Clinical Psychologist</p>
            <p className="text-sm text-slate-500">{profileData.professionalInfo.yearsOfExperience} years of experience</p>
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.personalInfo.firstName}
                  onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.personalInfo.lastName}
                  onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={profileData.personalInfo.email}
                  onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={profileData.personalInfo.phone}
                  onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  className="form-input"
                  value={profileData.personalInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
                <select
                  className="form-select"
                  value={profileData.personalInfo.gender}
                  onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.personalInfo.address}
                  onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea
                  rows={4}
                  className="form-textarea"
                  value={profileData.personalInfo.bio}
                  onChange={(e) => handleInputChange('personalInfo', 'bio', e.target.value)}
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
              <h3 className="text-lg font-medium text-slate-900 mb-6">Licensing & Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">License Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileData.professionalInfo.licenseNumber}
                    onChange={(e) => handleInputChange('professionalInfo', 'licenseNumber', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
                  <input
                    type="number"
                    className="form-input"
                    value={profileData.professionalInfo.yearsOfExperience}
                    onChange={(e) => handleInputChange('professionalInfo', 'yearsOfExperience', parseInt(e.target.value))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Education</h3>
              <div className="space-y-4">
                {profileData.professionalInfo.education.map((edu, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">{edu.degree}</h4>
                      <span className="text-sm text-slate-500">{edu.year}</span>
                    </div>
                    <p className="text-slate-600">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.professionalInfo.specializations.map((spec, index) => (
                  <span key={index} className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Services & Availability Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Session Rates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Individual Therapy</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      className="form-input pl-10"
                      value={profileData.serviceInfo.hourlyRates.individual}
                      onChange={(e) => handleInputChange('serviceInfo', 'hourlyRates', {
                        ...profileData.serviceInfo.hourlyRates,
                        individual: parseInt(e.target.value)
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Couples Therapy</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      className="form-input pl-10"
                      value={profileData.serviceInfo.hourlyRates.couples}
                      onChange={(e) => handleInputChange('serviceInfo', 'hourlyRates', {
                        ...profileData.serviceInfo.hourlyRates,
                        couples: parseInt(e.target.value)
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Group Therapy</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="number"
                      className="form-input pl-10"
                      value={profileData.serviceInfo.hourlyRates.group}
                      onChange={(e) => handleInputChange('serviceInfo', 'hourlyRates', {
                        ...profileData.serviceInfo.hourlyRates,
                        group: parseInt(e.target.value)
                      })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-6">Weekly Availability</h3>
              <div className="space-y-4">
                {Object.entries(profileData.serviceInfo.availability).map(([day, schedule]) => (
                  <div key={day} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-20">
                        <span className="font-medium text-slate-900 capitalize">{day}</span>
                      </div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                          checked={schedule.available}
                          onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                          disabled={!isEditing}
                        />
                        <span className="ml-2 text-sm text-slate-600">Available</span>
                      </label>
                    </div>
                    {schedule.available && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          className="form-input w-32"
                          value={schedule.start}
                          onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                          disabled={!isEditing}
                        />
                        <span className="text-slate-500">to</span>
                        <input
                          type="time"
                          className="form-input w-32"
                          value={schedule.end}
                          onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistProfileEdit;