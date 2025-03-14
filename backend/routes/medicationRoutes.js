const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

// Middleware để kiểm tra quyền admin
router.use(verifyToken, checkRole(['admin']));

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