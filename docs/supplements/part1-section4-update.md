<!-- Cập nhật: THAY THẾ mục "4. Cấu trúc báo cáo" trong Phần 1 -->

## 4. Cấu trúc báo cáo

Báo cáo được tổ chức thành năm phần chính, mỗi phần đảm nhận một vai trò riêng biệt trong việc trình bày đề tài từ lý thuyết đến thực hành.

**Phần 1: Giới thiệu** (Chương 1–2) cung cấp bối cảnh tổng quan về NestJS — từ lịch sử ra đời, triết lý thiết kế, hệ sinh thái, đến lý do nhóm chọn framework này. Chương 2 giới thiệu đề tài ứng dụng TodoList Collaboration, xác định mục tiêu, phạm vi, và phương pháp thực hiện.

**Phần 2: Nền tảng lý thuyết** (Chương 3–7) trình bày kiến thức kỹ thuật cốt lõi theo trình tự từ cơ bản đến nâng cao. Chương 3 hướng dẫn cài đặt môi trường. Chương 4 phân tích kiến trúc NestJS (Modules, Controllers, Services, Dependency Injection). Chương 5 đi sâu vào tầng dữ liệu với Prisma ORM và PostgreSQL. Chương 6 trình bày các kỹ thuật nâng cao gồm Pipes, Interceptors, và File Upload với Multer. Chương 7 triển khai JWT Authentication, Refresh Token, và Token Blacklist. Mỗi chương đều có phần **"Lỗi thường gặp và Trade-offs"** — phân tích các cạm bẫy thực tế và quyết định thiết kế mà nhóm đã đối mặt, giúp người đọc tránh lặp lại sai lầm phổ biến.

**Phần 3: Thực hành và kiểm thử** (Chương 8) trình bày Unit Testing với Jest — cách viết test cho Services và Controllers, kỹ thuật mock dependencies, và phân tích kết quả 41 test cases. Chương này kết nối lý thuyết ở Phần 2 với thực hành kiểm thử, đảm bảo code không chỉ hoạt động đúng mà còn có thể kiểm chứng.

**Phần 4: Sản phẩm đồ án** (Chương 9–10) tổng hợp toàn bộ kết quả thực tế. Chương 9 trình bày thiết kế hệ thống chi tiết, bao gồm sơ đồ ERD, database schema 17 models, và kiến trúc module. Chương 10 trình bày sản phẩm tổng hợp với bảng mapping 36 kỹ thuật NestJS vào từng module, demo các luồng nghiệp vụ chính, và kết quả unit test — cung cấp cái nhìn toàn diện về những gì đồ án đã xây dựng.

**Phần 5: Đánh giá và kết luận** (Chương 11–12) nhìn lại toàn bộ quá trình. Chương 11 đối chiếu kết quả với 8 mục tiêu ban đầu, phân tích chi tiết ba bug reports điển hình (JwtStrategy crash, import path sau refactor, avatar path sai), và đánh giá NestJS qua sáu khía cạnh sau khi thực hành. Chương 12 đề xuất hướng phát triển kỹ thuật cho đồ án (WebSocket, OAuth, Redis), cải thiện chất lượng code, infrastructure CI/CD, và định hướng phát triển cá nhân của từng thành viên.
