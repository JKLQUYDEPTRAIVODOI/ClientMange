import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  LocalHospital as HospitalIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const stats = [
    {
      title: 'Tổng số người dùng',
      value: '1,234',
      icon: <PeopleIcon sx={{ color: '#1976d2' }} />,
      color: '#1976d2',
    },
    {
      title: 'Cuộc hẹn hôm nay',
      value: '15',
      icon: <CalendarIcon sx={{ color: '#2e7d32' }} />,
      color: '#2e7d32',
    },
    {
      title: 'Tổng số thuốc',
      value: '456',
      icon: <HospitalIcon sx={{ color: '#ed6c02' }} />,
      color: '#ed6c02',
    },
    {
      title: 'Doanh thu hôm nay',
      value: '12,500,000 VNĐ',
      icon: <MoneyIcon sx={{ color: '#9c27b0' }} />,
      color: '#9c27b0',
    },
  ];

  const recentAppointments = [
    {
      patient: 'Nguyễn Văn A',
      time: '09:00',
      service: 'Khám tổng quát',
    },
    {
      patient: 'Trần Thị B',
      time: '10:30',
      service: 'Khám răng',
    },
    {
      patient: 'Lê Văn C',
      time: '13:45',
      service: 'Xét nghiệm máu',
    },
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Tổng quan
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}15`,
                      borderRadius: '50%',
                      p: 1,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography color="text.secondary" variant="body2">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography variant="h5" component="div">
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Cuộc hẹn hôm nay
            </Typography>
            <List>
              {recentAppointments.map((appointment, index) => (
                <ListItem key={index} divider={index !== recentAppointments.length - 1}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                      <PeopleIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={appointment.patient}
                    secondary={`${appointment.time} - ${appointment.service}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Thông báo mới
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Cập nhật phần mềm"
                  secondary="Phiên bản mới 2.0 đã sẵn sàng để cập nhật"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Bảo trì hệ thống"
                  secondary="Hệ thống sẽ được bảo trì vào ngày 20/03/2024"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Thuốc sắp hết hạn"
                  secondary="Có 5 loại thuốc sẽ hết hạn trong tháng tới"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 