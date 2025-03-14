import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import axios from 'axios';

const RevenueStatistics = () => {
  const [timeRange, setTimeRange] = useState('day');
  const [statistics, setStatistics] = useState({
    totalRevenue: 0,
    totalAppointments: 0,
    totalPrescriptions: 0,
    revenueByService: [],
    revenueByMonth: [],
  });

  useEffect(() => {
    fetchStatistics();
  }, [timeRange]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/admin/statistics?timeRange=${timeRange}`
      );
      setStatistics(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '50%',
              p: 1,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
          {value.toLocaleString()} VNĐ
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Thống kê doanh thu</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Khoảng thời gian</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            label="Khoảng thời gian"
          >
            <MenuItem value="day">Hôm nay</MenuItem>
            <MenuItem value="week">Tuần này</MenuItem>
            <MenuItem value="month">Tháng này</MenuItem>
            <MenuItem value="year">Năm nay</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Tổng doanh thu"
            value={statistics.totalRevenue}
            icon={<MoneyIcon sx={{ color: '#1976d2' }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Số cuộc hẹn"
            value={statistics.totalAppointments}
            icon={<CalendarIcon sx={{ color: '#2e7d32' }} />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Số đơn thuốc"
            value={statistics.totalPrescriptions}
            icon={<TrendingUpIcon sx={{ color: '#ed6c02' }} />}
            color="#ed6c02"
          />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo dịch vụ
            </Typography>
            <Box sx={{ height: 300 }}>
              {/* Thêm biểu đồ ở đây */}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Doanh thu theo tháng
            </Typography>
            <Box sx={{ height: 300 }}>
              {/* Thêm biểu đồ ở đây */}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RevenueStatistics; 