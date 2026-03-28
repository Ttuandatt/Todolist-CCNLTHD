# CHƯƠNG 11: HƯỚNG PHÁT TRIỂN TRONG TƯƠNG LAI

## 11.1. Hướng phát triển cho đồ án

### 11.1.1. Tính năng kỹ thuật cần bổ sung

Trong quá trình phát triển, nhóm đã nhận diện được một số tính năng kỹ thuật quan trọng cần bổ sung để đưa hệ thống lên mức production-ready, bao gồm: Notification Realtime với WebSocket, OAuth 2.0 (đăng nhập Google/GitHub), Comment Module, Redis cho Token Blacklist, File Upload lên Cloud (S3), và API Rate Limiting.

### 11.1.2. Cải thiện chất lượng code

Bao gồm: Testing (unit + E2E), Error handling phân cấp, Structured logging với Winston, API Versioning, và Caching với Redis.

### 11.1.3. Infrastructure và Deployment

Containerize toàn bộ stack bằng Docker Compose và xây dựng CI/CD Pipeline với GitHub Actions.

## 11.2. Định hướng phát triển cá nhân

Trình bày định hướng phát triển của từng thành viên: Vy (Microservices, GraphQL, Testing), Huyền (DevOps, Database optimization), Đạt (Fullstack, Auth nâng cao), Phú (WebSocket, Redis, Production-ready API).

## 11.3. Tổng kết chung

Đề tài NestJS đã cho nhóm cơ hội tiếp cận framework backend hiện đại theo các nguyên tắc SOLID, DI và Module pattern. Qua quá trình xây dựng đồ án, nhóm đã trải nghiệm vòng lặp phát triển phần mềm thực tế từ thiết kế đến triển khai.

Nội dung đầy đủ đã được tích hợp vào file chính: `docs/chapters/11-future-development-chapter.md`.
