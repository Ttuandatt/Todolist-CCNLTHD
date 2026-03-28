# CHƯƠNG 11: HƯỚNG PHÁT TRIỂN TRONG TƯƠNG LAI

> **Hướng dẫn dán vào báo cáo:** Thay toàn bộ nội dung Chương 11 (hiện đang trống) bằng nội dung dưới đây.

---

## 11.1. Hướng phát triển cho đồ án

### 11.1.1. Tính năng kỹ thuật cần bổ sung

**1. Notification Realtime với WebSocket (Gateway)**

Hiện tại hệ thống chưa có notification. Hướng triển khai với NestJS:

```typescript
// notifications.gateway.ts
@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer() server: Server;

  // Gửi notification khi có task được giao
  notifyTaskAssigned(userId: string, task: Task) {
    this.server.to(`user:${userId}`).emit('task:assigned', { task });
  }
}
```

NestJS cung cấp `@WebSocketGateway()` decorator tích hợp với Socket.io — phù hợp với kiến trúc module hiện có.

**2. OAuth 2.0 — Đăng nhập bằng Google/GitHub**

```typescript
// Dùng @nestjs/passport với passport-google-oauth20
@Get('google')
@UseGuards(AuthGuard('google'))
@Public()
googleLogin() {} // Redirect đến Google

@Get('google/callback')
@UseGuards(AuthGuard('google'))
@Public()
googleCallback(@CurrentUser() user) {
  return this.authService.generateTokens(user.id, user.email);
}
```

**3. Comment Module**

Module bình luận trên task, hỗ trợ nested reply (self-relation trong schema đã chuẩn bị sẵn `Comment.parentId`).

**4. Redis cho Token Blacklist và Session Cache**

Thay PostgreSQL bằng Redis cho `InvalidatedToken` — giảm DB query mỗi request authenticated từ 2 xuống 1.

**5. File Upload lên Cloud (Amazon S3 / Cloudinary)**

Thay vì lưu avatar trên local disk (không phù hợp với môi trường cloud), tích hợp với S3:
```typescript
// Trả về presigned URL để client upload trực tiếp
// Không tốn bandwidth của server
```

**6. API Rate Limiting**

Ngăn brute-force attack bằng `@nestjs/throttler`:
```typescript
@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60000, limit: 10 }])],
  // Tối đa 10 request/phút cho mỗi IP
})
```

### 11.1.2. Cải thiện chất lượng code

| Hạng mục | Hiện tại | Cải thiện |
|----------|---------|---------|
| Testing | Chưa có | Unit test cho Services, E2E test cho critical flows |
| Error handling | HttpException cơ bản | Custom exception hierarchy (WorkspaceNotFoundException...) |
| Logging | Console log | Structured logging với Winston, gửi lên ELK Stack |
| API Versioning | v1 cố định | `@nestjs/common` API Versioning — hỗ trợ v1 và v2 song song |
| Caching | Không có | `@nestjs/cache-manager` với Redis cho danh sách members, projects |

### 11.1.3. Infrastructure và Deployment

**Containerize toàn bộ stack:**
```yaml
# docker-compose.prod.yml
services:
  backend:
    build: ./backend
    environment:
      - NODE_ENV=production
  postgres:
    image: postgres:16-alpine
  redis:
    image: redis:7-alpine
  nginx:
    image: nginx:alpine
    # Reverse proxy cho backend
```

**CI/CD Pipeline** với GitHub Actions:
1. Push code → trigger pipeline
2. Run TypeScript build check
3. Run unit tests
4. Build Docker image
5. Deploy lên VPS/Cloud

---

## 11.2. Định hướng phát triển cá nhân

### Nguyễn Hoàng Mai Vy

Sau khi hoàn thành báo cáo này, định hướng tiếp tục:
- Deepdive vào **NestJS Microservices** với RabbitMQ — phù hợp với xu hướng kiến trúc distributed systems
- Nghiên cứu **GraphQL với NestJS** (`@nestjs/graphql`) — linh hoạt hơn REST cho các ứng dụng có data phức tạp
- Thực hành **Unit Testing** với Jest — kỹ năng quan trọng trong môi trường làm việc chuyên nghiệp

### Trần Khánh Huyền

- Tập trung vào **DevOps** — Docker, Kubernetes, CI/CD để bổ sung kỹ năng deployment cho Backend developer
- Nghiên cứu **Database optimization** — indexing strategy, query performance, connection pooling

### Phan Cảnh Tuấn Đạt

- Mở rộng sang **Fullstack** — kết hợp NestJS backend với React/Next.js frontend (TypeScript end-to-end)
- Học **Authentication nâng cao** — OAuth 2.0, OpenID Connect, refresh token rotation

### Huỳnh Văn Phú

- Nghiên cứu **NestJS + WebSocket** để xây dựng ứng dụng realtime
- Tìm hiểu **Redis** cho caching và session management
- Thực hành xây dựng REST API production-ready với rate limiting, logging, monitoring

---

## 11.3. Tổng kết chung

Đề tài NestJS đã cho nhóm cơ hội tiếp cận một framework backend hiện đại, được thiết kế theo các nguyên tắc kỹ thuật phần mềm chuẩn mực (SOLID, DI, Module pattern). Qua quá trình xây dựng đồ án TodoList Collaboration, nhóm không chỉ học được NestJS mà còn thực hành nhiều kỹ năng liên quan: TypeScript, Prisma ORM, JWT authentication, Docker, Git workflow nhóm.

Quan trọng hơn, nhóm đã trải nghiệm **vòng lặp phát triển phần mềm thực tế**: từ thiết kế database schema → implement API → debug lỗi → refactor cấu trúc → test endpoint. Đây là hành trình học tập có giá trị nhất mà báo cáo này mang lại.
