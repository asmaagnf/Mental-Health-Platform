import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

interface PaymentDTO {
  id: string;
  patientId: string;
  therapistId: string;
  seanceId: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<PaymentDTO[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentDTO[]>([]);
  const [therapistNames, setTherapistNames] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFriendlyStatus = (status: string): string => {
    return {
      'REUSSI': 'Paid',
      'EN_ATTENTE': 'Pending',
      'ECHOUE': 'Failed',
    }[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'REUSSI': return 'bg-green-100 text-green-800';
      case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ECHOUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPatientIdFromToken = (): string | null => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded: any = jwtDecode(token);
        return decoded.userId || null;
      }
    } catch (err) {
      console.error('Invalid token:', err);
    }
    return null;
  };

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      const patientId = getPatientIdFromToken();
      if (!patientId) {
        setError('No patient ID found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get<PaymentDTO[]>(
          `http://localhost:8060/api/payments/patient/${patientId}`
        );
        setPayments(response.data);

        // Fetch therapist names
        const uniqueTherapistIds = [...new Set(response.data.map(p => p.therapistId))];
        const namesMap: { [key: string]: string } = {};

        await Promise.all(
          uniqueTherapistIds.map(async (id) => {
            try {
              const res = await axios.get(`http://localhost:8090/api/user/${id}`);
              namesMap[id] = res.data.name;
            } catch (err) {
              console.error(`Failed to fetch therapist ${id}`);
              namesMap[id] = 'Unknown';
            }
          })
        );

        setTherapistNames(namesMap);
      } catch (err) {
        console.error(err);
        setError('Failed to load payment history.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    let filtered = [...payments];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.id.toLowerCase().includes(lowerSearch) ||
        (therapistNames[p.therapistId]?.toLowerCase().includes(lowerSearch))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.paymentStatus === statusFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter, therapistNames]);

  const totalPaid = payments
    .filter(p => p.paymentStatus === 'REUSSI')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.paymentStatus === 'EN_ATTENTE')
    .reduce((sum, p) => sum + p.amount, 0);

  const handleDownloadReceipt = async (paymentId: string) => {
    try {
      const response = await axios.get(`http://localhost:8060/api/payments/${paymentId}/receipt`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${paymentId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Failed to download receipt.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">My Payment History</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="text-2xl font-bold">MAD {totalPaid.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-sm text-gray-500">Pending Amount</p>
          <p className="text-2xl font-bold">MAD {pendingAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-sm text-gray-500">Payments Count</p>
          <p className="text-2xl font-bold">{payments.length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by payment ID or therapist name"
          className="border px-3 py-2 rounded w-full sm:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border px-3 py-2 rounded w-full sm:w-1/4"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="REUSSI">Paid</option>
          <option value="EN_ATTENTE">Pending</option>
          <option value="ECHOUE">Failed</option>
        </select>
      </div>

      {loading ? (
        <p>Loading payment data...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {filteredPayments.length === 0 ? (
            <p className="text-gray-500 text-center mt-4">No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Therapist</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Method</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="p-2">{p.id}</td>
                      <td className="p-2">{therapistNames[p.therapistId] || 'Loading...'}</td>
                      <td className="p-2">MAD {p.amount.toFixed(2)}</td>
                      <td className="p-2">{p.paymentMethod}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(p.paymentStatus)}`}>
                          {getFriendlyStatus(p.paymentStatus)}
                        </span>
                      </td>
                      <td className="p-2">{new Date(p.paymentDate).toLocaleDateString()}</td>
                      <td className="p-2">
                        <button
                          className="text-blue-600 hover:underline"
                          onClick={() => handleDownloadReceipt(p.id)}
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaymentHistory;
