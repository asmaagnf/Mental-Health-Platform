import React, { useState, useEffect } from 'react';
import { Star, Trash2, User, MessageSquare, Calendar, Search, Filter,RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface UserInfo {
  id: string;
  name: string;
  profilePictureUrl: string | null;
}

interface Feedback {
  id: string;
  seanceId: string;
  patientId: string;
  therapistId: string;
  rating: number;
  comment: string;
  sentAt: string;
  patient?: UserInfo;
  therapist?: UserInfo;
}

const AdminFeedbackDashboard: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8030/api/feedbacks');
      const feedbacksData = response.data;

      // Fetch user info for each feedback
      const feedbacksWithUsers = await Promise.all(
        feedbacksData.map(async (feedback: Feedback) => {
          const [patient, therapist] = await Promise.all([
            fetchUserInfo(feedback.patientId),
            fetchUserInfo(feedback.therapistId)
          ]);
          return { ...feedback, patient, therapist };
        })
      );

      setFeedbacks(feedbacksWithUsers);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async (userId: string): Promise<UserInfo> => {
    try {
      const response = await axios.get(`http://localhost:8090/api/user/${userId}`);
      const user = response.data;
      return {
        id: user.id,
        name: user.name,
        profilePictureUrl: user.profilePictureUrl 
          ? `http://localhost:8090${user.profilePictureUrl}`
          : null
      };
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      return {
        id: userId,
        name: 'Unknown User',
        profilePictureUrl: null
      };
    }
  };

  const deleteFeedback = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`http://localhost:8030/api/feedbacks/${id}`);
      setFeedbacks(prev => prev.filter(f => f.id !== id));
      toast.success('Feedback deleted successfully');
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback');
    } finally {
      setDeletingId(null);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = 
      feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.therapist?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = 
      filterRating === null || feedback.rating === filterRating;

    return matchesSearch && matchesRating;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
          <p className="text-lg text-gray-600 mt-2">
            Monitor and manage patient feedback for therapists
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={filterRating || ''}
                onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
              >
                <option value="">All Ratings</option>
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </select>
            </div>
            <button
              onClick={fetchFeedbacks}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-teal-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Total Feedback</p>
                <p className="text-2xl font-bold text-gray-900">{feedbacks.length}</p>
              </div>
            </div>
          </div>
          {[5, 4, 3, 2, 1].slice(0, 3).map(rating => (
            <div key={rating} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex mr-3">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Ratings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {feedbacks.filter(f => f.rating === rating).length}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading feedbacks...</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900 mt-4">No feedback found</h3>
              <p className="text-gray-500 mt-1">
                {feedbacks.length === 0 
                  ? 'There are no feedbacks yet.' 
                  : 'No feedback matches your search criteria.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFeedbacks.map((feedback) => (
                <div key={feedback.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    {/* Patient Info */}
                    <div className="flex items-start space-x-4 mb-4 md:mb-0">
                      {feedback.patient?.profilePictureUrl ? (
                        <img
                          src={feedback.patient.profilePictureUrl}
                          alt={feedback.patient.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                          <span className="text-teal-800 font-medium">
                            {getInitials(feedback.patient?.name || 'UU')}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{feedback.patient?.name}</h3>
                        <p className="text-sm text-gray-500">Patient</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-4 md:mb-0">
                      <div className="flex mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${i < feedback.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-900 font-medium">{feedback.rating}.0</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center text-gray-500 mb-4 md:mb-0">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">{formatDate(feedback.sentAt)}</span>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteFeedback(feedback.id)}
                      disabled={deletingId === feedback.id}
                      className="text-red-500 hover:text-red-700 transition-colors flex items-center"
                    >
                      {deletingId === feedback.id ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>

                  {/* Therapist Info */}
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="text-sm text-gray-500">About therapist:</span>
                    {feedback.therapist?.profilePictureUrl ? (
                      <img
                        src={feedback.therapist.profilePictureUrl}
                        alt={feedback.therapist.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-800 text-xs font-medium">
                          {getInitials(feedback.therapist?.name || 'TU')}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {feedback.therapist?.name}
                    </span>
                  </div>

                  {/* Comment */}
                  <div className="mt-4">
                    <p className="text-gray-700 whitespace-pre-line">{feedback.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackDashboard;