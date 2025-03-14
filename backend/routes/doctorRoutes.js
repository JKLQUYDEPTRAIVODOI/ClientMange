const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(verifyToken);
router.use(checkRole('doctor'));

// Profile routes
router.get('/profile', doctorController.getProfile);
router.put('/profile', doctorController.updateProfile);

// Routes dành cho bác sĩ
router.get('/patients', async (req, res) => {
  try {
    const [patients] = await db.execute(
      'SELECT u.id, u.username, u.email FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = "patient"'
    );
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thêm các routes khác cho bác sĩ ở đây

module.exports = router; 