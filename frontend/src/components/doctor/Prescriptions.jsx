import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Prescriptions = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [medications, setMedications] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [note, setNote] = useState('');
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchMedications();
    fetchPatients();
  }, []);

  const fetchMedications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/medications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMedications(response.data);
    } catch (error) {
      console.error('Error fetching medications:', error);
      showSnackbar('Không thể tải danh sách thuốc', 'error');
    }
  };

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

  const handleAddItem = () => {
    setPrescriptionItems([
      ...prescriptionItems,
      { medicationId: '', quantity: 1, dosage: '', note: '' }
    ]);
  };

  const handleRemoveItem = (index) => {
    setPrescriptionItems(prescriptionItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...prescriptionItems];
    newItems[index][field] = value;
    setPrescriptionItems(newItems);
  };

  const handleSavePrescription = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/doctor/prescriptions',
        {
          patientId: selectedPatient.id,
          diagnosis,
          note,
          items: prescriptionItems
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSnackbar('Đã tạo đơn thuốc thành công');
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating prescription:', error);
      showSnackbar('Không thể tạo đơn thuốc', 'error');
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
    setDiagnosis('');
    setNote('');
    setPrescriptionItems([]);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Kê đơn thuốc
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Tạo đơn thuốc mới
          </Button>
        </Box>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>Tạo đơn thuốc mới</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Autocomplete
                  options={patients}
                  getOptionLabel={(option) => `${option.name} - ${option.email}`}
                  value={selectedPatient}
                  onChange={(_, newValue) => setSelectedPatient(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Chọn bệnh nhân" required />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Chẩn đoán"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  required
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Ghi chú"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Danh sách thuốc</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={handleAddItem}
                  >
                    Thêm thuốc
                  </Button>
                </Box>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tên thuốc</TableCell>
                        <TableCell>Số lượng</TableCell>
                        <TableCell>Liều dùng</TableCell>
                        <TableCell>Ghi chú</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prescriptionItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormControl fullWidth>
                              <Select
                                value={item.medicationId}
                                onChange={(e) => handleItemChange(index, 'medicationId', e.target.value)}
                                required
                              >
                                {medications.map((med) => (
                                  <MenuItem key={med.id} value={med.id}>
                                    {med.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                              required
                              inputProps={{ min: 1 }}
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={item.dosage}
                              onChange={(e) => handleItemChange(index, 'dosage', e.target.value)}
                              placeholder="VD: 1 viên/lần"
                              required
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={item.note}
                              onChange={(e) => handleItemChange(index, 'note', e.target.value)}
                              placeholder="VD: Uống sau ăn"
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button
              onClick={handleSavePrescription}
              variant="contained"
              disabled={!selectedPatient || !diagnosis || prescriptionItems.length === 0}
            >
              Lưu đơn thuốc
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

export default Prescriptions; 