import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Video } from 'lucide-react';

const BookingConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Confirmed!</h1>
        <p className="text-lg text-slate-600 mb-8">
          Your therapy session has been successfully booked.
        </p>
        
        <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left space-y-4">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-teal-500 mt-1 mr-3" />
            <div>
              <p className="font-medium text-slate-900">Date & Time</p>
              <p className="text-slate-600">June 13, 2025 at 6:00 PM</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Clock className="h-5 w-5 text-teal-500 mt-1 mr-3" />
            <div>
              <p className="font-medium text-slate-900">Duration</p>
              <p className="text-slate-600">60 minutes</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Video className="h-5 w-5 text-teal-500 mt-1 mr-3" />
            <div>
              <p className="font-medium text-slate-900">Session Type</p>
              <p className="text-slate-600">Online Video Session</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-slate-600">
            A confirmation has been sent to your email. The meeting link will be available 15 minutes before your session.
          </p>
          
          <div className="pt-6">
            <Link
              to="/patient/appointments"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;