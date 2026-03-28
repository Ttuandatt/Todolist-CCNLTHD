# Chương 11: Hướng phát triển trong tương lai

Chương này trình bày các hướng phát triển tiếp theo cho đồ án TodoList Collaboration, bao gồm những tính năng kỹ thuật cần bổ sung, các cải thiện về chất lượng code, và định hướng phát triển cá nhân của từng thành viên trong nhóm.

---

## 11.1. Hướng phát triển cho đồ án

### 11.1.1. Tính năng kỹ thuật cần bổ sung

Trong quá trình phát triển, nhóm đã nhận diện được một số tính năng kỹ thuật quan trọng cần bổ sung để đưa hệ thống lên mức production-ready.

Tính năng đầu tiên và quan trọng nhất là Notification Realtime với WebSocket. Hiện tại hệ thống chưa có cơ chế thông báo, nghĩa là khi một thành viên được giao task mới, họ không biết cho đến khi chủ động truy cập ứng dụng. NestJS cung cấp decorator `@WebSocketGateway()` tích hợp với Socket.io, cho phép xây dựng hệ thống notification realtime mà vẫn phù hợp với kiến trúc module hiện có:

```typescript
@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer() server: Server;

  notifyTaskAssigned(userId: string, task: Task) {
    this.server.to(`user:${userId}`).emit('task:assigned', { task });
  }
}
```

Tính năng thứ hai là OAuth 2.0, cho phép người dùng đăng nhập bằng tài khoản Google hoặc GitHub thay vì phải tạo tài khoản mới. Việc triển khai có thể thực hiện thông qua `@nestjs/passport` kết hợp với strategy `passport-google-oauth20`, tận dụng hạ tầng authentication đã có sẵn.

Thứ ba là Comment Module, cho phép thành viên bình luận trực tiếp trên task. Schema database đã chuẩn bị sẵn field `parentId` trong model Comment để hỗ trợ nested reply thông qua self-relation.

Ngoài ra, nhóm cũng xác định cần tích hợp Redis cho Token Blacklist và Session Cache nhằm giảm số lượng query đến PostgreSQL, chuyển đổi lưu trữ file từ local disk sang Amazon S3 hoặc Cloudinary để phù hợp với môi trường cloud, và triển khai API Rate Limiting bằng `@nestjs/throttler` để ngăn chặn brute-force attack.

### 11.1.2. Cải thiện chất lượng code

Bên cạnh tính năng mới, chất lượng code hiện tại cũng cần được nâng cao trên nhiều phương diện.

Về Testing, hệ thống hiện chưa có unit test hay integration test. Việc bổ sung unit test cho các Services bằng Jest và E2E test cho các luồng nghiệp vụ quan trọng sẽ giúp phát hiện regression sớm và tăng độ tin cậy khi refactor.

Về Error handling, hệ thống đang sử dụng `HttpException` cơ bản. Việc xây dựng hệ thống exception phân cấp với các custom exception cụ thể (như `WorkspaceNotFoundException`, `InsufficientPermissionException`) sẽ giúp error message rõ ràng hơn và dễ debug hơn.

Về Logging, hệ thống đang ghi log qua console. Chuyển sang structured logging với Winston và gửi log lên ELK Stack sẽ hỗ trợ monitoring và troubleshooting trong môi trường production.

Ngoài ra, cần bổ sung API Versioning để hỗ trợ nhiều phiên bản API song song, và tích hợp caching với `@nestjs/cache-manager` kết hợp Redis cho các danh sách thường xuyên được truy vấn như members và projects.

### 11.1.3. Infrastructure và Deployment

Để triển khai hệ thống lên môi trường production, cần containerize toàn bộ stack bằng Docker Compose, bao gồm backend NestJS, PostgreSQL, Redis, và Nginx reverse proxy. Đồng thời, xây dựng CI/CD Pipeline với GitHub Actions để tự động hóa quy trình: mỗi khi code được push lên repository, pipeline sẽ chạy TypeScript build check, thực thi unit tests, build Docker image, và deploy lên VPS hoặc cloud platform. Việc tự động hóa này giảm thiểu sai sót trong quá trình deploy và đảm bảo chất lượng code được kiểm tra liên tục.

---

## 11.2. Định hướng phát triển cá nhân

Sau khi hoàn thành đồ án, mỗi thành viên trong nhóm đã xác định cho mình một định hướng phát triển riêng dựa trên thế mạnh và sở thích cá nhân.

### Nguyễn Hoàng Mai Vy

Sau quá trình làm việc với NestJS ở quy mô monolith, Vy nhận thấy sự cần thiết của việc mở rộng kiến thức sang kiến trúc phân tán. Định hướng tiếp theo là nghiên cứu NestJS Microservices với RabbitMQ, phù hợp với xu hướng distributed systems trong ngành. Bên cạnh đó, Vy cũng quan tâm đến GraphQL với NestJS thông qua package `@nestjs/graphql`, một giải pháp linh hoạt hơn REST cho các ứng dụng có cấu trúc dữ liệu phức tạp. Ngoài ra, việc thực hành Unit Testing với Jest được xác định là kỹ năng quan trọng cần bổ sung để chuẩn bị cho môi trường làm việc chuyên nghiệp.

### Trần Khánh Huyền

Huyền nhận thấy rằng kỹ năng backend cần được bổ sung bằng khả năng deployment và vận hành. Định hướng phát triển tập trung vào DevOps, bao gồm Docker, Kubernetes và CI/CD pipeline. Song song với đó, Huyền cũng muốn đào sâu vào Database optimization, bao gồm chiến lược đánh index, tối ưu hiệu năng truy vấn và quản lý connection pooling — những kỹ năng thiết yếu khi hệ thống scale lên lượng dữ liệu lớn.

### Phan Cảnh Tuấn Đạt

Với nền tảng backend từ đồ án, Đạt định hướng mở rộng sang Fullstack bằng cách kết hợp NestJS backend với React/Next.js frontend, tạo ra một stack TypeScript end-to-end thống nhất từ database đến giao diện người dùng. Ngoài ra, Đạt cũng muốn nghiên cứu sâu hơn về Authentication nâng cao, bao gồm OAuth 2.0, OpenID Connect và kỹ thuật refresh token rotation — những kiến thức cần thiết để xây dựng hệ thống bảo mật đạt chuẩn production.

### Huỳnh Văn Phú

Phú đặc biệt quan tâm đến ứng dụng realtime và đặt mục tiêu nghiên cứu NestJS kết hợp WebSocket để xây dựng các tính năng giao tiếp thời gian thực. Bên cạnh đó, việc tìm hiểu Redis cho caching và session management sẽ bổ sung kiến thức về tối ưu hiệu năng hệ thống. Phú cũng hướng đến việc thực hành xây dựng REST API production-ready với đầy đủ rate limiting, structured logging và monitoring — những yêu cầu không thể thiếu trong các hệ thống thương mại thực tế.

---

## 11.3. Tổng kết chung

Đề tài NestJS đã cho nhóm cơ hội tiếp cận một framework backend hiện đại, được thiết kế theo các nguyên tắc kỹ thuật phần mềm chuẩn mực bao gồm SOLID, Dependency Injection và Module pattern. Qua quá trình xây dựng đồ án TodoList Collaboration, nhóm không chỉ học được NestJS mà còn thực hành nhiều kỹ năng liên quan: TypeScript, Prisma ORM, JWT authentication, Docker, và Git workflow nhóm.

Quan trọng hơn cả, nhóm đã trải nghiệm vòng lặp phát triển phần mềm thực tế: từ thiết kế database schema, implement API, debug lỗi, refactor cấu trúc, đến test endpoint. Mỗi giai đoạn đều mang lại bài học riêng — không chỉ về kỹ thuật mà còn về cách làm việc nhóm, quản lý thời gian và đưa ra quyết định thiết kế. Đây là hành trình học tập có giá trị nhất mà đồ án này mang lại, và là nền tảng vững chắc để mỗi thành viên tiếp tục phát triển trong sự nghiệp công nghệ thông tin.
