import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';

const MedicationManagement = () => {
  const [medications, setMedications] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    status: 'active',
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const fetchMedications = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/medications', getAuthHeaders());
      setMedications(response.data);
    } catch (error) {
      console.error('Error fetching medications:', error);
      showSnackbar('Lỗi khi tải danh sách thuốc', 'error');
    }
  };

  const handleOpen = (medication = null) => {
    if (medication) {
      setSelectedMedication(medication);
      setFormData({
        name: medication.name,
        description: medication.description,
        price: medication.price,
        unit: medication.unit,
        status: medication.status,
      });
    } else {
      setSelectedMedication(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        unit: '',
        status: 'active',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMedication(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedMedication) {
        await axios.put(
          `http://localhost:3000/api/admin/medications/${selectedMedication.id}`,
          formData,
          getAuthHeaders()
        );
        showSnackbar('Cập nhật thuốc thành công');
      } else {
        await axios.post('http://localhost:3000/api/admin/medications', formData, getAuthHeaders());
        showSnackbar('Thêm thuốc mới thành công');
      }
      fetchMedications();
      handleClose();
    } catch (error) {
      console.error('Error saving medication:', error);
      showSnackbar('Lỗi khi lưu thông tin thuốc', 'error');
    }
  };

  const handleDelete = async (medicationId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thuốc này?')) {
      try {
        await axios.delete(`http://localhost:3000/api/admin/medications/${medicationId}`, getAuthHeaders());
        showSnackbar('Xóa thuốc thành công');
        fetchMedications();
      } catch (error) {
        console.error('Error deleting medication:', error);
        showSnackbar('Lỗi khi xóa thuốc', 'error');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Quản lý thuốc</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Thêm thuốc mới
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên thuốc</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Đơn vị</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell>{medication.name}</TableCell>
                <TableCell>{medication.description}</TableCell>
                <TableCell>{medication.price.toLocaleString()} VNĐ</TableCell>
                <TableCell>{medication.unit}</TableCell>
                <TableCell>{medication.status}</TableCell>
                <TableCell>
                  <Tooltip title="Sửa">
                    <IconButton onClick={() => handleOpen(medication)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton onClick={() => handleDelete(medication.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedMedication ? 'Sửa thông tin thuốc' : 'Thêm thuốc mới'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Tên thuốc"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Giá"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Đơn vị"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Trạng thái"
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedMedication ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MedicationManagement; 