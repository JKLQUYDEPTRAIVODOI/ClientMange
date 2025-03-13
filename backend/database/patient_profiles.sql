CREATE TABLE IF NOT EXISTS patient_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    date_of_birth DATE,
    gender VARCHAR(10),
    nationality VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    blood_type VARCHAR(5),
    allergies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
); 