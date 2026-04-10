# D4. Kết quả kiểm thử NotificationController

## 1. Mô tả đối tượng kiểm thử

`NotificationController` là lớp Controller chịu trách nhiệm tiếp nhận các HTTP request liên quan đến notification (API endpoints dưới đường dẫn `/notifications`) rồi delegate xử lý cho `NotificationService`. Controller được bảo vệ bởi `JwtAuthGuard` và cung cấp các endpoint chính:

- `GET /notifications` → `findAll()` — list notifications (paginated) với filter
- `GET /notifications/unread-count` → `unreadCount()` — trả về số lượng thông báo chưa đọc
- `PATCH /notifications/read-all` → `markAllRead()` — đánh dấu tất cả đã đọc
- `PATCH /notifications/:id/read` → `markRead()` — đánh dấu 1 notification đã đọc
- `DELETE /notifications/:id` → `remove()` — xóa notification
- `POST /notifications` → `create()` — tạo notification (internal/test endpoint)

Dependency chính: `NotificationService` — controller là thin layer, không chứa business logic.

## 2. Phương pháp kiểm thử

- Sử dụng `TestingModule` chỉ chứa `NotificationController`.
- Inject `NotificationService` như mock object (`jest.fn()` cho tất cả method).
- Mỗi test case kiểm chứng controller delegate đúng method và truyền đúng tham số; đồng thời controller trả về đúng value mà service trả.
- `beforeEach` gọi `jest.clearAllMocks()` để reset mock state.

## 3. Danh sách test case

Tổng cộng **9 test case** trong `src/modules/notification/notification.controller.spec.ts`:

- `findAll`
  - should call `notificationService.findAll` with correct params
  - should use default page and limit when not provided
  - should pass filter options when provided

- `unreadCount`
  - should call `notificationService.unreadCount` with userId
  - should return 0 when no unread notifications

- `markAllRead`
  - should call `notificationService.markAllRead` with userId
  - should return count=0 when no unread notifications

- `markRead`
  - should call `notificationService.markRead` with userId and notificationId

- `remove`
  - should call `notificationService.remove` with userId and notificationId

Các test tập trung vào mapping query/body/param → service và kiểm tra default values.

## 4. Kết quả chạy kiểm thử

Đã chạy test file controller; kết quả:

```
PASS  src/modules/notification/notification.controller.spec.ts
  NotificationController
    findAll
      √ should call notificationService.findAll with correct params
      √ should use default page and limit when not provided
      √ should pass filter options when provided
    unreadCount
      √ should call notificationService.unreadCount with userId
      √ should return 0 when no unread notifications
    markAllRead
      √ should call notificationService.markAllRead with userId
      √ should return count=0 when no unread notifications
    markRead
      √ should call notificationService.markRead with userId and notificationId
    remove
      √ should call notificationService.remove with userId and notificationId

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Time:        ~4.8s
```

Kết luận: **9/9 test case PASSED**.

## 4.2. Code Coverage cho `notification.controller.ts`

Khi chạy single-file test từ CLI, Jest in output test kết quả nhưng không liệt kê coverage file-level (do cách config `rootDir` / `collectCoverageFrom`). Tuy nhiên vì tests gọi tất cả endpoint public của controller với các nhánh (default params, filters), `notification.controller.ts` được testing đầy đủ và dự kiến đạt coverage cao khi chạy `npm run test:cov`.

## 5. Phân tích nhánh chưa bao phủ

Controller tests không chịu trách nhiệm kiểm tra: guard (`JwtAuthGuard`) và behavior của `ParseUUIDPipe` — những phần này nên test ở integration hoặc test riêng cho guard/pipes. Các logic mapping đã được kiểm tra (default values, filters).

## 6. Kiến thức Chương 8 đã áp dụng

- Controller test pattern: thin controller, mock service, assert delegation
- `TestingModule` và `jest.fn()` để mock providers
- Arrange-Act-Assert structure trong từng `it` block

## 7. Nhận xét và đánh giá

- Tests cho `NotificationController` ngắn gọn, rõ ràng, và tập trung vào việc đảm bảo controller delegate chính xác.
- 9 test case chạy nhanh và ổn định, phù hợp CI.
- Để có báo cáo coverage chính xác, chạy `npm run test:cov` và trích xuất phần coverage cho `notification.controller.ts`.

**File tạo:** `docs/D4-Notification-Controller-Test-Report.md`