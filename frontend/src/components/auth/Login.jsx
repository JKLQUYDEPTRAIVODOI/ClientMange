import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
      password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .required('Mật khẩu là bắt buộc'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:3000/api/auth/login', values);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Điều hướng dựa theo role
        switch (response.data.user.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'doctor':
            navigate('/doctor');
            break;
          case 'patient':
            navigate('/patient');
            break;
          default:
            navigate('/login');
        }
      } catch (error) {
        console.error('Đăng nhập thất bại:', error);
        alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                padding: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '450px',
                margin: '0 auto',
              }}
            >
              <Typography 
                component="h1" 
                variant="h5" 
                sx={{ 
                  mb: 3,
                  fontWeight: 'bold',
                  color: 'primary.main'
                }}
              >
                Đăng nhập
              </Typography>
              <Box 
                component="form" 
                onSubmit={formik.handleSubmit} 
                sx={{ 
                  width: '100%',
                  mt: 1 
                }}
              >
                <TextField
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ 
                    mt: 2, 
                    mb: 2,
                    py: 1.5,
                    fontSize: '1rem',
                    fontWeight: 'bold'
                  }}
                >
                  Đăng nhập
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    mt: 1,
                    textTransform: 'none'
                  }}
                >
                  Chưa có tài khoản? Đăng ký ngay
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                width: '100%',
                height: '500px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: 3,
              }}
            >
              <img
                src="/healthcare.jpg"
                alt="Healthcare"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login; 