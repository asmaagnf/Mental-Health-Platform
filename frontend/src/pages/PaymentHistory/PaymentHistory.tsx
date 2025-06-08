import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar, Download, Filter, Search, TrendingUp, TrendingDown } from 'lucide-react';

// Mock data for payment history
const MOCK_PAYMENT_DATA = [
  {
    id: 1,
    sessionDate: '2023-05-15',
    patientName: 'Sarah Johnson',
    sessionType: 'Video Therapy',
    amount: 120.00,
    status: 'paid',
    paymentDate: '2023-05-15',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN_001234'
  },
  {
    id: 2,
    sessionDate: '2023-05-14',
    patientName: 'Michael Chen',
    sessionType: 'In-Person Therapy',
    amount: 150.00,
    status: 'paid',
    paymentDate: '2023-05-14',
    paymentMethod: 'Insurance',
    transactionId: 'TXN_001235'
  },
  {
    id: 3,
    sessionDate: '2023-05-13',
    patientName: 'Emma Wilson',
    sessionType: 'Phone Consultation',
    amount: 80.00,
    status: 'pending',
    paymentDate: null,
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN_001236'
  },
  {
    id: 4,
    sessionDate: '2023-05-12',
    patientName: 'David Brown',
    sessionType: 'Video Therapy',
    amount: 120.00,
    status: 'paid',
    paymentDate: '2023-05-12',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN_001237'
  },
  {
    id: 5,
    sessionDate: '2023-05-11',
    patientName: 'Lisa Garcia',
    sessionType: 'Group Therapy',
    amount: 60.00,
    status: 'failed',
    paymentDate: null,
    paymentMethod: 'Credit Card',
    transactionId: 'TXN_001238'
  }
];

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState(MOCK_PAYMENT_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredPayments, setFilteredPayments] = useState(MOCK_PAYMENT_DATA);

  // Filter payments based on search and status
  useEffect(() => {
    let filtered = payments;

    if (searchTerm) {
      filtered = filtered.filter(payment => 
        payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    setFilteredPayments(filtered);
  }, [payments, searchTerm, statusFilter]);

  // Calculate summary statistics
  const totalEarnings = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const thisMonthEarnings = payments
    .filter(p => p.status === 'paid' && new Date(p.paymentDate!).getMonth() === new Date().getMonth())
    .reduce((sum, payment) => sum + payment.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <style>
        {`
        .card {
            background-color: #fff;
            border-radius: 0.5rem;
            box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
        }
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            font-weight: 500;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
        }
        .btn-primary {
            background-color: #0d9488;
            color: #fff;
            border: 1px solid #0d9488;
        }
        .btn-primary:hover {
            background-color: #0f766e;
        }
        .btn-outline {
            background-color: #fff;
            color: #475569;
            border: 1px solid #cbd5e1;
        }
        .btn-outline:hover {
            background-color: #f8fafc;
        }
        `}
      </style>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment History</h1>
        <p className="text-lg text-slate-600">Track your earnings and payment transactions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Earnings</p>
              <p className="text-3xl font-bold text-slate-900">${totalEarnings.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-teal-100 rounded-full">
              <DollarSign className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">This Month</p>
              <p className="text-3xl font-bold text-slate-900">${thisMonthEarnings.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Pending</p>
              <p className="text-3xl font-bold text-slate-900">${pendingAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Sessions</p>
              <p className="text-3xl font-bold text-slate-900">{payments.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <CreditCard className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by patient name or transaction ID..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <button className="btn btn-outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
            <button className="btn btn-primary">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Payment Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Patient & Session
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{payment.patientName}</div>
                      <div className="text-sm text-slate-500">{payment.sessionType}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">${payment.amount.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">
                    {payment.transactionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;