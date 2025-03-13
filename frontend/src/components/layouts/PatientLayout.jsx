import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  CalendarMonth as CalendarIcon,
  LocalHospital as DoctorIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const menuItems = [
  { text: 'Trang chủ', icon: <HomeIcon />, path: '/patient' },
  { text: 'Hồ sơ bệnh nhân', icon: <PersonIcon />, path: '/patient/profile' },
  { text: 'Cuộc hẹn', icon: <CalendarIcon />, path: '/patient/appointments' },
  { text: 'Bác sĩ', icon: <DoctorIcon />, path: '/patient/doctors' },
  { text: 'Lịch sử bệnh án', icon: <HistoryIcon />, path: '/patient/history' },
];

const PatientLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        margin: 0,
        padding: 0,
        backgroundColor: '#f5f5f5'
      }}
    >
      <CssBaseline />
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'white',
          color: 'black',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            Clinic Manage
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {user?.username}
            </Typography>
            <Button
              color="inherit"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              Đăng xuất
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 72,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 72,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            transition: (theme) =>
              theme.transitions.create(['width'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            overflowX: 'hidden',
            backgroundColor: 'white',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'hidden' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                key={item.text}
                disablePadding
                sx={{
                  display: 'block',
                  backgroundColor:
                    location.pathname === item.path ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                }}
              >
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: location.pathname === item.path ? 'primary.main' : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      color: location.pathname === item.path ? 'primary.main' : 'inherit',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          width: '100%',
          p: 3,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Toolbar />
        <Typography
          variant="h5"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          {menuItems.find((item) => item.path === location.pathname)?.text || 'Trang chủ'}
        </Typography>
        {children}
      </Box>
    </Box>
  );
};

export default PatientLayout; 