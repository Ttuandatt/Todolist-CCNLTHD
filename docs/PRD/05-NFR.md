# YÊU CẦU PHI CHỨC NĂNG (NFR)
## DỰ ÁN: TODOLIST COLLABORATION

> **Phiên bản:** 1.0  
> **Ngày tạo:** 05/02/2026  
> **Tiêu chuẩn tham chiếu:** ISO 25010 (Quality Attributes)

---

## 1. YÊU CẦU HIỆU NĂNG (Performance)

### NFR-1.1: Thời gian phản hồi API

| Loại request | Thời gian tối đa | Ghi chú |
|--------------|------------------|---------|
| Read operations (GET) | ≤ 200ms | Lấy danh sách task, project |
| Write operations (POST/PUT/PATCH) | ≤ 500ms | Tạo/sửa task, comment |
| Delete operations | ≤ 300ms | Xóa task, project |
| File upload (≤10MB) | ≤ 5s | Upload attachment |
| Search/Filter | ≤ 500ms | Full-text search |

### NFR-1.2: Khả năng chịu tải

| Metric | Giá trị | Mô tả |
|--------|---------|-------|
| Concurrent users | 100 | Số user đồng thời tối đa |
| Requests per second | 500 RPS | Tổng requests/giây |
| WebSocket connections | 100 | Kết nối real-time đồng thời |
| Database connections | 20 | Connection pool size |

### NFR-1.3: Tối ưu hóa

- Pagination: Mặc định 20 items/page, tối đa 100 items/page
- Lazy loading cho attachments và comments
- Caching với Redis cho dữ liệu ít thay đổi (user profile, workspace info)
- Database indexing cho các trường query thường xuyên

---

## 2. YÊU CẦU BẢO MẬT (Security)

### NFR-2.1: Authentication

| Yêu cầu | Chi tiết |
|---------|----------|
| JWT Access Token | Thời hạn 15 phút |
| JWT Refresh Token | Thời hạn 7 ngày |
| Password hashing | bcrypt với salt rounds = 10 |
| Password policy | Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số |
| Rate limiting login | 5 lần thất bại → khóa 15 phút |

### NFR-2.2: Authorization (RBAC)

| Role | Workspace Actions | Project Actions | Task Actions |
|------|-------------------|-----------------|--------------|
| **Owner** | Full control | Full control | Full control |
| **Admin** | Manage members, settings | CRUD | Full control |
| **Member** | View only | Create, view, edit own | CRUD |

### NFR-2.3: Data Protection

- HTTPS/TLS 1.3 cho tất cả communications
- Input validation và sanitization
- SQL Injection prevention (Prisma ORM parameterized queries)
- XSS prevention (output encoding)
- CORS configuration cho allowed origins
- Helmet.js cho HTTP security headers

### NFR-2.4: Audit & Logging

- Activity log cho tất cả write operations
- Log retention: 90 ngày
- Sensitive data không được log (passwords, tokens)

---

## 3. YÊU CẦU KHẢ DỤNG (Availability)

### NFR-3.1: Uptime

| Metric | Target |
|--------|--------|
| Availability | 99% uptime (cho production) |
| Planned downtime | ≤ 4 giờ/tháng (maintenance window) |
| Recovery Time Objective (RTO) | ≤ 1 giờ |
| Recovery Point Objective (RPO) | ≤ 24 giờ |

### NFR-3.2: Error Handling

- Graceful degradation khi service lỗi
- Retry mechanism với exponential backoff
- Circuit breaker pattern cho external calls
- User-friendly error messages (không expose stack trace)

---

## 4. YÊU CẦU KHẢ NĂNG MỞ RỘNG (Scalability)

### NFR-4.1: Database Scalability

| Metric | Current | Future Growth |
|--------|---------|---------------|
| Users | 100 | 10,000 |
| Workspaces | 50 | 1,000 |
| Tasks | 5,000 | 500,000 |
| Comments | 10,000 | 1,000,000 |
| Attachments (storage) | 10GB | 1TB |

### NFR-4.2: Architecture Scalability

- Stateless API servers (horizontal scaling)
- Redis cho session/cache (shared state)
- Database connection pooling
- File storage abstraction (local → S3)
- Microservices-ready modular design

---

## 5. YÊU CẦU KHẢ NĂNG BẢO TRÌ (Maintainability)

### NFR-5.1: Code Quality

| Metric | Standard |
|--------|----------|
| Test coverage | ≥ 80% |
| Code documentation | JSDoc cho public APIs |
| Linting | ESLint + Prettier |
| TypeScript strict mode | Enabled |

### NFR-5.2: Documentation

- API documentation (Swagger/OpenAPI 3.0)
- README với setup instructions
- Architecture Decision Records (ADRs)
- Deployment guide

### NFR-5.3: Modularity

- NestJS module structure
- Dependency Injection
- Separation of concerns (Controller → Service → Repository)
- Clean Architecture principles

---

## 6. YÊU CẦU KHẢ DỤNG (Usability)

### NFR-6.1: UI/UX

| Yêu cầu | Chi tiết |
|---------|----------|
| Responsive design | Desktop, Tablet, Mobile |
| Loading indicators | Skeleton UI, Spinner |
| Error feedback | Toast notifications |
| Form validation | Real-time validation |
| Accessibility | WCAG 2.1 Level AA |

### NFR-6.2: Internationalization

- Ngôn ngữ mặc định: Tiếng Việt
- Prepared for i18n (có thể mở rộng)
- Date/Time format theo locale

---

## 7. YÊU CẦU KHẢ NĂNG TƯƠNG THÍCH (Compatibility)

### NFR-7.1: Browser Support

| Browser | Phiên bản tối thiểu |
|---------|---------------------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

### NFR-7.2: API Compatibility

- RESTful API (JSON format)
- Content-Type: application/json
- Accept-Language header support
- CORS enabled

---

## 8. YÊU CẦU REAL-TIME (Real-time Requirements)

### NFR-8.1: WebSocket

| Feature | Requirement |
|---------|-------------|
| Protocol | Socket.io over WebSocket |
| Reconnection | Auto-reconnect với backoff |
| Heartbeat | 30 giây |
| Room-based updates | Workspace-level rooms |

### NFR-8.2: Event Latency

| Event | Max Latency |
|-------|-------------|
| Task status change | ≤ 500ms |
| New comment | ≤ 500ms |
| New notification | ≤ 1s |
| Member online status | ≤ 2s |

---

## 9. YÊU CẦU STORAGE

### NFR-9.1: File Upload

| Constraint | Value |
|------------|-------|
| Max file size | 10MB (attachments) |
| Max avatar size | 5MB |
| Allowed file types | jpg, png, gif, pdf, doc, docx, xls, xlsx |
| Storage location | Local (dev) / S3-compatible (prod) |

### NFR-9.2: Data Retention

| Data Type | Retention |
|-----------|-----------|
| User data | Until account deletion |
| Deleted tasks | 30 days (soft delete) |
| Activity logs | 90 days |
| Notification history | 30 days |

---

## 10. YÊU CẦU ĐỘ TIN CẬY (Reliability)

### NFR-10.1: Backup & Recovery

| Yêu cầu | Chi tiết |
|---------|----------|
| Database backup | Hàng ngày, tự động |
| Backup retention | 30 ngày |
| Backup location | Off-site/Cloud storage |
| Recovery testing | Hàng tháng |
| Disaster recovery plan | Documented |

### NFR-10.2: Data Integrity

- Transaction management với ACID compliance
- Foreign key constraints enforcement
- Optimistic locking cho concurrent updates
- Data validation ở cả client và server
- Cascading delete với soft-delete strategy

### NFR-10.3: Fault Tolerance

- Graceful degradation khi database connection lost
- Queue-based processing cho non-critical operations
- Auto-retry cho failed operations (max 3 lần)
- Health check endpoints (`/health`, `/ready`)

---

## 11. YÊU CẦU KHẢ NĂNG DI CHUYỂN (Portability)

### NFR-11.1: Containerization

| Yêu cầu | Chi tiết |
|---------|----------|
| Docker support | Dockerfile + docker-compose |
| Image size | ≤ 500MB |
| Multi-stage build | Production optimized |
| Environment variables | 12-factor app compliance |

### NFR-11.2: Cloud Agnostic

- Không phụ thuộc vendor-specific services
- S3-compatible storage interface (MinIO/AWS S3/GCS)
- Database portable (PostgreSQL standard)
- Configuration via environment variables

### NFR-11.3: Database Migration

- Prisma migrations versioned
- Rollback capability
- Zero-downtime migration strategy
- Seed data cho development

---

## 12. YÊU CẦU KHẢ NĂNG KIỂM THỬ (Testability)

### NFR-12.1: Testing Environment

| Environment | Purpose | Database |
|-------------|---------|----------|
| Development | Local dev | SQLite/Docker PostgreSQL |
| Testing | CI/CD | Docker PostgreSQL |
| Staging | Pre-production | Clone of production |
| Production | Live | PostgreSQL managed |

### NFR-12.2: Test Automation

| Test Type | Coverage Target | Tools |
|-----------|-----------------|-------|
| Unit Tests | ≥ 80% | Jest |
| Integration Tests | Critical paths | Supertest |
| E2E Tests | Happy paths | Playwright/Cypress |
| API Tests | All endpoints | Postman/Newman |

### NFR-12.3: Mocking & Fixtures

- Database fixtures cho test data
- Mock services cho external APIs
- Factory patterns cho test objects
- Isolated test databases

---

## 13. YÊU CẦU QUAN SÁT (Observability)

### NFR-13.1: Logging

| Log Level | Use Case | Example |
|-----------|----------|---------|
| ERROR | System errors | Database connection failed |
| WARN | Potential issues | Rate limit approaching |
| INFO | Business events | User registered, Task created |
| DEBUG | Development | Request/Response details |

**Log Format:**
```json
{
  "timestamp": "ISO 8601",
  "level": "INFO",
  "message": "...",
  "correlationId": "uuid",
  "userId": "optional",
  "context": {}
}
```

### NFR-13.2: Monitoring & Metrics

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| Response time (p95) | API latency | > 1s |
| Error rate | 5xx responses | > 1% |
| CPU usage | Server load | > 80% |
| Memory usage | RAM consumption | > 85% |
| Active connections | WebSocket/DB | > 90% capacity |

### NFR-13.3: Health Checks

| Endpoint | Purpose | Check Interval |
|----------|---------|----------------|
| `/health` | Basic liveness | 30s |
| `/health/ready` | Readiness (DB, Redis) | 30s |
| `/health/detailed` | Full component status | 60s |

### NFR-13.4: Alerting

- Email alerts cho critical errors
- Slack/Discord integration (optional)
- On-call rotation (nếu production)
- Escalation policies

---

## 14. YÊU CẦU BẢN ĐỊA HÓA (Localization)

### NFR-14.1: Timezone Handling

| Yêu cầu | Chi tiết |
|---------|----------|
| Storage | UTC trong database |
| Display | Convert theo user timezone |
| User preference | Lưu timezone trong profile |
| Default timezone | Asia/Ho_Chi_Minh |

### NFR-14.2: Date/Time Format

| Locale | Format | Example |
|--------|--------|---------|
| vi-VN | DD/MM/YYYY HH:mm | 05/02/2026 10:30 |
| en-US | MM/DD/YYYY h:mm A | 02/05/2026 10:30 AM |

### NFR-14.3: Language Support

| Phase | Languages |
|-------|-----------|
| MVP | Tiếng Việt (default) |
| Future | English, thêm ngôn ngữ khác |

**i18n Ready:**
- Externalized strings
- Translation file structure
- Pluralization support
- RTL preparation (future)

---

## 15. YÊU CẦU QUYỀN RIÊNG TƯ (Privacy & Compliance)

### NFR-15.1: Data Privacy

| Yêu cầu | Chi tiết |
|---------|----------|
| Data minimization | Chỉ thu thập dữ liệu cần thiết |
| Purpose limitation | Dữ liệu chỉ dùng cho mục đích declared |
| Data access | User có thể xem dữ liệu của mình |
| Data portability | Export data (JSON format) |
| Right to delete | User có thể yêu cầu xóa account |

### NFR-15.2: Data Export

- Export user data trong 48 giờ
- Format: JSON hoặc CSV
- Bao gồm: Profile, Tasks, Comments, Attachments metadata

### NFR-15.3: Account Deletion

| Step | Action | Timeline |
|------|--------|----------|
| Request | User yêu cầu xóa | Immediate |
| Soft delete | Deactivate account | Within 24h |
| Grace period | User có thể recover | 30 ngày |
| Hard delete | Xóa vĩnh viễn | After 30 days |

### NFR-15.4: Consent Management

- Terms of Service acceptance tracking
- Privacy Policy version tracking
- Cookie consent (nếu có tracking)
- Email notification preferences

---

## 📋 TỔNG KẾT

| Category | NFR Count | Priority |
|----------|-----------|----------|
| Performance | 3 | Critical |
| Security | 4 | Critical |
| Availability | 2 | High |
| Scalability | 2 | High |
| Maintainability | 3 | Medium |
| Usability | 2 | Medium |
| Compatibility | 2 | Medium |
| Real-time | 2 | High |
| Storage | 2 | Medium |
| **Reliability** | **3** | **High** |
| **Portability** | **3** | **Medium** |
| **Testability** | **3** | **High** |
| **Observability** | **4** | **High** |
| **Localization** | **3** | **Medium** |
| **Privacy/Compliance** | **4** | **High** |
| **Total** | **42** | |
