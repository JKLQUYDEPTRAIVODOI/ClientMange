# Hospital Management System

Hệ thống quản lý bệnh viện với các chức năng cho Admin, Bác sĩ và Bệnh nhân.

## Cài đặt

1. Clone repository:
```bash
git clone [your-repository-url]
cd HMS
```

2. Cài đặt dependencies cho Backend:
```bash
cd backend
npm install
```

3. Cài đặt dependencies cho Frontend:
```bash
cd ../frontend
npm install
```

4. Tạo file .env trong thư mục backend:
```env
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=hms_db
JWT_SECRET=your_jwt_secret
```

## Chạy ứng dụng

1. Chạy Backend:
```bash
cd backend
npm run dev
```

2. Chạy Frontend (mở terminal mới):
```bash
cd frontend
npm run dev
```

Ứng dụng sẽ chạy tại:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Công nghệ sử dụng

- Frontend: React, Material-UI, Vite
- Backend: Node.js, Express, MySQL
- Authentication: JWT

## Cấu trúc thư mục

```
HMS/
├── frontend/           # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
└── backend/            # Node.js backend
    ├── config/
    ├── controllers/
    ├── middleware/
    ├── routes/
    └── package.json
``` 