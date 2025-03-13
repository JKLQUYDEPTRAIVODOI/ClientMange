import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleDashboardPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'doctor':
        return '/doctor';
      case 'patient':
        return '/patient';
      default:
        return '/login';
    }
  };

  if (!user) return null;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate(getRoleDashboardPath())}
        >
          HMS - {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1">
            {user.username}
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Đăng xuất
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 