const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authController = {
    register: async (req, res) => {
        try {
            const { email, password, role } = req.body;

            // Kiểm tra email đã tồn tại chưa
            const [existingUsers] = await db.execute(
                'SELECT * FROM users WHERE email = ?',
                [email]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'Email đã tồn tại' });
            }

            // Kiểm tra role hợp lệ
            const [roles] = await db.execute(
                'SELECT * FROM roles WHERE name = ?',
                [role]
            );

            if (roles.length === 0) {
                return res.status(400).json({ message: 'Role không hợp lệ' });
            }

            const roleId = roles[0].id;

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo user mới
            const [result] = await db.execute(
                'INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)',
                [email, hashedPassword, roleId]
            );

            // Tạo profile tương ứng với role
            const userId = result.insertId;
            if (role === 'patient') {
                await db.execute(
                    'INSERT INTO patient_profiles (user_id, full_name) VALUES (?, ?)',
                    [userId, '(Chưa cập nhật)']
                );
            } else if (role === 'doctor') {
                await db.execute(
                    'INSERT INTO doctor_profiles (user_id, full_name) VALUES (?, ?)',
                    [userId, '(Chưa cập nhật)']
                );
            }

            res.status(201).json({ message: 'Đăng ký thành công' });
        } catch (error) {
            console.error('Error in register:', error);
            res.status(500).json({ message: 'Lỗi server khi đăng ký' });
        }
    },

    login: async (req, res) => {
        try {
            console.log('Login attempt:', req.body);
            const { email, password } = req.body;

            // Kiểm tra email tồn tại và lấy thông tin user kèm role
            const [users] = await db.execute(
                `SELECT u.*, r.name as role_name 
                FROM users u 
                JOIN roles r ON u.role_id = r.id 
                WHERE u.email = ?`,
                [email]
            );

            console.log('Found users:', users);

            if (users.length === 0) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            const user = users[0];

            // Kiểm tra mật khẩu
            const validPassword = await bcrypt.compare(password, user.password);
            console.log('Password validation:', validPassword);

            if (!validPassword) {
                return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
            }

            // Lấy thông tin profile dựa vào role
            let profile = null;
            if (user.role_name === 'patient') {
                const [profiles] = await db.execute(
                    'SELECT * FROM patient_profiles WHERE user_id = ?',
                    [user.id]
                );
                profile = profiles[0];
            } else if (user.role_name === 'doctor') {
                const [profiles] = await db.execute(
                    'SELECT * FROM doctor_profiles WHERE user_id = ?',
                    [user.id]
                );
                profile = profiles[0];
            }

            console.log('User profile:', profile);

            // Tạo JWT token
            const token = jwt.sign(
                { 
                    id: user.id,
                    email: user.email,
                    role: user.role_name
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Đăng nhập thành công',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role_name,
                    profile: profile
                }
            });
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
        }
    }
};

module.exports = authController; 