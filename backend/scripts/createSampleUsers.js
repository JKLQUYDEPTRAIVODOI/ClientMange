const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createSampleUsers() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        // Tạo tài khoản bác sĩ
        const doctorPassword = await bcrypt.hash('doctor123', 10);
        const [doctorResult] = await connection.execute(
            'INSERT INTO users (username, password, email, full_name, phone, role_id) VALUES (?, ?, ?, ?, ?, ?)',
            ['doctor1', doctorPassword, 'doctor1@example.com', 'Bác sĩ Nguyễn Văn A', '0123456789', 2]
        );
        console.log('Created doctor account:', doctorResult.insertId);

        // Tạo profile cho bác sĩ
        await connection.execute(
            'INSERT INTO doctor_profiles (user_id, specialty_id, experience_years, education) VALUES (?, ?, ?, ?)',
            [doctorResult.insertId, 1, 5, 'Đại học Y Hà Nội']
        );
        console.log('Created doctor profile');

        // Tạo tài khoản bệnh nhân
        const patientPassword = await bcrypt.hash('patient123', 10);
        const [patientResult] = await connection.execute(
            'INSERT INTO users (username, password, email, full_name, phone, role_id) VALUES (?, ?, ?, ?, ?, ?)',
            ['patient1', patientPassword, 'patient1@example.com', 'Bệnh nhân Trần Thị B', '0987654321', 3]
        );
        console.log('Created patient account:', patientResult.insertId);

        console.log('Sample users created successfully');
        console.log('\nThông tin đăng nhập:');
        console.log('Bác sĩ:');
        console.log('- Email: doctor1@example.com');
        console.log('- Password: doctor123');
        console.log('\nBệnh nhân:');
        console.log('- Email: patient1@example.com');
        console.log('- Password: patient123');

    } catch (error) {
        console.error('Error creating sample users:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

createSampleUsers()
    .then(() => {
        console.log('Script completed successfully');
        process.exit(0);
    })
    .catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    }); 