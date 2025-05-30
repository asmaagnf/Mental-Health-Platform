import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, Award, BookOpen, MessageCircle, Video, Users, CheckCircle } from 'lucide-react';

// Mock data for demonstration
const MOCK_THERAPIST = {
  id: '1',
  name: 'Dr. Sarah Johnson',
  title: 'Licensed Clinical Psychologist',
  rating: 4.8,
  reviews: 124,
  location: 'New York, NY',
  price: '$120',
  image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  specialties: ['Anxiety', 'Depression', 'Trauma', 'Relationships'],
  education: [
    {
      degree: 'Ph.D. in Clinical Psychology',
      school: 'Stanford University',
      year: '2010'
    },
    {
      degree: 'M.A. in Psychology',
      school: 'Columbia University',
      year: '2006'
    }
  ],
  experience: '12+ years',
  languages: ['English', 'Spanish'],
  about: 'Dr. Johnson specializes in helping individuals navigate life transitions, manage anxiety and depression, and heal from trauma. With over 12 years of experience, she combines evidence-based approaches with compassionate care to support her clients journey toward mental wellness.',
  approach: 'I believe in creating a safe, non-judgmental space where clients can explore their challenges and develop practical tools for growth. My approach integrates Cognitive Behavioral Therapy (CBT), Mindfulness, and Psychodynamic techniques, tailored to each clients unique needs.',
  availability: [
    { day: 'Monday', slots: ['9:00 AM', '2:00 PM', '4:00 PM'] },
    { day: 'Wednesday', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] },
    { day: 'Friday', slots: ['9:00 AM', '11:00 AM', '2:00 PM'] }
  ]
};

const TherapistDetailPage: React.FC = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Mock function to handle booking
  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }
    alert(`Booking confirmed for ${selectedDate} at ${selectedTime}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-slate-500">
          <li><Link to="/therapists" className="hover:text-teal-600">Therapists</Link></li>
          <li>/</li>
          <li className="text-slate-900">{MOCK_THERAPIST.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Therapist Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <img
                  src={MOCK_THERAPIST.image}
                  alt={MOCK_THERAPIST.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="md:w-2/3 md:pl-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{MOCK_THERAPIST.name}</h1>
                    <p className="text-lg text-slate-600">{MOCK_THERAPIST.title}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="ml-1 font-medium">{MOCK_THERAPIST.rating}</span>
                    <span className="text-slate-500 ml-1">({MOCK_THERAPIST.reviews} reviews)</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-slate-600">
                    <MapPin className="h-5 w-5 mr-2 text-slate-400" />
                    {MOCK_THERAPIST.location}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Clock className="h-5 w-5 mr-2 text-slate-400" />
                    {MOCK_THERAPIST.experience} of experience
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Award className="h-5 w-5 mr-2 text-slate-400" />
                    Licensed Professional
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-slate-900 mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_THERAPIST.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About Me</h2>
            <p className="text-slate-600 mb-6">{MOCK_THERAPIST.about}</p>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3">My Approach</h3>
            <p className="text-slate-600">{MOCK_THERAPIST.approach}</p>
          </div>

          {/* Education & Experience */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Education & Experience</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-3">Education</h3>
                <div className="space-y-4">
                  {MOCK_THERAPIST.education.map((edu, index) => (
                    <div key={index} className="flex items-start">
                      <BookOpen className="h-5 w-5 text-teal-500 mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-slate-900">{edu.degree}</p>
                        <p className="text-slate-600">{edu.school}, {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-3">Languages</h3>
                <div className="flex gap-4">
                  {MOCK_THERAPIST.languages.map((language, index) => (
                    <div key={index} className="flex items-center text-slate-600">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-1" />
                      {language}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold text-slate-900">{MOCK_THERAPIST.price}</span>
              <span className="text-slate-500">per session</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-slate-600">
                <Video className="h-5 w-5 mr-3 text-teal-500" />
                Online video sessions
              </div>
              <div className="flex items-center text-slate-600">
                <MessageCircle className="h-5 w-5 mr-3 text-teal-500" />
                Messaging between sessions
              </div>
              <div className="flex items-center text-slate-600">
                <Users className="h-5 w-5 mr-3 text-teal-500" />
                Individual & couples therapy
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Date
                </label>
                <select
                  className="form-input"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  <option value="">Choose a date</option>
                  {MOCK_THERAPIST.availability.map((day) => (
                    <option key={day.day} value={day.day}>{day.day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Time
                </label>
                <select
                  className="form-input"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={!selectedDate}
                >
                  <option value="">Choose a time</option>
                  {selectedDate && 
                    MOCK_THERAPIST.availability
                      .find(day => day.day === selectedDate)?.slots
                      .map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))
                  }
                </select>
              </div>

              <button
                className="w-full btn btn-primary"
                onClick={handleBooking}
              >
                Book Session
              </button>
            </div>
          </div>

          {/* Availability Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Weekly Availability</h3>
            <div className="space-y-3">
              {MOCK_THERAPIST.availability.map((day) => (
                <div key={day.day} className="flex items-start">
                  <Calendar className="h-5 w-5 text-teal-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-slate-900">{day.day}</p>
                    <p className="text-slate-600">{day.slots.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDetailPage;