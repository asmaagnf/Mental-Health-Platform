import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, MapPin, Calendar } from 'lucide-react';

// Mock data for therapists
const MOCK_THERAPISTS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Anxiety & Depression",
    rating: 4.8,
    reviews: 124,
    location: "New York, NY",
    availableToday: true,
    education: "Ph.D. in Clinical Psychology",
    experience: "12 years",
    price: "$120",
    image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 2,
    name: "Dr. Michael Rodriguez",
    specialty: "Trauma & PTSD",
    rating: 4.9,
    reviews: 89,
    location: "Chicago, IL",
    availableToday: false,
    education: "Psy.D. in Clinical Psychology",
    experience: "8 years",
    price: "$150",
    image: "https://images.pexels.com/photos/5326953/pexels-photo-5326953.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 3,
    name: "Dr. Emily Chen",
    specialty: "Relationship Issues",
    rating: 4.7,
    reviews: 156,
    location: "San Francisco, CA",
    availableToday: true,
    education: "Ph.D. in Psychology",
    experience: "15 years",
    price: "$135",
    image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Stress Management",
    rating: 4.6,
    reviews: 72,
    location: "Boston, MA",
    availableToday: true,
    education: "Ph.D. in Counseling Psychology",
    experience: "10 years",
    price: "$110",
    image: "https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
  }
];

const TherapistListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialty: '',
    availableToday: false,
    priceRange: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Filter therapists based on search and filters
  const filteredTherapists = MOCK_THERAPISTS.filter(therapist => {
    // Search term filter
    if (searchTerm && !therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Specialty filter
    if (filters.specialty && therapist.specialty !== filters.specialty) {
      return false;
    }
    
    // Available today filter
    if (filters.availableToday && !therapist.availableToday) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange) {
      const price = parseInt(therapist.price.replace('$', ''));
      if (filters.priceRange === 'under100' && price >= 100) return false;
      if (filters.priceRange === '100-150' && (price < 100 || price > 150)) return false;
      if (filters.priceRange === 'over150' && price <= 150) return false;
    }
    
    return true;
  });
  
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
              placeholder="Search by name or specialty..."
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
                <select
                  id="specialty"
                  name="specialty"
                  className="form-input"
                  value={filters.specialty}
                  onChange={handleFilterChange}
                >
                  <option value="">All Specialties</option>
                  <option value="Anxiety & Depression">Anxiety & Depression</option>
                  <option value="Trauma & PTSD">Trauma & PTSD</option>
                  <option value="Relationship Issues">Relationship Issues</option>
                  <option value="Stress Management">Stress Management</option>
                </select>
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
                  <option value="under100">Under $100</option>
                  <option value="100-150">$100 - $150</option>
                  <option value="over150">Over $150</option>
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
                    src={therapist.image} 
                    alt={therapist.name} 
                    className="w-full h-48 md:h-full object-cover object-center"
                  />
                </div>
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{therapist.name}</h2>
                      <p className="text-teal-600 font-medium">{therapist.specialty}</p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="ml-1 font-medium">{therapist.rating}</span>
                      <span className="text-slate-500 ml-1">({therapist.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center text-slate-600">
                      <MapPin className="h-5 w-5 mr-2 text-slate-400" />
                      {therapist.location}
                    </div>
                    <div className="flex items-center text-slate-600">
                      <Calendar className="h-5 w-5 mr-2 text-slate-400" />
                      {therapist.availableToday ? (
                        <span className="text-green-600 font-medium">Available today</span>
                      ) : (
                        <span>Not available today</span>
                      )}
                    </div>
                    <div className="text-slate-600">
                      <span className="font-medium">Education:</span> {therapist.education}
                    </div>
                    <div className="text-slate-600">
                      <span className="font-medium">Experience:</span> {therapist.experience}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <div className="text-xl font-bold text-slate-900">{therapist.price} <span className="text-slate-500 text-base font-normal">/ session</span></div>
                    <div className="flex gap-3">
                      <Link 
                        to={`/therapists/${therapist.id}`}
                        className="btn btn-outline"
                      >
                        View Profile
                      </Link>
                      <Link
                        to={`/appointments/book/${therapist.id}`}
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