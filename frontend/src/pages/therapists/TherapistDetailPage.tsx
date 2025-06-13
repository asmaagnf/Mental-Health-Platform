import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, Award, BookOpen, MessageCircle, Video, Users, CheckCircle } from 'lucide-react';
import axios from 'axios';
import FeedbackSection from '../../components/FeedbackSection';

interface Diploma {
  title: string;
  institution: string;
  year: number;
  imageUrl: string | null;
}

interface PlageHoraire {
  heureDebut: string;
  heureFin: string;
}

interface Disponibilite {
  id: string;
  therapeuteId: string;
  jour: string;
  plageHoraire: PlageHoraire;
}

interface Therapist {
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

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string | null;
  address: string | null;
  gender: string;
  role: string;
  profilePictureUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const TherapistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        setLoading(true);
        
        // Fetch therapist data
        const therapistRes = await axios.get(`http://localhost:8040/api/therapeutes/profiles/${id}`);
        setTherapist(therapistRes.data);
        
        // Fetch user data
        const userRes = await axios.get(`http://localhost:8090/api/user/${therapistRes.data.userId}`);
        setUser(userRes.data);
        
        // Fetch disponibilites
        const disponibilitesRes = await axios.get(
          `http://localhost:8040/api/therapeutes/${therapistRes.data.userId}/disponibilites`
        );
        setDisponibilites(disponibilitesRes.data);
        
        // Fetch average rating - CORRECTION ICI
        try {
          const averageRes = await axios.get(
            `http://localhost:8030/api/feedbacks/therapist/${therapistRes.data.userId}/average`
          );
          // L'API retourne directement le nombre (ex: 4.5), pas un objet
          const avg = Number(averageRes.data);
          setAverageRating(isNaN(avg) ? null : avg);
        } catch (ratingError) {
          console.error('Error fetching average rating:', ratingError);
          setAverageRating(null);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load therapist data. Please try again later.');
        setLoading(false);
        console.error('Error fetching therapist data:', err);
      }
    };
    
    if (id) {
      fetchTherapistData();
    }
  }, [id]);

  // Convertir les disponibilités en format plus utilisable pour l'interface
  const availability = disponibilites.map(dispo => {
    const joursTraduction: Record<string, string> = {
      'MONDAY': 'Monday',
      'TUESDAY': 'Tuesday',
      'WEDNESDAY': 'Wednesday',
      'THURSDAY': 'Thursday',
      'FRIDAY': 'Friday',
      'SATURDAY': 'Saturday',
      'SUNDAY': 'Sunday'
    };
    
    const formatHeure = (heure: string) => {
      const [hours, minutes] = heure.split(':');
      const hourNum = parseInt(hours, 10);
      const ampm = hourNum >= 12 ? 'PM' : 'AM';
      const hour12 = hourNum % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };
    
    const heureDebut = parseInt(dispo.plageHoraire.heureDebut.split(':')[0], 10);
    const heureFin = parseInt(dispo.plageHoraire.heureFin.split(':')[0], 10);
    const slots = [];
    
    for (let i = heureDebut; i < heureFin; i++) {
      slots.push(formatHeure(`${i}:00:00`));
    }
    
    return {
      day: joursTraduction[dispo.jour] || dispo.jour,
      slots,
      plageHoraire: {
        start: formatHeure(dispo.plageHoraire.heureDebut),
        end: formatHeure(dispo.plageHoraire.heureFin)
      }
    };
  });

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }
    alert(`Booking confirmed for ${selectedDate} at ${selectedTime}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!therapist || !user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-slate-600">Therapist not found.</p>
          <Link to="/therapists" className="mt-4 btn btn-outline">
            Back to Therapists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-slate-500">
          <li><Link to="/therapists" className="hover:text-teal-600">Therapists</Link></li>
          <li>/</li>
          <li className="text-slate-900">{user.name}</li>
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
                  src={user.profilePictureUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"}
                  alt={user.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="md:w-2/3 md:pl-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                    <p className="text-lg text-slate-600">Licensed Therapist</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="ml-1 font-medium">
                      {averageRating !== null ? averageRating.toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-slate-500 ml-1">
                      ({averageRating !== null ? 'based on reviews' : 'no reviews yet'})
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-slate-600">
                    <MapPin className="h-5 w-5 mr-2 text-slate-400" />
                    {therapist.localisation}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Clock className="h-5 w-5 mr-2 text-slate-400" />
                    {therapist.anneesExperience} years of experience
                  </div>
                  <div className="flex items-center text-slate-600">
                    <Award className="h-5 w-5 mr-2 text-slate-400" />
                    Licensed Professional
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-slate-900 mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {therapist.specialites.map((specialty, index) => (
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
            <p className="text-slate-600 mb-6">{therapist.description}</p>
            
            <h3 className="text-xl font-bold text-slate-900 mb-3">My Approach</h3>
            <p className="text-slate-600">
              I provide a compassionate and non-judgmental space to explore your concerns. 
              My approach is tailored to your unique needs and goals.
            </p>
          </div>

          {/* Education & Experience */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Education & Experience</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-3">Education</h3>
                <div className="space-y-4">
                  {therapist.diplomas.map((diploma, index) => (
                    <div key={index} className="flex items-start">
                      <BookOpen className="h-5 w-5 text-teal-500 mt-1 mr-3" />
                      <div>
                        <p className="font-medium text-slate-900">{diploma.title}</p>
                        <p className="text-slate-600">{diploma.institution}, {diploma.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-3">Languages</h3>
                <div className="flex gap-4">
                  {therapist.languesParlees.map((language, index) => (
                    <div key={index} className="flex items-center text-slate-600">
                      <CheckCircle className="h-4 w-4 text-teal-500 mr-1" />
                      {language}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          {therapist.userId && (
            <FeedbackSection 
              therapistId={therapist.userId} 
              onAverageRatingChange={setAverageRating}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Booking Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold text-slate-900">{therapist.prixParHeure} DH</span>
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
                Individual therapy
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
                  {availability.map((day) => (
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
                    availability
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
              {availability.map((day) => (
                <div key={day.day} className="flex items-start">
                  <Calendar className="h-5 w-5 text-teal-500 mt-1 mr-3" />
                  <div>
                    <p className="font-medium text-slate-900">{day.day}</p>
                    <p className="text-slate-600">
                      {day.plageHoraire.start} - {day.plageHoraire.end}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Available slots: {day.slots.join(', ')}
                    </p>
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