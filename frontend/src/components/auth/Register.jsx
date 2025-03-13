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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Tên người dùng phải có ít nhất 3 ký tự')
        .required('Tên người dùng là bắt buộc'),
      email: Yup.string()
        .email('Email không hợp lệ')
        .required('Email là bắt buộc'),
      password: Yup.string()
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .required('Mật khẩu là bắt buộc'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
        .required('Xác nhận mật khẩu là bắt buộc'),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:3000/api/auth/register', {
          username: values.username,
          email: values.email,
          password: values.password,
        });
        alert('Đăng ký thành công!');
        navigate('/login');
      } catch (error) {
        console.error('Đăng ký thất bại:', error);
        alert('Đăng ký thất bại. Vui lòng thử lại.');
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center">
            Đăng ký
          </Typography>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="Tên người dùng"
              name="username"
              autoComplete="username"
              autoFocus
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              margin="normal"
              fullWidth
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Đăng ký
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/login')}
            >
              Đã có tài khoản? Đăng nhập ngay
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 