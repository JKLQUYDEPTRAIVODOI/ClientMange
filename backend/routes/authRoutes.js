const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Route test cho từng role
router.get('/test-admin', verifyToken, checkRole(['admin']), (req, res) => {
  res.json({ message: 'Bạn có quyền admin' });
});

router.get('/test-doctor', verifyToken, checkRole(['doctor']), (req, res) => {
  res.json({ message: 'Bạn có quyền bác sĩ' });
});

router.get('/test-patient', verifyToken, checkRole(['patient']), (req, res) => {
  res.json({ message: 'Bạn có quyền bệnh nhân' });
});

module.exports = router; 