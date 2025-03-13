const mysql = require('mysql2');
require('dotenv').config();

console.log('Database configuration:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  // không log password vì lý do bảo mật
});

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Successfully connected to database');
  connection.release();
});

module.exports = pool.promise(); 