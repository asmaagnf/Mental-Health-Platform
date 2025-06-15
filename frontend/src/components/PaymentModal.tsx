import React, { useState } from 'react';
import axios from 'axios';
import { X, CreditCard,CircleDollarSign } from 'lucide-react';

interface PaymentModalProps {
  session: {
    seanceId: string;
    therapeuteId: string;
    patientId: string;
  };
  amount: number;
  onSuccess: (paymentId: string) => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ session, amount, onSuccess, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<'CARTE' | 'PAYPAL'>('CARTE');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');
if (!session.therapeuteId || !session.patientId) {
    setError('Missing required session information');
    setIsProcessing(false);
    return;
  }
    try {
      // Process payment
      const paymentResponse = await axios.post('http://localhost:8060/api/payments', {
        seanceId: session.seanceId,
        patientId: session.patientId,
        therapistId: session.therapeuteId,
        amount: amount,
        paymentMethod: paymentMethod,
        paymentStatus: 'REUSSI' // In a real app, this would come from the payment processor
      });

      // Confirm session
      await axios.post(
        `http://localhost:8070/api/seances/confirm?seanceId=${session.seanceId}&paymentId=${paymentResponse.data.id}`
      );

      onSuccess(paymentResponse.data.id);
    } catch (err) {
      console.error('Payment error:', err);
      setError('Payment failed. Please try again or use a different payment method.');
      setIsProcessing(false);
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'number') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiry') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
      setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
      return;
    }
    
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-fade-in-up">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-bold text-slate-800">Complete Your Booking</h3>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <div className="mb-6 bg-teal-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Session Total</span>
              <span className="text-2xl font-bold text-teal-700">{amount} DH</span>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="mb-6">
            <div className="flex border-b border-slate-200">
              <button
                className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${paymentMethod === 'CARTE' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-500'}`}
                onClick={() => setPaymentMethod('CARTE')}
              >
                <CreditCard size={18} />
                Credit Card
              </button>
              <button
                className={`flex-1 py-3 font-medium flex items-center justify-center gap-2 ${paymentMethod === 'PAYPAL' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-500'}`}
                onClick={() => setPaymentMethod('PAYPAL')}
              >
                
                PayPal
              </button>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit}>
            {paymentMethod === 'CARTE' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    name="number"
                    value={cardDetails.number}
                    onChange={handleCardChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardDetails.expiry}
                      onChange={handleCardChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CVC</label>
                    <input
                      type="text"
                      name="cvc"
                      value={cardDetails.cvc}
                      onChange={handleCardChange}
                      placeholder="123"
                      maxLength={3}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    name="name"
                    value={cardDetails.name}
                    onChange={handleCardChange}
                    placeholder="Name on card"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="bg-blue-50 inline-flex p-4 rounded-full mb-4">
                  <CircleDollarSign size={40} className="text-blue-600" />
                </div>
                <p className="text-slate-600 mb-6">You will be redirected to PayPal to complete your payment securely.</p>
              </div>
            )}

            {error && (
              <div className="mt-4 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${isProcessing ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'} transition flex items-center justify-center`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `Pay ${amount} DH`
                )}
              </button>
              
              <p className="text-xs text-slate-500 mt-3 text-center">
                Your payment is secure and encrypted. By continuing, you agree to our Terms of Service.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;