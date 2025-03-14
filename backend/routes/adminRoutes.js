const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Middleware để kiểm tra quyền admin
router.use(verifyToken, checkRole(['admin']));

// ===== User Management Routes =====
// Get all users
router.get('/users', async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT u.id, u.username, u.email, r.name as role, u.created_at, ' +
      'CASE WHEN u.role_id = r.id THEN "active" ELSE "inactive" END as status ' +
      'FROM users u ' +
      'JOIN roles r ON u.role_id = r.id'
    );
    res.json(users);
  } catch (error) {
    console.error('Error in GET /users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new user
router.post('/users', async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    // Get role_id from roles table
    const [roles] = await db.execute('SELECT id FROM roles WHERE name = ?', [role]);
    if (roles.length === 0) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const roleId = roles[0].id;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, roleId]
    );

    res.json({ 
      id: result.insertId, 
      username, 
      email, 
      role,
      created_at: new Date(),
      status: 'active'
    });
  } catch (error) {
    console.error('Error in POST /users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  const { username, email, role, status } = req.body;
  try {
    // Get role_id from roles table
    const [roles] = await db.execute('SELECT id FROM roles WHERE name = ?', [role]);
    if (roles.length === 0) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    const roleId = roles[0].id;

    // If password is provided, hash it
    let updateQuery = 'UPDATE users SET username = ?, email = ?, role_id = ? WHERE id = ?';
    let params = [username, email, roleId, req.params.id];

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateQuery = 'UPDATE users SET username = ?, email = ?, role_id = ?, password = ? WHERE id = ?';
      params = [username, email, roleId, hashedPassword, req.params.id];
    }

    await db.execute(updateQuery, params);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error in PUT /users/:id:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /users/:id:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ===== Medication Management Routes =====
// Get all medications
router.get('/medications', async (req, res) => {
  try {
    const [medications] = await db.execute(
      'SELECT * FROM medications ORDER BY created_at DESC'
    );
    res.json(medications);
  } catch (error) {
    console.error('Error in GET /medications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add new medication
router.post('/medications', async (req, res) => {
  const { name, description, price, unit, status = 'active' } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO medications (name, description, price, unit, status) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, unit, status]
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      price,
      unit,
      status,
      created_at: new Date()
    });
  } catch (error) {
    console.error('Error in POST /medications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update medication
router.put('/medications/:id', async (req, res) => {
  const { name, description, price, unit, status } = req.body;
  try {
    await db.execute(
      'UPDATE medications SET name = ?, description = ?, price = ?, unit = ?, status = ? WHERE id = ?',
      [name, description, price, unit, status, req.params.id]
    );
    res.json({ message: 'Medication updated successfully' });
  } catch (error) {
    console.error('Error in PUT /medications/:id:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete medication
router.delete('/medications/:id', async (req, res) => {
  try {
    await db.execute('DELETE FROM medications WHERE id = ?', [req.params.id]);
    res.json({ message: 'Medication deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /medications/:id:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 