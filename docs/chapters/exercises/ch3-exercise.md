# Chương 3 — Bài tập ứng dụng: Khởi tạo dự án StudentManager

## 1. Mục tiêu

Bài tập này giúp người đọc vận dụng toàn bộ kiến thức đã học trong Chương 3 — từ việc cài đặt Node.js, NestJS CLI, cho đến khởi tạo và chạy một dự án NestJS thực tế. Sau khi hoàn thành, người đọc sẽ:

- Thành thạo quy trình tạo dự án NestJS mới bằng CLI.
- Hiểu cấu trúc thư mục mặc định của NestJS.
- Biết cách khởi chạy ứng dụng ở chế độ development và kiểm tra hoạt động bằng công cụ API testing.

## 2. Mô tả bài tập

Tạo một dự án NestJS có tên **student-manager** — ứng dụng quản lý thông tin sinh viên. Trong bài tập này, chúng ta chỉ dừng lại ở việc khởi tạo project và tuỳ chỉnh endpoint mặc định. Các chương sau sẽ tiếp tục mở rộng dự án này.

**Yêu cầu cụ thể:**

1. Sử dụng NestJS CLI để tạo dự án mới với tên `student-manager`.
2. Chạy ứng dụng ở chế độ development (`npm run start:dev`).
3. Truy cập `http://localhost:3000` để xác nhận ứng dụng hoạt động.
4. Tuỳ chỉnh `AppService` để thay đổi message mặc định thành `"Welcome to StudentManager API - Hệ thống quản lý sinh viên"`.
5. Sử dụng Hoppscotch để gửi request `GET /` và xác nhận kết quả.

## 3. Code minh họa

**Bước 1: Khởi tạo dự án**

Mở Terminal và chạy lệnh sau để tạo project mới:

```bash
nest new student-manager
```

Khi được hỏi package manager, chọn **npm**. CLI sẽ tự động tạo cấu trúc thư mục chuẩn và cài đặt các dependencies cần thiết.

> (Ảnh chụp: Terminal hiển thị quá trình `nest new student-manager` hoàn tất thành công)

**Bước 2: Khởi chạy ứng dụng**

Di chuyển vào thư mục project và khởi động ứng dụng:

```bash
cd student-manager
npm run start:dev
```

Terminal sẽ hiển thị thông báo `Nest application successfully started` khi ứng dụng sẵn sàng nhận request tại `http://localhost:3000`.

> (Ảnh chụp: Terminal hiển thị ứng dụng khởi động thành công với thông báo "Nest application successfully started")

**Bước 3: Tuỳ chỉnh AppService**

Mở file `src/app.service.ts` và thay đổi nội dung phương thức `getHello()`:

```typescript
// src/app.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to StudentManager API - Hệ thống quản lý sinh viên';
  }
}
```

Nhờ chế độ `start:dev` (watch mode), ứng dụng sẽ tự động restart sau khi lưu file mà không cần khởi động lại thủ công.

**Bước 4: Kiểm tra bằng Hoppscotch**

Truy cập Hoppscotch tại `https://hoppscotch.io`, gửi request:

- **Method:** GET
- **URL:** `http://localhost:3000`
- **Expected Response:** `Welcome to StudentManager API - Hệ thống quản lý sinh viên`

> (Ảnh chụp: Hoppscotch hiển thị response thành công với message mới — status 200 OK)

## 4. Kết quả đạt được

Sau khi hoàn thành bài tập, chúng ta đã:

- Tạo thành công dự án NestJS `student-manager` bằng CLI.
- Khởi chạy ứng dụng ở chế độ development với hot-reload.
- Tuỳ chỉnh endpoint mặc định và xác nhận hoạt động qua Hoppscotch.
- Dự án này sẽ được sử dụng làm nền tảng cho các bài tập ở các chương tiếp theo.

> (Ảnh chụp tổng hợp: Cấu trúc thư mục project student-manager trong IDE)
