const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { username, email, password, role = 'patient' } = req.body;
    console.log('Register attempt:', { username, email, role });

    // Kiểm tra email đã tồn tại
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length > 0) {
      console.log('Email already exists');
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Lấy role_id từ tên role
    const [roles] = await db.execute('SELECT id FROM roles WHERE name = ?', [role]);
    if (roles.length === 0) {
      console.log('Invalid role:', role);
      return res.status(400).json({ message: 'Role không hợp lệ' });
    }
    const roleId = roles[0].id;

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm user mới vào database
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, roleId]
    );
    console.log('User registered successfully');

    res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Received login request:', req.body);
    const { email, password } = req.body;

    // Kiểm tra user tồn tại và lấy thông tin role
    console.log('Executing database query for email:', email);
    const [users] = await db.execute(
      'SELECT u.*, r.name as role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
      [email]
    );
    console.log('Database query result:', users);

    if (users.length === 0) {
      console.log('User not found for email:', email);
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    const user = users[0];
    console.log('Found user:', { id: user.id, email: user.email, role_name: user.role_name });

    // Kiểm tra mật khẩu
    console.log('Comparing passwords...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Tạo JWT token
    console.log('Creating JWT token with secret:', process.env.JWT_SECRET ? 'Secret exists' : 'No secret found');
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role_name
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful:', { userId: user.id, role: user.role_name });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role_name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}; 