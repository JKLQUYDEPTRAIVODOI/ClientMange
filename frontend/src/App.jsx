import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/Dashboard';
import DoctorDashboard from './components/doctor/Dashboard';
import PatientDashboard from './components/patient/Dashboard';
import PatientProfile from './components/patient/Profile';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route
            path="/doctor/*"
            element={
              <ProtectedRoute roles={['doctor']}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Patient Routes */}
          <Route path="/patient" element={
            <ProtectedRoute roles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/profile" element={
            <ProtectedRoute roles={['patient']}>
              <PatientProfile />
            </ProtectedRoute>
          } />
          <Route path="/patient/appointments" element={
            <ProtectedRoute roles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/doctors" element={
            <ProtectedRoute roles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patient/history" element={
            <ProtectedRoute roles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;