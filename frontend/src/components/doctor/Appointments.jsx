import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Done as DoneIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [note, setNote] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/doctor/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showSnackbar('Không thể tải danh sách cuộc hẹn', 'error');
    }
  };

  const handleStatusChange = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/doctor/appointments/${appointmentId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar('Cập nhật trạng thái thành công');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment status:', error);
      showSnackbar('Không thể cập nhật trạng thái', 'error');
    }
  };

  const handleComplete = async (appointmentId) => {
    setSelectedAppointment(appointments.find(app => app.id === appointmentId));
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
    setNote('');
  };

  const handleSaveCompletion = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/api/doctor/appointments/${selectedAppointment.id}/complete`,
        { note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar('Đã hoàn thành cuộc hẹn');
      handleCloseDialog();
      fetchAppointments();
    } catch (error) {
      console.error('Error completing appointment:', error);
      showSnackbar('Không thể hoàn thành cuộc hẹn', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ xác nhận', color: 'warning' },
      confirmed: { label: 'Đã xác nhận', color: 'info' },
      completed: { label: 'Đã hoàn thành', color: 'success' },
      cancelled: { label: 'Đã hủy', color: 'error' },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quản lý cuộc hẹn
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Bệnh nhân</TableCell>
                <TableCell>Ngày giờ</TableCell>
                <TableCell>Triệu chứng</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patientName}</TableCell>
                  <TableCell>{new Date(appointment.datetime).toLocaleString('vi-VN')}</TableCell>
                  <TableCell>{appointment.symptoms}</TableCell>
                  <TableCell>{getStatusChip(appointment.status)}</TableCell>
                  <TableCell>
                    {appointment.status === 'pending' && (
                      <>
                        <Tooltip title="Xác nhận">
                          <IconButton
                            color="primary"
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Từ chối">
                          <IconButton
                            color="error"
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <Tooltip title="Hoàn thành">
                        <IconButton
                          color="success"
                          onClick={() => handleComplete(appointment.id)}
                        >
                          <DoneIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Hoàn thành cuộc hẹn</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Ghi chú kết quả khám"
              multiline
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleSaveCompletion} variant="contained">
              Hoàn thành
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Appointments; 