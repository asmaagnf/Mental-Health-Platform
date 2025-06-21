import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, XCircle, RefreshCw, Download, Filter, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Payment {
  id: string;
  patientId: string;
  therapistId: string;
  seanceId: string;
  amount: number;
  paymentMethod: 'CARTE' | 'PAYPAL';
  paymentStatus: 'REUSSI' | 'ECHOUE' | 'EN_ATTENTE' | 'REMBOURSE';
  paymentDate: string;
  patient?: {
    id: string;
    name: string;
    profilePictureUrl: string | null;
  };
  therapist?: {
    id: string;
    name: string;
    profilePictureUrl: string | null;
  };
}

interface Refund {
  id: string;
  paiementId: string;
  montant: number;
  motif: string;
  dateRemboursement: string;
  payment?: Payment;
}

const AdminPaymentDashboard: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('payments');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterMethod, setFilterMethod] = useState<string>('ALL');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'payments') {
        const response = await axios.get('http://localhost:8060/api/payments');
        const paymentsData = response.data;
        
        // Fetch user info for each payment
        const paymentsWithUsers = await Promise.all(
          paymentsData.map(async (payment: Payment) => {
            const [patient, therapist] = await Promise.all([
              fetchUserInfo(payment.patientId),
              fetchUserInfo(payment.therapistId)
            ]);
            return { ...payment, patient, therapist };
          })
        );
        
        setPayments(paymentsWithUsers);
      } else {
        const response = await axios.get('http://localhost:8060/api/remboursements');
        const refundsData = response.data;
        
        // Fetch payment info for each refund
        const refundsWithPayments = await Promise.all(
          refundsData.map(async (refund: Refund) => {
            try {
              const payment = await axios.get(`http://localhost:8060/api/payments/${refund.paiementId}`);
              return { ...refund, payment: payment.data };
            } catch {
              return refund;
            }
          })
        );
        
        setRefunds(refundsWithPayments);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async (userId: string) => {
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
      console.error('Error fetching user info:', error);
      return {
        id: userId,
        name: 'Unknown User',
        profilePictureUrl: null
      };
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

  const handleRefund = async (paymentId: string) => {
    const reason = prompt('Enter refund reason:');
    if (!reason) return;

    try {
      await axios.post('http://localhost:8060/api/remboursements', {
        paiementId: paymentId,
        montant: payments.find(p => p.id === paymentId)?.amount || 0,
        motif: reason
      });
      toast.success('Refund processed successfully');
      fetchData();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error('Failed to process refund');
    }
  };

  const downloadReceipt = async (paymentId: string) => {
    try {
      const response = await axios.get(`http://localhost:8060/api/payments/${paymentId}/receipt`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast.error('Failed to download receipt');
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.therapist?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      filterStatus === 'ALL' || 
      payment.paymentStatus === filterStatus;
    
    const matchesMethod = 
      filterMethod === 'ALL' || 
      payment.paymentMethod === filterMethod;
    
    const matchesDate = 
      (!dateRange.start || new Date(payment.paymentDate) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(payment.paymentDate) <= new Date(dateRange.end));
    
    return matchesSearch && matchesStatus && matchesMethod && matchesDate;
  });

  const totalRevenue = payments
    .filter(p => p.paymentStatus === 'REUSSI')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalRefunds = refunds.reduce((sum, refund) => sum + refund.montant, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-lg text-gray-600 mt-2">
            Monitor and manage all payment transactions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-teal-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">MAD {totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <CreditCard className="w-8 h-8 text-blue-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Successful Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.paymentStatus === 'REUSSI').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Failed Payments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {payments.filter(p => p.paymentStatus === 'ECHOUE').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <RefreshCw className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-gray-500 text-sm">Total Refunds</p>
                <p className="text-2xl font-bold text-gray-900">MAD {totalRefunds.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center ${
                activeTab === 'payments'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('payments')}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Payments
            </button>
            <button
              className={`py-4 px-6 font-medium text-sm border-b-2 flex items-center ${
                activeTab === 'refunds'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('refunds')}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refunds
            </button>
          </nav>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            {activeTab === 'payments' && (
              <>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="REUSSI">Successful</option>
                    <option value="ECHOUE">Failed</option>
                    <option value="EN_ATTENTE">Pending</option>
                    <option value="REMBOURSE">Refunded</option>
                  </select>
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={filterMethod}
                    onChange={(e) => setFilterMethod(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                  >
                    <option value="ALL">All Methods</option>
                    <option value="CARTE">Credit Card</option>
                    <option value="PAYPAL">PayPal</option>
                  </select>
                </div>
              </>
            )}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Start date"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="End date"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : activeTab === 'payments' ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredPayments.length === 0 ? (
              <div className="p-12 text-center">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900 mt-4">No payments found</h3>
                <p className="text-gray-500 mt-1">
                  {payments.length === 0 
                    ? 'There are no payments yet.' 
                    : 'No payments match your search criteria.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Therapist</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {payment.patient?.profilePictureUrl ? (
                              <img
                                src={payment.patient.profilePictureUrl}
                                alt={payment.patient.name}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                                <span className="text-teal-800 text-xs font-medium">
                                  {getInitials(payment.patient?.name || 'PU')}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{payment.patient?.name}</div>
                              <div className="text-sm text-gray-500">Patient</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {payment.therapist?.profilePictureUrl ? (
                              <img
                                src={payment.therapist.profilePictureUrl}
                                alt={payment.therapist.name}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                                <span className="text-blue-800 text-xs font-medium">
                                  {getInitials(payment.therapist?.name || 'TU')}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{payment.therapist?.name}</div>
                              <div className="text-sm text-gray-500">Therapist</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          MAD {payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.paymentMethod === 'CARTE' ? 'Credit Card' : 'PayPal'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            payment.paymentStatus === 'REUSSI' ? 'bg-green-100 text-green-800' :
                            payment.paymentStatus === 'ECHOUE' ? 'bg-red-100 text-red-800' :
                            payment.paymentStatus === 'EN_ATTENTE' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {payment.paymentStatus === 'REUSSI' ? 'Successful' :
                             payment.paymentStatus === 'ECHOUE' ? 'Failed' :
                             payment.paymentStatus === 'EN_ATTENTE' ? 'Pending' : 'Refunded'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payment.paymentDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => downloadReceipt(payment.id)}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                            {payment.paymentStatus === 'REUSSI' && (
                              <button
                                onClick={() => handleRefund(payment.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {refunds.length === 0 ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-12 h-12 text-gray-400 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900 mt-4">No refunds found</h3>
                <p className="text-gray-500 mt-1">There are no refunds yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {refunds.map((refund) => (
                      <tr key={refund.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {refund.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {refund.paiementId.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          -MAD{refund.montant.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {refund.motif}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(refund.dateRemboursement)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {refund.payment?.patient ? (
                            <div className="flex items-center">
                              {refund.payment.patient.profilePictureUrl ? (
                                <img
                                  src={refund.payment.patient.profilePictureUrl}
                                  alt={refund.payment.patient.name}
                                  className="w-8 h-8 rounded-full mr-2"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2">
                                  <span className="text-teal-800 text-xs font-medium">
                                    {getInitials(refund.payment.patient.name)}
                                  </span>
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{refund.payment.patient.name}</div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Unknown</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentDashboard;