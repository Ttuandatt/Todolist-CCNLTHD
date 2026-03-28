# CHƯƠNG 9: TRIỂN KHAI CHI TIẾT — NỘI DUNG BỔ SUNG

## 9.4. Cấu trúc thư mục dự án (bổ sung)

Dự án được tổ chức theo mô hình Infrastructure-separated Architecture, phân tách rõ ràng giữa feature modules (chứa nghiệp vụ) và shared infrastructure (chứa các thành phần dùng chung). Cách tổ chức này giúp developer nhanh chóng xác định vị trí code cần sửa đổi và đảm bảo tính nhất quán khi mở rộng hệ thống.

Quyết định tách thư mục `modules/` khỏi `shared/` giúp phân biệt rõ ràng giữa code nghiệp vụ và code hạ tầng. Thư mục `shared/prisma/` được đánh dấu `@Global()` vì PrismaService được sử dụng ở mọi module mà không cần khai báo import lại. Các filters và interceptors trong `shared/common/` được đăng ký global trong `main.ts`, áp dụng cho toàn bộ API.

## 9.5. Hướng dẫn cài đặt và chạy dự án (bổ sung)

Phần này trình bày quy trình cài đặt từng bước, từ clone repository, cài đặt dependencies, cấu hình biến môi trường, khởi động PostgreSQL qua Docker, chạy migration, cho đến khởi động ứng dụng.

## 9.6. Demo vận hành hệ thống (bổ sung)

Demo luồng sử dụng hoàn chỉnh end-to-end qua Swagger UI, bao gồm kiểm chứng Token Blacklist và Validation.

## 9.7. Tổng kết: Mối liên hệ Phần 2 → Phần 3 (bổ sung)

Bảng mapping 31 kỹ thuật đã tích hợp, tỷ lệ tích hợp 100%, và danh sách kỹ thuật chưa tích hợp cùng lý do cụ thể.

Nội dung đầy đủ đã được tích hợp vào file chính: `docs/chapters/09-module-implementation-chapter.md`.
