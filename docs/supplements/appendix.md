<!-- Phụ lục — chèn cuối báo cáo -->

# Phụ lục

## A. Link GitHub Repository

Toàn bộ mã nguồn dự án TodoList Collaboration được lưu trữ tại:

https://github.com/todolist-collaboration

Repository bao gồm backend NestJS, Prisma schema, migration files, và tài liệu kỹ thuật.

## B. Nội dung file .env.example

File `.env.example` chứa danh sách các biến môi trường cần thiết để chạy dự án. Mỗi thành viên copy file này thành `.env` và điền giá trị thực tế:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/todolist_db?schema=public"

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# App
PORT=3333
FRONTEND_URL=http://localhost:3000

# Mail (Brevo)
BREVO_API_KEY=your_brevo_api_key_here
MAIL_FROM=noreply@todolist.com
```

Lưu ý: file `.env` chứa secrets thực tế, đã được thêm vào `.gitignore` và **không bao giờ** được commit lên repository.

## C. Danh sách lệnh chạy dự án

Các lệnh dưới đây được thực thi trong thư mục `backend/`:

```bash
# 1. Cài đặt dependencies
npm install

# 2. Tạo database (PostgreSQL phải đang chạy)
npx prisma migrate dev

# 3. Generate Prisma Client
npx prisma generate

# 4. Chạy development server
npm run start:dev
# Server khởi động tại http://localhost:3333

# 5. Truy cập Swagger UI
# Mở trình duyệt: http://localhost:3333/api-docs

# 6. Chạy unit tests
npm run test

# 7. Build production
npm run build

# 8. Chạy production
npm run start:prod
```
