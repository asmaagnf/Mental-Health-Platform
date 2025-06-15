import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, Award, BookOpen, MessageCircle, Video, Users, CheckCircle } from 'lucide-react';
import axios from 'axios';
import FeedbackSection from '../../components/FeedbackSection';
import PaymentModal from '../../components/PaymentModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState<number>(60);
  const [sessionType, setSessionType] = useState<'EN_LIGNE' | 'PRESENTIEL'>('EN_LIGNE');
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingSession, setPendingSession] = useState<any>(null);
  const navigate = useNavigate();
  const patient = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchTherapistData = async () => {
      try {
        setLoading(true);
        
        const therapistRes = await axios.get(`http://localhost:8040/api/therapeutes/profiles/user/${id}`);
        setTherapist(therapistRes.data);
        
        const userRes = await axios.get(`http://localhost:8090/api/user/${therapistRes.data.userId}`);
        setUser(userRes.data);
        
        const disponibilitesRes = await axios.get(
          `http://localhost:8040/api/therapeutes/${therapistRes.data.userId}/disponibilites`
        );
        setDisponibilites(disponibilitesRes.data);
        
        try {
          const averageRes = await axios.get(
            `http://localhost:8030/api/feedbacks/therapist/${therapistRes.data.userId}/average`
          );
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
      dayEnum: dispo.jour,
      slots,
      plageHoraire: {
        start: formatHeure(dispo.plageHoraire.heureDebut),
        end: formatHeure(dispo.plageHoraire.heureFin)
      }
    };
  });

  const availableDays = availability.map(a => a.dayEnum);
  
  const isDayAvailable = (date: Date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
    return availableDays.includes(day);
  };

  const convertTo24Hour = (time12: string) => {
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = String(parseInt(hours, 10) + 12);
    }
    
    return `${hours.padStart(2, '0')}:${minutes}:00`;
  };

  const handleBooking = async () => {
  if (!selectedDate || !selectedTime) {
    alert('Please select both date and time');
    return;
  }

  try {
    const time24 = convertTo24Hour(selectedTime);
    
    // Create date string in local timezone (YYYY-MM-DD format)
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    const dateTime = `${dateStr}T${time24}`;
    
    const response = await axios.post(
      `http://localhost:8070/api/seances/pending?therapistId=${id}&patientId=${patient.id}&dateTime=${encodeURIComponent(dateTime)}&dureeMinutes=${duration}&typeSeance=${sessionType}`
    );
    
    setPendingSession({
      ...response.data});
    setShowPaymentModal(true);
  } catch (error) {
    console.error('Error creating pending session:', error);
    if (error.response) {
      alert(`Failed to create booking: ${error.response.data.message || error.response.statusText}`);
    } else {
      alert('Failed to create booking. Please try again.');
    }
  }
};

  const handlePaymentSuccess = (paymentId: string) => {
    setShowPaymentModal(false);
    navigate(`/patient/booking-confirmation/${pendingSession.seanceId}`);
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
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-slate-500">
          <li><Link to="/therapists" className="hover:text-teal-600">Therapists</Link></li>
          <li>/</li>
          <li className="text-slate-900">{user.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 mb-4 md:mb-0">
                <img
                  src={`http://localhost:8090${user.profilePictureUrl}` || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"}
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

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About Me</h2>
            <p className="text-slate-600 mb-6">{therapist.description}</p>
          </div>

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

          {therapist.userId && (
            <FeedbackSection 
              therapistId={therapist.userId} 
              onAverageRatingChange={setAverageRating}
            />
          )}
        </div>

        <div className="space-y-6">
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
                  Session Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-lg border ${sessionType === 'EN_LIGNE' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-300'}`}
                    onClick={() => setSessionType('EN_LIGNE')}
                  >
                    Online
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-lg border ${sessionType === 'PRESENTIEL' ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-300'}`}
                    onClick={() => setSessionType('PRESENTIEL')}
                  >
                    In-Person
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                >
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Date
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setSelectedTime('');
                  }}
                  filterDate={isDayAvailable}
                  minDate={new Date()}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  placeholderText="Select a date"
                  dateFormat="MMMM d, yyyy"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Available days: {availability.map(a => a.day).join(', ')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Select Time
                </label>
                <select
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  disabled={!selectedDate}
                >
                  <option value="">Choose a time</option>
                  {selectedDate && 
                    availability
                      .find(day => 
                        day.dayEnum === selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()
                      )?.slots
                      .map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))
                  }
                </select>
              </div>

              <button
                className="w-full py-3 px-4 rounded-lg font-medium text-white bg-teal-600 hover:bg-teal-700 transition"
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
              >
                Book Session
              </button>
            </div>
          </div>

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

      {showPaymentModal && pendingSession && (
        <>{console.log('Pending session data:', pendingSession)}
        <PaymentModal
          session={pendingSession}
          amount={therapist?.prixParHeure || 0}
          onSuccess={handlePaymentSuccess}
          onClose={() => setShowPaymentModal(false)}
        />
        </>
      )}
    </div>
  );
};

export default TherapistDetailPage;