# 📘 Quy tắc Soạn Code Guide

## 1. Format tổng quát
- Luôn mở đầu bằng phần "Tổng quan" (bối cảnh, mục tiêu, công nghệ) giống Phase 0/1.
- Mỗi bước chính đặt tiêu đề "## Bước X: ..." và giữ thứ tự công việc thực tế (deps → code → cấu hình → test).
- Trong từng bước phải có đủ ba khối: **Tại sao?**, **Kỹ thuật**, **Code + Giải thích**.
- Hạn chế văn phong hàn lâm; dùng câu ngắn, thân thiện, có ví dụ thực tế.

## 2. Nội dung bắt buộc ở từng bước
- "Tại sao?" giải thích pain point hoặc lý do business (ví dụ: tuân thủ API Spec, tránh lặp code).
- "Kỹ thuật" liệt kê công cụ, pattern, hoặc dependency mới (ValidationPipe, Interceptor, Multer...).
- "Code + Giải thích" phải chỉ rõ đường dẫn file 📁 và cung cấp block code kèm chú giải quan trọng (không giải thích điều hiển nhiên).
- Nếu bước tạo nhiều file con (ví dụ nhiều DTO), chia nhỏ dạng 2a, 2b... như Phase 1.

## 3. Quy định về ví dụ & snippet
- Code snippet cần sát với kiến trúc NestJS hiện tại (PrismaService, JwtGuard, folder structure `src/<module>/...`).
- Khi mô tả DTO hoặc service method, giải thích luôn input/output và các exception chính.
- Với config (env, npm scripts), cung cấp lệnh CLI hoặc đoạn config copy-paste được.

## 4. Phần kết
- Luôn có mục "Test" hướng dẫn cách verify nhanh (Swagger, Hoppscotch, cURL).
- Kèm "Checklist" dạng to-do để reviewer tick khi hoàn tất.
- Nếu có lưu ý quan trọng, thêm mục "Q&A" hoặc "Gotchas" giải đáp trước.

## 5. Ghi chú khác
- Tài liệu viết bằng tiếng Việt, xen kẽ vài thuật ngữ tiếng Anh khi cần thiết (JWT, DTO, Guard...).
- Dùng emoji nhẹ nhàng (🚀, ✅, ⚠️) giống hai guide trước để dễ scan.
- Mọi link tới file code sử dụng đường dẫn tương đối trong repo; hạn chế dẫn nguồn bên ngoài trừ khi thật sự cần.
