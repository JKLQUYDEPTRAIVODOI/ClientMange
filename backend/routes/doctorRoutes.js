const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Middleware để kiểm tra quyền bác sĩ
router.use(verifyToken, checkRole(['doctor', 'admin']));

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