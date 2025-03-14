import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const specializations = [
  'Đa khoa',
  'Ngoại khoa',
  'Nha khoa',
  'Nhãn khoa',
  'Thần kinh'
];

const genderOptions = [
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' },
  { value: 'Khác', label: 'Khác' }
];

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    specialization: '',
    experience: '',
    education: '',
    certifications: '',
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showSnackbar('Vui lòng đăng nhập lại', 'error');
        navigate('/login');
        return;
      }

      console.log('Fetching profile with token:', token);
      const response = await axios.get('http://localhost:3000/api/doctor/profile', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Profile response:', response.data);
      
      if (response.data) {
        // Format date if exists
        const formattedData = {
          ...response.data,
          dateOfBirth: response.data.dateOfBirth ? 
            new Date(response.data.dateOfBirth).toISOString().split('T')[0] : '',
          // Ensure all fields exist with default values
          phone: response.data.phone || '',
          gender: response.data.gender || '',
          address: response.data.address || '',
          specialization: response.data.specialization || '',
          experience: response.data.experience || '',
          education: response.data.education || '',
          certifications: response.data.certifications || ''
        };
        console.log('Formatted profile data:', formattedData);
        setProfile(formattedData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401) {
        showSnackbar('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        showSnackbar(
          error.response?.data?.message || 'Không thể tải thông tin hồ sơ', 
          'error'
        );
      }
    }
  };

  const handleEditProfile = () => {
    setEditedProfile({ ...profile });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditedProfile({});
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showSnackbar('Vui lòng đăng nhập lại', 'error');
        navigate('/login');
        return;
      }

      // Validate required fields
      const requiredFields = ['name', 'phone', 'gender', 'specialization'];
      const missingFields = requiredFields.filter(field => !editedProfile[field]);
      
      if (missingFields.length > 0) {
        showSnackbar('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
        return;
      }

      console.log('Saving profile data:', editedProfile);
      const response = await axios.put(
        'http://localhost:3000/api/doctor/profile',
        editedProfile,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('Save profile response:', response.data);
      setProfile(editedProfile);
      showSnackbar('Cập nhật hồ sơ thành công');
      handleCloseDialog();
      // Refresh profile data after update
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401) {
        showSnackbar('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 'error');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        showSnackbar(
          error.response?.data?.message || 'Không thể cập nhật hồ sơ', 
          'error'
        );
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const InfoRow = ({ label, value }) => (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={4}>
        <Typography color="textSecondary">{label}:</Typography>
      </Grid>
      <Grid item xs={12} sm={8}>
        <Typography>{value || '(Chưa cập nhật)'}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Hồ sơ bác sĩ
          </Typography>
          <Button variant="contained" onClick={handleEditProfile}>
            Cập nhật thông tin
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Thông tin cá nhân
              </Typography>
              <Box>
                <InfoRow label="Họ và tên" value={profile.name} />
                <InfoRow label="Email" value={profile.email} />
                <InfoRow label="Số điện thoại" value={profile.phone} />
                <InfoRow label="Ngày sinh" value={profile.dateOfBirth} />
                <InfoRow label="Giới tính" value={profile.gender} />
                <InfoRow label="Địa chỉ" value={profile.address} />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Thông tin chuyên môn
              </Typography>
              <Box>
                <InfoRow label="Chuyên khoa" value={profile.specialization} />
                <InfoRow label="Kinh nghiệm" value={profile.experience} />
                <InfoRow label="Học vấn" value={profile.education} />
                <InfoRow label="Chứng chỉ" value={profile.certifications} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Cập nhật thông tin</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Thông tin cá nhân
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Họ và tên"
                  name="name"
                  value={editedProfile.name || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={editedProfile.email || ''}
                  onChange={handleInputChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Số điện thoại"
                  name="phone"
                  value={editedProfile.phone || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ngày sinh"
                  name="dateOfBirth"
                  type="date"
                  value={editedProfile.dateOfBirth || ''}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    name="gender"
                    value={editedProfile.gender || ''}
                    onChange={handleInputChange}
                    label="Giới tính"
                  >
                    {genderOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={editedProfile.address || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Thông tin chuyên môn
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Chuyên khoa</InputLabel>
                  <Select
                    name="specialization"
                    value={editedProfile.specialization || ''}
                    onChange={handleInputChange}
                    label="Chuyên khoa"
                  >
                    {specializations.map(spec => (
                      <MenuItem key={spec} value={spec}>
                        {spec}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Kinh nghiệm"
                  name="experience"
                  value={editedProfile.experience || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Học vấn"
                  name="education"
                  value={editedProfile.education || ''}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Chứng chỉ"
                  name="certifications"
                  value={editedProfile.certifications || ''}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleSaveProfile} variant="contained">
              Lưu thay đổi
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Profile; 