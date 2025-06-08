import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Clock, Video, Phone, MessageSquare, TrendingUp, Bell, Star } from 'lucide-react';

// Mock data for dashboard
const MOCK_DASHBOARD_DATA = {
  stats: {
    totalPatients: 24,
    sessionsToday: 6,
    monthlyEarnings: 4800,
    avgRating: 4.8,
    upcomingSessions: 3,
    pendingPayments: 2
  },
  upcomingSessions: [
    {
      id: 1,
      patientName: 'Sarah Johnson',
      time: '10:00 AM',
      type: 'video',
      duration: 60,
      isFirstTime: false
    },
    {
      id: 2,
      patientName: 'Michael Chen',
      time: '2:00 PM',
      type: 'phone',
      duration: 45,
      isFirstTime: true
    },
    {
      id: 3,
      patientName: 'Emma Wilson',
      time: '4:30 PM',
      type: 'video',
      duration: 60,
      isFirstTime: false
    }
  ],
  recentMessages: [
    {
      id: 1,
      patientName: 'David Brown',
      message: 'Thank you for yesterday\'s session. I felt much better.',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      patientName: 'Lisa Garcia',
      message: 'Could we reschedule our appointment for next week?',
      time: '5 hours ago',
      unread: true
    },
    {
      id: 3,
      patientName: 'Alex Turner',
      message: 'The breathing exercises are really helping.',
      time: '1 day ago',
      unread: false
    }
  ],
  weeklyActivity: [
    { day: 'Mon', sessions: 8 },
    { day: 'Tue', sessions: 6 },
    { day: 'Wed', sessions: 7 },
    { day: 'Thu', sessions: 5 },
    { day: 'Fri', sessions: 9 },
    { day: 'Sat', sessions: 3 },
    { day: 'Sun', sessions: 2 }
  ]
};

const TherapistDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState(MOCK_DASHBOARD_DATA);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
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
        .gradient-bg {
            background: linear-gradient(135deg, #14b8a6 0%, #2563eb 100%);
        }
        `}
      </style>

      {/* Header with Welcome Message */}
      <div className="mb-8">
        <div className="gradient-bg rounded-lg p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. Smith!</h1>
              <p className="text-teal-100">Today is {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p className="text-teal-100">Current time: {formatTime(currentTime)}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{dashboardData.stats.sessionsToday}</div>
              <div className="text-teal-100">Sessions Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Patients</p>
              <p className="text-3xl font-bold text-slate-900">{dashboardData.stats.totalPatients}</p>
            </div>
            <div className="p-3 bg-teal-100 rounded-full">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Monthly Earnings</p>
              <p className="text-3xl font-bold text-slate-900">${dashboardData.stats.monthlyEarnings.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Average Rating</p>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-slate-900 mr-2">{dashboardData.stats.avgRating}</p>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Upcoming Sessions</p>
              <p className="text-3xl font-bold text-slate-900">{dashboardData.stats.upcomingSessions}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Today's Schedule</h3>
              <button className="btn btn-outline text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {dashboardData.upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex-shrink-0 mr-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-teal-100 rounded-full">
                      {getSessionTypeIcon(session.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{session.patientName}</p>
                        <div className="flex items-center text-sm text-slate-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {session.time} • {session.duration} min
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {session.isFirstTime && (
                          <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                            First Session
                          </span>
                        )}
                        <button className="btn btn-primary text-sm">Join</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Weekly Activity Chart */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Weekly Activity</h3>
            <div className="space-y-3">
              {dashboardData.weeklyActivity.map((day) => (
                <div key={day.day} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 w-8">{day.day}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-teal-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(day.sessions / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-slate-900 w-6 text-right">{day.sessions}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-900">Recent Messages</h3>
              <Bell className="h-5 w-5 text-slate-400" />
            </div>
            <div className="space-y-3">
              {dashboardData.recentMessages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 ${message.unread ? 'bg-teal-500' : 'bg-slate-300'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{message.patientName}</p>
                    <p className="text-sm text-slate-600 truncate">{message.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 btn btn-outline text-sm">
              <MessageSquare className="h-4 w-4 mr-2" />
              View All Messages
            </button>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn btn-primary">
                <Users className="h-4 w-4 mr-2" />
                Add New Patient
              </button>
              <button className="w-full btn btn-outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Session
              </button>
              <button className="w-full btn btn-outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistDashboard;