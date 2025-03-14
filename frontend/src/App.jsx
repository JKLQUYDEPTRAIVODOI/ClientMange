import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import UserManagement from './components/admin/UserManagement';
import MedicationManagement from './components/admin/MedicationManagement';
import RevenueStatistics from './components/admin/RevenueStatistics';
import DoctorLayout from './components/doctor/DoctorLayout';
import DoctorDashboard from './components/doctor/Dashboard';
import DoctorAppointments from './components/doctor/Appointments';
import DoctorPrescriptions from './components/doctor/Prescriptions';
import DoctorMedicalHistory from './components/doctor/MedicalHistory';
import DoctorPatients from './components/doctor/Patients';
import DoctorProfile from './components/doctor/Profile';
import PatientLayout from './components/patient/PatientLayout';
import PatientDashboard from './components/patient/Dashboard';
import PatientProfile from './components/patient/Profile';
import PatientAppointments from './components/patient/Appointments';
import PatientPrescriptions from './components/patient/Prescriptions';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Patient Routes */}
          <Route
            path="/patient/*"
            element={
              <ProtectedRoute roles={['patient']}>
                <PatientLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="appointments" element={<PatientAppointments />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="prescriptions" element={<PatientPrescriptions />} />
          </Route>

          {/* Doctor Routes */}
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute roles={['doctor']}>
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="medical-history" element={<DoctorMedicalHistory />} />
            <Route path="patients" element={<DoctorPatients />} />
            <Route path="profile" element={<DoctorProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="medications" element={<MedicationManagement />} />
            <Route path="revenue" element={<RevenueStatistics />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;