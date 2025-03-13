import React from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import {
  CalendarMonth as CalendarIcon,
  LocalHospital as DoctorIcon,
  Assignment as AssignmentIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import PatientLayout from '../layouts/PatientLayout';

const StatCard = ({ icon, title, value, color }) => (
  <Paper
    sx={{
      p: 3,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      height: '100%',
      borderRadius: 2,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}
  >
    <Box
      sx={{
        backgroundColor: `${color}15`,
        borderRadius: '50%',
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {React.cloneElement(icon, { sx: { fontSize: 40, color: color } })}
    </Box>
    <Box>
      <Typography color="textSecondary" variant="body2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const PatientDashboard = () => {
  const { user } = useAuth();

  return (
    <PatientLayout>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Patient Dashboard
          </Typography>
          <Typography variant="h6" gutterBottom>
            Xin chào, {user?.username}!
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Thông tin cá nhân
                </Typography>
                <Box>
                  <Typography>
                    <strong>Tên:</strong> {user?.username}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {user?.email}
                  </Typography>
                  <Typography>
                    <strong>Vai trò:</strong> Bệnh nhân
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Lịch hẹn sắp tới
                </Typography>
                <Typography color="text.secondary">
                  Chưa có lịch hẹn nào
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Lịch sử khám bệnh
                </Typography>
                <Typography color="text.secondary">
                  Chưa có lịch sử khám bệnh
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </PatientLayout>
  );
};

export default PatientDashboard; 