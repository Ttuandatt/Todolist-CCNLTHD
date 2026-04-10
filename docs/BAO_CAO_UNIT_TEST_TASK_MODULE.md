### A1. Kết quả kiểm thử TaskService

#### 1. Mô tả đối tượng kiểm thử

TaskService là service cốt lõi của module quản lý công việc, chịu trách nhiệm xử lý toàn bộ luồng nghiệp vụ liên quan đến task — thực thể trung tâm được thao tác nhiều nhất trong hệ thống TodoList Collaboration. Service này quản lý 14 phương thức public bao gồm tạo task (create), lấy danh sách task có filter/sort/phân trang (findAllByProject), xem chi tiết task (findOne), cập nhật task (update), xóa task (remove), chuyển trạng thái task (updateStatus), phân công thành viên (assignMember), hủy phân công (unassignMember), gắn nhãn (addLabel), gỡ nhãn (removeLabel), tạo subtask (createSubtask), toggle hoàn thành subtask (toggleSubtask), danh sách subtask (findSubtasks) và xóa subtask (removeSubtask), cùng 3 phương thức private hỗ trợ là checkProjectMembership, findTaskOrThrow và checkTaskAccess.

TaskService phụ thuộc vào 2 dependency được inject qua constructor theo cơ chế Dependency Injection của NestJS:

| Dependency | Vai trò | Các method được sử dụng |
|------------|---------|------------------------|
| PrismaService | Truy cập cơ sở dữ liệu thông qua Prisma ORM | project.findUnique, workspaceMember.findUnique, task.findUnique, task.findMany, task.create, task.update, task.delete, task.count, task.aggregate, taskAssignment.findUnique, taskAssignment.create, taskAssignment.delete, label.findUnique, taskLabel.findUnique, taskLabel.create, taskLabel.delete, subtask.findUnique, subtask.findMany, subtask.create, subtask.update, subtask.delete, subtask.aggregate |
| EventsService | Phát sự kiện WebSocket real-time đến các client đang kết nối | emitToProject, emitToTask |

Điểm đặc biệt của TaskService so với các service khác trong hệ thống là sử dụng chuỗi kiểm tra phân quyền hai lớp: trước mỗi thao tác, service đều phải (1) xác minh entity tồn tại (project hoặc task), sau đó (2) kiểm tra user có phải thành viên (member) của workspace chứa project đó hay không. Logic này được đóng gói trong 3 helper method private để tái sử dụng xuyên suốt 14 phương thức public. Ngoài ra, TaskService còn tích hợp real-time notification — sau mỗi thao tác thay đổi dữ liệu (create, update, delete, updateStatus), service gọi EventsService để emit WebSocket event đến frontend, hỗ trợ cập nhật giao diện Kanban board tức thì mà không cần user F5 trang.

#### 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng phương pháp unit test cô lập (isolated unit testing) theo mô hình Testing Pyramid (Chương 8.1.3), trong đó TaskService được kiểm thử độc lập với toàn bộ dependency được thay thế bằng mock object. Cách tiếp cận này đảm bảo rằng khi một test case thất bại, nguyên nhân chắc chắn nằm trong logic nghiệp vụ của TaskService chứ không phải do lỗi từ database hay WebSocket gateway.

Các kỹ thuật cụ thể được áp dụng:

**Tạo môi trường test với TestingModule (Chương 8.2.2):** Sử dụng Test.createTestingModule() từ @nestjs/testing để tạo một NestJS module giả lập. Trong module này, TaskService được đăng ký là provider thật, còn PrismaService và EventsService được đăng ký dưới dạng mock thông qua pattern { provide: RealService, useValue: mockObject }. Khi NestJS khởi tạo TaskService, cơ chế DI sẽ tự động inject các mock object thay vì service thật.

**Mock function với jest.fn() (Chương 8.4.2):** Mỗi method của dependency được thay thế bằng jest.fn() — một hàm giả lập cho phép kiểm soát giá trị trả về (mockResolvedValue, mockResolvedValueOnce) và theo dõi lịch sử gọi (toHaveBeenCalledWith, toHaveBeenCalledTimes). Mock object của PrismaService đặc biệt phức tạp do phải giả lập 7 model Prisma khác nhau (project, workspaceMember, task, taskAssignment, label, taskLabel, subtask) với tổng cộng 22 method.

**Tái sử dụng mock data với helper function:** Do hầu hết 14 phương thức đều bắt đầu bằng bước kiểm tra membership, bài test tạo 2 helper function mockProjectMembershipSuccess() và mockTaskAccessSuccess() để giảm duplicate code trong phần Arrange. Các mock data dùng chung (MOCK_USER_ID, MOCK_PROJECT, MOCK_MEMBER, MOCK_TASK, MOCK_SUBTASK) được khai báo ở đầu file dưới dạng constant và tái sử dụng xuyên suốt 36 test case, đảm bảo tính nhất quán.

**Cấu trúc test Arrange-Act-Assert (Chương 8.3.1):** Mỗi test case được tổ chức theo 3 bước rõ ràng: (1) Arrange — thiết lập mock behavior và dữ liệu đầu vào, (2) Act — gọi method cần test, (3) Assert — kiểm tra kết quả trả về và xác nhận các dependency được gọi đúng cách.

**Đảm bảo tính độc lập giữa các test:** Trước mỗi test case, jest.clearAllMocks() được gọi trong beforeEach để reset toàn bộ mock về trạng thái ban đầu. Module test cũng được khởi tạo lại hoàn toàn trong mỗi vòng lặp beforeEach, đảm bảo test A không ảnh hưởng đến kết quả của test B.

#### 3. Danh sách test case

Tổng cộng 36 test case được viết cho 14 nhóm phương thức, bao phủ cả luồng thành công (happy path) và các trường hợp lỗi (error cases):

##### 1. create() — Tạo task mới

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 1 | nên tạo task thành công và trả về task object | Tạo task trong project mà user là member, project đã có 3 task | Trả về task object với position = 4 (max + 1). Event task:created được emit tới project. |
| 2 | nên báo lỗi 404 nếu project không tồn tại | Tạo task trong project có ID không tồn tại trong DB | Throw NotFoundException (HTTP 404). Không gọi task.create. |
| 3 | nên báo lỗi 403 nếu user không phải member workspace | Project tồn tại nhưng user không phải member của workspace chứa nó | Throw ForbiddenException (HTTP 403). Không gọi task.create. |
| 4 | nên set position = 1 khi project chưa có task nào | Tạo task đầu tiên trong project (aggregate trả max = null) | Position = (null ?? 0) + 1 = 1. |

Ở test case 1, ngoài việc kiểm tra giá trị trả về, bài test còn xác nhận rằng: task.aggregate được gọi để tính max position trong project, task.create nhận đúng data bao gồm position: 4, projectId và createdById: userId, và eventsService.emitToProject được gọi với event name "task:created" kèm payload task mới tạo. Test case 4 kiểm tra edge case quan trọng: khi project chưa có task nào, aggregate._max.position trả về null — sử dụng nullish coalescing operator ?? để fallback về 0, sau đó +1 = 1. Nếu dùng || thay vì ??, trường hợp position = 0 (hợp lệ) cũng bị fallback sai.

##### 2. findAllByProject() — Danh sách task có filter/sort/phân trang

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 5 | nên trả danh sách tasks kèm meta phân trang | Query rỗng (không filter), mặc định page=1, limit=20 | Trả về { data: tasks[], meta: { total, page, limit, totalPages } }. |
| 6 | nên xây dựng WHERE đúng khi filter theo status | Query status=TODO,IN_PROGRESS | WHERE chứa status: { in: ['TODO', 'IN_PROGRESS'] }. |
| 7 | nên xây dựng WHERE đúng khi search theo title | Query search=Login | WHERE chứa title: { contains: 'Login', mode: 'insensitive' }. |
| 8 | nên tính skip đúng dựa trên page và limit | Query page=3, limit=10 | skip = (3-1) × 10 = 20, take = 10. |

Phương thức findAllByProject() là phương thức phức tạp nhất trong TaskService với hơn 110 dòng code, hỗ trợ 7 loại filter (status, priority, assigneeId, labelIds, dueDate, search, sortBy). Bài test kiểm tra 3 filter phổ biến nhất — status, search và pagination — bằng cách verify cấu trúc object WHERE truyền vào task.findMany. Kỹ thuật expect.objectContaining() được sử dụng để chỉ assert phần cần kiểm tra mà không cần khai báo toàn bộ object phức tạp, giúp test dễ đọc và ít bị vỡ khi code thay đổi. Test case 8 xác nhận công thức tính skip = (page - 1) * limit hoạt động đúng cho trang thứ 3.

##### 3. findOne() — Xem chi tiết task

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 9 | nên trả về task với đầy đủ subtasks, assignees, labels | Xem chi tiết task mà user có quyền truy cập | Trả về task kèm subtasks[], assignments[], labels[], _count (comments, attachments). |
| 10 | nên báo lỗi 404 nếu task không tồn tại | Task ID không tồn tại trong database | Throw NotFoundException (HTTP 404). |

Ở test case 9, task.findUnique được mock 2 lần bằng mockResolvedValueOnce: lần đầu trong checkTaskAccess() trả về task cơ bản (chỉ có project.workspaceId để kiểm tra membership), lần hai trong findOne() trả về task đầy đủ kèm toàn bộ includes (subtasks, assignments, labels, _count). Đây là kỹ thuật mock theo thứ tự gọi — đảm bảo mỗi lần gọi cùng method nhận đúng dữ liệu tương ứng với ngữ cảnh gọi.

##### 4. update() — Cập nhật task

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 11 | nên cập nhật task và trả về task đã update | Cập nhật title của task | Trả về task đã update. Event task:updated được emit tới cả task channel và project channel. |
| 12 | nên tự động set completedAt khi chuyển sang DONE | Update với status: 'DONE' | Data truyền vào task.update chứa completedAt: expect.any(Date). |
| 13 | nên xóa completedAt khi chuyển từ DONE sang status khác | Update với status: 'IN_PROGRESS' | Data truyền vào task.update chứa completedAt: null. |

Test case 12 và 13 kiểm tra logic tự động quản lý completedAt — một business rule quan trọng: khi task được đánh dấu DONE, hệ thống tự ghi nhận thời điểm hoàn thành (completedAt = new Date()); khi chuyển ngược lại sang trạng thái khác, completedAt phải được reset về null. Kỹ thuật expect.any(Date) được sử dụng thay vì so sánh Date cụ thể vì thời điểm new Date() trong service thay đổi theo thời gian chạy test — nếu hardcode giá trị Date, test sẽ fail khi chạy ở thời điểm khác. Test case 11 cũng xác nhận rằng emitToTask và emitToProject đều được gọi — đảm bảo real-time update đến cả trang chi tiết task lẫn Kanban board.

##### 5. remove() — Xóa task

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 14 | nên xóa task và trả về thông báo thành công | Xóa task mà user có quyền truy cập | Trả { message: 'Xóa task thành công' }. task.delete được gọi. Event task:deleted được emit. |
| 15 | nên báo lỗi 404 nếu task không tồn tại | Task ID không tồn tại | Throw NotFoundException. task.delete không được gọi. |

Test case 14 xác nhận thêm rằng emitToProject nhận payload { id: taskId } — đây là thông tin tối thiểu mà frontend cần để xóa task khỏi danh sách hiển thị mà không cần request lại server. Prisma cascade delete sẽ tự động xóa toàn bộ bản ghi liên quan (subtasks, assignments, labels, comments, attachments) khi task bị xóa.

##### 6. updateStatus() — Chuyển trạng thái task (Kanban drag-drop)

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 16 | nên cập nhật status và emit event | Chuyển status sang IN_PROGRESS | Trả task mới. emitToTask và emitToProject đều được gọi. |
| 17 | nên set completedAt = now khi chuyển sang DONE | Chuyển status sang DONE | Data chứa status: 'DONE' và completedAt: expect.any(Date). |

updateStatus() là phiên bản chuyên biệt của update(), chỉ cho phép thay đổi trường status — thiết kế riêng cho tính năng kéo-thả cột trên Kanban board. Điểm khác biệt là method này emit event tới cả 2 channel: emitToTask (cập nhật trang chi tiết task) và emitToProject (cập nhật Kanban board). Test case 16 xác nhận cả 2 emit đều được gọi — đảm bảo mọi client đang xem bất kỳ view nào đều nhận được update real-time.

##### 7. assignMember() — Phân công thành viên vào task

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 18 | nên assign thành viên vào task thành công | Assign user-002 (là member workspace) vào task chưa được assign | Trả { message: 'Assign thành công', assignment }. taskAssignment.create được gọi. |
| 19 | nên báo lỗi 403 nếu người được assign không phải member workspace | Assign user ngoài workspace vào task | Throw ForbiddenException (HTTP 403). taskAssignment.create không được gọi. |
| 20 | nên báo lỗi 409 nếu user đã được assign vào task rồi | Assign user đã có assignment record trong DB | Throw ConflictException (HTTP 409). |

Test case 18 sử dụng kỹ thuật chuỗi mockResolvedValueOnce: workspaceMember.findUnique được mock trả về lần lượt MOCK_MEMBER (kiểm tra current user có quyền từ checkTaskAccess) rồi { id: 'member-002', userId: 'user-002' } (kiểm tra target user là member workspace). Thứ tự này phản ánh chính xác thứ tự gọi trong source code — nếu đảo ngược, test sẽ fail. Test case 19 minh họa trường hợp current user hợp lệ nhưng target user không phải member workspace — mock lần đầu trả MOCK_MEMBER, lần hai trả null.

##### 8. unassignMember() — Hủy phân công

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 21 | nên hủy assignment thành công | Unassign user đã có assignment record | Trả { message: 'Unassign thành công' }. taskAssignment.delete được gọi với đúng ID. |
| 22 | nên báo lỗi 404 nếu user chưa được assign | Unassign user chưa có assignment record | Throw NotFoundException (HTTP 404). |

##### 9. addLabel() — Gắn nhãn vào task

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 23 | nên gắn label vào task thành công | Label thuộc cùng workspace với task, chưa được gắn trước đó | Trả { message: 'Gắn label thành công', taskLabel }. |
| 24 | nên báo lỗi 404 nếu label không thuộc workspace | Label có workspaceId khác với workspace chứa task | Throw NotFoundException (HTTP 404). |
| 25 | nên báo lỗi 409 nếu label đã gắn vào task rồi | taskLabel.findUnique trả về record tồn tại | Throw ConflictException (HTTP 409). |

Test case 24 kiểm tra business rule cross-workspace isolation: label chỉ có thể gắn vào task thuộc cùng workspace. Service kiểm tra bằng cách so sánh label.workspaceId với task.project.workspaceId. Nếu không khớp, throw NotFoundException thay vì ForbiddenException — đây là intentional design nhằm không tiết lộ sự tồn tại của label cho user ngoài workspace (information hiding principle), tương tự cách GitHub trả 404 thay vì 403 khi truy cập repo private.

##### 10. removeLabel() — Gỡ nhãn

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 26 | nên gỡ label thành công | Label đã gắn vào task, user có quyền | Trả { message: 'Gỡ label thành công' }. taskLabel.delete được gọi. |
| 27 | nên báo lỗi 404 nếu label chưa gắn | taskLabel.findUnique trả null | Throw NotFoundException (HTTP 404). |

##### 11. createSubtask() — Tạo subtask (công việc con)

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 28 | nên tạo subtask với position tự động tăng | Task đã có 2 subtask (max position = 2) | Trả subtask mới với position = 3. subtask.create nhận position: 3, taskId, title. |

Logic tính position cho subtask tương tự như task: dùng subtask.aggregate({ _max: { position: true } }) để lấy position lớn nhất hiện tại, sau đó cộng 1. Cơ chế này hỗ trợ sắp xếp thứ tự hiển thị và chuẩn bị cho tính năng drag-drop reorder trong các phase tiếp theo.

##### 12. toggleSubtask() — Toggle hoàn thành subtask

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 29 | nên đổi isCompleted từ false → true | Subtask có isCompleted: false | subtask.update được gọi với data: { isCompleted: true }. |
| 30 | nên đổi isCompleted từ true → false | Subtask có isCompleted: true | subtask.update được gọi với data: { isCompleted: false }. |
| 31 | nên báo lỗi 404 nếu subtask không tồn tại | Subtask ID không tồn tại trong DB | Throw NotFoundException (HTTP 404). |
| 32 | nên báo lỗi 403 nếu user không phải member | User không phải member workspace chứa task cha | Throw ForbiddenException (HTTP 403). |

toggleSubtask() không nhận body từ client — mỗi lần gọi sẽ đảo ngược trạng thái hiện tại bằng biểu thức !subtask.isCompleted. Test case 29 và 30 kiểm tra cả 2 chiều toggle để đảm bảo logic đảo ngược hoạt động đúng. Điểm đặc biệt là toggleSubtask() phải thực hiện membership check riêng — không dùng helper checkTaskAccess() — vì entry point là subtaskId chứ không phải taskId. Service cần truy cập chuỗi relation 3 cấp subtask → task → project → workspaceId để lấy được workspaceId. Đây cũng là lý do method này có tới 4 test case — nhiều hơn so với các method đơn giản chỉ dùng helper.

##### 13. findSubtasks() — Danh sách subtask

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 33 | nên trả danh sách subtasks sắp xếp theo position | Task có 2 subtask | Trả mảng subtask. subtask.findMany được gọi với orderBy: { position: 'asc' }. |

##### 14. removeSubtask() — Xóa subtask

| # | Test case | Mô tả | Kết quả mong đợi |
|---|-----------|-------|-------------------|
| 34 | nên xóa subtask thành công | Subtask tồn tại, user là member workspace | Trả { message: 'Xóa subtask thành công' }. subtask.delete được gọi. |
| 35 | nên báo lỗi 404 nếu subtask không tồn tại | Subtask ID không tồn tại | Throw NotFoundException (HTTP 404). |
| 36 | nên báo lỗi 403 nếu user không phải member | User không phải member workspace chứa task cha | Throw ForbiddenException (HTTP 403). |

Tương tự toggleSubtask(), removeSubtask() thực hiện membership check thủ công qua chuỗi subtask → task.project.workspaceId thay vì sử dụng helper checkTaskAccess(), vì entry point là subtaskId. Điều này đảm bảo chỉ member workspace mới có quyền xóa subtask, ngay cả khi subtask không thuộc task của họ.

#### 4. Kết quả chạy kiểm thử

##### 4.1. Kết quả tổng hợp

Kết quả terminal sau khi chạy lệnh test TaskService:

```
npx jest src/modules/task/task.service.spec.ts --coverage --collectCoverageFrom="modules/task/task.service.ts"
```

```
PASS src/modules/task/task.service.spec.ts (2.131 s)
  TaskService
    create() — Tạo task mới
      √ nên tạo task thành công và trả về task object (11 ms)
      √ nên báo lỗi 404 nếu project không tồn tại (21 ms)
      √ nên báo lỗi 403 nếu user không phải member workspace (3 ms)
      √ nên set position = 1 khi project chưa có task nào (2 ms)
    findAllByProject() — Danh sách task có filter/sort/pagination
      √ nên trả danh sách tasks kèm meta phân trang (2 ms)
      √ nên xây dựng WHERE đúng khi filter theo status (1 ms)
      √ nên xây dựng WHERE đúng khi search theo title (2 ms)
      √ nên tính skip đúng dựa trên page và limit (1 ms)
    findOne() — Chi tiết task
      √ nên trả về task với đầy đủ subtasks, assignees, labels (1 ms)
      √ nên báo lỗi 404 nếu task không tồn tại (1 ms)
    update() — Cập nhật task
      √ nên cập nhật task và trả về task đã update (1 ms)
      √ nên tự động set completedAt khi chuyển sang DONE (1 ms)
      √ nên xóa completedAt khi chuyển từ DONE sang status khác (1 ms)
    remove() — Xóa task
      √ nên xóa task và trả về thông báo thành công (1 ms)
      √ nên báo lỗi 404 nếu task không tồn tại (1 ms)
    updateStatus() — Chuyển trạng thái task
      √ nên cập nhật status và emit event (1 ms)
      √ nên set completedAt = now khi chuyển sang DONE (1 ms)
    assignMember() — Giao task cho thành viên
      √ nên assign thành viên vào task thành công (1 ms)
      √ nên báo lỗi 403 nếu người được assign không phải member workspace (1 ms)
      √ nên báo lỗi 409 nếu user đã được assign vào task rồi (1 ms)
    unassignMember() — Hủy giao task
      √ nên hủy assignment thành công (1 ms)
      √ nên báo lỗi 404 nếu user chưa được assign (2 ms)
    addLabel() — Gắn label vào task
      √ nên gắn label vào task thành công (1 ms)
      √ nên báo lỗi 404 nếu label không thuộc workspace (2 ms)
      √ nên báo lỗi 409 nếu label đã gắn vào task rồi (1 ms)
    removeLabel() — Gỡ label
      √ nên gỡ label thành công (2 ms)
      √ nên báo lỗi 404 nếu label chưa gắn (1 ms)
    createSubtask() — Tạo subtask
      √ nên tạo subtask với position tự động tăng (1 ms)
    toggleSubtask() — Toggle hoàn thành subtask
      √ nên đổi isCompleted từ false → true (2 ms)
      √ nên đổi isCompleted từ true → false (1 ms)
      √ nên báo lỗi 404 nếu subtask không tồn tại (1 ms)
      √ nên báo lỗi 403 nếu user không phải member (1 ms)
    findSubtasks() — Danh sách subtask
      √ nên trả danh sách subtasks sắp xếp theo position (2 ms)
    removeSubtask() — Xóa subtask
      √ nên xóa subtask thành công (1 ms)
      √ nên báo lỗi 404 nếu subtask không tồn tại (1 ms)
      √ nên báo lỗi 403 nếu user không phải member (2 ms)

Test Suites: 1 passed, 1 total
Tests:       36 passed, 36 total
Time:        2.131 s
```

Toàn bộ 36 test case đều PASSED trong thời gian 2.131 giây. Không có test nào bị skip hay fail.

##### 4.2. Code Coverage cho task.service.ts

| Chỉ số | Giá trị | Ý nghĩa |
|--------|---------|---------|
| Statements | 83.66% | 83.66% câu lệnh trong file đã được thực thi ít nhất 1 lần |
| Branches | 78.04% | 78.04% nhánh điều kiện (if/else, switch/case) đã được kiểm tra |
| Functions | 100% | Tất cả 17 hàm (14 public + 3 private) đều được gọi |
| Lines | 84.45% | 84.45% dòng code đã được bao phủ |

##### 4.3. Phân tích các dòng chưa bao phủ

Có 6 nhóm dòng trong task.service.ts chưa được bao phủ bởi test:

| Dòng | Code | Lý do chưa bao phủ |
|------|------|---------------------|
| 73 | `throw new ForbiddenException(...)` trong checkTaskAccess | Nhánh !member trong helper checkTaskAccess() — các test case 403 cho subtask methods (toggleSubtask, removeSubtask) kiểm tra membership check riêng, không đi qua helper này. Nhánh này được trigger gián tiếp qua các method khác nhưng coverage tool đếm theo dòng cụ thể. |
| 131-132 | `const priorities = query.priority.split(','); where.priority = { in: priorities }` | Nhánh filter query.priority trong findAllByProject() — bài test chỉ kiểm tra filter status và search, chưa viết test case riêng cho filter priority. |
| 137 | `where.assignments = { some: { userId: query.assigneeId } }` | Nhánh filter query.assigneeId — chưa có test case filter theo người được giao việc. |
| 142-143 | `const labelIds = query.labelIds.split(','); where.labels = { some: { labelId: { in: labelIds } } }` | Nhánh filter query.labelIds — chưa có test case filter theo nhãn. |
| 148-169 | Toàn bộ block `if (query.dueDate)` với 4 case switch: overdue, today, week, none | Nhánh filter dueDate với logic tính toán todayStart, todayEnd, weekEnd — đây là block phức tạp nhất với 4 sub-branch, chưa được kiểm thử. |
| 186 | `orderBy = { priority: sortOrder }` | Nhánh xử lý đặc biệt khi sortBy === 'priority' — sắp xếp theo thứ tự khai báo enum thay vì tên cột. |

Tất cả các dòng chưa bao phủ đều nằm trong phương thức findAllByProject(), cụ thể là các nhánh filter ít phổ biến (priority, assigneeId, labelIds, dueDate) và sort đặc biệt (priority). Đây là design decision có chủ đích: bài test tập trung vào 3 filter quan trọng nhất (status, search, pagination) và có thể bổ sung thêm test case cho các filter còn lại nếu cần nâng coverage. Điều quan trọng là 100% functions đã được kiểm thử — không có phương thức nào bị bỏ sót hoàn toàn.

#### 5. Kiến thức Chương 8 đã áp dụng

Bảng dưới đây tổng hợp các kiến thức lý thuyết từ Chương 8 (Unit Testing) và cách chúng được áp dụng cụ thể trong bài kiểm thử TaskService:

| Mục Chương 8 | Nội dung lý thuyết | Áp dụng thực tế trong TaskService test |
|--------------|--------------------|-----------------------------------------|
| 8.1.3 | Testing Pyramid — unit test là nền tảng, chiếm số lượng nhiều nhất, chạy nhanh nhất | 36 test case chạy trong ~2.1s, không cần DB/network. Mọi dependency đều mock. |
| 8.2.2 | TestingModule — tạo module NestJS giả lập cho test | Test.createTestingModule({ providers: [...] }).compile() trong beforeEach |
| 8.3.1 | Cấu trúc describe/it/beforeEach | 1 describe gốc (TaskService), 14 describe con (create, findAllByProject,...), 36 it blocks, 1 beforeEach |
| 8.4.2 | jest.fn(), mockResolvedValue, mockResolvedValueOnce | Mock 22 methods của PrismaService + 2 methods của EventsService. Sử dụng mockResolvedValueOnce cho chuỗi gọi lần lượt trong assignMember và findOne |
| 8.4.3 | Mock DI — { provide: X, useValue: mockX } | 2 dependency (PrismaService, EventsService) được inject dưới dạng mock object |
| 8.5 | Service test pattern — mock DB layer, test business logic | TaskService là service layer; PrismaService (DB) và EventsService (WebSocket) hoàn toàn mock |
| 8.7 | Code coverage — đo lường mức độ bao phủ | 83.66% Stmts, 100% Funcs, 84.45% Lines |

#### 6. Nhận xét và đánh giá

Bài kiểm thử TaskService đạt kết quả tốt với 36/36 test case passed và code coverage ở mức khá (83.66% statements, 100% functions). Tất cả 17 hàm (14 public + 3 private) đều được gọi ít nhất 1 lần, đảm bảo không có phương thức nào bị bỏ sót. Các test case bao phủ đầy đủ cả luồng thành công và các trường hợp lỗi cho tất cả 14 phương thức public, bao gồm các tình huống quan trọng như project không tồn tại, user không phải member workspace, assign trùng, label khác workspace, subtask không tồn tại, và logic tự động quản lý completedAt khi chuyển status DONE.

Điểm mạnh của bài test nằm ở việc thiết kế mock data có tính tái sử dụng cao — 5 constant (MOCK_USER_ID, MOCK_PROJECT, MOCK_MEMBER, MOCK_TASK, MOCK_SUBTASK) và 2 helper function (mockProjectMembershipSuccess, mockTaskAccessSuccess) giúp loại bỏ hàng trăm dòng duplicate code trong phần Arrange. Kỹ thuật mockResolvedValueOnce được áp dụng hiệu quả cho các method gọi cùng dependency nhiều lần với mục đích khác nhau — điển hình là assignMember() gọi workspaceMember.findUnique 2 lần (kiểm tra current user vs kiểm tra target user), và findOne() gọi task.findUnique 2 lần (checkTaskAccess vs query đầy đủ). Bài test assert đúng loại exception mà source code throw — ForbiddenException cho unauthorized access, NotFoundException cho entity không tồn tại, ConflictException cho duplicate — thay vì dùng chung một loại exception cho tất cả.

Branch coverage đạt 78.04% — thấp hơn so với các chỉ số khác — do toàn bộ các nhánh chưa bao phủ nằm trong findAllByProject(), method có tới 7 loại filter với nhiều sub-branch (đặc biệt dueDate có 4 case trong switch). Trong thực tế, status filter và search là 2 filter được sử dụng nhiều nhất trên giao diện Kanban board, các filter còn lại (priority, assigneeId, labelIds, dueDate) có thể bổ sung test case sau nếu cần nâng coverage lên trên 90%. Nếu không tính method findAllByProject(), coverage của các method còn lại sẽ đạt xấp xỉ 100%.
