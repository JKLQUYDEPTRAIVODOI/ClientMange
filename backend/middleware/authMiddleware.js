const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database using the correct property name (id)
    const [users] = await pool.query(
      'SELECT u.*, r.name as role FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [decoded.id]  // Using decoded.id to match the token payload
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = users[0];
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

const checkRole = (roleName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (req.user.role !== roleName) {
      return res.status(403).json({ 
        message: 'Access denied',
        required: roleName,
        current: req.user.role
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
}; 