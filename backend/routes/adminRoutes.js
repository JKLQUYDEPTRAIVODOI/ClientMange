const express = require('express');
const router = express.Router();
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Middleware để kiểm tra quyền admin
router.use(verifyToken, checkRole(['admin']));

// Routes chỉ dành cho admin
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT u.id, u.username, u.email, r.name as role FROM users u JOIN roles r ON u.role_id = r.id'
    );
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

// Thêm các routes khác cho admin ở đây

module.exports = router; 