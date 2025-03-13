import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    // Nếu người dùng không có quyền truy cập, chuyển hướng về trang phù hợp với role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" />;
      case 'doctor':
        return <Navigate to="/doctor" />;
      case 'patient':
        return <Navigate to="/patient" />;
      default:
        return <Navigate to="/login" />;
    }
  }

  return children;
};

export default ProtectedRoute; 