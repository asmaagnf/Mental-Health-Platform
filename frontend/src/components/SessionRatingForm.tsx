import React, { useState } from 'react';
import { Star, X, CheckCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface RatingFormProps {
  seanceId: string;
  therapistId: string;
  onClose: () => void;
  onRatingSubmitted: () => void;
}

const SessionRatingForm: React.FC<RatingFormProps> = ({ 
  seanceId, 
  therapistId, 
  onClose,
  onRatingSubmitted
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || '{}');
      const patientId = user?.id;

      await axios.post('http://localhost:8030/api/feedbacks', {
        patientId,
        therapistId,
        seanceId,
        rating,
        comment
      });

      toast.success('Merci pour votre évaluation!', {
        duration: 4000,
        position: 'top-right',
        icon: <CheckCircle className="text-green-500" />,
      });

      onRatingSubmitted();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Échec de l\'envoi de l\'évaluation', {
        duration: 4000,
        position: 'top-right',
        icon: <X className="text-red-500" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          disabled={isSubmitting}
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-4">Évaluer la séance</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Note
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRatingChange(value)}
                  className={`p-2 rounded-full ${rating >= value 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-slate-300'}`}
                  disabled={isSubmitting}
                >
                  <Star className="h-6 w-6" />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              id="comment"
              rows={4}
              className="form-textarea w-full"
              placeholder="Décrivez votre expérience avec ce thérapeute..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Envoi...
                </>
              ) : 'Envoyer l\'évaluation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionRatingForm;