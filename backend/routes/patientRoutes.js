const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { verifyToken } = require('../middleware/authMiddleware');

// Áp dụng middleware xác thực cho tất cả các routes
router.use(verifyToken);

// Routes
router.get('/profile', patientController.getProfile);
router.post('/profile', patientController.updateProfile);
router.put('/profile', patientController.updateProfile);

module.exports = router; 