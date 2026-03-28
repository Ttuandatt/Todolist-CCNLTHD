# BỔ SUNG VÀO CHƯƠNG 6 — KỸ THUẬT FILE UPLOAD VỚI MULTER

## 6.8. File Upload với Multer (bổ sung)

Bên cạnh việc validate dữ liệu JSON và transform response, một nhu cầu phổ biến khác trong ứng dụng web là xử lý file upload. HTTP `multipart/form-data` là định dạng gửi file lên server, khác hoàn toàn với JSON thông thường — request body lúc này không phải text mà là binary data xen lẫn metadata. Express.js và NestJS không xử lý được loại request này theo mặc định, do đó cần một middleware chuyên biệt.

### 6.8.1. Multer là gì và tại sao cần Multer?

Multer là middleware Node.js chuyên xử lý `multipart/form-data`. NestJS tích hợp Multer thông qua package `@nestjs/platform-express`, cung cấp `FileInterceptor` và `MulterModule` để làm việc với file upload một cách khai báo (declarative), phù hợp với kiến trúc module của framework.

Quy trình hoạt động của Multer trong NestJS diễn ra như sau: khi client gửi request chứa file, Multer middleware tiếp nhận và parse multipart request, sau đó validate file về loại (MIME type) và kích thước, lưu file vào bộ nhớ hoặc disk, và cuối cùng gắn thông tin file vào `req.file` để Controller có thể truy cập thông qua decorator `@UploadedFile()`.

### 6.8.2. Cấu hình Multer trong dự án

Trong đồ án TodoList Collaboration, Multer được cấu hình tại file `shared/common/config/multer.config.ts` với ba thiết lập chính. Đầu tiên, `memoryStorage()` được chọn làm phương thức lưu trữ — file sẽ được giữ trong RAM dưới dạng buffer thay vì ghi trực tiếp ra disk, cho phép xử lý file trước khi lưu vĩnh viễn. Thứ hai, giới hạn kích thước file được đặt ở mức 5MB. Cuối cùng, `fileFilter` chỉ cho phép các định dạng ảnh JPEG, PNG và GIF:

```typescript
import { memoryStorage } from 'multer';

export const avatarMulterConfig = {
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Only JPEG, PNG, GIF are allowed'), false);
    }
  },
};
```

Cấu hình này được đăng ký vào `UserModule` thông qua `MulterModule.register(avatarMulterConfig)`, cho phép `FileInterceptor` sử dụng các thiết lập đã định nghĩa khi xử lý upload.

### 6.8.3. Controller nhận file upload

Tại tầng Controller, endpoint upload avatar sử dụng `FileInterceptor('avatar')` để lấy file từ field tên "avatar" trong form-data. Decorator `@UploadedFile()` kết hợp với `ParseFilePipe` thực hiện validate lần hai ở tầng controller, tạo lớp bảo vệ kép (defense in depth):

```typescript
@Post('me/avatar')
@UseInterceptors(FileInterceptor('avatar'))
uploadAvatar(
  @CurrentUser('id') userId: string,
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return this.userService.uploadAvatar(userId, file);
}
```

### 6.8.4. Service lưu file và cập nhật database

Tại tầng Service, quá trình lưu file diễn ra qua năm bước tuần tự: tìm user và lấy avatar hiện tại, xóa avatar cũ nếu có, tạo tên file unique bằng timestamp, ghi file từ buffer ra disk, và cập nhật field avatar trong database:

```typescript
async uploadAvatar(userId: string, file: Express.Multer.File) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true },
  });

  if (user.avatar) {
    const oldPath = join(process.cwd(), 'uploads', 'avatars', user.avatar);
    await fs.unlink(oldPath).catch(() => {});
  }

  const filename = `${Date.now()}-${file.originalname}`;
  const filepath = join(process.cwd(), 'uploads', 'avatars', filename);
  await fs.writeFile(filepath, file.buffer);

  return this.prisma.user.update({
    where: { id: userId },
    data: { avatar: filename },
    select: this.profileSelect,
  });
}
```

### 6.8.5. Phục vụ file tĩnh (Static File Serving)

Để ảnh avatar có thể truy cập qua URL, cần khai báo static file serving trong `main.ts`:

```typescript
app.useStaticAssets(join(process.cwd(), 'uploads'), {
  prefix: '/uploads/',
});
```

### 6.8.6. Khi nào dùng và không nên dùng Multer

Multer phù hợp với các ứng dụng cần upload file có kích thước nhỏ đến trung bình (dưới 10MB), lưu trữ local hoặc chuyển tiếp sang cloud. Đối với file lớn như video hoặc dataset, nên sử dụng presigned URL với Amazon S3. Khi triển khai production ở quy mô lớn, việc kết hợp với CDN sẽ hiệu quả hơn.
