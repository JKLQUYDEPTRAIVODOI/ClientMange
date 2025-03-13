import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" gutterBottom>
          Xin chào, {user?.username}!
        </Typography>

        <Paper sx={{ mt: 4, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Danh sách người dùng
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên người dùng</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Vai trò</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
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

export default AdminDashboard; 