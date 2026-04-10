### A2. Kết quả kiểm thử TaskController

#### 1. Mô tả đối tượng kiểm thử

TaskController là controller của module quản lý công việc, đóng vai trò tiếp nhận HTTP request từ client và chuyển tiếp (delegate) xuống TaskService để xử lý. Controller này khai báo 14 endpoint tương ứng với 14 phương thức, chia làm 4 nhóm:

| Endpoint | Method | Decorator đặc biệt | Phương thức controller |
|----------|--------|--------------------|-----------------------|
| POST /projects/:projectId/tasks | POST | @Param('projectId', ParseUUIDPipe) | Gọi taskService.create(userId, projectId, dto) |
| GET /projects/:projectId/tasks | GET | @Query() FilterTaskDto | Gọi taskService.findAllByProject(userId, projectId, query) |
| GET /tasks/:id | GET | @Param('id', ParseUUIDPipe) | Gọi taskService.findOne(userId, id) |
| PATCH /tasks/:id | PATCH | @Body() UpdateTaskDto | Gọi taskService.update(userId, id, dto) |
| DELETE /tasks/:id | DELETE | — | Gọi taskService.remove(userId, id) |
| PATCH /tasks/:id/status | PATCH | @Body() UpdateStatusDto | Gọi taskService.updateStatus(userId, id, dto) |
| POST /tasks/:id/assign | POST | @Body() AssignTaskDto | Gọi taskService.assignMember(userId, id, dto.userId) |
| DELETE /tasks/:id/assign/:userId | DELETE | @Param('userId', ParseUUIDPipe) | Gọi taskService.unassignMember(userId, id, targetUserId) |
| POST /tasks/:id/labels | POST | @Body() TaskLabelDto | Gọi taskService.addLabel(userId, id, dto.labelId) |
| DELETE /tasks/:id/labels/:labelId | DELETE | @Param('labelId', ParseUUIDPipe) | Gọi taskService.removeLabel(userId, id, labelId) |
| POST /tasks/:id/subtasks | POST | @Body() CreateSubtaskDto | Gọi taskService.createSubtask(userId, id, dto) |
| GET /tasks/:id/subtasks | GET | — | Gọi taskService.findSubtasks(userId, id) |
| PATCH /subtasks/:id/complete | PATCH | — | Gọi taskService.toggleSubtask(userId, id) |
| DELETE /subtasks/:id | DELETE | — | Gọi taskService.removeSubtask(userId, id) |

TaskController chỉ phụ thuộc vào 1 dependency duy nhất là TaskService, được inject qua constructor. Tất cả 14 method đều chỉ delegate trực tiếp xuống service mà không có thêm logic xử lý — controller không chứa bất kỳ lệnh if/else, try/catch hay data transformation nào. Tuy nhiên, có 2 method đáng chú ý là assignMember() và addLabel(): thay vì truyền nguyên DTO object xuống service, controller extract ra field cụ thể (dto.userId và dto.labelId) rồi truyền dưới dạng primitive string. Đây là design decision giúp service method có thể được gọi từ nhiều ngữ cảnh khác nhau (controller, event handler, cron job) mà không bị ràng buộc vào DTO class.

Đặc điểm thiết kế quan trọng khác: controller sử dụng 2 pattern route — nested route (projects/:projectId/tasks) cho thao tác ở cấp collection (tạo task, list tasks) cần biết projectId, và flat route (tasks/:id) cho thao tác ở cấp individual (xem, sửa, xóa) không cần projectId vì có thể suy ra từ taskId trong service.

#### 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng Controller test pattern (Chương 8.6.1) — khác biệt cơ bản so với Service test (A1):

| Tiêu chí | Service test (A1) | Controller test (A2) |
|----------|-------------------|---------------------|
| Đối tượng test | TaskService (business logic) | TaskController (HTTP layer) |
| Mock gì | PrismaService, EventsService | TaskService |
| Kiểm tra gì | Logic nghiệp vụ, exception handling, data transformation, event emitting | Delegation đúng method + đúng tham số + extract field từ DTO |
| Số lượng mock | 2 dependencies (22 + 2 methods) | 1 dependency (14 methods) |

Controller được thiết kế theo nguyên tắc "thin controller" — không chứa business logic, chỉ đóng vai trò cầu nối giữa HTTP layer và service layer. Do đó, mục tiêu của controller test là xác nhận rằng mỗi endpoint gọi đúng method của service, truyền đúng tham số (bao gồm việc extract field cụ thể từ DTO khi cần), và trả về đúng kết quả mà service trả về.

Mock TaskService được tạo với jest.fn() cho tất cả 14 method, được inject vào TestingModule thông qua pattern { provide: TaskService, useValue: mockTaskService } (Chương 8.4.3). Mỗi test case sử dụng mockResolvedValue để thiết lập giá trị trả về mong muốn, sau đó assert rằng controller trả về đúng giá trị đó và service được gọi đúng 1 lần với đúng tham số.

#### 3. Danh sách test case

Tổng cộng 14 test case bao phủ toàn bộ 14 method của controller:

##### 1. create() — Tạo task mới

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 1 | nên gọi taskService.create với đúng tham số và trả kết quả | Truyền userId='user-001', projectId='project-001', dto={ title: 'Task mới', priority: 'HIGH' } | Controller trả về kết quả từ service. taskService.create được gọi 1 lần với đúng (userId, projectId, dto). |

##### 2. findAll() — Danh sách task

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 2 | nên gọi taskService.findAllByProject và trả kết quả | Truyền userId, projectId, query={ status: 'TODO', page: 1, limit: 10 } | Controller trả về { data: [], meta: { total, page, limit, totalPages } } từ service. |

##### 3. findOne() — Chi tiết task

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 3 | nên gọi taskService.findOne và trả kết quả | Truyền userId='user-001', taskId='task-001' | Controller trả về task object từ service. |

##### 4. update() — Cập nhật task

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 4 | nên gọi taskService.update và trả kết quả | Truyền userId, taskId, dto={ title: 'Title mới' } | Controller trả về task đã update từ service. |

##### 5. remove() — Xóa task

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 5 | nên gọi taskService.remove và trả kết quả | Truyền userId='user-001', taskId='task-001' | Controller trả về { message: 'Xóa task thành công' } từ service. |

##### 6. updateStatus() — Chuyển trạng thái task

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 6 | nên gọi taskService.updateStatus và trả kết quả | Truyền userId, taskId, dto={ status: 'IN_PROGRESS' } | Controller trả về task đã update status từ service. |

##### 7. assignMember() — Phân công thành viên (có logic extract DTO)

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 7 | nên extract userId từ DTO và gọi taskService.assignMember | Truyền AssignTaskDto có { userId: 'user-002' } | Service nhận ('user-001', 'task-001', 'user-002') — controller extract dto.userId thay vì truyền nguyên dto. |

Đây là test case quan trọng nhất trong TaskController test vì nó kiểm tra logic duy nhất ngoài delegation thuần — controller phải extract field dto.userId từ DTO body rồi truyền dưới dạng string cho service, thay vì truyền nguyên object DTO. Nếu developer vô tình viết `this.taskService.assignMember(userId, id, dto)` thay vì `this.taskService.assignMember(userId, id, dto.userId)`, test case sẽ fail ngay lập tức vì toHaveBeenCalledWith nhận được object { userId: 'user-002' } thay vì string 'user-002'.

##### 8. unassignMember() — Hủy phân công

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 8 | nên gọi taskService.unassignMember với đúng tham số | Truyền userId, taskId, targetUserId='user-002' (từ URL param) | Service nhận đúng 3 tham số primitive từ controller. |

##### 9. addLabel() — Gắn nhãn (có logic extract DTO)

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 9 | nên extract labelId từ DTO và gọi taskService.addLabel | Truyền TaskLabelDto có { labelId: 'label-001' } | Service nhận ('user-001', 'task-001', 'label-001') — controller extract dto.labelId thay vì truyền nguyên dto. |

Tương tự test case 7, đây là method thứ hai có logic extract field từ DTO. Cả 2 method (assignMember và addLabel) đều nhận body chứa single foreign key reference — controller tách ra trước khi truyền cho service, giữ cho service interface sạch và không phụ thuộc vào DTO class.

##### 10. removeLabel() — Gỡ nhãn

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 10 | nên gọi taskService.removeLabel với đúng tham số | Truyền userId, taskId, labelId='label-001' (từ URL param) | Service nhận đúng 3 tham số. |

##### 11. createSubtask() — Tạo subtask

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 11 | nên gọi taskService.createSubtask và trả kết quả | Truyền userId, taskId, dto={ title: 'Vẽ wireframe' } | Controller trả về subtask object từ service có position: 1. |

##### 12. findSubtasks() — Danh sách subtask

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 12 | nên gọi taskService.findSubtasks và trả kết quả | Truyền userId='user-001', taskId='task-001' | Controller trả về mảng subtask từ service. |

##### 13. toggleSubtask() — Toggle hoàn thành subtask

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 13 | nên gọi taskService.toggleSubtask và trả kết quả | Truyền userId='user-001', subtaskId='subtask-001' | Controller trả về subtask đã toggle (isCompleted: true) từ service. |

##### 14. removeSubtask() — Xóa subtask

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 14 | nên gọi taskService.removeSubtask và trả kết quả | Truyền userId='user-001', subtaskId='subtask-001' | Controller trả về { message: 'Xóa subtask thành công' } từ service. |

Vì controller không chứa logic xử lý ngoài delegation (khác với logout trong AuthController có strip "Bearer " prefix), mỗi method chỉ cần 1 test case để xác nhận delegation. Ngoại lệ duy nhất là 2 method assignMember và addLabel — dù chỉ có 1 test case mỗi method, bài test đặc biệt assert rằng service nhận primitive value (string) chứ không phải object, xác nhận controller thực hiện đúng bước extract dto.userId / dto.labelId. Tất cả các trường hợp lỗi (task not found, user không phải member, assign trùng, label khác workspace...) đã được kiểm tra kỹ ở tầng service (A1 — 36 test case).

#### 4. Kết quả chạy kiểm thử

##### 4.1. Kết quả tổng hợp

Kết quả terminal sau khi chạy lệnh test TaskController:

```
npx jest src/modules/task/task.controller.spec.ts --coverage --collectCoverageFrom="modules/task/task.controller.ts"
```

```
PASS src/modules/task/task.controller.spec.ts (2.445 s)
  TaskController
    create()
      √ nên gọi taskService.create với đúng tham số và trả kết quả (12 ms)
    findAll()
      √ nên gọi taskService.findAllByProject và trả kết quả (2 ms)
    findOne()
      √ nên gọi taskService.findOne và trả kết quả (2 ms)
    update()
      √ nên gọi taskService.update và trả kết quả (2 ms)
    remove()
      √ nên gọi taskService.remove và trả kết quả (1 ms)
    updateStatus()
      √ nên gọi taskService.updateStatus và trả kết quả (2 ms)
    assignMember()
      √ nên extract userId từ DTO và gọi taskService.assignMember (1 ms)
    unassignMember()
      √ nên gọi taskService.unassignMember với đúng tham số (2 ms)
    addLabel()
      √ nên extract labelId từ DTO và gọi taskService.addLabel (2 ms)
    removeLabel()
      √ nên gọi taskService.removeLabel với đúng tham số (2 ms)
    createSubtask()
      √ nên gọi taskService.createSubtask và trả kết quả (2 ms)
    findSubtasks()
      √ nên gọi taskService.findSubtasks và trả kết quả (1 ms)
    toggleSubtask()
      √ nên gọi taskService.toggleSubtask và trả kết quả (1 ms)
    removeSubtask()
      √ nên gọi taskService.removeSubtask và trả kết quả (1 ms)

Test Suites: 1 passed, 1 total
Tests:       14 passed, 14 total
Time:        2.445 s
```

Toàn bộ 14 test case đều PASSED trong thời gian 2.445 giây. Không có test nào bị skip hay fail.

##### 4.2. Code Coverage cho task.controller.ts

| Chỉ số | Giá trị | Ý nghĩa |
|--------|---------|---------|
| Statements | 100% | Tất cả câu lệnh trong file đã được thực thi ít nhất 1 lần |
| Branches | 75% | 3/4 nhánh điều kiện đã được kiểm tra |
| Functions | 100% | Tất cả 14 method + constructor đều được gọi |
| Lines | 100% | Tất cả dòng code đã được bao phủ |

##### 4.3. Phân tích nhánh chưa bao phủ

Branch coverage đạt 75% — mặc dù 100% statements và lines đều đạt. Coverage tool báo uncovered ở dòng 24-139, tuy nhiên đây không phải dòng code cụ thể chưa được test mà là các nhánh ngầm (implicit branches) được sinh ra bởi decorator metadata của NestJS: @Controller(), @Get(), @Post(), @Patch(), @Delete(), @Param(ParseUUIDPipe), @Body(), @Query(), @CurrentUser(). Những decorator này tạo ra conditional logic ở tầng framework runtime — ví dụ ParseUUIDPipe tạo nhánh kiểm tra UUID format valid/invalid, @Body() với ValidationPipe tạo nhánh kiểm tra DTO hợp lệ/không hợp lệ. Các nhánh này được thực thi bởi NestJS runtime chứ không phải bởi controller code trực tiếp, do đó không thể và không cần bao phủ trong unit test.

Đây là hạn chế kỹ thuật chung khi đo coverage cho NestJS controller có nhiều decorator — tương tự trường hợp UserController test (A4 Auth+User) đạt 64.7% branches nhưng 100% statements/lines, và AuthController test (A2 Auth+User) đạt 75% branches. Trong thực tế, 100% statements + 100% functions + 100% lines cho thấy toàn bộ logic do developer viết đã được kiểm thử hoàn toàn.

#### 5. Kiến thức Chương 8 đã áp dụng

Bảng dưới đây tổng hợp các kiến thức lý thuyết từ Chương 8 (Unit Testing) và cách chúng được áp dụng cụ thể trong bài kiểm thử TaskController:

| Mục Chương 8 | Nội dung lý thuyết | Áp dụng thực tế trong TaskController test |
|--------------|--------------------|-----------------------------------------|
| 8.2.2 | TestingModule — tạo module NestJS giả lập cho test | Test.createTestingModule({ controllers: [TaskController], providers: [...] }).compile() trong beforeEach |
| 8.3.1 | Cấu trúc describe/it/beforeEach | 1 describe gốc (TaskController), 14 describe con (create, findAll,...), 14 it blocks, 1 beforeEach |
| 8.4.2 | jest.fn(), mockResolvedValue | Mock 14 methods của TaskService, mỗi test dùng mockResolvedValue để thiết lập return value |
| 8.4.3 | Mock DI — { provide: X, useValue: mockX } | 1 dependency (TaskService) được inject dưới dạng mock object |
| 8.6.1 | Controller test pattern — mock service layer, verify delegation | Mock TaskService (khác service test ở A1 mock DB layer), verify đúng method + đúng tham số |

#### 6. Nhận xét và đánh giá

Bài kiểm thử TaskController hoàn thành tốt vai trò với 14/14 test case passed và coverage tối đa cho các chỉ số quan trọng (100% statements, 100% functions, 100% lines). Số lượng test case bằng đúng số method (14 test case cho 14 method) là hợp lý vì controller không chứa business logic — không có nhánh if/else hay exception handling cần test thêm error case.

Điểm đáng chú ý nhất trong bài test là 2 test case cho assignMember() và addLabel() — kiểm tra việc controller extract field cụ thể từ DTO (dto.userId và dto.labelId) trước khi truyền cho service. Đây là logic duy nhất có thể bị viết sai nếu developer truyền nguyên dto thay vì dto.userId, và bài test phát hiện ngay lỗi này nhờ toHaveBeenCalledWith assert đúng kiểu tham số (string vs object). Các method còn lại đều thuần delegation — truyền thẳng tham số từ decorator cho service mà không biến đổi.

So sánh với AuthController test (A2 Auth+User — 7 test case), TaskController test có nhiều test case hơn (14 vs 7) do controller có nhiều endpoint hơn (14 vs 6). Tuy nhiên không có test case nào phức tạp như logout test của AuthController (strip Bearer prefix) — vì TaskController thuần delegation, controller không chứa logic xử lý authorization header hay string manipulation. Branch coverage tương đương (75% vs 75%), cả hai đều do decorator framework chứ không phải do thiếu test cho logic do developer viết.

So sánh với A1 (TaskService test — 36 test case), bài test A2 minh họa rõ sự khác biệt giữa 2 tầng trong kiến trúc NestJS: service test kiểm tra business logic với mock phức tạp (22 method từ PrismaService, kỹ thuật mockResolvedValueOnce cho chuỗi gọi), trong khi controller test kiểm tra HTTP layer với mock đơn giản hơn (14 jest.fn() calls). Cả hai cùng sử dụng TestingModule và mock DI nhưng ở mức độ trừu tượng khác nhau — đúng theo nguyên tắc Testing Pyramid mà Chương 8 đề cập: unit test ở tầng thấp (service) nhiều test case hơn, kiểm tra logic chi tiết hơn, còn unit test ở tầng cao (controller) ít test case hơn, chỉ cần verify delegation đúng.
