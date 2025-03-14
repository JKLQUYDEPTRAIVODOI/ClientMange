const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log(`Using database: ${process.env.DB_NAME}`);
        
        // Đọc file SQL
        const sqlFile = path.join(__dirname, '../database/schema.sql');
        const sqlContent = fs.readFileSync(sqlFile, 'utf8');

        // Tách các câu lệnh SQL
        const statements = sqlContent
            .split(';')
            .map(statement => statement.trim())
            .filter(statement => statement.length > 0);

        // Thực thi từng câu lệnh SQL
        for (const statement of statements) {
            try {
                await connection.query(statement);
                console.log('Executed SQL statement successfully');
            } catch (error) {
                console.error('Error executing SQL statement:', error.message);
                console.error('Statement:', statement);
                throw error;
            }
        }

        console.log('Database structure created successfully');
    } catch (error) {
        console.error('Error setting up database:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

setupDatabase()
    .then(() => {
        console.log('Database setup completed successfully');
        process.exit(0);
    })
    .catch(error => {
        console.error('Database setup failed:', error);
        process.exit(1);
    }); 