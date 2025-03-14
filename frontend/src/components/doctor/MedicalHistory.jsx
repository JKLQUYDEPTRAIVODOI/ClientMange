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
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Visibility as ViewIcon,
} from '@mui/icons-material';
import axios from 'axios';

const MedicalHistory = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      fetchMedicalRecords(selectedPatient.id);
    }
  }, [selectedPatient]);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/doctor/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      showSnackbar('Không thể tải danh sách bệnh nhân', 'error');
    }
  };

  const fetchMedicalRecords = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/doctor/patients/${patientId}/medical-history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedicalRecords(response.data);
    } catch (error) {
      console.error('Error fetching medical records:', error);
      showSnackbar('Không thể tải lịch sử khám bệnh', 'error');
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      completed: { label: 'Đã hoàn thành', color: 'success' },
      cancelled: { label: 'Đã hủy', color: 'error' },
    };
    const config = statusConfig[status] || { label: status, color: 'default' };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Lịch sử khám bệnh
        </Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => `${option.name} - ${option.email}`}
            value={selectedPatient}
            onChange={(_, newValue) => setSelectedPatient(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Chọn bệnh nhân" fullWidth />
            )}
          />
        </Paper>

        {selectedPatient && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày khám</TableCell>
                  <TableCell>Chẩn đoán</TableCell>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicalRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{new Date(record.date).toLocaleDateString('vi-VN')}</TableCell>
                    <TableCell>{record.diagnosis}</TableCell>
                    <TableCell>{record.doctorName}</TableCell>
                    <TableCell>{getStatusChip(record.status)}</TableCell>
                    <TableCell>
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewRecord(record)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Chi tiết lịch sử khám bệnh</DialogTitle>
          <DialogContent dividers>
            {selectedRecord && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Thông tin chung
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography><strong>Ngày khám:</strong> {new Date(selectedRecord.date).toLocaleDateString('vi-VN')}</Typography>
                  <Typography><strong>Bác sĩ:</strong> {selectedRecord.doctorName}</Typography>
                  <Typography><strong>Trạng thái:</strong> {selectedRecord.status}</Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Chẩn đoán và điều trị
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography><strong>Chẩn đoán:</strong> {selectedRecord.diagnosis}</Typography>
                  <Typography><strong>Ghi chú:</strong> {selectedRecord.note}</Typography>
                </Box>

                <Typography variant="h6" gutterBottom>
                  Đơn thuốc
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên thuốc</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Liều dùng</TableCell>
                        <TableCell>Ghi chú</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRecord.prescriptions?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.medicationName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.dosage}</TableCell>
                          <TableCell>{item.note}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Đóng</Button>
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

export default MedicalHistory; 