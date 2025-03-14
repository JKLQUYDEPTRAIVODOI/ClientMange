const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Connected to database successfully');

        // Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);
        console.log('Password hashed successfully');

        // Kiểm tra xem tài khoản admin đã tồn tại chưa
        const [existingAdmin] = await connection.execute(
            'SELECT id FROM users WHERE email = ?',
            ['admin@example.com']
        );

        if (existingAdmin.length > 0) {
            console.log('Admin account already exists, updating password...');
            // Cập nhật mật khẩu nếu tài khoản đã tồn tại
            await connection.execute(
                'UPDATE users SET password = ? WHERE email = ?',
                [hashedPassword, 'admin@example.com']
            );
            console.log('Admin password updated successfully');
        } else {
            console.log('Creating new admin account...');
            // Tạo tài khoản admin mới
            await connection.execute(
                'INSERT INTO users (username, password, email, full_name, role_id) VALUES (?, ?, ?, ?, ?)',
                ['admin', hashedPassword, 'admin@example.com', 'Administrator', 1]
            );
            console.log('Admin account created successfully');
        }

        // Kiểm tra lại tài khoản admin
        const [admin] = await connection.execute(
            'SELECT id, email, role_id FROM users WHERE email = ?',
            ['admin@example.com']
        );
        console.log('Admin account details:', admin[0]);

    } catch (error) {
        console.error('Error creating/updating admin account:', error);
    } finally {
        await connection.end();
        console.log('Database connection closed');
    }
}

createAdmin(); 