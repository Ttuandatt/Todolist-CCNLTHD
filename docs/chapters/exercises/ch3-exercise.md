# Chương 3 — Bài tập ứng dụng: Khởi tạo dự án TodoList Collaboration

## 1. Mục tiêu

Vận dụng toàn bộ kiến thức đã học trong Chương 3 để khởi tạo dự án TodoList Collaboration — ứng dụng quản lý công việc cộng tác sẽ được xây dựng xuyên suốt đồ án. Sau khi hoàn thành, người đọc sẽ:

- Thành thạo quy trình tạo dự án NestJS mới bằng CLI.
- Biết cách cài đặt và khởi chạy PostgreSQL bằng Docker.
- Hiểu cấu trúc thư mục và vai trò của từng file trong dự án NestJS.
- Kiểm tra hoạt động ứng dụng bằng trình duyệt và công cụ API testing.

## 2. Mô tả bài tập

Tạo dự án NestJS **todolist-collaboration**, cấu hình PostgreSQL thông qua Docker, và xác nhận ứng dụng hoạt động đúng. Đây là bước nền tảng — các chương sau sẽ tiếp tục mở rộng dự án này.

**Yêu cầu cụ thể:**

1. Sử dụng NestJS CLI để tạo dự án mới với tên `todolist-collaboration`.
2. Tạo file `docker-compose.yml` để khởi chạy PostgreSQL.
3. Chạy ứng dụng ở chế độ development và xác nhận hoạt động.
4. Sử dụng Hoppscotch để gửi request kiểm tra.

## 3. Code minh họa

**Bước 1: Khởi tạo dự án**

```bash
nest new todolist-collaboration
```

Khi được hỏi package manager, chọn **npm**. CLI sẽ tự động tạo cấu trúc thư mục chuẩn và cài đặt dependencies.

> (Ảnh chụp: Terminal hiển thị quá trình `nest new todolist-collaboration` hoàn tất thành công)

**Bước 2: Cấu hình PostgreSQL với Docker**

Tạo file `docker-compose.yml` tại thư mục gốc của dự án:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secretpassword
      POSTGRES_DB: todolist_collaboration
    ports:
      - '5435:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Khởi chạy database:

```bash
docker-compose up -d
```

> (Ảnh chụp: Terminal hiển thị Docker khởi chạy PostgreSQL thành công)
> (Ảnh chụp: Docker Desktop hiển thị container postgres đang chạy — trạng thái "Running")

**Bước 3: Khởi chạy ứng dụng**

```bash
cd todolist-collaboration
npm run start:dev
```

Terminal sẽ hiển thị thông báo `Nest application successfully started` khi ứng dụng sẵn sàng nhận request tại `http://localhost:3000`.

> (Ảnh chụp: Terminal hiển thị ứng dụng khởi động thành công)

**Bước 4: Kiểm tra bằng Hoppscotch**

Truy cập Hoppscotch tại `https://hoppscotch.io`, gửi request:

- **Method:** GET
- **URL:** `http://localhost:3000`
- **Expected Response:** `Hello World!`

> (Ảnh chụp: Hoppscotch hiển thị response thành công — status 200 OK, body "Hello World!")

## 4. Kết quả đạt được

Sau khi hoàn thành bài tập:

- Tạo thành công dự án NestJS `todolist-collaboration` bằng CLI.
- Khởi chạy PostgreSQL trên Docker, sẵn sàng kết nối ở cổng 5435 (host) → 5432 (container).
- Ứng dụng NestJS hoạt động ở chế độ development với hot-reload.
- Xác nhận endpoint mặc định phản hồi đúng qua Hoppscotch.

Dự án này sẽ được sử dụng làm nền tảng cho các bài tập ở các chương tiếp theo — bắt đầu từ việc xây dựng các Module, Controller, và Service trong Chương 4.
