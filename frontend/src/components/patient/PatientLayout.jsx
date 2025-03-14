import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon as MuiListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Home as HomeIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  History as HistoryIcon,
  LocalHospital as DoctorIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import axios from 'axios';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Trang chủ',
    icon: <HomeIcon />,
    path: '/patient/dashboard'
  },
  {
    text: 'Hồ sơ bệnh nhân',
    icon: <PersonIcon />,
    path: '/patient/profile'
  },
  {
    text: 'Cuộc hẹn',
    icon: <CalendarIcon />,
    path: '/patient/appointments'
  },
  {
    text: 'Bác sĩ',
    icon: <DoctorIcon />,
    path: '/patient/doctors'
  },
  {
    text: 'Lịch sử bệnh án',
    icon: <HistoryIcon />,
    path: '/patient/history'
  }
];

const PatientLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8080/api/patient/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('User data from API:', response.data);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#fff',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Toolbar sx={{ px: 2, py: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            Clinic Manage
          </Typography>
        </Toolbar>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                selected={isCurrentPath(item.path)}
                sx={{
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: '#e3f2fd',
                    '&:hover': {
                      backgroundColor: '#e3f2fd',
                    },
                  },
                }}
              >
                <MuiListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </MuiListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <AppBar 
          position="fixed" 
          sx={{ 
            ml: `${drawerWidth}px`,
            width: `calc(100% - ${drawerWidth}px)`,
            bgcolor: '#fff',
            color: 'text.primary',
            boxShadow: 'none',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 'medium' }}>
                {userData?.full_name || '(Chưa cập nhật)'}
              </Typography>
              <IconButton
                size="small"
                onClick={handleMenu}
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32 }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Đăng xuất
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* Spacing for fixed AppBar */}
        <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default PatientLayout; 