import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

import PublicLayout from './components/layout/PublicLayout';
import TherapistLayout from './components/layout/TherapistLayout';
import PatientLayout from './components/layout/PatientLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import TherapistListPage from './pages/therapists/TherapistListPage';
import TherapistDetailPage from './pages/therapists/TherapistDetailPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import HealthTrackerPage from './pages/health/HealthTrackerPage';
import ProfilePage from './pages/profile/ProfilePage';
import TherapistDashboard from './pages/dashboard/TherapistDashboard';
import TherapistProfileEdit from './pages/profile/TherapistProfileEdit';
import PaymentHistory from './pages/PaymentHistory/PaymentHistory';
import NotFoundPage from './pages/NotFoundPage';
import SessionHistoryTherapist from './pages/SessionHistory/SessionHistoryTherapist';
import SessionHistoryPatient from './pages/SessionHistory/SessionHistoryPatient';
import LiveSession from './pages/LiveSesssion/LiveSession';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import CreerTherapistProfile from './pages/profile/CreerTherapistProfile';
import PendingPage from './pages/ProfileRed/PendingPage';
import RefusedPage from './pages/ProfileRed/RefusedPage ';

function App() {
  return (
    <ThemeProvider>
      <Toaster position="top-center" />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
          <Route path="/therapists" element={<PublicLayout><TherapistListPage /></PublicLayout>} />
          <Route path="/therapists/:id" element={<PublicLayout><TherapistDetailPage /></PublicLayout>} />
          <Route path="/therapeute/creer-profil" element={<CreerTherapistProfile />} />
          <Route path="/therapeute/en-attente" element={<PendingPage />} />
          <Route path="/therapeute/refuse" element={<RefusedPage />} />
          

          {/* Patient Protected Routes */}
          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={['PATIENT']}>
              <PatientLayout />
            </ProtectedRoute>
          }>
            <Route path="health" element={<HealthTrackerPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="therapists" element={<TherapistListPage />} />
            <Route path="therapists/:id" element={<TherapistDetailPage />} />
            <Route path="historiqueSeance" element={<SessionHistoryPatient />} />
            <Route path="LiveSeance" element={<LiveSession />} />
             <Route path="patientPaymentHistory" element={<PaymentHistory />} />
          </Route>

          {/* Therapist Protected Routes */}
          <Route path="/therapist" element={
            <ProtectedRoute allowedRoles={['THERAPIST']}>
              <TherapistLayout />
            </ProtectedRoute>
          }>
            <Route path="TherapistDashboard" element={<TherapistDashboard />} />
            <Route path="appointments" element={<AppointmentsPage />} />
             <Route path="historiqueSeance" element={<SessionHistoryTherapist />} />
            <Route path="TherapistProfile" element={<TherapistProfileEdit />} />
          </Route>

          {/* Therapist Protected Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            
          </Route>

          {/* 404 */}
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
