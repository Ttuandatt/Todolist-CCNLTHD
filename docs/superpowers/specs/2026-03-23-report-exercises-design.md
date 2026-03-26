# Design: Bài tập nhỏ cho báo cáo NestJS — Mini Project "StudentManager"

## Tổng quan
Bổ sung phần "Bài tập ứng dụng" cho mỗi chương trong Phần 3 của báo cáo CCNLTHD (NestJS).
Sử dụng một mini project xuyên suốt: **StudentManager** (Quản lý Sinh viên).

## Cấu trúc mỗi bài tập
```
X. Bài tập ứng dụng
  X.1. Mục tiêu
  X.2. Mô tả bài tập
  X.3. Code minh họa
  X.4. Kết quả đạt được (screenshots)
```

## Chi tiết từng chương

### Chương 3: "Khởi tạo dự án StudentManager"
- Tạo project bằng NestJS CLI, chạy dev, sửa message, test Hoppscotch
- Screenshots: terminal, Hoppscotch GET /

### Chương 4: "Xây dựng Module Student với dữ liệu giả"
- Generate Module/Controller/Service, in-memory array, 3 endpoints (GET list, GET :id, POST)
- Screenshots: Hoppscotch CRUD responses

### Chương 5: "Kết nối PostgreSQL và CRUD với Prisma"
- Prisma schema Student, migration, PrismaService, full CRUD 5 endpoints
- Screenshots: schema, migration terminal, Prisma Studio, Hoppscotch CRUD

### Chương 6: "Validation và Response chuẩn hóa"
- CreateStudentDto + class-validator, ValidationPipe, TransformResponseInterceptor
- Screenshots: validation errors, formatted responses

### Chương 7: "Bảo vệ API với JWT Authentication"
- AuthModule (register/login), JwtStrategy, JwtAuthGuard on StudentController
- Screenshots: register, login, 401 vs 200
