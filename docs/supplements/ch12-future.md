<!-- THAY TOÀN BỘ Chương 12: Hướng phát triển -->

# Chương 12: Hướng phát triển

> **Mục tiêu chương học:** Sau khi hoàn thành chương này, người đọc sẽ nhận diện được các hướng mở rộng kỹ thuật cho dự án, hiểu cách cải thiện chất lượng code và infrastructure, và nắm được định hướng phát triển cá nhân của từng thành viên.

Chương này trình bày các hướng phát triển tiếp theo cho đồ án TodoList Collaboration, bao gồm những tính năng kỹ thuật cần bổ sung, các cải thiện về chất lượng code và infrastructure, và định hướng phát triển cá nhân của từng thành viên trong nhóm.

---

## 12.1. Hướng phát triển cho đồ án

### 12.1.1. Tính năng kỹ thuật cần bổ sung

Trong quá trình phát triển, nhóm đã nhận diện được sáu tính năng kỹ thuật quan trọng cần bổ sung để đưa hệ thống từ mức đồ án lên mức production-ready.

Tính năng đầu tiên và quan trọng nhất là **WebSocket Gateway** cho notification realtime. Hiện tại dự án đã có `EventsModule` với `EventsGateway` cơ bản, nhưng chưa triển khai đầy đủ hệ thống notification cho end-user. NestJS cung cấp decorator `@WebSocketGateway()` tích hợp với Socket.IO, cho phép mở rộng tự nhiên:

```typescript
// Gợi ý: Mở rộng EventsGateway hiện có
@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer() server: Server;

  // Thông báo realtime khi user được assign task
  notifyUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
```

Tính năng thứ hai là **OAuth 2.0** cho phép đăng nhập bằng Google hoặc GitHub. Việc triển khai tận dụng hạ tầng Passport đã có sẵn trong `AuthModule`, chỉ cần thêm strategy mới:

```typescript
// Gợi ý: Thêm Google OAuth strategy
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.get('GOOGLE_CLIENT_ID'),
      clientSecret: config.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: '/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }
}
```

Thứ ba là **mở rộng Comment Module**. Schema database đã chuẩn bị sẵn field `parentId` trong model `Comment` để hỗ trợ nested reply thông qua self-relation `CommentReplies`. Module hiện tại đã có CRUD cơ bản, cần bổ sung tính năng mention (@user) và notification khi có reply.

Thứ tư là tích hợp **Redis cho Token Blacklist**. Hiện tại Token Blacklist sử dụng PostgreSQL (bảng `invalidated_tokens`), mỗi request tốn 1-3ms để kiểm tra. Redis lưu dữ liệu trong RAM với thời gian truy vấn dưới 0.1ms và hỗ trợ TTL tự động xóa record hết hạn:

```typescript
// Gợi ý: Redis blacklist check
async isTokenBlacklisted(token: string): Promise<boolean> {
  return !!(await this.redis.get(`blacklist:${token}`));
}
```

Thứ năm là chuyển **file storage sang Amazon S3** thay vì local disk. Multer hiện tại lưu avatar vào `uploads/avatars/`, giải pháp này không phù hợp khi deploy nhiều server vì file không sync giữa các instances. S3 cung cấp storage tập trung, redundant, và scalable.

Cuối cùng là **Rate Limiting** bằng `@nestjs/throttler` để ngăn chặn brute-force attack, đặc biệt quan trọng cho các endpoint authentication:

```typescript
// Gợi ý: Giới hạn 5 request/phút cho login
@Throttle({ default: { limit: 5, ttl: 60000 } })
@Post('login')
login(@Body() dto: LoginDto) { /* ... */ }
```

### 12.1.2. Cải thiện chất lượng code

Bên cạnh tính năng mới, chất lượng code hiện tại cần được nâng cao trên nhiều phương diện. Bảng dưới đây tóm tắt năm hạng mục cần cải thiện:

| Hạng mục | Hiện trạng | Mục tiêu |
|----------|-----------|----------|
| **Testing** | Unit test cơ bản cho Auth + User (41 tests) | E2E test cho luồng nghiệp vụ quan trọng, coverage > 80% |
| **Error handling** | `HttpException` cơ bản | Custom exceptions phân cấp (`WorkspaceNotFoundException`, `InsufficientPermissionException`) |
| **Logging** | Console log qua `LoggingInterceptor` | Structured logging với Winston, gửi lên ELK Stack |
| **API Versioning** | Prefix `/api/v1` hardcode | NestJS URI Versioning cho nhiều phiên bản song song |
| **Caching** | Không có | `@nestjs/cache-manager` + Redis cho danh sách members, projects |

Về Testing, dự án đã có 41 unit tests cho Auth và User modules (như trình bày ở **Chương 8**). Bước tiếp theo là bổ sung E2E test chạy trên database thật để kiểm tra luồng hoàn chỉnh: register → login → tạo workspace → tạo project → tạo task → assign member. E2E test giúp phát hiện các lỗi mà unit test với mock không thể bắt được, như đã phân tích ở **Chương 5** về vấn đề mock vs database thật.

### 12.1.3. Infrastructure và Deployment

Để triển khai hệ thống lên môi trường production, cần containerize toàn bộ stack bằng Docker Compose. Cấu hình production bao gồm bốn services: NestJS backend, PostgreSQL database, Redis cache, và Nginx reverse proxy. Docker Compose đảm bảo mọi thành phần được khởi động đúng thứ tự với cấu hình nhất quán.

Song song với containerization, cần xây dựng CI/CD Pipeline với GitHub Actions để tự động hóa quy trình phát triển. Pipeline gồm năm bước:

1. **Lint & Type Check** — chạy ESLint và TypeScript compiler để phát hiện lỗi cú pháp và type.
2. **Unit Tests** — chạy Jest với coverage report, fail nếu coverage dưới ngưỡng.
3. **Build** — compile TypeScript thành JavaScript, đảm bảo production build thành công.
4. **Docker Build** — tạo Docker image, push lên container registry.
5. **Deploy** — deploy image mới lên VPS hoặc cloud platform (AWS ECS, Google Cloud Run, hoặc Railway).

Việc tự động hóa này giảm thiểu sai sót trong quá trình deploy và đảm bảo chất lượng code được kiểm tra liên tục — mỗi pull request đều phải pass toàn bộ pipeline trước khi merge.

---

## 12.2. Định hướng phát triển cá nhân

Sau khi hoàn thành đồ án, mỗi thành viên trong nhóm đã xác định cho mình một định hướng phát triển riêng dựa trên thế mạnh và sở thích cá nhân.

### Nguyễn Hoàng Mai Vy

Sau quá trình làm việc với NestJS ở quy mô monolith, Vy nhận thấy sự cần thiết của việc mở rộng kiến thức sang kiến trúc phân tán. Định hướng tiếp theo là nghiên cứu **NestJS Microservices** với RabbitMQ — tách monolith hiện tại thành các services độc lập (Auth Service, Task Service, Notification Service) giao tiếp qua message queue. Bên cạnh đó, Vy cũng quan tâm đến **GraphQL** với NestJS thông qua package `@nestjs/graphql`, một giải pháp linh hoạt hơn REST cho các ứng dụng có cấu trúc dữ liệu phức tạp như TodoList với nhiều nested relations. Ngoài ra, việc thực hành **Unit Testing** với Jest được xác định là kỹ năng quan trọng cần bổ sung để chuẩn bị cho môi trường làm việc chuyên nghiệp.

### Trần Khánh Huyền

Huyền nhận thấy rằng kỹ năng backend cần được bổ sung bằng khả năng deployment và vận hành. Định hướng phát triển tập trung vào **DevOps**, bao gồm Docker multi-stage build, Kubernetes orchestration, và CI/CD pipeline với GitHub Actions — những kỹ năng thiết yếu để đưa ứng dụng NestJS từ môi trường development lên production. Song song với đó, Huyền cũng muốn đào sâu vào **Database optimization**, bao gồm chiến lược đánh index cho Prisma, tối ưu hiệu năng truy vấn với `EXPLAIN ANALYZE`, và quản lý connection pooling khi hệ thống scale lên lượng dữ liệu lớn.

### Phan Cảnh Tuấn Đạt

Với nền tảng backend vững chắc từ đồ án, Đạt định hướng mở rộng sang **Fullstack** bằng cách kết hợp NestJS backend với Next.js frontend, tạo ra một stack TypeScript end-to-end thống nhất từ database (Prisma) đến giao diện người dùng (React). TypeScript xuyên suốt cả hai tầng cho phép chia sẻ types giữa backend và frontend, giảm thiểu lỗi tại điểm tích hợp. Ngoài ra, Đạt cũng muốn nghiên cứu sâu hơn về **Authentication nâng cao**, bao gồm OAuth 2.0, OpenID Connect (OIDC), và kỹ thuật refresh token rotation — mở rộng từ hệ thống JWT đã xây dựng trong đồ án.

### Huỳnh Văn Phú

Phú đặc biệt quan tâm đến ứng dụng realtime và đặt mục tiêu nghiên cứu **NestJS kết hợp WebSocket** để xây dựng các tính năng giao tiếp thời gian thực — mở rộng từ `EventsGateway` đã có trong dự án thành hệ thống notification và collaboration hoàn chỉnh. Bên cạnh đó, việc tìm hiểu **Redis** cho caching, session management, và pub/sub sẽ bổ sung kiến thức về tối ưu hiệu năng hệ thống. Phú cũng hướng đến việc thực hành xây dựng **REST API production-ready** với đầy đủ rate limiting (`@nestjs/throttler`), structured logging (Winston), và monitoring (Prometheus + Grafana) — những yêu cầu không thể thiếu trong các hệ thống thương mại thực tế.

---

## 12.3. Tổng kết chung

Đề tài NestJS đã cho nhóm cơ hội tiếp cận một framework backend hiện đại, được thiết kế theo các nguyên tắc kỹ thuật phần mềm chuẩn mực bao gồm SOLID, Dependency Injection, và Module pattern. Qua quá trình xây dựng đồ án TodoList Collaboration — từ thiết kế 17 models database, implement 44 API endpoints, triển khai JWT authentication với Token Blacklist, đến viết 41 unit tests — nhóm không chỉ học được NestJS mà còn thực hành toàn diện các kỹ năng liên quan: TypeScript, Prisma ORM, Docker, Git workflow nhóm, và tư duy thiết kế hệ thống. Quan trọng hơn cả, nhóm đã trải nghiệm vòng lặp phát triển phần mềm thực tế — từ bug debugging đến refactoring, từ trade-off analysis đến code review — mỗi giai đoạn đều mang lại bài học riêng không thể tìm thấy trong sách vở. Đây là hành trình học tập có giá trị nhất mà đồ án này mang lại, và là nền tảng vững chắc để mỗi thành viên tiếp tục phát triển trong sự nghiệp công nghệ thông tin.
