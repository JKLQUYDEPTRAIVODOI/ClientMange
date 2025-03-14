const db = require('../config/db');

const formatDate = (dateString) => {
    if (!dateString) return null;
    // Thêm timezone offset để tránh bị lệch ngày
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const userDate = new Date(date.getTime() + userTimezoneOffset);
    return userDate.toISOString().split('T')[0];
};

const patientController = {
    // Lấy thông tin profile của bệnh nhân
    getProfile: async (req, res) => {
        try {
            const userId = req.user.id;
            console.log('Getting profile for user ID:', userId);

            // Kiểm tra xem có profile không
            const [profiles] = await db.execute(
                `SELECT * FROM patient_profiles WHERE user_id = ?`,
                [userId]
            );

            if (profiles.length === 0) {
                // Nếu chưa có profile, tạo mới với thông tin cơ bản
                await db.execute(
                    `INSERT INTO patient_profiles (user_id) VALUES (?)`,
                    [userId]
                );
            }

            // Lấy thông tin profile
            const [rows] = await db.execute(
                `SELECT 
                    p.*,
                    u.email
                FROM patient_profiles p
                JOIN users u ON p.user_id = u.id
                WHERE u.id = ?`,
                [userId]
            );

            if (!rows || rows.length === 0) {
                return res.status(404).json({ message: 'Không tìm thấy thông tin bệnh nhân' });
            }

            const userData = rows[0];
            console.log('Raw user data from database:', userData);

            if (userData.date_of_birth) {
                userData.date_of_birth = formatDate(userData.date_of_birth);
            }

            console.log('Sending formatted user data:', userData);
            res.json(userData);
        } catch (error) {
            console.error('Error in getProfile:', error);
            res.status(500).json({ message: 'Lỗi server khi lấy thông tin profile' });
        }
    },

    // Cập nhật thông tin profile
    updateProfile: async (req, res) => {
        const {
            fullname,
            dateOfBirth,
            gender,
            nationality,
            bloodType,
            allergies,
            phone,
            address
        } = req.body;

        const profileData = {
            full_name: fullname || null,  // Giữ nguyên giá trị
            date_of_birth: dateOfBirth ? formatDate(dateOfBirth) : null,
            gender: gender || null,
            nationality: nationality || null,
            blood_type: bloodType || null,
            allergies: allergies || null,
            phone: phone || null,
            address: address || null
        };

        console.log('Profile data to update:', profileData);  // Log dữ liệu trước khi cập nhật

        const query = `UPDATE patient_profiles SET full_name = ?, date_of_birth = ?, gender = ?, nationality = ?, blood_type = ?, allergies = ?, phone = ?, address = ? WHERE user_id = ?`;
        const updateValues = [
            profileData.full_name,
            profileData.date_of_birth,
            profileData.gender,
            profileData.nationality,
            profileData.blood_type,
            profileData.allergies,
            profileData.phone,
            profileData.address,
            req.user.id
        ];

        console.log('Update query:', query);  // Log câu lệnh SQL
        console.log('Update values:', updateValues);  // Log giá trị sẽ được cập nhật

        try {
            await db.execute(query, updateValues);
            res.status(200).json({ message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).json({ message: 'Error updating profile' });
        }
    }
};

module.exports = patientController; 