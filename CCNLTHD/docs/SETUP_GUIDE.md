# 🚀 HƯỚNG DẪN SETUP MÔI TRƯỜNG - TodoList Collaboration

> **Dành cho:** Team Lead và các thành viên  
> **Thời gian:** ~30-45 phút  
> **OS:** Windows

---

## BƯỚC 1: CÀI ĐẶT NODE.JS

### 1.1 Download Node.js
1. Truy cập: https://nodejs.org/
2. Download **LTS version** (v20.x hoặc v18.x)
3. Chạy installer (.msi file)

### 1.2 Cài đặt
1. Double-click file `.msi` đã download
2. Click **Next** → Accept License → **Next**
3. Giữ nguyên đường dẫn mặc định → **Next**
4. ✅ Check "Automatically install necessary tools" → **Next**
5. Click **Install** → Chờ cài xong → **Finish**

### 1.3 Kiểm tra cài đặt
Mở **PowerShell** hoặc **Terminal** và chạy:
```bash
node --version
# Kết quả mong đợi: v20.x.x hoặc v18.x.x

npm --version
# Kết quả mong đợi: 10.x.x hoặc 9.x.x
```

---

## BƯỚC 2: CÀI ĐẶT POSTGRESQL

### 2.1 Download PostgreSQL
1. Truy cập: https://www.postgresql.org/download/windows/
2. Click **Download the installer**
3. Chọn phiên bản **16.x** hoặc **15.x** cho Windows x86-64

### 2.2 Cài đặt
1. Chạy installer
2. Chọn components:
   - ✅ PostgreSQL Server
   - ✅ pgAdmin 4 (GUI tool)
   - ✅ Command Line Tools
3. Đặt **password** cho user `postgres` (NHỚ MẬT KHẨU NÀY!)
   - Gợi ý: `postgres123` cho development
4. Port: giữ mặc định **5432**
5. Locale: Default
6. Click **Next** → **Install** → Chờ → **Finish**

### 2.3 Kiểm tra cài đặt
```bash
# Thêm PostgreSQL vào PATH nếu chưa có
# Mở PowerShell với quyền Admin:
$env:Path += ";C:\Program Files\PostgreSQL\16\bin"

# Kiểm tra
psql --version
# Kết quả: psql (PostgreSQL) 16.x
```

### 2.4 Tạo Database cho project
Mở **pgAdmin 4** hoặc dùng command:
```bash
# Kết nối với postgres
psql -U postgres

# Nhập password đã đặt ở bước 2.2

# Tạo database
CREATE DATABASE todolist_db;

# Thoát
\q
```

---

## BƯỚC 3: CÀI ĐẶT NESTJS CLI

```bash
npm install -g @nestjs/cli

# Kiểm tra
nest --version
# Kết quả: 10.x.x
```

---

## BƯỚC 4: KHỞI TẠO BACKEND PROJECT

### 4.1 Di chuyển vào thư mục project
```bash
cd d:\IT\Projects\CCNLTHD
```

### 4.2 Tạo NestJS project
```bash
nest new backend
```

Khi được hỏi:
- **Which package manager would you ❤️ to use?** → Chọn `npm`
- Chờ cài đặt dependencies (~2-3 phút)

### 4.3 Kiểm tra project đã tạo
```bash
cd backend
npm run start:dev
```

Mở browser: http://localhost:3000 → Thấy "Hello World!" là thành công!

**Nhấn `Ctrl+C` để dừng server**

---

## BƯỚC 5: CÀI ĐẶT PRISMA

### 5.1 Cài đặt dependencies
```bash
cd d:\IT\Projects\CCNLTHD\backend

npm install prisma @prisma/client
npm install -D prisma
```

### 5.2 Khởi tạo Prisma
```bash
npx prisma init
```

Lệnh này tạo:
- `prisma/schema.prisma` - File định nghĩa database schema
- `.env` - File chứa DATABASE_URL

### 5.3 Cấu hình Database URL
Mở file `.env` và sửa:
```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/todolist_db?schema=public"
```

> ⚠️ Thay `postgres123` bằng password bạn đã đặt ở Bước 2.2

### 5.4 Kiểm tra kết nối
```bash
npx prisma db pull
# Nếu không có lỗi = kết nối thành công
```

---

## BƯỚC 6: CẤU TRÚC THƯ MỤC SAU KHI SETUP

```
d:\IT\Projects\CCNLTHD\
├── docs/                    # Documentation (đã có)
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── .env                 # Environment variables
│   ├── package.json
│   └── tsconfig.json
└── frontend/                # (Sẽ tạo sau)
```

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Node.js v18+ cài xong
- [ ] npm hoạt động
- [ ] PostgreSQL cài xong
- [ ] Database `todolist_db` đã tạo
- [ ] NestJS CLI cài xong
- [ ] Backend project khởi tạo
- [ ] Prisma cài và kết nối database thành công
- [ ] `npm run start:dev` chạy được

---

## 🔜 BƯỚC TIẾP THEO

Sau khi hoàn thành setup, chúng ta sẽ:
1. Tạo Prisma Schema cho User, Workspace, Project, Task
2. Tạo Auth Module (Register/Login)
3. Tạo các Module CRUD

---

## ❓ XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi: 'nest' is not recognized
```bash
# Đóng terminal, mở lại và chạy:
npm install -g @nestjs/cli
```

### Lỗi: Cannot connect to PostgreSQL
- Kiểm tra PostgreSQL service đang chạy
- Kiểm tra password trong `.env` đúng chưa
- Kiểm tra database `todolist_db` đã tạo chưa

### Lỗi: Port 3000 already in use
```bash
# Tìm và kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```
