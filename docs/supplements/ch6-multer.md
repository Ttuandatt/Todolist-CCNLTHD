<!-- Chèn vào: SAU section 6.3 (Interceptors), TRƯỚC section 6.5 (Lỗi thường gặp) -->

## 6.4. File Upload với Multer

Bên cạnh việc validate dữ liệu JSON và transform response, một nhu cầu phổ biến khác trong ứng dụng web là xử lý file upload. Khi người dùng muốn thay đổi ảnh đại diện, đính kèm tài liệu, hay tải lên bất kỳ file nào, request gửi lên server không còn là JSON thuần túy nữa mà sử dụng encoding hoàn toàn khác — **multipart/form-data**. Đây là định dạng cho phép gửi đồng thời cả dữ liệu text lẫn binary (file) trong cùng một HTTP request. Express.js và NestJS không xử lý được loại request này theo mặc định, do đó cần một middleware chuyên biệt.

### 6.4.1. Multer là gì và tại sao cần Multer?

Để xử lý được loại request `multipart/form-data` này, NestJS dựa vào **Multer** — một middleware Node.js chuyên biệt cho việc parse dữ liệu multipart. Khi client gửi request chứa file, Express chỉ nhận được một chuỗi binary thô mà không biết đâu là file, đâu là metadata, đâu là ranh giới giữa các phần. Multer đảm nhận toàn bộ quá trình phân tích chuỗi binary đó, tách từng file ra, validate, và lưu trữ — giúp controller chỉ cần nhận file đã được xử lý sẵn.

NestJS tích hợp Multer thông qua package `@nestjs/platform-express`, cung cấp `FileInterceptor` và decorator `@UploadedFile()` để làm việc với file upload một cách khai báo (*declarative*), phù hợp với kiến trúc module của framework. Thay vì viết middleware thủ công như trong Express thuần, chúng ta chỉ cần gắn một decorator lên method trong controller — NestJS sẽ tự động gọi Multer ở đúng thời điểm trong request pipeline.

### 6.4.2. Lý thuyết hoạt động

Sau khi biết Multer là gì và vai trò của nó trong NestJS, phần này đi sâu vào cơ chế hoạt động bên trong — từ cấu trúc của request multipart cho đến chiến lược lưu trữ file và luồng xử lý end-to-end.

#### Cấu trúc multipart/form-data

Để hiểu tại sao cần Multer, trước hết cần hiểu `multipart/form-data` khác JSON như thế nào. Với JSON, toàn bộ request body là một chuỗi text có cấu trúc rõ ràng — server chỉ cần `JSON.parse()` là xong. Nhưng khi gửi file, request body trở thành hỗn hợp giữa text và binary, được chia thành nhiều phần (*parts*) ngăn cách bởi một chuỗi đặc biệt gọi là *boundary*. Mỗi part có header riêng mô tả kiểu nội dung, và phần cuối cùng kết thúc bằng boundary kèm dấu `--`.

Dưới đây là cấu trúc thực tế của một request upload avatar:

```
POST /api/v1/users/me/avatar HTTP/1.1
Content-Type: multipart/form-data; boundary=----FormBoundary7MA4YWxk

------FormBoundary7MA4YWxk
Content-Disposition: form-data; name="avatar"; filename="photo.jpg"
Content-Type: image/jpeg

[... binary data của file ảnh — hàng nghìn bytes ...]
------FormBoundary7MA4YWxk--
```

Server nhận được chuỗi bytes thô này và cần: tìm boundary string, tách từng part, đọc header `Content-Disposition` để biết tên field và tên file gốc, đọc `Content-Type` để biết loại file, rồi tách phần binary data ra khỏi header. Quá trình này phức tạp hơn nhiều so với parse JSON, và đó chính là lý do Express không cung cấp middleware mặc định cho multipart — phần việc đó được giao cho Multer.

#### Storage strategy: memoryStorage vs diskStorage

Sau khi Multer parse xong request và tách được file ra, câu hỏi tiếp theo là lưu file ở đâu. Multer cung cấp hai chiến lược lưu trữ:

| Tiêu chí | **memoryStorage** | **diskStorage** |
|----------|-------------------|-----------------|
| **Lưu ở đâu** | RAM — file tồn tại dưới dạng Buffer trong bộ nhớ | Disk — file được ghi trực tiếp vào ổ đĩa |
| **Truy cập file** | Qua `file.buffer` (mảng bytes) | Qua `file.path` và `file.filename` |
| **Ưu điểm** | Cho phép xử lý file trước khi lưu (resize, compress, upload lên cloud) | Không tốn RAM, an toàn với file lớn |
| **Nhược điểm** | Tốn RAM, nguy cơ Out-Of-Memory nếu nhiều user upload đồng thời | File đã nằm trên disk trước khi business logic chạy |
| **Phù hợp cho** | Ứng dụng cần transform file trước khi lưu | Ứng dụng lưu file trực tiếp, không cần xử lý trung gian |

Trong dự án TodoList Collaboration, chúng ta chọn **diskStorage** vì avatar chỉ cần lưu thẳng vào thư mục `uploads/avatars/` mà không cần resize hay compress. Multer tự động ghi file ra disk ngay trong quá trình parse request — khi code trong controller chạy, file đã nằm sẵn trên ổ đĩa rồi.

#### Luồng xử lý trong NestJS

Khi một request upload avatar được gửi đến hệ thống, luồng xử lý đi qua nhiều lớp trước khi business logic thực sự chạy:

```
Client gửi POST multipart/form-data
    │
    ▼
Guard: JwtAuthGuard xác thực user
    │
    ▼
Interceptor: FileInterceptor gọi Multer
    │
    ├── fileFilter: kiểm tra MIME type (jpeg/png/gif)
    ├── limits: kiểm tra kích thước (≤ 5MB)
    └── storage: diskStorage ghi file vào uploads/avatars/
    │
    ▼
Pipe: ParseFilePipe validate thêm lần nữa
    │
    ▼
Controller nhận file đã validate
    │
    ▼
Service: tìm user → xóa avatar cũ → cập nhật DB → trả response
```

*Hình 6.1: Luồng xử lý file upload qua Multer trong NestJS*

Điểm đáng chú ý là file được validate **hai lần**: lần đầu bởi Multer (`fileFilter` kiểm tra MIME type), lần hai bởi `ParseFilePipe` của NestJS (kiểm tra kích thước). Chiến lược *defense in depth* — phòng thủ nhiều lớp — này đảm bảo rằng ngay cả khi một lớp bị bypass hoặc cấu hình thiếu, lớp còn lại vẫn bắt được file không hợp lệ. Đây là nguyên tắc bảo mật quan trọng khi xử lý dữ liệu từ bên ngoài.

### 6.4.3. Cấu hình Multer trong dự án

Nắm được lý thuyết về storage strategy và luồng xử lý, bước tiếp theo là triển khai cấu hình Multer cụ thể cho dự án. File cấu hình này tập trung toàn bộ logic liên quan đến việc lưu trữ và validate file tại một nơi, tách biệt khỏi controller và service. Cách tổ chức này tuân theo nguyên tắc *Separation of Concerns* — nếu sau này cần thay đổi thư mục lưu trữ hoặc thêm định dạng file mới, chỉ cần sửa một file duy nhất:

```typescript
// backend/src/shared/common/config/multer.config.ts
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const avatarDir = join(process.cwd(), 'uploads', 'avatars');

// Tạo thư mục nếu chưa tồn tại (sync vì chạy 1 lần khi app khởi tạo)
if (!existsSync(avatarDir)) {
  mkdirSync(avatarDir, { recursive: true });
}

export const avatarMulterConfig = {
  storage: diskStorage({
    destination: avatarDir,
    filename: (_req, file, callback) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      callback(
        null,
        `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, callback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowed.includes(file.mimetype)) {
      return callback(
        new Error('Only image/jpeg, image/png, image/gif files are allowed!'),
        false,
      );
    }
    callback(null, true);
  },
};
```

Cấu hình trên bao gồm ba thành phần chính. **storage** sử dụng `diskStorage` với hai callback: `destination` chỉ định thư mục lưu file, và `filename` tạo tên file duy nhất bằng cách kết hợp fieldname, timestamp (`Date.now()`) và số ngẫu nhiên — đảm bảo không bao giờ trùng lặp kể cả khi nhiều user upload cùng lúc. **limits** giới hạn kích thước file tối đa 5MB, ngăn chặn việc upload file quá lớn gây tốn tài nguyên server — Multer sẽ reject request ngay khi đọc đủ 5MB mà không cần đợi toàn bộ file. **fileFilter** kiểm tra MIME type — chỉ cho phép ba định dạng ảnh phổ biến, reject mọi loại file khác ngay trước khi lưu vào disk.

Ngoài ra, đoạn code đầu file tự động tạo thư mục `uploads/avatars/` nếu chưa tồn tại. Sử dụng `existsSync` và `mkdirSync` (đồng bộ) ở đây là hợp lý vì đoạn này chỉ chạy **một lần duy nhất** khi ứng dụng khởi tạo, không ảnh hưởng đến hiệu năng xử lý request.

### 6.4.4. Controller nhận file upload

Với cấu hình Multer đã sẵn sàng, bước tiếp theo là kết nối nó vào Controller — nơi endpoint nhận request upload từ client. Tại đây, các decorator của NestJS đóng vai trò cầu nối giữa cấu hình Multer và logic xử lý request:

```typescript
// backend/src/modules/user/user.controller.ts
@Post('me/avatar')
@UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))
uploadAvatar(
  @CurrentUser('id') userId: string,
  @UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({
          maxSize: 1024 * 1024 * 5, // 5MB
        }),
      ],
    }),
  )
  file: Express.Multer.File,
) {
  return this.userService.uploadAvatar(userId, file);
}
```

Đoạn code trên tuy ngắn gọn nhưng chứa nhiều lớp xử lý đan xen. `@UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))` chỉ định rằng endpoint này nhận file từ field có tên `avatar` trong form-data, sử dụng cấu hình đã định nghĩa ở `multer.config.ts`. `FileInterceptor` chính là cầu nối giữa NestJS và Multer — nó gọi Multer để parse request, chạy `fileFilter` và `limits`, rồi lưu file vào disk thông qua `diskStorage`.

`@UploadedFile()` kết hợp `ParseFilePipe` tạo lớp validate thứ hai. Tại đây `MaxFileSizeValidator` kiểm tra lại kích thước file — tưởng như thừa vì `limits` trong Multer đã giới hạn 5MB, nhưng thực tế đây là lớp phòng thủ bổ sung phòng trường hợp cấu hình Multer bị thay đổi mà quên cập nhật. Sau khi qua tất cả kiểm tra, `file` chứa đầy đủ metadata: `filename` (tên file trên disk), `originalname` (tên file gốc từ client), `mimetype`, `size`, và `path` (đường dẫn đầy đủ trên disk).

### 6.4.5. Service lưu file và cập nhật DB

Sau khi Controller nhận và validate file thành công, nó chuyển tiếp sang Service — nơi chứa business logic thực sự. `UserService.uploadAvatar()` xử lý toàn bộ phần còn lại: tìm user, dọn dẹp file cũ, và cập nhật database:

```typescript
// backend/src/modules/user/user.service.ts
async uploadAvatar(userId: string, file: Express.Multer.File) {
  if (!file) {
    throw new BadRequestException('File is required');
  }

  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    select: { avatar: true },
  });
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Xóa avatar cũ nếu có
  if (user.avatar) {
    const oldPath = join(process.cwd(), 'uploads', 'avatars', user.avatar);
    await fs.unlink(oldPath).catch(() => {}); // ← Bỏ qua lỗi nếu file không tồn tại
  }

  // diskStorage đã lưu file vào disk rồi → chỉ cần lấy file.filename
  const updated = await this.prisma.user.update({
    where: { id: userId },
    data: { avatar: file.filename },
    select: this.profileSelect,
  });
  return updated;
}
```

Logic xử lý đi qua bốn bước tuần tự. Bước đầu tiên kiểm tra file tồn tại — mặc dù `ParseFilePipe` đã validate, kiểm tra tại service vẫn cần thiết để method có thể hoạt động độc lập khi được gọi từ nơi khác. Bước thứ hai tìm user trong database và lấy tên avatar hiện tại. Bước thứ ba xóa file avatar cũ trên disk nếu có — `fs.unlink()` kết hợp `.catch(() => {})` bỏ qua lỗi khi file đã bị xóa trước đó hoặc không tồn tại, tránh crash toàn bộ quá trình upload. Nếu không thực hiện bước xóa này, mỗi lần user thay avatar sẽ để lại một file không sử dụng trên disk, dần dần chiếm hết dung lượng. Bước cuối cùng cập nhật tên file mới vào database — chỉ lưu `file.filename` (tên file) thay vì đường dẫn tuyệt đối, nhờ vậy khi di chuyển thư mục `uploads/` sang vị trí khác, chỉ cần thay đổi cấu hình static serving mà không cần cập nhật database.

Một điểm quan trọng cần lưu ý: vì sử dụng `diskStorage`, file đã được Multer ghi vào disk **trước khi** code trong service chạy. Service không cần gọi `fs.writeFile()` — chỉ cần lấy `file.filename` mà Multer đã tạo sẵn. Đây là khác biệt cốt lõi so với `memoryStorage`, nơi file chỉ tồn tại trong RAM dưới dạng `file.buffer` và developer phải tự ghi ra disk.

### 6.4.6. Phục vụ file tĩnh (Static File Serving)

Đến đây, file đã được lưu trên disk và đường dẫn đã được ghi vào database. Tuy nhiên, điều đó chưa đủ — client cần có cách truy cập file qua URL để hiển thị ảnh đại diện trên giao diện. NestJS cung cấp method `useStaticAssets()` cho mục đích này — tương tự `express.static()` trong Express thuần:

```typescript
// backend/src/main.ts
app.useStaticAssets(join(process.cwd(), 'uploads'), {
  prefix: '/uploads/',
});
```

Với cấu hình trên, file avatar lưu tại `backend/uploads/avatars/avatar-123.jpg` sẽ có thể truy cập qua URL `http://localhost:3333/uploads/avatars/avatar-123.jpg`. `process.cwd()` trả về thư mục nơi lệnh `node` được chạy (thường là `backend/`), đảm bảo đường dẫn chính xác bất kể môi trường development hay production.

Prefix `/uploads/` đóng vai trò giới hạn phạm vi truy cập — chỉ các file trong thư mục `uploads/` mới được serve. Nếu đặt prefix là `/`, browser có thể truy cập bất kỳ file nào trong thư mục gốc, gây rủi ro bảo mật nghiêm trọng. Nhờ prefix, chúng ta kiểm soát chính xác những gì được phép truy cập từ bên ngoài.

### 6.4.7. Kết quả

Sau khi hoàn tất cả bốn tầng — cấu hình Multer, Controller validate, Service xử lý business logic, và static file serving — hệ thống upload avatar đã sẵn sàng hoạt động. Khi upload thành công qua endpoint `POST /api/v1/users/me/avatar`, API trả về thông tin profile đã cập nhật, được wrap trong format chuẩn nhờ `TransformResponseInterceptor` đã trình bày ở **mục 6.3**:

```json
{
  "success": true,
  "data": {
    "id": "a1b2c3d4-...",
    "email": "user@example.com",
    "displayName": "Nguyen Van A",
    "avatar": "avatar-1712345678901-123456789.jpg",
    "status": "ACTIVE",
    "bio": null,
    "emailVerified": false,
    "lastLoginAt": "2026-04-07T10:00:00.000Z",
    "createdAt": "2026-03-01T08:00:00.000Z",
    "updatedAt": "2026-04-07T10:30:00.000Z"
  },
  "timestamp": "2026-04-07T10:30:00.123Z"
}
```

Client sử dụng field `avatar` kết hợp base URL để tạo đường dẫn đầy đủ truy cập ảnh: `http://localhost:3333/uploads/avatars/avatar-1712345678901-123456789.jpg`. Chú ý rằng response chỉ chứa tên file chứ không chứa đường dẫn đầy đủ — client tự ghép base URL, giúp hệ thống linh hoạt khi thay đổi domain hoặc CDN.

<!-- Ghi chú: Chèn ảnh chụp màn hình Swagger UI hoặc Hoppscotch thực hiện upload avatar tại đây -->

### 6.4.8. Khi nào dùng và không nên dùng Multer

Dù hỗ trợ upload file hiệu quả như đã minh họa qua tính năng avatar, Multer không phải giải pháp phù hợp cho mọi tình huống upload file. Bảng dưới đây tổng hợp các trường hợp nên và không nên sử dụng Multer:

| Trường hợp | **Nên dùng Multer** | **Không nên dùng Multer** |
|------------|---------------------|---------------------------|
| Kích thước file | File nhỏ-vừa (< 50MB) | File rất lớn (> 100MB) — tốn RAM hoặc disk I/O |
| Lưu trữ | Local disk hoặc chuyển tiếp sang cloud | Cần upload trực tiếp lên S3/GCS — dùng presigned URL |
| Số lượng | Upload 1-10 files mỗi request | Batch upload hàng trăm files |
| Processing | Cần validate hoặc transform file trên server | Client upload thẳng lên cloud, server chỉ nhận URL |
| Infrastructure | Single server | Nhiều server (load balanced) — file local không sync |

Trong dự án TodoList Collaboration, Multer là lựa chọn phù hợp vì chỉ cần upload avatar — file ảnh nhỏ, một file mỗi request, lưu trên local disk. Khi mở rộng lên production với nhiều server, nên chuyển sang giải pháp cloud storage như Amazon S3 kết hợp presigned URL, để client upload trực tiếp lên cloud mà không tốn bandwidth của application server. Hướng phát triển này sẽ được đề cập chi tiết ở **Chương 12**.
