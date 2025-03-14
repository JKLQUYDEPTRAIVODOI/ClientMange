import React, { useState } from 'react';
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
  CalendarToday as CalendarIcon,
  LocalHospital as PrescriptionIcon,
  History as HistoryIcon,
  Person as PatientIcon,
  AccountBox as ProfileIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Trang chủ',
    icon: <HomeIcon />,
    path: '/doctor/dashboard'
  },
  {
    text: 'Quản lý cuộc hẹn',
    icon: <CalendarIcon />,
    path: '/doctor/appointments'
  },
  {
    text: 'Kê đơn thuốc',
    icon: <PrescriptionIcon />,
    path: '/doctor/prescriptions'
  },
  {
    text: 'Lịch sử khám bệnh',
    icon: <HistoryIcon />,
    path: '/doctor/medical-history'
  },
  {
    text: 'Hồ sơ bệnh nhân',
    icon: <PatientIcon />,
    path: '/doctor/patients'
  },
  {
    text: 'Hồ sơ cá nhân',
    icon: <ProfileIcon />,
    path: '/doctor/profile'
  }
];

const DoctorLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

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
              <Typography>Bác sĩ Nguyễn Văn A</Typography>
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

export default DoctorLayout; 