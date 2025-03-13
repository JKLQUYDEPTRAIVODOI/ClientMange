const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Không tìm thấy token xác thực' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

exports.checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const [users] = await db.execute(
        'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
        [req.user.userId]
      );

      if (users.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      const userRole = users[0].role_name;

      if (!roles.includes(userRole)) {
        return res.status(403).json({ 
          message: 'Bạn không có quyền truy cập chức năng này' 
        });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };
}; 