# 📘 Quy tắc Soạn Code Guide

## 1. Format tổng quát
- Luôn mở đầu bằng phần "Tổng quan" (bối cảnh, mục tiêu, công nghệ) giống Phase 0/1.
- Mỗi bước chính đặt tiêu đề "## Bước X: ..." và giữ thứ tự công việc thực tế (deps → code → cấu hình → test).
- Trong từng bước phải có đủ ba khối: **Tại sao?**, **Kỹ thuật**, **Code + Giải thích**.

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

## 6. Văn phong viết guide ⭐

> **Quy tắc quan trọng nhất: Guide phải đọc như đang ngồi pair-programming với bạn, không phải đọc sách giáo khoa.**

### 6.1. Giọng điệu
- **Thân mật, đối thoại trực tiếp**: viết như đang giải thích cho đồng đội ngồi cạnh.
  - ✅ "Như ta đã nói ở Phase 1...", "Giờ thì blurt out đáp án luôn nhé", "Đừng sợ lý thuyết"
  - ❌ "Phần này sẽ trình bày về...", "Người dùng cần thực hiện..."
  
### 6.2. Đại từ
- Dùng **"ta"** hoặc **"chúng ta"** thay vì "bạn nên" — cảm giác đồng hành, cùng nhau code.
  - ✅ "Giờ ta cần tạo một service để..."
  - ❌ "Bạn cần tạo một service để..."

### 6.3. Câu văn
- **Câu ngắn**, rõ ý, **không dùng thuật ngữ mà không giải thích ngay**.
  - ✅ "Interceptor — nôm na là 'bộ chặn' đứng giữa request và response, cắt xen vào để thêm/sửa data."
  - ❌ "Interceptor là một lớp triển khai NestInterceptor interface được sử dụng trong NestJS pipeline."

### 6.4. Dẫn dắt bằng câu hỏi
- Hay dùng **câu hỏi tu từ** để kéo người đọc vào:
  - "Nhưng nếu ta chỉ muốn Owner mới được xóa workspace thì sao? Liệu có cách nào chặn ở tầng Guard không?"
  - "Tại sao không hardcode limit vào service luôn? Vì khi lên production, QA muốn test với limit 5, còn prod cần 50 — biết điều chỉnh ở đâu?"

### 6.5. Chú thích & ví dụ
- Thoải mái dùng **footnote**, ví von, kể cả trích dẫn phim/game nếu giúp minh họa.
  - "Guard giống như security guard ở cửa club — check giấy tờ (JWT) rồi mới cho vào. Còn Interceptor giống camera an ninh — ghi nhận mọi thứ đi qua."
- Ví dụ phải **thực tế**, lấy từ chính codebase TodoList Collaboration — không dùng ví dụ học thuật trừu tượng.

### 6.6. Comment trong code
- Comment giải thích **tại sao** chứ không giải thích **cái gì** (code đã nói cái gì rồi).
  - ✅ `// Không cho assign OWNER trực tiếp — phải qua flow transfer`
  - ❌ `// Gán role cho member`
