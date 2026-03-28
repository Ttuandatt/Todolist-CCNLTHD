# BỔ SUNG VÀO CHƯƠNG 6 — KỸ THUẬT FILE UPLOAD VỚI MULTER

> **Hướng dẫn dán vào báo cáo:** Thêm section 6.5 và 6.6 này vào **sau section 6.4** (Bài tập ứng dụng hiện tại), trước phần Tổng kết của Chương 6.

---

## 6.5. File Upload với Multer

### 6.5.1. File Upload là gì và tại sao cần Multer?

HTTP multipart/form-data là định dạng gửi file lên server — khác hoàn toàn với JSON. Request body lúc này không phải text, mà là binary data xen lẫn metadata. Express.js (và NestJS) không xử lý được loại request này theo mặc định.

**Multer** là middleware Node.js chuyên xử lý `multipart/form-data`. NestJS tích hợp Multer qua `@nestjs/platform-express`, cung cấp `FileInterceptor` và `MulterModule`.

### 6.5.2. Lý thuyết hoạt động

```
Client                          NestJS
  |                               |
  |--- POST /users/me/avatar ----> |
  |    Content-Type: multipart     |
  |    [binary file data]          |
  |                          [Multer Middleware]
  |                          1. Parse multipart request
  |                          2. Validate file (type, size)
  |                          3. Lưu file (memory/disk)
  |                          4. Gắn vào req.file
  |                               |
  |                          [Controller]
  |                          @UploadedFile() nhận file
  |                               |
  |<--- 201 { avatar: "..." } ---- |
```

### 6.5.3. Cấu hình Multer trong dự án

File `shared/common/config/multer.config.ts`:

```typescript
import { memoryStorage } from 'multer';

export const avatarMulterConfig = {
  storage: memoryStorage(),
  // memoryStorage: lưu file vào RAM (buffer) thay vì disk
  // Lý do: linh hoạt hơn — có thể xử lý trước khi lưu (resize, compress)

  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB tối đa
  },

  fileFilter: (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);  // Chấp nhận file
    } else {
      callback(new Error('Only JPEG, PNG, GIF are allowed'), false);
    }
  },
};
```

Đăng ký trong `UserModule`:

```typescript
@Module({
  imports: [
    MulterModule.register(avatarMulterConfig),
    // Đăng ký config vào DI container của module
    // FileInterceptor sẽ dùng config này khi xử lý upload
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
```

### 6.5.4. Controller nhận file upload

```typescript
@Post('me/avatar')
@UseInterceptors(FileInterceptor('avatar'))
// FileInterceptor('avatar'): lấy file từ field tên "avatar" trong form-data
uploadAvatar(
  @CurrentUser('id') userId: string,
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        // Validate lần 2 ở tầng controller (defense in depth)
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return this.userService.uploadAvatar(userId, file);
}
```

### 6.5.5. Service lưu file và cập nhật DB

```typescript
async uploadAvatar(userId: string, file: Express.Multer.File) {
  // 1. Tìm user, lấy avatar hiện tại
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true },
  });

  // 2. Xóa avatar cũ (nếu có) để tránh tốn disk
  if (user.avatar) {
    const oldPath = join(process.cwd(), 'uploads', 'avatars', user.avatar);
    await fs.unlink(oldPath).catch(() => {}); // Bỏ qua lỗi nếu file không tồn tại
  }

  // 3. Tạo tên file unique bằng timestamp
  const filename = `${Date.now()}-${file.originalname}`;
  const filepath = join(process.cwd(), 'uploads', 'avatars', filename);

  // 4. Lưu file từ buffer ra disk
  await fs.writeFile(filepath, file.buffer);

  // 5. Cập nhật avatar field trong DB
  return this.prisma.user.update({
    where: { id: userId },
    data: { avatar: filename },
    select: this.profileSelect, // Không trả password
  });
}
```

### 6.5.6. Phục vụ file tĩnh (Static File Serving)

Để ảnh có thể truy cập qua URL, khai báo trong `main.ts`:

```typescript
app.useStaticAssets(join(process.cwd(), 'uploads'), {
  prefix: '/uploads/',
});
// URL truy cập: http://localhost:3333/uploads/avatars/1711620000000-avatar.jpg
```

### 6.5.7. Kết quả

Test bằng Swagger UI hoặc Hoppscotch:
- Method: `POST`
- URL: `http://localhost:3333/api/v1/users/me/avatar`
- Headers: `Authorization: Bearer <token>`
- Body: `form-data`, key=`avatar`, value=chọn file ảnh

Response thành công:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-...",
    "email": "vana@example.com",
    "avatar": "1711620000000-my-photo.jpg",
    "displayName": "Van A"
  }
}
```

Truy cập ảnh: `http://localhost:3333/uploads/avatars/1711620000000-my-photo.jpg`

### 6.5.8. Khi nào dùng / không nên dùng Multer

| Nên dùng | Không nên dùng |
|---------|---------------|
| Upload file ≤ 10MB | Upload file lớn (video, dataset) → dùng presigned URL (S3) |
| File lưu local hoặc chuyển sang S3 | File cần xử lý realtime (stream) |
| Prototype và ứng dụng nhỏ-vừa | Production scale lớn → cần CDN |

---

## 6.6. Bổ sung: Áp dụng vào đồ án TodoList Collaboration

Kỹ thuật File Upload với Multer được áp dụng trực tiếp vào `UserModule`, endpoint `POST /users/me/avatar`:

- **Validate:** FileFilter chỉ chấp nhận JPEG/PNG/GIF; giới hạn 5MB
- **Lưu trữ:** `memoryStorage` → ghi ra `uploads/avatars/`
- **Quản lý:** Tự động xóa ảnh cũ khi upload ảnh mới
- **Phục vụ:** Static file server với prefix `/uploads/`

Đây là module nền tảng (từ Phần 2) trở thành tính năng thực tế (Phần 3).
