import React, { useState, useEffect } from 'react';
import { Users, Calendar, DollarSign, Clock, Video, Phone, MessageSquare, TrendingUp, Bell, Star } from 'lucide-react';
import TherapistRedirector from "../../components/TherapistRedirector";
import { Link } from 'react-router-dom';

interface DashboardData {
  totalPatients: number;
  sessionsToday: number;
  monthlyEarnings: number;
  avgRating: number;
}

interface UpcomingSession {
  seanceId: string;
  patientId: string; 
  patientName: string;
  time: string;
  type: 'EN_LIGNE' | 'PRESENTIEL';
  duration: number;
  isFirstTime: boolean;
  dateHeure: string;
  statutSeance: string;
  lienVisio: string;
}

interface WeeklyActivity {
  day: string;
  sessions: number;
}

const TherapistDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalPatients: 0,
    sessionsToday: 0,
    monthlyEarnings: 0,
    avgRating: 0
  });
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivity[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const userId = user?.id;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [userDataRes, feedbackRes, earningsRes, sessionsRes, patientCountRes] = await Promise.all([
          fetch(`http://localhost:8090/api/user/${userId}`),
          fetch(`http://localhost:8030/api/feedbacks/therapist/${userId}/average`),
          fetch(`http://localhost:8060/api/payments/therapists/${userId}/earnings`),
          fetch(`http://localhost:8070/api/seances/therapeute/${userId}`),
          fetch(`http://localhost:8070/api/seances/therapeute/${userId}/patient-count`)
        ]);

        if (!userDataRes.ok || !feedbackRes.ok || !earningsRes.ok || !sessionsRes.ok || !patientCountRes.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const userData = await userDataRes.json();
        const avgRating = await feedbackRes.json();
        const monthlyEarnings = await earningsRes.json();
        const sessions = await sessionsRes.json();
        const patientCount = await patientCountRes.json();

        // Process sessions data
        const today = new Date().toISOString().split('T')[0];
        const todaySessions = sessions.filter((s: any) => 
          s.dateHeure.startsWith(today) && s.statutSeance === 'PLANIFIEE'
        );

        // Format upcoming sessions
        const formattedSessions = todaySessions.map((session: any) => ({
          seanceId: session.seanceId,
          patientId: session.patientId, 
          patientName: 'Patient',
          time: new Date(session.dateHeure).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: session.typeSeance,
          duration: session.dureeMinutes,
          isFirstTime: false, // We'd need additional data to determine this
          dateHeure: session.dateHeure,
          statutSeance: session.statutSeance,
          lienVisio: session.lienVisio
        }));

        // Fetch patient names for the sessions
        const sessionsWithPatientNames = await Promise.all(
          formattedSessions.map(async (session: any) => {
            try {
              const patientRes = await fetch(`http://localhost:8090/api/user/${session.patientId}`);
              if (patientRes.ok) {
                const patientData = await patientRes.json();
                return { ...session, patientName: patientData.name || 'Patient' };
              }
              return session;
            } catch (error) {
              return session;
            }
          })
        );

        // Generate weekly activity data (mock for now)
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weeklyData = days.map(day => ({
          day,
          sessions: Math.floor(Math.random() * 10) // Random data - in a real app, you'd fetch this
        }));

        setDashboardData({
          totalPatients: patientCount || 0,
          sessionsToday: todaySessions.length,
          monthlyEarnings: monthlyEarnings || 0,
          avgRating: avgRating || 0
        });
        setUpcomingSessions(sessionsWithPatientNames);
        setWeeklyActivity(weeklyData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [userId]);

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'EN_LIGNE': return <Video className="h-4 w-4" />;
      case 'PRESENTIEL': return <Phone className="h-4 w-4" />;
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <TherapistRedirector userId={userId} />
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
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name || 'Doctor'}!</h1>
                <p className="text-teal-100">Today is {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p className="text-teal-100">Current time: {formatTime(currentTime)}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{dashboardData.sessionsToday}</div>
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
                <p className="text-3xl font-bold text-slate-900">{dashboardData.totalPatients}</p>
              </div>
              <div className="p-3 bg-teal-100 rounded-full">
                <Users className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Revenue</p>
                <p className="text-3xl font-bold text-slate-900">MAD {dashboardData.monthlyEarnings.toLocaleString()}</p>
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
                  <p className="text-3xl font-bold text-slate-900 mr-2">{dashboardData.avgRating}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < Math.floor(dashboardData.avgRating) ? 'fill-current' : ''}`} />
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
                <p className="text-3xl font-bold text-slate-900">{upcomingSessions.length}</p>
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
        <Link to="/therapist/LiveSeance" className="btn btn-outline text-sm flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          View All
        </Link>
      </div>
              
              <div className="space-y-4">
                {upcomingSessions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No sessions scheduled for today</p>
                ) : (
                  upcomingSessions.map((session) => (
                    <div key={session.seanceId} className="flex items-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
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
                            <a 
                              href={session.type === 'EN_LIGNE' ? session.lienVisio : '#'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-primary text-sm"
                            >
                              {session.type === 'EN_LIGNE' ? 'Join' : 'Details'}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weekly Activity Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Weekly Activity</h3>
              <div className="space-y-3">
                {weeklyActivity.map((day) => (
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

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn btn-outline flex items-center justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule New Session
                </button>
                <button className="w-full btn btn-outline flex items-center justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View All Patients
                </button>
                <button className="w-full btn btn-outline flex items-center justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  View Earnings Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TherapistDashboard;