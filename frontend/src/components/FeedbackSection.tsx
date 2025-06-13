import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User } from 'lucide-react';
import axios from 'axios';

interface Feedback {
  id: string;
  patientId: string;
  therapistId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Patient {
  id: string;
  name: string;
  profilePictureUrl: string | null;
}

interface FeedbackSectionProps {
  therapistId: string;
  onAverageRatingChange?: (average: number | null) => void;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ 
  therapistId, 
  onAverageRatingChange 
}) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [patients, setPatients] = useState<Record<string, Patient>>({});
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch feedbacks and average rating in parallel
        const [feedbacksRes, averageRes] = await Promise.all([
          axios.get(`http://localhost:8030/api/feedbacks/therapist/${therapistId}`),
          axios.get(`http://localhost:8030/api/feedbacks/therapist/${therapistId}/average`)
        ]);

        setFeedbacks(feedbacksRes.data);
        
        // Update average rating - CORRECTION ICI
        const avg = Number(averageRes.data);
        setAverageRating(isNaN(avg) ? null : avg);
        if (onAverageRatingChange) onAverageRatingChange(isNaN(avg) ? null : avg);

        // Fetch patient data
        const patientsData: Record<string, Patient> = {};
        await Promise.all(
          feedbacksRes.data.map(async (feedback: Feedback) => {
            try {
              const patientRes = await axios.get(
                `http://localhost:8090/api/user/${feedback.patientId}`
              );
              patientsData[feedback.patientId] = {
                id: patientRes.data.id,
                name: patientRes.data.name,
                profilePictureUrl: patientRes.data.profilePictureUrl
              };
            } catch (patientError) {
              console.error(`Error fetching patient ${feedback.patientId}:`, patientError);
              patientsData[feedback.patientId] = {
                id: feedback.patientId,
                name: 'Anonymous',
                profilePictureUrl: null
              };
            }
          })
        );
        
        setPatients(patientsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load feedbacks. Please try again later.');
        setLoading(false);
        console.error('Error fetching feedbacks:', err);
      }
    };
    
    if (therapistId) {
      fetchData();
    }
  }, [therapistId, onAverageRatingChange]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
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

  if (feedbacks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Client Feedback</h2>
        <p className="text-slate-600">No feedback yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Client Feedback</h2>
      
      <div className="space-y-6">
        {feedbacks.map(feedback => {
          const patient = patients[feedback.patientId] || {
            id: feedback.patientId,
            name: 'Anonymous',
            profilePictureUrl: null
          };
          
          return (
            <div key={feedback.id} className="border-b border-slate-200 pb-6 last:border-0 last:pb-0">
              <div className="flex items-start">
                <div className="mr-4">
                  <img
                    src={patient.profilePictureUrl || "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"}
                    alt={patient.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-slate-900">{patient.name}</h3>
                      <p className="text-sm text-slate-500">
                        {new Date(feedback.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="ml-1 font-medium">{feedback.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center text-slate-600">
                    <MessageCircle className="h-5 w-5 mr-2 text-teal-500" />
                    <p className="text-slate-700">{feedback.comment}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FeedbackSection;