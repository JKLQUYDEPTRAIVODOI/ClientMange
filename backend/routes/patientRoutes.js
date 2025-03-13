const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticateToken = require('../middleware/authenticateToken');

// Lấy thông tin profile của bệnh nhân
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        // Lấy thông tin từ cả bảng users và patient_profiles
        const query = `
            SELECT u.username, u.email, p.*
            FROM users u
            LEFT JOIN patient_profiles p ON u.id = p.user_id
            WHERE u.id = ?
        `;
        
        const [results] = await db.query(query, [userId]);
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy thông tin bệnh nhân' });
        }
        
        res.json(results[0]);
    } catch (error) {
        console.error('Error fetching patient profile:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Cập nhật hoặc tạo mới profile của bệnh nhân
router.post('/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const {
            dateOfBirth,
            gender,
            nationality,
            phone,
            address,
            bloodType,
            allergies
        } = req.body;

        // Kiểm tra xem profile đã tồn tại chưa
        const [existingProfile] = await db.query(
            'SELECT * FROM patient_profiles WHERE user_id = ?',
            [userId]
        );

        if (existingProfile.length > 0) {
            // Cập nhật profile hiện có
            const updateQuery = `
                UPDATE patient_profiles 
                SET date_of_birth = ?,
                    gender = ?,
                    nationality = ?,
                    phone = ?,
                    address = ?,
                    blood_type = ?,
                    allergies = ?
                WHERE user_id = ?
            `;
            
            await db.query(updateQuery, [
                dateOfBirth,
                gender,
                nationality,
                phone,
                address,
                bloodType,
                allergies,
                userId
            ]);
        } else {
            // Tạo profile mới
            const insertQuery = `
                INSERT INTO patient_profiles 
                (user_id, date_of_birth, gender, nationality, phone, address, blood_type, allergies)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            
            await db.query(insertQuery, [
                userId,
                dateOfBirth,
                gender,
                nationality,
                phone,
                address,
                bloodType,
                allergies
            ]);
        }

        res.json({ message: 'Cập nhật thông tin thành công' });
    } catch (error) {
        console.error('Error updating patient profile:', error);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router; 