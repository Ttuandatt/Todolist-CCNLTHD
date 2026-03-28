# CHƯƠNG 10: ĐÁNH GIÁ VÀ TỔNG KẾT

> **Hướng dẫn dán vào báo cáo:** Thay toàn bộ nội dung Chương 10 (hiện đang trống) bằng nội dung dưới đây.

---

## 10.1. So sánh với mục tiêu ban đầu

### Mục tiêu đã đề ra (Phần 1)

| # | Mục tiêu | Kết quả | Mức độ |
|---|---------|---------|-------|
| 1 | Hiểu kiến trúc NestJS: Modules, Controllers, Providers, Guards, Interceptors | Trình bày đầy đủ ở Ch4–6, có code minh họa thực tế | ✅ Đạt |
| 2 | Nắm vững TypeScript trong môi trường Backend | Ch4 trình bày Interface, Decorator, Generics | ✅ Đạt |
| 3 | Xây dựng RESTful API với CRUD đầy đủ | 44 endpoints hoàn chỉnh cho 5 modules | ✅ Đạt |
| 4 | Tích hợp PostgreSQL qua Prisma ORM | 17 models, 4 migrations, đầy đủ relations | ✅ Đạt |
| 5 | Triển khai Authentication & Authorization bằng JWT | JWT + Refresh Token + Token Blacklist + APP_GUARD | ✅ Vượt mục tiêu |
| 6 | Tổ chức code theo kiến trúc Modular | Cấu trúc modules/ và shared/ chuẩn | ✅ Đạt |
| 7 | So sánh NestJS với Spring Boot | Đề cập ở Ch1, Ch4 (DI, Module, Decorator tương đồng) | ⚠️ Sơ lược |
| 8 | Triển khai Workspace, Project, Task module | Cả 3 module hoàn thành với đầy đủ CRUD | ✅ Đạt |

**Tổng kết:** Đạt 7/8 mục tiêu đề ra. Mục tiêu so sánh với Spring Boot được đề cập nhưng chưa có bảng so sánh chi tiết — đây là điểm có thể cải thiện.

---

## 10.2. Phân tích lỗi (Bug Reports)

### Bug 1: JwtStrategy crash khi khởi động — "requires a secret or key"

**Mức độ:** Nghiêm trọng (crash toàn bộ ứng dụng)

**Triệu chứng:**
```
TypeError: JwtStrategy requires a secret or key
    at new JwtStrategy (jwt.strategy.ts:10:5)
```

**Nguyên nhân:** `ConfigModule` (chịu trách nhiệm load file `.env`) chưa được khởi tạo trước khi `AuthModule` khởi tạo `JwtStrategy`. Kết quả là `process.env.JWT_SECRET` trả về `undefined`.

**Quá trình debug:**
1. Kiểm tra file `.env` — file tồn tại và có `JWT_SECRET`
2. Kiểm tra `app.module.ts` — phát hiện thứ tự import: `AuthModule` đứng trước `ConfigModule`
3. Di chuyển `ConfigModule.forRoot({ isGlobal: true })` lên vị trí đầu tiên trong mảng `imports`

**Cách sửa:**
```typescript
// ❌ Trước khi sửa
@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), ...]
})

// ✅ Sau khi sửa
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, ...]
})
```

**Bài học:** Trong NestJS, thứ tự import trong `@Module` ảnh hưởng đến thứ tự khởi tạo. Các infrastructure modules (`ConfigModule`, `PrismaModule`) luôn phải được import trước feature modules.

---

### Bug 2: Import path sai sau khi refactor cấu trúc thư mục

**Mức độ:** Nghiêm trọng (build thất bại — TypeScript compile error)

**Bối cảnh:** Nhóm quyết định refactor cấu trúc từ flat structure (`src/auth/`, `src/user/`...) sang phân tách rõ ràng (`src/modules/`, `src/shared/`) để code có tổ chức hơn.

**Triệu chứng:** Sau khi di chuyển files, build báo hàng chục lỗi:
```
Cannot find module 'src/auth/guards/jwt-auth.guard'
Property 'user' does not exist on type 'PrismaService'
Module '"@prisma/client"' has no exported member 'ProjectStatus'
```

**Nguyên nhân:** Ba vấn đề riêng biệt:
1. Các file đã di chuyển nhưng import paths chưa được cập nhật
2. Prisma Client chưa được regenerate sau khi node_modules được cài lại
3. `@sendgrid/mail` package chưa được install

**Quá trình sửa:**
1. Cập nhật toàn bộ import paths trong 12 files (dùng grep để tìm tất cả path cũ)
2. Chạy `npx prisma generate` để tạo lại Prisma Client với các models mới
3. Chạy `npm install @sendgrid/mail`

**Bài học:**
- Khi refactor cấu trúc thư mục lớn, cần kiểm tra tất cả import paths — đặc biệt các absolute paths dạng `src/...`
- Prisma Client là code được **auto-generate** — cần regenerate sau mỗi lần thay đổi schema hoặc cài lại dependencies
- Nên dùng `npm run build` để kiểm tra TypeScript errors trước khi commit

---

### Bug 3: User.avatar path sai khi upload từ môi trường khác

**Mức độ:** Trung bình (tính năng không hoạt động đúng)

**Triệu chứng:** Avatar upload thành công nhưng khi truy cập URL ảnh thì trả về 404.

**Nguyên nhân:** `UserService.uploadAvatar()` dùng `__dirname` để tính đường dẫn lưu file:
```typescript
const filepath = join(__dirname, '..', '..', 'uploads', 'avatars', filename);
```

`__dirname` trong môi trường dev (TypeScript source) khác với môi trường production (compiled JavaScript). Khi chạy `npm run start:dev`, `__dirname` trỏ vào `dist/modules/user/` thay vì `backend/uploads/avatars/`.

**Cách sửa:** Dùng `process.cwd()` thay vì `__dirname` để lấy thư mục gốc của project:
```typescript
// ✅ Dùng process.cwd() — luôn trỏ về thư mục chạy npm script
const filepath = join(process.cwd(), 'uploads', 'avatars', filename);
```

**Bài học:** `__dirname` phụ thuộc vào vị trí file trong cấu trúc thư mục compiled. `process.cwd()` luôn trỏ về thư mục từ đó lệnh `node` được chạy — ổn định hơn cho file system operations.

---

## 10.3. Nhìn lại quá trình học NestJS

### Những điều nhóm học được ngoài kế hoạch

1. **Tầm quan trọng của cấu trúc thư mục:** Không phải NestJS bắt buộc, nhưng thiết kế tốt ngay từ đầu tiết kiệm nhiều công sức refactor sau này.

2. **Git workflow thực tế:** Làm việc nhóm với nhiều branch, merge conflict, và convention commit message — kỹ năng quan trọng không kém code.

3. **Docker trong phát triển:** PostgreSQL qua Docker tránh "works on my machine" — mọi thành viên có cùng môi trường database.

4. **Swagger không chỉ để demo:** Swagger UI trở thành công cụ test API chính trong quá trình phát triển, thay thế hoàn toàn cho Postman/Hoppscotch trong nhiều trường hợp.

### Đánh giá NestJS sau khi thực hành

| Khía cạnh | Đánh giá | Ghi chú |
|-----------|---------|---------|
| **Learning curve** | Cao hơn Express | Cần hiểu DI, Decorators, Module system |
| **Năng suất sau khi quen** | Rất cao | CLI generate, cấu trúc rõ ràng |
| **TypeScript integration** | Xuất sắc | Type safety từ schema đến response |
| **Debug khó khăn** | Khi DI injection fail | Error message đôi khi khó hiểu |
| **Phù hợp cho** | Team có convention, project lớn | Không phù hợp cho microservice nhỏ cần deploy nhanh |
| **So với Spring Boot** | Tương đồng về kiến trúc | NestJS nhẹ hơn, startup nhanh hơn |
