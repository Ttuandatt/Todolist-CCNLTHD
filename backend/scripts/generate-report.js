const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle } = require('docx');
const fs = require('fs');

// ═══════════════════════════════════════════════════════════════
// Helper: tạo bảng
// ═══════════════════════════════════════════════════════════════
function createTable(headers, rows) {
  const headerCells = headers.map(h => new TableCell({
    children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20, font: 'Times New Roman' })] })],
    shading: { fill: 'D9E2F3' },
  }));

  const dataRows = rows.map(row =>
    new TableRow({
      children: row.map(cell => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: String(cell), size: 20, font: 'Times New Roman' })] })],
      })),
    })
  );

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headerCells, tableHeader: true }),
      ...dataRows,
    ],
  });
}

function p(text, options = {}) {
  return new Paragraph({
    children: [new TextRun({ text, size: 24, font: 'Times New Roman', ...options })],
    spacing: { after: 120 },
    ...(options.heading ? { heading: options.heading } : {}),
    ...(options.alignment ? { alignment: options.alignment } : {}),
  });
}

function h1(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 32, bold: true, font: 'Times New Roman' })],
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 240, after: 120 },
  });
}

function h2(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 28, bold: true, font: 'Times New Roman' })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
  });
}

function h3(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 24, bold: true, font: 'Times New Roman' })],
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 160, after: 80 },
  });
}

function empty() {
  return new Paragraph({ children: [] });
}

// ═══════════════════════════════════════════════════════════════
// NỘI DUNG BÁO CÁO
// ═══════════════════════════════════════════════════════════════
const doc = new Document({
  sections: [{
    properties: {
      page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } },
    },
    children: [
      // ─── TRANG BÌA ───
      empty(), empty(), empty(), empty(),
      p('TRƯỜNG ĐẠI HỌC', { bold: true, size: 28, alignment: AlignmentType.CENTER }),
      empty(),
      p('BÁO CÁO UNIT TEST', { bold: true, size: 36, alignment: AlignmentType.CENTER }),
      p('MODULE TASK (PHASE 4)', { bold: true, size: 32, alignment: AlignmentType.CENTER }),
      p('Dự án: TodoList Collaboration — CCNLTHD', { size: 24, alignment: AlignmentType.CENTER }),
      empty(), empty(),
      p('Người thực hiện: Phú', { size: 24, alignment: AlignmentType.CENTER }),
      p('Ngày: 10/04/2026', { size: 24, alignment: AlignmentType.CENTER }),
      empty(), empty(), empty(),

      // ─── 1. THÔNG TIN CHUNG ───
      h1('1. THÔNG TIN CHUNG'),
      createTable(
        ['Thông tin', 'Chi tiết'],
        [
          ['Dự án', 'TodoList Collaboration — CCNLTHD'],
          ['Module', 'Task Module (Phase 4)'],
          ['Người thực hiện', 'Phú'],
          ['Ngày thực hiện', '10/04/2026'],
          ['Công nghệ test', 'Jest v30 + @nestjs/testing v11'],
          ['Ngôn ngữ', 'TypeScript'],
        ]
      ),
      empty(),

      // ─── 2. MỤC ĐÍCH ───
      h1('2. MỤC ĐÍCH'),
      p('Báo cáo này trình bày kết quả viết và chạy unit test cho Task Module — module cốt lõi quản lý công việc (task) của ứng dụng TodoList Collaboration. Mục tiêu kiểm thử đơn vị (unit test) là:'),
      p('• Đảm bảo tất cả các chức năng CRUD, phân trang, lọc, sắp xếp, phân công, gắn nhãn và quản lý subtask hoạt động đúng theo yêu cầu.'),
      p('• Xác minh các luồng xử lý lỗi (error flow) trả về đúng mã lỗi HTTP và thông báo.'),
      p('• Kiểm tra tính cách ly (isolation) — mỗi test case chạy độc lập, không ảnh hưởng lẫn nhau.'),
      empty(),

      // ─── 3. PHẠM VI KIỂM THỬ ───
      h1('3. PHẠM VI KIỂM THỬ'),
      h2('3.1. Các file được kiểm thử'),
      createTable(
        ['STT', 'File', 'Vai trò', 'Số test case'],
        [
          ['1', 'task.service.ts', 'Chứa toàn bộ business logic', '36'],
          ['2', 'task.controller.ts', 'Tiếp nhận HTTP request, delegate cho service', '14'],
          ['', 'Tổng', '', '50'],
        ]
      ),
      empty(),

      // ─── 4. PHƯƠNG PHÁP KIỂM THỬ ───
      h1('4. PHƯƠNG PHÁP KIỂM THỬ'),
      h2('4.1. Kiến thức Chương 8 áp dụng'),
      createTable(
        ['Mục', 'Nội dung', 'Cách áp dụng'],
        [
          ['8.1.3', 'Testing Pyramid', 'Unit test là tầng nền tảng — chạy nhanh, kiểm tra logic đơn lẻ'],
          ['8.2.2', 'TestingModule + mock DI', 'Dùng Test.createTestingModule() tạo module NestJS giả lập'],
          ['8.3.1', 'describe/it/beforeEach', 'Cấu trúc test: nhóm theo chức năng, reset mock trước mỗi test'],
          ['8.4.2', 'jest.fn(), mockResolvedValue', 'Tạo hàm giả, kiểm soát giá trị trả về'],
          ['8.4.3', '{ provide: X, useValue: mockX }', 'Tiêm dependency giả vào NestJS module'],
          ['8.5', 'Service test pattern', 'Mock database layer (Prisma), test business logic'],
          ['8.6.1', 'Controller test pattern', 'Mock service layer, kiểm tra delegation'],
          ['8.7', 'Code coverage', 'Dùng --coverage để đo độ phủ mã nguồn'],
        ]
      ),
      empty(),

      h2('4.2. Mô hình AAA (Arrange – Act – Assert)'),
      p('Mỗi test case tuân theo mô hình 3 bước:'),
      p('1. Arrange — Thiết lập dữ liệu đầu vào và mock behavior'),
      p('2. Act — Gọi method cần kiểm thử'),
      p('3. Assert — Kiểm tra kết quả trả về và hành vi (method nào được gọi, với tham số gì)'),
      empty(),

      h2('4.3. Dependency được mock'),
      createTable(
        ['Dependency', 'Mock object', 'Lý do mock'],
        [
          ['PrismaService', 'mockPrismaService', 'Không kết nối DB thật — chỉ test logic'],
          ['EventsService', 'mockEventsService', 'Không gửi WebSocket event thật — chỉ verify emit'],
          ['TaskService (controller test)', 'mockTaskService', 'Test controller chỉ kiểm tra delegation'],
        ]
      ),
      empty(),

      // ─── 5. CHI TIẾT TEST CASES ───
      h1('5. CHI TIẾT CÁC TEST CASE — TaskService (36 tests)'),

      h3('Nhóm 1: create() — Tạo task mới (4 tests)'),
      createTable(
        ['#', 'Tên test case', 'Kết quả mong đợi', 'Trạng thái'],
        [
          ['1.1', 'Tạo task thành công', 'Trả task object, position tự tăng, emit event', '✅ PASS'],
          ['1.2', 'Project không tồn tại', 'Throw NotFoundException (404)', '✅ PASS'],
          ['1.3', 'User không phải member', 'Throw ForbiddenException (403)', '✅ PASS'],
          ['1.4', 'Project chưa có task nào', 'Position = 1', '✅ PASS'],
        ]
      ),
      empty(),

      h3('Nhóm 2: findAllByProject() — Danh sách task (4 tests)'),
      createTable(
        ['#', 'Tên test case', 'Kết quả mong đợi', 'Trạng thái'],
        [
          ['2.1', 'Lấy danh sách (không filter)', 'Trả data[] + meta phân trang', '✅ PASS'],
          ['2.2', 'Filter theo status', 'WHERE chứa status: { in: [...] }', '✅ PASS'],
          ['2.3', 'Search theo title', 'WHERE chứa contains, mode: insensitive', '✅ PASS'],
          ['2.4', 'Phân trang đúng', 'skip = (page-1)*limit', '✅ PASS'],
        ]
      ),
      empty(),

      h3('Nhóm 3: findOne() — Chi tiết task (2 tests)'),
      createTable(
        ['#', 'Tên test case', 'Kết quả mong đợi', 'Trạng thái'],
        [
          ['3.1', 'Lấy chi tiết thành công', 'Trả task kèm subtasks, assignees, labels', '✅ PASS'],
          ['3.2', 'Task không tồn tại', 'Throw NotFoundException (404)', '✅ PASS'],
        ]
      ),
      empty(),

      h3('Nhóm 4: update() — Cập nhật task (3 tests)'),
      createTable(
        ['#', 'Tên test case', 'Kết quả mong đợi', 'Trạng thái'],
        [
          ['4.1', 'Cập nhật thành công', 'Trả task đã update, emit event', '✅ PASS'],
          ['4.2', 'Chuyển status DONE', 'Tự set completedAt = now()', '✅ PASS'],
          ['4.3', 'Chuyển khỏi DONE', 'Tự xóa completedAt = null', '✅ PASS'],
        ]
      ),
      empty(),

      h3('Nhóm 5: remove() — Xóa task (2 tests)'),
      createTable(
        ['#', 'Tên test case', 'Kết quả mong đợi', 'Trạng thái'],
        [
          ['5.1', 'Xóa thành công', 'Cascade delete, emit event', '✅ PASS'],
          ['5.2', 'Task không tồn tại', 'Throw NotFoundException (404)', '✅ PASS'],
        ]
      ),
      empty(),

      h3('Nhóm 6: updateStatus() — Chuyển trạng thái (2 tests)'),
      createTable(
        ['#', 'Tên test case', 'Kết quả mong đợi', 'Trạng thái'],
        [
          ['6.1', 'Chuyển status thành công', 'Trả task mới, emit events', '✅ PASS'],
          ['6.2', 'Chuyển sang DONE', 'Set completedAt = now()', '✅ PASS'],
        ]
      ),
      empty(),

      h3('Nhóm 7: assignMember() — Phân công (3 tests)'),
      createTable(
        ['#', 'Tên test case', 'Kết quả mong đợi', 'Trạng thái'],
        [
          ['7.1', 'Assign thành công', 'Trả message + assignment', '✅ PASS'],
          ['7.2', 'Target không phải member', 'Throw ForbiddenException (403)', '✅ PASS'],
          ['7.3', 'Đã assign rồi', 'Throw ConflictException (409)', '✅ PASS'],
        ]
      ),
      empty(),

      h3('Nhóm 8: unassignMember() — Hủy phân công (2 tests)'),
      createTable(
        ['#', 'Tên test case', 'Kết quả mong đợi', 'Trạng thái'],
        [
          ['8.1', 'Unassign thành công', 'Trả message', '✅ PASS'],
          ['8.2', 'Chưa assign', 'Throw NotFoundException (404)', '✅ PASS'],
        ]
      ),
      empty(),

      h3('Nhóm 9: addLabel() — Gắn nhãn (3 tests)'),
      createTable(
        ['#', 'Tên test case', 'Kết quả mong đợi', 'Trạng thái'],
        [
          ['9.1', 'Gắn label thành công', 'Trả message + taskLabel', '✅ PASS'],
          ['9.2', 'Label không thuộc workspace', 'Throw NotFoundException (404)', '✅ PASS'],
          ['9.3', 'Label đã gắn rồi', 'Throw ConflictException (409)', '✅ PASS'],
        ]
      ),
      empty(),

      h3('Nhóm 10: removeLabel() — Gỡ nhãn (2 tests)'),
      createTable(
        ['#', 'Tên test case', 'Kết quả mong đợi', 'Trạng thái'],
        [
          ['10.1', 'Gỡ label thành công', 'Trả message', '✅ PASS'],
          ['10.2', 'Label chưa gắn', 'Throw NotFoundException (404)', '✅ PASS'],
        ]
      ),
      empty(),

      h3('Nhóm 11-14: Subtask (9 tests)'),
      createTable(
        ['#', 'Tên test case', 'Kết quả mong đợi', 'Trạng thái'],
        [
          ['11.1', 'Tạo subtask, position tự tăng', 'Trả subtask, position = max + 1', '✅ PASS'],
          ['12.1', 'Toggle false → true', 'isCompleted: true', '✅ PASS'],
          ['12.2', 'Toggle true → false', 'isCompleted: false', '✅ PASS'],
          ['12.3', 'Subtask không tồn tại', 'Throw NotFoundException (404)', '✅ PASS'],
          ['12.4', 'User không phải member', 'Throw ForbiddenException (403)', '✅ PASS'],
          ['13.1', 'Danh sách subtask', 'Subtasks[] sắp theo position ASC', '✅ PASS'],
          ['14.1', 'Xóa subtask thành công', 'Trả message', '✅ PASS'],
          ['14.2', 'Subtask không tồn tại', 'Throw NotFoundException (404)', '✅ PASS'],
          ['14.3', 'User không phải member', 'Throw ForbiddenException (403)', '✅ PASS'],
        ]
      ),
      empty(),

      // ─── TaskController ───
      h1('6. CHI TIẾT CÁC TEST CASE — TaskController (14 tests)'),
      createTable(
        ['#', 'Method', 'Kiểm tra', 'Trạng thái'],
        [
          ['1', 'create()', 'userId, projectId, dto → service.create', '✅ PASS'],
          ['2', 'findAll()', 'userId, projectId, query → service.findAllByProject', '✅ PASS'],
          ['3', 'findOne()', 'userId, taskId → service.findOne', '✅ PASS'],
          ['4', 'update()', 'userId, taskId, dto → service.update', '✅ PASS'],
          ['5', 'remove()', 'userId, taskId → service.remove', '✅ PASS'],
          ['6', 'updateStatus()', 'userId, taskId, dto → service.updateStatus', '✅ PASS'],
          ['7', 'assignMember()', 'Extract dto.userId → service.assignMember', '✅ PASS'],
          ['8', 'unassignMember()', 'userId, taskId, targetUserId → service', '✅ PASS'],
          ['9', 'addLabel()', 'Extract dto.labelId → service.addLabel', '✅ PASS'],
          ['10', 'removeLabel()', 'userId, taskId, labelId → service', '✅ PASS'],
          ['11', 'createSubtask()', 'userId, taskId, dto → service.createSubtask', '✅ PASS'],
          ['12', 'findSubtasks()', 'userId, taskId → service.findSubtasks', '✅ PASS'],
          ['13', 'toggleSubtask()', 'userId, subtaskId → service.toggleSubtask', '✅ PASS'],
          ['14', 'removeSubtask()', 'userId, subtaskId → service.removeSubtask', '✅ PASS'],
        ]
      ),
      empty(),

      // ─── 7. KẾT QUẢ TỔNG HỢP ───
      h1('7. KẾT QUẢ TỔNG HỢP'),
      h2('7.1. Kết quả chạy test'),
      createTable(
        ['Chỉ số', 'Giá trị'],
        [
          ['Test Suites', '2 passed / 2 total'],
          ['Test Cases', '50 passed / 50 total'],
          ['Failures', '0'],
          ['Thời gian chạy', '~57 giây'],
        ]
      ),
      empty(),

      h2('7.2. Code Coverage (Độ phủ mã nguồn)'),
      createTable(
        ['File', '% Statements', '% Branches', '% Functions', '% Lines'],
        [
          ['task.controller.ts', '100%', '75%', '100%', '100%'],
          ['task.service.ts', '83.66%', '78.04%', '100%', '84.45%'],
          ['Trung bình', '84.15%', '77.19%', '100%', '85.49%'],
        ]
      ),
      empty(),

      // ─── 8. KẾT LUẬN ───
      h1('8. KẾT LUẬN'),
      p('Unit test cho Task Module đã được viết đầy đủ với 50 test cases bao phủ:'),
      p('• 14 chức năng của TaskService (CRUD task, filter/sort/phân trang, quản lý status, phân công thành viên, gắn/gỡ nhãn, quản lý subtask)'),
      p('• 14 endpoint của TaskController (kiểm tra delegation pattern)'),
      p('• Cả luồng thành công lẫn luồng lỗi (NotFoundException, ForbiddenException, ConflictException)'),
      p('• Tất cả 50/50 test cases đều PASS (0 failure)'),
      p('• Code coverage đạt 84.15% statements, 100% functions'),
      empty(),
      p('Kết quả cho thấy Task Module hoạt động đúng theo yêu cầu thiết kế, sẵn sàng để tích hợp với các module tiếp theo (Phase 5: RBAC + Comments, Phase 6: WebSocket).'),
    ],
  }],
});

// ═══════════════════════════════════════════════════════════════
// XUẤT FILE .DOCX
// ═══════════════════════════════════════════════════════════════
async function generate() {
  const buffer = await Packer.toBuffer(doc);
  const outputPath = 'docs/BAO_CAO_UNIT_TEST_TASK_MODULE.docx';
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Đã tạo file: ${outputPath}`);
}

generate().catch(console.error);
