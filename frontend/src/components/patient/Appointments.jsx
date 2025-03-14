import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

const Appointments = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [note, setNote] = useState('');

  const services = [
    'Khám tổng quát',
    'Khám chuyên khoa',
    'Khám nha khoa',
    'Xét nghiệm máu',
    'Chụp X-quang',
  ];

  const doctors = [
    { id: 1, name: 'Bác sĩ Nguyễn Văn A', specialty: 'Đa khoa' },
    { id: 2, name: 'Bác sĩ Trần Thị B', specialty: 'Nha khoa' },
    { id: 3, name: 'Bác sĩ Lê Văn C', specialty: 'Tim mạch' },
  ];

  const appointments = [
    {
      id: 1,
      date: '15/03/2024',
      time: '09:00',
      service: 'Khám tổng quát',
      doctor: 'Bác sĩ Nguyễn Văn A',
      status: 'Chờ khám',
    },
    {
      id: 2,
      date: '20/03/2024',
      time: '14:30',
      service: 'Khám răng',
      doctor: 'Bác sĩ Trần Thị B',
      status: 'Đã xác nhận',
    },
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedService('');
    setSelectedDoctor('');
    setNote('');
  };

  const handleSubmit = () => {
    // TODO: Submit appointment data to backend
    console.log({
      date: selectedDate,
      time: selectedTime,
      service: selectedService,
      doctor: selectedDoctor,
      note,
    });
    handleCloseDialog();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Đặt lịch khám</Typography>
        <Button variant="contained" onClick={handleOpenDialog}>
          Đặt lịch mới
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Lịch khám sắp tới
            </Typography>
            {appointments.map((appointment) => (
              <Paper
                key={appointment.id}
                sx={{
                  p: 2,
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: '#f8f9fa',
                }}
              >
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {appointment.service}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.date} - {appointment.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {appointment.doctor}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: appointment.status === 'Chờ khám' ? 'warning.main' : 'success.main',
                      fontWeight: 'bold',
                    }}
                  >
                    {appointment.status}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Đặt lịch khám</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Ngày khám
                </Typography>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  placeholderText="Chọn ngày khám"
                  className="form-control"
                  customInput={
                    <TextField
                      fullWidth
                      size="small"
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Giờ khám
                </Typography>
                <DatePicker
                  selected={selectedTime}
                  onChange={(time) => setSelectedTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="Giờ"
                  dateFormat="HH:mm"
                  placeholderText="Chọn giờ khám"
                  className="form-control"
                  customInput={
                    <TextField
                      fullWidth
                      size="small"
                    />
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Dịch vụ khám</InputLabel>
                  <Select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    label="Dịch vụ khám"
                  >
                    {services.map((service) => (
                      <MenuItem key={service} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Bác sĩ</InputLabel>
                  <Select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    label="Bác sĩ"
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  multiline
                  rows={4}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            Đặt lịch
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx global>{`
        .react-datepicker-wrapper {
          width: 100%;
        }
        .react-datepicker__input-container {
          width: 100%;
        }
      `}</style>
    </Box>
  );
};

export default Appointments; 