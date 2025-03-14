const pool = require('../config/db');
const logger = require('../config/logger');

// Get doctor profile
const getProfile = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    console.log('Getting doctor profile for user:', req.user);
    const doctorId = req.user?.id;
    if (!doctorId) {
      return res.status(401).json({ message: 'Unauthorized - User ID not found' });
    }

    // Get user info first
    console.log('Fetching user info for doctorId:', doctorId);
    const [users] = await connection.query(
      `SELECT 
        u.id,
        u.username as name,
        u.email,
        u.phone,
        u.gender,
        u.dateOfBirth,
        u.address,
        r.name as role
      FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = ? AND r.name = 'doctor'`,
      [doctorId]
    );
    console.log('User info found:', users);

    if (users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin bác sĩ' });
    }

    // Ensure doctor_details table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS doctor_details (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL UNIQUE,
        specialization VARCHAR(100),
        experience TEXT,
        education TEXT,
        certifications TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Get doctor details
    console.log('Fetching doctor details for doctorId:', doctorId);
    const [details] = await connection.query(
      'SELECT specialization, experience, education, certifications FROM doctor_details WHERE userId = ?',
      [doctorId]
    );
    console.log('Doctor details found:', details);

    // Combine user info with doctor details
    const profile = {
      ...users[0],
      ...details[0] || {
        specialization: '',
        experience: '',
        education: '',
        certifications: ''
      }
    };
    console.log('Final profile data:', profile);

    res.json(profile);
  } catch (error) {
    console.error('Detailed error in getProfile:', error);
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message,
      stack: error.stack 
    });
  } finally {
    connection.release();
  }
};

// Update doctor profile
const updateProfile = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    console.log('Updating doctor profile for user:', req.user);
    console.log('Update data received:', req.body);
    
    const doctorId = req.user?.id;
    if (!doctorId) {
      return res.status(401).json({ message: 'Unauthorized - User ID not found' });
    }

    const {
      name,
      phone,
      gender,
      dateOfBirth,
      address,
      specialization,
      experience,
      education,
      certifications
    } = req.body;

    await connection.beginTransaction();
    console.log('Transaction started');

    // Update user table
    console.log('Updating user table...');
    const updateUserQuery = `
      UPDATE users 
      SET username = ?, phone = ?, gender = ?, dateOfBirth = ?, address = ?
      WHERE id = ? AND role_id = (SELECT id FROM roles WHERE name = 'doctor')
    `;
    const [userResult] = await connection.query(updateUserQuery, [
      name,
      phone,
      gender,
      dateOfBirth || null,
      address,
      doctorId
    ]);
    console.log('User update result:', userResult);

    if (userResult.affectedRows === 0) {
      throw new Error('Không tìm thấy bác sĩ để cập nhật');
    }

    // Ensure doctor_details table exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS doctor_details (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL UNIQUE,
        specialization VARCHAR(100),
        experience TEXT,
        education TEXT,
        certifications TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Insert or update doctor details using ON DUPLICATE KEY UPDATE
    console.log('Upserting doctor details...');
    const upsertDetailsQuery = `
      INSERT INTO doctor_details 
        (userId, specialization, experience, education, certifications)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        specialization = VALUES(specialization),
        experience = VALUES(experience),
        education = VALUES(education),
        certifications = VALUES(certifications)
    `;
    const [detailsResult] = await connection.query(upsertDetailsQuery, [
      doctorId,
      specialization,
      experience,
      education,
      certifications
    ]);
    console.log('Doctor details upsert result:', detailsResult);

    await connection.commit();
    console.log('Transaction committed successfully');
    res.json({ message: 'Cập nhật thông tin thành công' });
  } catch (error) {
    console.error('Detailed error in updateProfile:', error);
    await connection.rollback();
    res.status(500).json({ 
      message: 'Lỗi server', 
      error: error.message,
      stack: error.stack 
    });
  } finally {
    connection.release();
  }
};

module.exports = {
  getProfile,
  updateProfile
}; 