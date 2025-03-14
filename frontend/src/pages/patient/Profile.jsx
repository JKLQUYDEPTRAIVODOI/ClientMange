import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Grid,
    TextField,
    Button,
    MenuItem,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = 'http://localhost:3000/api';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        fullname: '',
        phone: '',
        address: '',
        date_of_birth: null,
        gender: '',
        nationality: '',
        blood_type: '',
        allergies: ''
    });

    useEffect(() => {
        if (user) {
            fetchProfileData();
        }
    }, [user]);

    const fetchProfileData = async () => {
        try {
            setLoading(true);
            setError('');
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập lại');
                setLoading(false);
                return;
            }

            console.log('Fetching profile data...');
            const response = await axios.get(`${API_URL}/patient/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            console.log('Profile data received:', response.data);
            
            if (response.data) {
                const profileData = {
                    ...response.data,
                    fullname: response.data.full_name || '',
                    date_of_birth: response.data.date_of_birth ? new Date(response.data.date_of_birth) : null
                };
                
                setFormData(profileData);
                setSuccess('Đã tải thông tin profile thành công');
            } else {
                setError('Không tìm thấy thông tin profile');
            }
            
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            if (err.response) {
                const errorMessage = err.response.data.message || 'Lỗi server khi tải thông tin profile';
                console.error('Server error:', err.response.data);
                setError(errorMessage);
            } else if (err.request) {
                console.error('Network error:', err.request);
                setError('Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối.');
            } else {
                console.error('Request error:', err.message);
                setError('Có lỗi xảy ra khi tải thông tin profile');
            }
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            date_of_birth: date
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Vui lòng đăng nhập lại');
                return;
            }

            console.log('Current form data:', formData);
            console.log('Current fullname value:', formData.fullname);

            // Chuẩn bị dữ liệu để gửi lên server
            const submitData = {
                fullname: formData.fullname,
                dateOfBirth: formData.date_of_birth ? formData.date_of_birth.toISOString() : null,
                bloodType: formData.blood_type || null,
                gender: formData.gender || null,
                nationality: formData.nationality || null,
                phone: formData.phone || null,
                address: formData.address || null,
                allergies: formData.allergies || null
            };

            console.log('Submitting profile data:', submitData);
            const response = await axios.put(`${API_URL}/patient/profile`, submitData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log('Profile update response:', response.data);

            if (response.data.user) {
                const updatedData = {
                    ...response.data.user,
                    fullname: response.data.user.full_name,
                    date_of_birth: response.data.user.date_of_birth ? new Date(response.data.user.date_of_birth) : null
                };
                setFormData(updatedData);
                setSuccess('Cập nhật thông tin thành công');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            if (err.response) {
                const errorMessage = err.response.data.message || 'Lỗi server khi cập nhật thông tin';
                console.error('Server error:', err.response.data);
                setError(errorMessage);
            } else if (err.request) {
                console.error('Network error:', err.request);
                setError('Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối.');
            } else {
                console.error('Request error:', err.message);
                setError('Có lỗi xảy ra khi cập nhật thông tin');
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Thông tin cá nhân
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Họ và tên"
                                name="fullname"
                                value={formData.fullname || ''}
                                onChange={handleChange}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Số điện thoại"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Địa chỉ"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Ngày sinh"
                                    value={formData.date_of_birth}
                                    onChange={handleDateChange}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Giới tính"
                                name="gender"
                                value={formData.gender || ''}
                                onChange={handleChange}
                            >
                                <MenuItem value="male">Nam</MenuItem>
                                <MenuItem value="female">Nữ</MenuItem>
                                <MenuItem value="other">Khác</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Quốc tịch"
                                name="nationality"
                                value={formData.nationality || ''}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                label="Nhóm máu"
                                name="blood_type"
                                value={formData.blood_type || ''}
                                onChange={handleChange}
                            >
                                <MenuItem value="A">A</MenuItem>
                                <MenuItem value="B">B</MenuItem>
                                <MenuItem value="O">O</MenuItem>
                                <MenuItem value="AB">AB</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Dị ứng"
                                name="allergies"
                                value={formData.allergies || ''}
                                onChange={handleChange}
                                multiline
                                rows={2}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box display="flex" justifyContent="flex-end">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
                                    Cập nhật thông tin
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Profile; 