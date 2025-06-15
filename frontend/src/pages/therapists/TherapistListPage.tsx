import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Calendar } from 'lucide-react';
import axios from 'axios';

interface Diploma {
  title: string;
  institution: string;
  year: number;
  imageUrl: string | null;
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

interface CombinedTherapist extends Therapist {
  user: User;
}

const TherapistListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    availableToday: false,
    priceRange: ''
  });
 const [showFilters, setShowFilters] = useState(false);
const [therapists, setTherapists] = useState<CombinedTherapist[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
const [averageRatings, setAverageRatings] = useState<Record<string, number | null>>({});
const [isLoggedIn, setIsLoggedIn] = useState(false);

useEffect(() => {
  // Check if user is logged in
  const user = localStorage.getItem('user');
  setIsLoggedIn(!!user);

  const fetchTherapists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch therapists
      const therapistsRes = await axios.get('http://localhost:8040/api/therapeutes/profiles/all/valides');
      
      // Fetch user data and ratings for each therapist
      const combinedTherapists = await Promise.all(
        therapistsRes.data.map(async (therapist: Therapist) => {
          try {
            const [userRes, ratingRes] = await Promise.all([
              axios.get(`http://localhost:8090/api/user/${therapist.userId}`),
              axios.get(`http://localhost:8030/api/feedbacks/therapist/${therapist.userId}/average`)
            ]);
            
            const avg = Number(ratingRes.data);
            const rating = isNaN(avg) ? null : avg;
            
            // Update ratings state
            setAverageRatings(prev => ({...prev, [therapist.userId]: rating}));
            
            return { 
              ...therapist, 
              user: userRes.data,
              averageRating: rating
            };
          } catch (error) {
            console.error(`Error fetching data for therapist ${therapist.userId}:`, error);
            return { 
              ...therapist, 
              user: null,
              averageRating: null
            };
          }
        })
      );
      
      setTherapists(combinedTherapists);
    } catch (err) {
      console.error('Error fetching therapists:', err);
      setError('Failed to load therapists. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  fetchTherapists();
}, []);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Filter therapists based on search and filters
  const filteredTherapists = therapists.filter(therapist => {
    // Search term filter
    if (searchTerm && 
        !therapist.user?.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Specialty filter
    if (filters.specialty && 
        !therapist.specialites.some(s => s.toLowerCase().includes(filters.specialty.toLowerCase()))) {
      return false;
    }
    
    // Available today filter
    if (filters.availableToday && !therapist.available) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange) {
      if (filters.priceRange === 'under100' && therapist.prixParHeure >= 100) return false;
      if (filters.priceRange === '100-150' && (therapist.prixParHeure < 100 || therapist.prixParHeure > 150)) return false;
      if (filters.priceRange === 'over150' && therapist.prixParHeure <= 150) return false;
    }
    
    return true;
  });
  
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
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Find Your Therapist</h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Browse our network of licensed therapists and find the perfect match for your mental health needs.
        </p>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 form-input"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-outline flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
        
        {/* Filter panel */}
        {showFilters && (
          <div className="bg-slate-50 rounded-lg p-4 mb-6 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="specialty" className="form-label">Specialty</label>
                <input
                  type="text"
                  id="specialty"
                  name="specialty"
                  className="form-input"
                  placeholder="Filter by specialty..."
                  value={filters.specialty}
                  onChange={handleFilterChange}
                />
              </div>
              
              <div>
                <label htmlFor="priceRange" className="form-label">Price Range</label>
                <select
                  id="priceRange"
                  name="priceRange"
                  className="form-input"
                  value={filters.priceRange}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Price</option>
                  <option value="under100">Under 100 DH</option>
                  <option value="100-150">100 DH - 150 DH</option>
                  <option value="over150">Over 150 DH</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  id="availableToday"
                  name="availableToday"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                  checked={filters.availableToday}
                  onChange={handleFilterChange}
                />
                <label htmlFor="availableToday" className="ml-2 block text-sm text-slate-700">
                  Available today
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Results */}
      <div className="grid grid-cols-1 gap-6">
        {filteredTherapists.length > 0 ? (
          filteredTherapists.map(therapist => (
            <div key={therapist.id} className="card hover:shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4">
                  <img 
                    src={therapist.user?.profilePictureUrl 
                      ? `http://localhost:8090${therapist.user.profilePictureUrl}`
                      : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"} 
                    alt={therapist.user?.name} 
                    className="w-full h-48 md:h-full object-cover object-center"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{therapist.user?.name}</h2>
                      <p className="text-teal-600 font-medium">
                        {therapist.specialites.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    <span className="ml-1 font-medium">
                      {averageRatings[therapist.userId] !== null ? averageRatings[therapist.userId]?.toFixed(1) : 'N/A'}
                    </span>
                    <span className="text-slate-500 ml-1">
                      ({averageRatings[therapist.userId] !== null ? 'based on reviews' : 'no reviews yet'})
                    </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-5 w-5 mr-2 text-slate-400" />
                      {therapist.localisation}
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-5 w-5 mr-2 text-slate-400" />
                      {therapist.available ? (
                        <span className="text-green-600 font-medium">Available today</span>
                      ) : (
                        <span>Not available today</span>
                      )}
                    </div>
                    <div className="text-slate-600">
                      <span className="font-medium">Experience:</span> {therapist.anneesExperience} years
                    </div>
                    <div className="text-slate-600">
                      <span className="font-medium">Languages:</span> {therapist.languesParlees.join(', ')}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-xl font-bold text-slate-900">{therapist.prixParHeure} DH <span className="text-slate-500 text-base font-normal">/ session</span></div>
                    <div className="flex gap-3">
                      {!isLoggedIn ? (
                        <Link 
                          to={`/therapists/${therapist.userId}`}
                          className="btn btn-outline"
                        >
                          View Profile
                        </Link>
                      ) : (
                        <Link 
                          to={`/patient/therapists/${therapist.userId}`}
                          className="btn btn-outline"
                        >
                          View Profile
                        </Link>
                      )}
                      <Link
                        to={isLoggedIn 
                          ? `/appointments/book/${therapist.userId}`
                          : '/login?redirect=/therapists'}
                        className="btn btn-primary"
                      >
                        Book Session
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600">No therapists match your search criteria.</p>
            <button 
              className="mt-4 btn btn-outline"
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  specialty: '',
                  availableToday: false,
                  priceRange: ''
                });
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistListPage;