-- Tắt kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa các bảng cũ nếu tồn tại
DROP TABLE IF EXISTS invoice_details;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS prescription_details;
DROP TABLE IF EXISTS prescriptions;
DROP TABLE IF EXISTS medical_records;
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS medications;
DROP TABLE IF EXISTS medical_services;
DROP TABLE IF EXISTS doctor_profiles;
DROP TABLE IF EXISTS patient_profiles;
DROP TABLE IF EXISTS specialties;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- Bảng vai trò
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Thêm dữ liệu mẫu cho vai trò
INSERT INTO roles (name, description) VALUES
('admin', 'Quản trị viên hệ thống'),
('doctor', 'Bác sĩ'),
('patient', 'Bệnh nhân');

-- Bảng người dùng (đã bỏ full_name, phone, address)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Bảng chuyên khoa
CREATE TABLE IF NOT EXISTS specialties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng thông tin bác sĩ (thêm full_name, phone, address)
CREATE TABLE IF NOT EXISTS doctor_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    specialty_id INT,
    experience_years INT,
    education TEXT,
    description TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);

-- Bảng thông tin bệnh nhân (đã có full_name, phone, address)
CREATE TABLE IF NOT EXISTS patient_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(10),
    nationality VARCHAR(50),
    blood_type VARCHAR(5),
    allergies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Bảng dịch vụ y tế
CREATE TABLE IF NOT EXISTS medical_services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category ENUM('examination', 'test', 'imaging', 'treatment') NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng lịch hẹn
CREATE TABLE IF NOT EXISTS appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled') DEFAULT 'pending',
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
    FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(id)
);

-- Bảng bệnh án
CREATE TABLE IF NOT EXISTS medical_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_id INT,
    diagnosis TEXT,
    symptoms TEXT,
    treatment_plan TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
    FOREIGN KEY (doctor_id) REFERENCES doctor_profiles(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id)
);

-- Bảng thuốc
CREATE TABLE IF NOT EXISTS medications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng đơn thuốc
CREATE TABLE IF NOT EXISTS prescriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medical_record_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_record_id) REFERENCES medical_records(id)
);

-- Bảng chi tiết đơn thuốc
CREATE TABLE IF NOT EXISTS prescription_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prescription_id INT NOT NULL,
    medication_id INT NOT NULL,
    quantity INT NOT NULL,
    dosage VARCHAR(100),
    instructions TEXT,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id),
    FOREIGN KEY (medication_id) REFERENCES medications(id)
);

-- Bảng hóa đơn
CREATE TABLE IF NOT EXISTS invoices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    appointment_id INT,
    prescription_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cash', 'card', 'insurance') DEFAULT 'cash',
    payment_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patient_profiles(id),
    FOREIGN KEY (appointment_id) REFERENCES appointments(id),
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id)
);

-- Bảng chi tiết hóa đơn
CREATE TABLE IF NOT EXISTS invoice_details (
    id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_id INT NOT NULL,
    service_id INT,
    prescription_id INT,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (service_id) REFERENCES medical_services(id),
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id)
);

-- Thêm dữ liệu mẫu cho chuyên khoa
INSERT INTO specialties (name, description) VALUES
('Nội tổng quát', 'Chuyên khoa nội tổng quát'),
('Ngoại tổng quát', 'Chuyên khoa ngoại tổng quát'),
('Răng - Hàm - Mặt', 'Chuyên khoa răng hàm mặt'),
('Nhãn khoa', 'Chuyên khoa mắt'),
('Thần kinh', 'Chuyên khoa thần kinh');

-- Thêm dữ liệu mẫu cho dịch vụ y tế
INSERT INTO medical_services (name, description, price, category) VALUES
('Khám tổng quát', 'Khám sức khỏe tổng quát', 200000, 'examination'),
('Xét nghiệm máu', 'Xét nghiệm công thức máu', 150000, 'test'),
('Chụp X-quang', 'Chụp X-quang ngực', 250000, 'imaging'),
('Điều trị nội trú', 'Điều trị nội trú theo ngày', 500000, 'treatment');

-- Thêm dữ liệu mẫu cho users và profiles sau khi tạo xong các bảng và dữ liệu cơ bản

-- Thêm admin
INSERT INTO users (email, password, role_id) VALUES
('admin@gmail.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 1);

-- Thêm bác sĩ mẫu
INSERT INTO users (email, password, role_id) VALUES
('doctor1@gmail.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 2),
('doctor2@gmail.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 2);

-- Thêm bệnh nhân mẫu
INSERT INTO users (email, password, role_id) VALUES
('patient1@gmail.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 3),
('patient2@gmail.com', '$2b$10$8f.oiyy89Cm8SyrX4CBejOkLe5e6ePg7XQLXpjUSMy6R4W1Kp5INS', 3);

-- Thêm thông tin cho bác sĩ
INSERT INTO doctor_profiles (user_id, full_name, phone, address, specialty_id, experience_years, education, description) VALUES
(2, 'Bác sĩ Nguyễn Văn A', '0123456789', 'Hà Nội', 1, 5, 'Đại học Y Hà Nội', 'Bác sĩ chuyên khoa nội'),
(3, 'Bác sĩ Trần Thị B', '0987654321', 'Hồ Chí Minh', 2, 8, 'Đại học Y Dược TP.HCM', 'Bác sĩ chuyên khoa ngoại');

-- Thêm thông tin cho bệnh nhân
INSERT INTO patient_profiles (user_id, full_name, phone, address, date_of_birth, gender, nationality, blood_type) VALUES
(4, 'Nguyễn Văn X', '0123456789', 'Hà Nội', '1990-01-01', 'Nam', 'Việt Nam', 'A'),
(5, 'Trần Thị Y', '0987654321', 'Hồ Chí Minh', '1995-05-05', 'Nữ', 'Việt Nam', 'B'); 