import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/doctor/patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(response.data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Doctor Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom>
          Xin chào, Bác sĩ {user?.username}!
        </Typography>

        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Danh sách bệnh nhân
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên bệnh nhân</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.id}</TableCell>
                    <TableCell>{patient.username}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>
                      {/* Thêm các nút hành động ở đây */}
                      Xem chi tiết
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default DoctorDashboard; 