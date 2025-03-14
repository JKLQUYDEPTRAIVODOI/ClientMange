import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Button,
  Chip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

const Prescriptions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Mock data - sẽ được thay thế bằng dữ liệu từ API
  const prescriptions = [
    {
      id: 1,
      date: '15/03/2024',
      doctor: 'Bác sĩ Nguyễn Văn A',
      diagnosis: 'Viêm họng cấp',
      status: 'Đang điều trị',
      medications: [
        {
          name: 'Amoxicillin 500mg',
          dosage: '1 viên',
          frequency: '3 lần/ngày',
          duration: '5 ngày',
          note: 'Uống sau ăn',
        },
        {
          name: 'Paracetamol 500mg',
          dosage: '1 viên',
          frequency: 'Khi sốt > 38.5°C',
          duration: '3 ngày',
          note: 'Cách nhau 6 tiếng',
        },
      ],
    },
    {
      id: 2,
      date: '10/03/2024',
      doctor: 'Bác sĩ Trần Thị B',
      diagnosis: 'Đau dạ dày',
      status: 'Hoàn thành',
      medications: [
        {
          name: 'Omeprazole 20mg',
          dosage: '1 viên',
          frequency: '2 lần/ngày',
          duration: '14 ngày',
          note: 'Uống trước ăn 30 phút',
        },
      ],
    },
  ];

  const handleOpenDialog = (prescription) => {
    setSelectedPrescription(prescription);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPrescription(null);
  };

  const handleDownload = (id) => {
    // TODO: Implement download functionality
    console.log('Downloading prescription:', id);
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Đơn thuốc của bạn
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày kê đơn</TableCell>
                  <TableCell>Bác sĩ</TableCell>
                  <TableCell>Chẩn đoán</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {prescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>{prescription.date}</TableCell>
                    <TableCell>{prescription.doctor}</TableCell>
                    <TableCell>{prescription.diagnosis}</TableCell>
                    <TableCell>
                      <Chip
                        label={prescription.status}
                        color={prescription.status === 'Đang điều trị' ? 'primary' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(prescription)}
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleDownload(prescription.id)}
                        size="small"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Chi tiết đơn thuốc</Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Ngày kê đơn
                  </Typography>
                  <Typography variant="body1">{selectedPrescription.date}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Bác sĩ
                  </Typography>
                  <Typography variant="body1">{selectedPrescription.doctor}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Chẩn đoán
                  </Typography>
                  <Typography variant="body1">{selectedPrescription.diagnosis}</Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Danh sách thuốc
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tên thuốc</TableCell>
                      <TableCell>Liều dùng</TableCell>
                      <TableCell>Tần suất</TableCell>
                      <TableCell>Thời gian</TableCell>
                      <TableCell>Ghi chú</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPrescription.medications.map((medication, index) => (
                      <TableRow key={index}>
                        <TableCell>{medication.name}</TableCell>
                        <TableCell>{medication.dosage}</TableCell>
                        <TableCell>{medication.frequency}</TableCell>
                        <TableCell>{medication.duration}</TableCell>
                        <TableCell>{medication.note}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(selectedPrescription.id)}
                >
                  Tải đơn thuốc
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Prescriptions; 