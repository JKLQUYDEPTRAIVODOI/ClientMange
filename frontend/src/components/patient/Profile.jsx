import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import PatientLayout from '../layouts/PatientLayout';
import axios from 'axios';

const Profile = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    phone: '',
    address: '',
    bloodType: '',
    allergies: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/patient/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfileData({
        username: response.data.username,
        email: response.data.email,
        dateOfBirth: response.data.date_of_birth || '',
        gender: response.data.gender || '',
        nationality: response.data.nationality || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        bloodType: response.data.blood_type || '',
        allergies: response.data.allergies || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setSnackbar({
        open: true,
        message: 'Không thể tải thông tin hồ sơ',
        severity: 'error'
      });
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/patient/profile',
        {
          dateOfBirth: profileData.dateOfBirth,
          gender: profileData.gender,
          nationality: profileData.nationality,
          phone: profileData.phone,
          address: profileData.address,
          bloodType: profileData.bloodType,
          allergies: profileData.allergies,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSnackbar({
        open: true,
        message: 'Cập nhật thông tin thành công',
        severity: 'success'
      });
      handleCloseDialog();
      fetchProfile(); // Tải lại thông tin sau khi cập nhật
    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({
        open: true,
        message: 'Không thể cập nhật thông tin',
        severity: 'error'
      });
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const InfoSection = ({ title, children }) => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );

  const InfoRow = ({ label, value }) => (
    <Box sx={{ py: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography color="textSecondary">{label}:</Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography>{value || '(Chưa cập nhật)'}</Typography>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <PatientLayout>
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleOpenDialog}
          >
            Điền thông tin
          </Button>
        </Box>

        <InfoSection title="Thông tin cá nhân">
          <InfoRow label="Họ và tên" value={profileData.username} />
          <InfoRow label="Ngày sinh" value={profileData.dateOfBirth} />
          <InfoRow label="Giới tính" value={profileData.gender} />
          <InfoRow label="Quốc tịch" value={profileData.nationality} />
          <InfoRow label="Email" value={profileData.email} />
          <InfoRow label="Số điện thoại" value={profileData.phone} />
          <InfoRow label="Địa chỉ" value={profileData.address} />
        </InfoSection>

        <InfoSection title="Thông tin y tế">
          <InfoRow label="Nhóm máu" value={profileData.bloodType} />
          <InfoRow label="Dị ứng" value={profileData.allergies} />
        </InfoSection>

        {/* Dialog để cập nhật thông tin */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Cập nhật thông tin</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="username"
                  value={profileData.username}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  name="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    name="gender"
                    value={profileData.gender}
                    onChange={handleInputChange}
                    label="Giới tính"
                  >
                    <MenuItem value="Nam">Nam</MenuItem>
                    <MenuItem value="Nữ">Nữ</MenuItem>
                    <MenuItem value="Khác">Khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quốc tịch"
                  name="nationality"
                  value={profileData.nationality}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profileData.email}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Nhóm máu</InputLabel>
                  <Select
                    name="bloodType"
                    value={profileData.bloodType}
                    onChange={handleInputChange}
                    label="Nhóm máu"
                  >
                    <MenuItem value="A">A</MenuItem>
                    <MenuItem value="B">B</MenuItem>
                    <MenuItem value="O">O</MenuItem>
                    <MenuItem value="AB">AB</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dị ứng"
                  name="allergies"
                  value={profileData.allergies}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  placeholder="Liệt kê các loại dị ứng (nếu có)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button variant="contained" onClick={handleSaveProfile}>
              Lưu thông tin
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar thông báo */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </PatientLayout>
  );
};

export default Profile; 