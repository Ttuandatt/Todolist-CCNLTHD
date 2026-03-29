# Chương 8: Kiểm thử đơn vị (Unit Testing)

> **Mục tiêu chương học:** Sau khi hoàn thành chương này, bạn sẽ hiểu được tầm quan trọng của kiểm thử phần mềm, nắm vững cách sử dụng Jest và @nestjs/testing để viết unit test trong NestJS, biết cách mock các dependency thông qua Dependency Injection, và có khả năng tự viết bộ kiểm thử hoàn chỉnh cho TaskService cũng như TaskController trong dự án TodoList Collaboration.

---

## 8.1. Kiểm thử phần mềm là gì?

### 8.1.1. Định nghĩa và tầm quan trọng

Kiểm thử phần mềm (Software Testing) là quá trình đánh giá và xác minh rằng một sản phẩm phần mềm hoạt động đúng theo yêu cầu đã đặt ra. Trong suốt các chương trước, chúng ta đã xây dựng hệ thống TodoList Collaboration với đầy đủ các tính năng từ kiến trúc module (Chương 4), kết nối database (Chương 5), xử lý nâng cao với Pipes và Exception Filters (Chương 6), cho đến bảo mật với JWT Authentication (Chương 7). Tuy nhiên, việc phát triển tính năng chỉ là một nửa của quy trình phần mềm chuyên nghiệp — nửa còn lại chính là kiểm thử để đảm bảo mọi thứ hoạt động đúng đắn. Một ứng dụng không có test giống như một tòa nhà chưa qua kiểm định chất lượng: có thể trông ổn bên ngoài, nhưng tiềm ẩn những lỗi nghiêm trọng bên trong.

Kiểm thử phần mềm mang lại nhiều lợi ích thiết thực cho dự án. Thứ nhất, nó giúp phát hiện lỗi sớm trong quá trình phát triển, khi chi phí sửa chữa còn thấp — một bug được tìm ra trong giai đoạn coding rẻ hơn gấp nhiều lần so với khi đã deploy lên production. Thứ hai, bộ test đóng vai trò như tài liệu sống (living documentation) cho code, giúp các thành viên mới trong nhóm hiểu nhanh cách mỗi module hoạt động. Thứ ba, khi có bộ test đầy đủ, developer có thể tự tin refactor code mà không lo phá vỡ các tính năng hiện có, bởi test sẽ ngay lập tức báo đỏ nếu có gì sai.

### 8.1.2. Các cấp độ kiểm thử

Kiểm thử phần mềm được chia thành nhiều cấp độ, mỗi cấp độ phục vụ một mục đích khác nhau và kiểm tra ở phạm vi khác nhau. Ba cấp độ phổ biến nhất trong phát triển ứng dụng web là Unit Testing, Integration Testing, và End-to-End (E2E) Testing.

Unit Testing (Kiểm thử đơn vị) là cấp độ thấp nhất và cơ bản nhất, tập trung vào việc kiểm tra từng "đơn vị" nhỏ nhất của code một cách độc lập. Một đơn vị có thể là một function, một method trong class, hoặc một service. Điểm mấu chốt của unit test là **sự cô lập** (isolation): khi test một service, chúng ta không muốn phụ thuộc vào database thật, API bên ngoài, hay bất kỳ dependency nào khác. Thay vào đó, tất cả các dependency được thay thế bằng các đối tượng giả (mock). Ví dụ, khi test `TaskService.create()`, chúng ta không cần database thật — chỉ cần đảm bảo rằng method đó gọi đúng câu lệnh Prisma với đúng dữ liệu.

Integration Testing (Kiểm thử tích hợp) kiểm tra sự phối hợp giữa nhiều đơn vị với nhau. Ở cấp độ này, chúng ta có thể test xem TaskService và PrismaService có hoạt động đúng khi kết nối với nhau không, hoặc liệu AuthGuard có chặn đúng các request không có token hay không. Integration test thường sử dụng database thật (hoặc database test) và kiểm tra luồng dữ liệu xuyên suốt nhiều layer.

End-to-End Testing (Kiểm thử đầu cuối) mô phỏng hành vi thực tế của người dùng, gửi HTTP request thật đến ứng dụng và kiểm tra response trả về. Ví dụ, một E2E test có thể gửi POST request đến `/auth/login` với email và password, rồi kiểm tra xem response có chứa JWT token hợp lệ hay không. E2E test chạy chậm hơn nhưng mang lại độ tin cậy cao nhất vì kiểm tra toàn bộ hệ thống hoạt động như một khối thống nhất.

### 8.1.3. Kim tự tháp kiểm thử (Testing Pyramid)

Mối quan hệ giữa ba cấp độ kiểm thử được minh họa bằng khái niệm **Kim tự tháp kiểm thử** (Testing Pyramid) do Mike Cohn đề xuất. Ở đáy kim tự tháp là Unit Test — chiếm số lượng lớn nhất, chạy nhanh nhất, và chi phí thấp nhất. Tầng giữa là Integration Test — số lượng vừa phải, chạy chậm hơn do cần khởi tạo nhiều thành phần. Đỉnh kim tự tháp là E2E Test — ít nhất về số lượng, chạy chậm nhất nhưng kiểm tra toàn diện nhất.

```
        /\
       /E2E\        <-- Ít test, chạy chậm, chi phí cao
      /------\
     /Integra-\     <-- Số lượng vừa phải
    /--tion----\
   / Unit Tests \   <-- Nhiều test, chạy nhanh, chi phí thấp
  /______________\
```

Nguyên tắc của kim tự tháp là: nên viết nhiều unit test vì chúng chạy nhanh, dễ bảo trì, và cho phản hồi tức thì khi code bị lỗi. Trong chương này, chúng ta sẽ tập trung hoàn toàn vào Unit Testing — cấp độ mà mọi developer đều cần thành thạo trước khi tiến đến các cấp độ kiểm thử cao hơn.

---

## 8.2. Công cụ kiểm thử trong NestJS

### 8.2.1. Jest — Framework kiểm thử mặc định

NestJS tích hợp sẵn **Jest** làm test framework mặc định ngay từ khi khởi tạo dự án bằng Nest CLI. Jest là một framework kiểm thử JavaScript được phát triển bởi Meta (Facebook), nổi tiếng với triết lý "zero configuration" — nghĩa là hầu như không cần cấu hình gì thêm để bắt đầu viết test. Jest cung cấp đầy đủ các công cụ cần thiết trong một gói duy nhất: test runner (chạy test), assertion library (so sánh kết quả), mocking system (tạo đối tượng giả), và code coverage (đo độ phủ).

Khi tạo dự án NestJS mới, file `package.json` đã được cấu hình sẵn Jest thông qua phần `jest` configuration. Jest sẽ tự động tìm và chạy tất cả các file có đuôi `.spec.ts` hoặc `.test.ts` trong dự án. Ngoài ra, Jest hỗ trợ chế độ watch (`--watch`) để tự động chạy lại test mỗi khi file source code thay đổi, giúp developer nhận phản hồi ngay lập tức trong quá trình phát triển.

### 8.2.2. @nestjs/testing — TestingModule

Package `@nestjs/testing` cung cấp class `Test` với method `createTestingModule()`, cho phép tạo ra một module NestJS thu nhỏ dành riêng cho mục đích kiểm thử. TestingModule hoạt động giống hệt AppModule trong runtime — nó khởi tạo Dependency Injection container, resolve các provider, và inject dependency vào đúng chỗ. Điểm khác biệt duy nhất là trong TestingModule, chúng ta có thể thay thế bất kỳ provider nào bằng mock object, từ đó đạt được sự cô lập hoàn toàn cho unit test.

Cách tiếp cận này tận dụng triệt để cơ chế Dependency Injection đã được trình bày trong Chương 4. Khi TaskService yêu cầu PrismaService thông qua constructor injection, TestingModule sẽ inject mock object thay vì PrismaService thật. TaskService hoàn toàn không biết nó đang làm việc với object giả — đây chính là sức mạnh của DI trong kiểm thử.

### 8.2.3. Quy ước đặt tên file và cách chạy test

Trong NestJS, file test được đặt cạnh file source code tương ứng và tuân theo quy ước đặt tên `*.spec.ts`. Ví dụ, file test của `task.service.ts` sẽ là `task.service.spec.ts`, và chúng nằm cùng thư mục. Cách tổ chức này giúp developer dễ dàng tìm thấy file test tương ứng với mỗi file source code, đồng thời đảm bảo tính nhất quán trong toàn bộ dự án.

Để chạy test, NestJS cung cấp sẵn các npm scripts trong `package.json`:

```bash
# Chạy toàn bộ unit test
npm run test

# Chạy test ở chế độ watch — tự động chạy lại khi file thay đổi
npm run test:watch

# Chạy test và đo code coverage
npm run test:cov
```

Lệnh `npm run test` sẽ thực thi Jest, quét toàn bộ project để tìm các file `.spec.ts`, biên dịch TypeScript và chạy tất cả test case. Chế độ `test:watch` đặc biệt hữu ích trong quá trình phát triển vì nó theo dõi sự thay đổi của file và chỉ chạy lại những test liên quan, giúp tiết kiệm thời gian đáng kể so với việc chạy lại toàn bộ.

---

## 8.3. Cấu trúc một bài test

### 8.3.1. Các thành phần cơ bản

Một file test trong Jest được tổ chức theo cấu trúc phân cấp rõ ràng, bao gồm bốn thành phần chính: `describe()`, `it()` (hoặc `test()`), `expect()`, và các hook `beforeEach()` / `afterEach()`.

Hàm `describe()` đóng vai trò như một nhóm (group) chứa các test case liên quan đến cùng một chức năng hoặc một đơn vị code. Mỗi `describe()` nhận hai tham số: một chuỗi mô tả tên nhóm, và một callback function chứa các test case bên trong. Các `describe()` có thể lồng nhau (nested) để tạo cấu trúc phân cấp chi tiết hơn — ví dụ, `describe('TaskService')` bên ngoài chứa `describe('create')` và `describe('findOne')` bên trong.

Hàm `it()` (hoặc `test()` — hai hàm này hoàn toàn tương đương) định nghĩa một test case cụ thể. Mỗi `it()` mô tả một kịch bản kiểm thử duy nhất và chứa logic kiểm tra bên trong. Quy ước đặt tên phổ biến là bắt đầu bằng "should" để tạo câu đọc tự nhiên: `it('should return a task when valid ID is provided')`. Mỗi test case nên kiểm tra một và chỉ một hành vi — nguyên tắc này giúp dễ dàng xác định nguyên nhân khi test fail.

Hàm `expect()` tạo ra một assertion — phép so sánh giữa giá trị thực tế và giá trị mong đợi. Jest cung cấp nhiều matcher methods như `.toBe()` (so sánh giá trị nguyên thủy), `.toEqual()` (so sánh deep equality cho object), `.toThrow()` (kiểm tra exception), `.toHaveBeenCalledWith()` (kiểm tra mock function được gọi với tham số nào). Nếu assertion fail, Jest sẽ báo lỗi chi tiết cho biết giá trị nhận được (received) khác giá trị mong đợi (expected) ở điểm nào.

Các hook `beforeEach()` và `afterEach()` chạy tự động trước và sau mỗi test case trong cùng block `describe()`. Hook `beforeEach()` thường được sử dụng để khởi tạo TestingModule, reset mock, và chuẩn bị dữ liệu test. Hook `afterEach()` dùng để dọn dẹp tài nguyên sau mỗi test. Việc sử dụng `beforeEach()` đảm bảo mỗi test case bắt đầu với trạng thái sạch, không bị ảnh hưởng bởi test case trước đó.

### 8.3.2. Ví dụ đơn giản với hàm thuần

Trước khi đi vào kiểm thử các thành phần NestJS, hãy bắt đầu với một ví dụ đơn giản nhất: kiểm thử một hàm thuần (pure function) không có dependency nào. Giả sử trong dự án TodoList Collaboration, chúng ta có một hàm tiện ích tính tiến độ hoàn thành task dựa trên số subtask đã hoàn thành.

```typescript
// utils/task-progress.ts
export function calculateTaskProgress(
  completedSubtasks: number,
  totalSubtasks: number,
): number {
  if (totalSubtasks === 0) return 0;
  return Math.round((completedSubtasks / totalSubtasks) * 100);
}
```

Hàm `calculateTaskProgress` nhận vào số subtask đã hoàn thành và tổng số subtask, trả về phần trăm tiến độ. Đây là một hàm thuần — output chỉ phụ thuộc vào input, không có side effect — nên rất dễ viết test.

```typescript
// utils/task-progress.spec.ts
import { calculateTaskProgress } from './task-progress';

describe('calculateTaskProgress', () => {
  it('should return 0 when no subtasks exist', () => {
    const result = calculateTaskProgress(0, 0);
    expect(result).toBe(0);
  });

  it('should return percentage of completed subtasks', () => {
    const result = calculateTaskProgress(3, 10);
    expect(result).toBe(30);
  });

  it('should return 100 when all subtasks are completed', () => {
    const result = calculateTaskProgress(5, 5);
    expect(result).toBe(100);
  });

  it('should round to nearest integer', () => {
    const result = calculateTaskProgress(1, 3);
    expect(result).toBe(33);
  });
});
```

Mỗi test case trong ví dụ trên kiểm tra một kịch bản cụ thể: trường hợp không có subtask nào, trường hợp bình thường, trường hợp hoàn thành 100%, và trường hợp cần làm tròn. Lưu ý rằng tên các test case được viết mô tả rõ ràng hành vi mong đợi, giúp khi đọc output của Jest ta có thể hiểu ngay test nào pass và test nào fail mà không cần xem code. Đây là nền tảng để chúng ta tiến đến kiểm thử các thành phần phức tạp hơn trong NestJS.

---

## 8.4. Mocking và Dependency Injection trong test

### 8.4.1. Vấn đề dependency trong unit test

Trong thực tế, hầu hết các service trong NestJS đều có dependency. TaskService phụ thuộc vào PrismaService để thao tác database, AuthService phụ thuộc vào JwtService để tạo token, và các controller phụ thuộc vào service tương ứng. Nếu chúng ta sử dụng dependency thật trong unit test, nhiều vấn đề sẽ phát sinh: test cần kết nối database thật (chậm và không ổn định), kết quả test phụ thuộc vào trạng thái database (không reproducible), và một lỗi ở PrismaService sẽ khiến test của TaskService cũng fail (vi phạm nguyên tắc cô lập).

Giải pháp cho vấn đề này là **Mocking** — kỹ thuật thay thế dependency thật bằng các đối tượng giả (mock objects) mà chúng ta hoàn toàn kiểm soát được. Mock object có cùng interface với dependency thật nhưng không thực hiện logic thật. Thay vào đó, chúng ta có thể lập trình sẵn giá trị trả về cho mock, và sau đó kiểm tra xem mock có được gọi đúng cách hay không.

### 8.4.2. Jest mock functions

Jest cung cấp hàm `jest.fn()` để tạo mock function — một function giả mà Jest theo dõi toàn bộ lịch sử gọi: bao nhiêu lần được gọi, với tham số gì, và trả về giá trị nào. Ngoài ra, `jest.spyOn()` cho phép "theo dõi" một method có sẵn trên object, vừa giữ nguyên implementation gốc vừa có thể override khi cần. Hai công cụ này là nền tảng của mọi unit test trong NestJS.

Để mock PrismaService trong test của TaskService, chúng ta tạo một object có cùng cấu trúc với PrismaService nhưng tất cả các method đều là `jest.fn()`. Object này sẽ được inject vào TaskService thay cho PrismaService thật thông qua TestingModule.

```typescript
const mockPrismaService = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};
```

Đoạn code trên tạo ra một mock object mô phỏng cấu trúc của PrismaService, cụ thể là phần Prisma Client delegate cho model `task`. Mỗi method (`create`, `findMany`, `findUnique`, `update`, `delete`) đều là `jest.fn()`, nghĩa là chúng không làm gì cả khi được gọi (trả về `undefined`), nhưng Jest sẽ ghi lại mọi lần gọi để chúng ta kiểm tra sau.

### 8.4.3. Tạo TestingModule với mock dependency

Sau khi có mock object, bước tiếp theo là tạo TestingModule và đăng ký mock thay cho dependency thật. Cú pháp `{ provide: PrismaService, useValue: mockPrismaService }` yêu cầu NestJS DI container: "Khi có ai yêu cầu PrismaService, hãy trả về mockPrismaService thay vì tạo instance thật."

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);

    // Reset tất cả mock trước mỗi test
    jest.clearAllMocks();
  });
});
```

Trong đoạn code trên, `beforeEach()` đảm bảo mỗi test case đều bắt đầu với một TestingModule mới. Hàm `module.get<TaskService>(TaskService)` lấy instance của TaskService từ DI container — instance này đã được inject mockPrismaService thay vì PrismaService thật. Lệnh `jest.clearAllMocks()` rất quan trọng: nó reset lịch sử gọi của tất cả mock function, đảm bảo test case này không bị ảnh hưởng bởi các lần gọi trong test case trước.

---

## 8.5. Kiểm thử Service

### 8.5.1. Thiết lập file test cho TaskService

Với kiến thức về mocking và TestingModule, bây giờ chúng ta sẽ viết bộ test hoàn chỉnh cho TaskService — service chính quản lý Task trong dự án TodoList Collaboration. File test sẽ kiểm tra các method: `create()`, `findAll()`, `findOne()`, và `update()`.

Đầu tiên, chúng ta thiết lập cấu trúc cơ bản của file test, bao gồm import các module cần thiết, tạo mock PrismaService, và khởi tạo TestingModule trong `beforeEach()`.

```typescript
// task/task.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });
```

Phần thiết lập này tái sử dụng kỹ thuật đã trình bày ở mục 8.4. Biến `service` chứa instance TaskService cần test, và biến `prisma` chứa mock PrismaService để chúng ta có thể lập trình hành vi và kiểm tra lịch sử gọi.

### 8.5.2. Test method create()

Method `create()` của TaskService nhận vào userId, projectId, và DTO chứa thông tin task, sau đó gọi `prisma.task.create()` để lưu vào database. Unit test cần xác minh hai điều: method trả về đúng kết quả, và `prisma.task.create()` được gọi với đúng dữ liệu.

```typescript
  describe('create', () => {
    it('should create a task and return it', async () => {
      const createTaskDto = {
        title: 'Viet bao cao chuong 8',
        priority: 'HIGH',
      };
      const expectedTask = {
        id: 'uuid-1',
        title: 'Viet bao cao chuong 8',
        priority: 'HIGH',
        status: 'TODO',
        createdById: 'user-id',
        projectId: 'project-id',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(prisma.task, 'create').mockResolvedValue(expectedTask as any);

      const result = await service.create(
        'user-id',
        'project-id',
        createTaskDto,
      );

      expect(result).toEqual(expectedTask);
      expect(prisma.task.create).toHaveBeenCalledTimes(1);
      expect(prisma.task.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: 'Viet bao cao chuong 8',
          createdById: 'user-id',
          projectId: 'project-id',
        }),
      });
    });
  });
```

Trong test case trên, `jest.spyOn(prisma.task, 'create').mockResolvedValue(expectedTask)` lập trình cho mock: khi `prisma.task.create()` được gọi, nó sẽ trả về một Promise resolve thành `expectedTask`. Sau khi gọi `service.create()`, chúng ta sử dụng ba assertion: `expect(result).toEqual(expectedTask)` kiểm tra giá trị trả về đúng, `toHaveBeenCalledTimes(1)` xác nhận mock chỉ được gọi đúng một lần, và `toHaveBeenCalledWith()` kiểm tra tham số truyền vào có chứa đúng dữ liệu. Matcher `expect.objectContaining()` cho phép kiểm tra một phần của object — rất hữu ích khi object thực tế có thể chứa thêm các field như `createdAt` mà chúng ta không muốn kiểm tra cứng.

### 8.5.3. Test method findAll()

Method `findAll()` trả về danh sách tất cả task trong một project. Test case cần xác minh rằng method gọi `prisma.task.findMany()` và trả về đúng mảng kết quả.

```typescript
  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const expectedTasks = [
        { id: 'uuid-1', title: 'Task 1', status: 'TODO' },
        { id: 'uuid-2', title: 'Task 2', status: 'IN_PROGRESS' },
      ];

      jest
        .spyOn(prisma.task, 'findMany')
        .mockResolvedValue(expectedTasks as any);

      const result = await service.findAll('project-id');

      expect(result).toEqual(expectedTasks);
      expect(prisma.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            projectId: 'project-id',
          }),
        }),
      );
    });

    it('should return empty array when no tasks exist', async () => {
      jest.spyOn(prisma.task, 'findMany').mockResolvedValue([]);

      const result = await service.findAll('project-id');

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
```

Ở test case thứ hai, chúng ta kiểm tra trường hợp biên (edge case) khi project chưa có task nào. Việc test cả trường hợp bình thường lẫn trường hợp biên giúp đảm bảo method xử lý đúng trong mọi tình huống. Assertion `toHaveLength(0)` là cách tường minh để xác nhận mảng trả về thực sự rỗng.

### 8.5.4. Test method findOne()

Method `findOne()` là trường hợp thú vị vì nó có hai nhánh logic: trả về task khi tìm thấy, hoặc throw `NotFoundException` khi task không tồn tại. Chúng ta cần viết test case cho cả hai nhánh.

```typescript
  describe('findOne', () => {
    it('should return a task when found', async () => {
      const expectedTask = {
        id: 'uuid-1',
        title: 'Task 1',
        status: 'TODO',
      };

      jest
        .spyOn(prisma.task, 'findUnique')
        .mockResolvedValue(expectedTask as any);

      const result = await service.findOne('uuid-1');

      expect(result).toEqual(expectedTask);
      expect(prisma.task.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
    });

    it('should throw NotFoundException when task does not exist', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
```

Lưu ý cú pháp đặc biệt khi test exception trong async function: `await expect(service.findOne(...)).rejects.toThrow(NotFoundException)`. Phần `.rejects` cho Jest biết Promise sẽ bị reject, và `.toThrow(NotFoundException)` kiểm tra rằng lỗi ném ra là đúng loại `NotFoundException`. Đây là pattern quan trọng vì trong NestJS, các HTTP exception như `NotFoundException` sẽ tự động được chuyển thành response 404 bởi Exception Filter mặc định (đã trình bày ở Chương 6).

### 8.5.5. Test method update()

Method `update()` nhận vào taskId và DTO chứa dữ liệu cần cập nhật, sau đó gọi `prisma.task.update()`. Chúng ta cần kiểm tra rằng method truyền đúng tham số cho Prisma.

```typescript
  describe('update', () => {
    it('should update and return the modified task', async () => {
      const updateTaskDto = { title: 'Updated title', status: 'DONE' };
      const updatedTask = {
        id: 'uuid-1',
        title: 'Updated title',
        status: 'DONE',
        updatedAt: new Date(),
      };

      jest
        .spyOn(prisma.task, 'findUnique')
        .mockResolvedValue({ id: 'uuid-1' } as any);
      jest
        .spyOn(prisma.task, 'update')
        .mockResolvedValue(updatedTask as any);

      const result = await service.update('uuid-1', updateTaskDto);

      expect(result).toEqual(updatedTask);
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
        data: expect.objectContaining({
          title: 'Updated title',
          status: 'DONE',
        }),
      });
    });

    it('should throw NotFoundException when updating non-existent task', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('non-existent-id', { title: 'New title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
```

Test case thứ hai cho `update()` xác minh rằng khi cố cập nhật task không tồn tại, method sẽ throw NotFoundException thay vì gọi `prisma.task.update()`. Điều này đảm bảo service thực hiện validation trước khi thao tác database — đây là best practice trong mọi ứng dụng backend.

---

## 8.6. Kiểm thử Controller

### 8.6.1. Sự khác biệt giữa test Service và test Controller

Kiểm thử Controller khác biệt cơ bản so với kiểm thử Service ở chỗ: trong test Controller, chúng ta mock Service thay vì mock database layer. Controller chỉ đóng vai trò "người điều phối" — nhận request, gọi service tương ứng, và trả về response. Do đó, unit test cho Controller chỉ cần xác minh rằng Controller gọi đúng method của Service với đúng tham số, chứ không cần kiểm tra logic nghiệp vụ (vì logic đó thuộc về Service và đã được test riêng).

Cách tiếp cận này tuân theo nguyên tắc Single Responsibility: mỗi layer chỉ test trách nhiệm của chính nó. Controller test kiểm tra "routing" và "parameter passing", Service test kiểm tra "business logic", và nếu có Integration test thì sẽ kiểm tra sự phối hợp giữa các layer.

### 8.6.2. Thiết lập và viết test cho TaskController

Để test TaskController, chúng ta tạo TestingModule với TaskController là controller và mock TaskService là provider. Mock TaskService chứa các mock function tương ứng với mỗi method của service thật.

```typescript
// task/task.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should call taskService.create with correct params', async () => {
      const dto = { title: 'Test task', priority: 'MEDIUM' };
      const userId = 'user-123';
      const projectId = 'project-456';
      const expectedResult = { id: 'uuid-1', ...dto, status: 'TODO' };

      mockTaskService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(userId, projectId, dto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(userId, projectId, dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should call taskService.findAll and return tasks', async () => {
      const projectId = 'project-456';
      const expectedTasks = [
        { id: 'uuid-1', title: 'Task 1' },
        { id: 'uuid-2', title: 'Task 2' },
      ];

      mockTaskService.findAll.mockResolvedValue(expectedTasks);

      const result = await controller.findAll(projectId);

      expect(result).toEqual(expectedTasks);
      expect(service.findAll).toHaveBeenCalledWith(projectId);
    });
  });

  describe('findOne', () => {
    it('should call taskService.findOne with task ID', async () => {
      const taskId = 'uuid-1';
      const expectedTask = { id: taskId, title: 'Task 1', status: 'TODO' };

      mockTaskService.findOne.mockResolvedValue(expectedTask);

      const result = await controller.findOne(taskId);

      expect(result).toEqual(expectedTask);
      expect(service.findOne).toHaveBeenCalledWith(taskId);
    });
  });
});
```

Trong đoạn code trên, mỗi test case của Controller đều theo cùng một pattern: chuẩn bị dữ liệu đầu vào, lập trình mock service trả về giá trị mong muốn, gọi method của controller, và kiểm tra kết quả cùng lịch sử gọi service. Pattern này nhất quán và dễ mở rộng khi thêm các endpoint mới. Lưu ý rằng chúng ta không test logic nghiệp vụ ở đây — ví dụ, không kiểm tra NotFoundException vì đó là trách nhiệm của Service layer.

---

## 8.7. Đo độ phủ kiểm thử (Code Coverage)

### 8.7.1. Code Coverage là gì?

Code Coverage (Độ phủ code) là một chỉ số đo lường tỷ lệ code đã được thực thi trong quá trình chạy test. Chỉ số này giúp developer xác định những phần code nào chưa được test, từ đó bổ sung test case cho phù hợp. Jest tích hợp sẵn công cụ đo coverage dựa trên Istanbul, cho phép tạo báo cáo chi tiết mà không cần cài đặt thêm gì.

Coverage được đo theo bốn tiêu chí khác nhau, mỗi tiêu chí phản ánh một khía cạnh riêng của mức độ kiểm thử. Bảng sau tóm tắt ý nghĩa của từng tiêu chí:

| Tiêu chí | Ý nghĩa | Ví dụ |
|-----------|----------|-------|
| Statements (% Stmts) | Tỷ lệ câu lệnh đã được thực thi | Mỗi dòng code đơn lẻ |
| Branches (% Branch) | Tỷ lệ nhánh điều kiện đã được kiểm tra | Cả nhánh `if` lẫn `else` |
| Functions (% Funcs) | Tỷ lệ hàm đã được gọi | Mỗi method trong service |
| Lines (% Lines) | Tỷ lệ dòng code đã được thực thi | Tương tự Statements nhưng tính theo dòng vật lý |

### 8.7.2. Cách chạy và đọc báo cáo Coverage

Để tạo báo cáo coverage, chúng ta chạy lệnh `npm run test:cov`. Jest sẽ thực thi toàn bộ test, đồng thời theo dõi những dòng code nào được chạy qua và những dòng nào bị bỏ qua. Sau khi hoàn tất, Jest in ra bảng tổng hợp trên terminal.

```
-----------------------|---------|----------|---------|---------|-------------------
File                   | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------|---------|----------|---------|---------|-------------------
All files              |   87.50 |    75.00 |   91.67 |   85.71 |
 task/                 |         |          |         |         |
  task.service.ts      |   85.71 |    66.67 |     100 |   83.33 | 45-48
  task.controller.ts   |     100 |      100 |     100 |     100 |
 prisma/               |         |          |         |         |
  prisma.service.ts    |     100 |      100 |     100 |     100 |
-----------------------|---------|----------|---------|---------|-------------------
```

Bảng trên cho thấy `task.controller.ts` đạt 100% ở mọi tiêu chí — tất cả code trong controller đã được test. Trong khi đó, `task.service.ts` có Branch coverage chỉ 66.67%, nghĩa là có một nhánh điều kiện chưa được kiểm tra. Cột "Uncovered Line #s" chỉ rõ dòng 45-48 chưa được chạy qua — developer cần xem lại những dòng này và viết thêm test case phù hợp.

Ngoài bảng trên terminal, Jest còn tạo thư mục `coverage/` chứa báo cáo HTML chi tiết. Mở file `coverage/lcov-report/index.html` trong trình duyệt sẽ thấy giao diện trực quan với code được đánh dấu màu: xanh cho dòng đã được test, đỏ cho dòng chưa test. Đây là công cụ rất hữu ích để review coverage một cách trực quan.

### 8.7.3. Ngưỡng Coverage hợp lý

Một câu hỏi thường gặp là: bao nhiêu phần trăm coverage là đủ? Trong thực tế, ngưỡng 70-80% được coi là hợp lý cho hầu hết các dự án. Ngưỡng này đảm bảo phần lớn logic quan trọng đã được kiểm thử, đồng thời không tạo áp lực quá lớn lên developer phải viết test cho những đoạn code trivial.

Theo đuổi 100% coverage không phải lúc nào cũng là mục tiêu đúng đắn. Một số đoạn code rất khó test nhưng lại đơn giản đến mức không cần test — ví dụ getter/setter đơn thuần hoặc constructor chỉ gán giá trị. Việc ép viết test cho những đoạn code như vậy tốn thời gian mà không mang lại giá trị thực sự. Quan trọng hơn số phần trăm là **chất lượng** test: một bộ test 70% coverage nhưng kiểm tra đúng các business logic quan trọng và edge case sẽ có giá trị hơn nhiều so với bộ test 100% coverage nhưng chỉ kiểm tra happy path.

---

## 8.8. Bài tập ứng dụng — Viết Unit Test cho TaskService

### 8.8.1. Yêu cầu bài tập

Dựa trên kiến thức đã học trong chương này, hãy viết bộ unit test hoàn chỉnh cho TaskService bao gồm bốn method chính: `create()`, `findAll()`, `update()`, và `delete()`. Mỗi method cần có ít nhất hai test case: một cho trường hợp thành công (happy path) và một cho trường hợp lỗi (error case).

### 8.8.2. Hướng dẫn thực hiện

**Bước 1:** Tạo file `task.service.spec.ts` trong thư mục `src/task/` (nếu chưa có).

**Bước 2:** Thiết lập TestingModule với mock PrismaService theo cấu trúc đã trình bày ở mục 8.4.

**Bước 3:** Viết các test case theo danh sách sau:

```typescript
// task/task.service.spec.ts — Bài tập hoàn chỉnh
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrismaService = {
  task: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('TaskService', () => {
  let service: TaskService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  // Test 1: create — trường hợp thành công
  describe('create', () => {
    it('should create and return a new task', async () => {
      const dto = { title: 'Bài tập chương 8', priority: 'HIGH' };
      const expected = { id: 'uuid-1', ...dto, status: 'TODO' };
      jest.spyOn(prisma.task, 'create').mockResolvedValue(expected as any);

      const result = await service.create('user-1', 'project-1', dto);

      expect(result).toEqual(expected);
      expect(prisma.task.create).toHaveBeenCalledTimes(1);
    });
  });

  // Test 2: findAll — trường hợp có dữ liệu và không có dữ liệu
  describe('findAll', () => {
    it('should return array of tasks for a project', async () => {
      const tasks = [{ id: '1', title: 'Task A' }];
      jest.spyOn(prisma.task, 'findMany').mockResolvedValue(tasks as any);

      const result = await service.findAll('project-1');

      expect(result).toEqual(tasks);
    });

    it('should return empty array when project has no tasks', async () => {
      jest.spyOn(prisma.task, 'findMany').mockResolvedValue([]);

      const result = await service.findAll('project-1');

      expect(result).toHaveLength(0);
    });
  });

  // Test 3: update — thành công và thất bại
  describe('update', () => {
    it('should update and return modified task', async () => {
      const updated = { id: 'uuid-1', title: 'Updated', status: 'DONE' };
      jest
        .spyOn(prisma.task, 'findUnique')
        .mockResolvedValue({ id: 'uuid-1' } as any);
      jest.spyOn(prisma.task, 'update').mockResolvedValue(updated as any);

      const result = await service.update('uuid-1', { title: 'Updated' });

      expect(result.title).toBe('Updated');
    });

    it('should throw NotFoundException for non-existent task', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(null);

      await expect(
        service.update('fake-id', { title: 'X' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // Test 4: delete — thành công và thất bại
  describe('delete', () => {
    it('should delete and return the task', async () => {
      const task = { id: 'uuid-1', title: 'To delete' };
      jest
        .spyOn(prisma.task, 'findUnique')
        .mockResolvedValue(task as any);
      jest.spyOn(prisma.task, 'delete').mockResolvedValue(task as any);

      const result = await service.remove('uuid-1');

      expect(result).toEqual(task);
      expect(prisma.task.delete).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
    });

    it('should throw NotFoundException when deleting non-existent task', async () => {
      jest.spyOn(prisma.task, 'findUnique').mockResolvedValue(null);

      await expect(service.remove('fake-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
```

### 8.8.3. Kết quả mong đợi

Sau khi hoàn thành bài tập và chạy `npm run test`, kết quả mong đợi sẽ hiển thị như sau:

```
 PASS  src/task/task.service.spec.ts
  TaskService
    create
      ✓ should create and return a new task (15 ms)
    findAll
      ✓ should return array of tasks for a project (3 ms)
      ✓ should return empty array when project has no tasks (2 ms)
    update
      ✓ should update and return modified task (4 ms)
      ✓ should throw NotFoundException for non-existent task (3 ms)
    delete
      ✓ should delete and return the task (3 ms)
      ✓ should throw NotFoundException when deleting non-existent task (2 ms)

Test Suites: 1 passed, 1 total
Tests:       7 passed, 7 total
Snapshots:   0 total
Time:        2.847 s
```

Tất cả 7 test case đều pass (dấu tích xanh), nghĩa là TaskService xử lý đúng cả trường hợp thành công lẫn trường hợp lỗi. Thời gian chạy chỉ khoảng 3 giây — minh chứng cho ưu điểm tốc độ của unit test so với integration test hay E2E test.

---

## 8.9. Tổng kết

Trong chương này, chúng ta đã tìm hiểu toàn bộ quy trình kiểm thử đơn vị trong NestJS, từ lý thuyết đến thực hành. Chúng ta bắt đầu với các khái niệm nền tảng về kiểm thử phần mềm, hiểu được sự khác biệt giữa ba cấp độ kiểm thử (Unit, Integration, E2E) và tại sao unit test nằm ở đáy kim tự tháp kiểm thử với số lượng nhiều nhất. Tiếp theo, chúng ta làm quen với bộ công cụ Jest và @nestjs/testing — hai thành phần cốt lõi để viết test trong hệ sinh thái NestJS.

Phần trọng tâm của chương là kỹ thuật Mocking — cách thay thế dependency thật bằng đối tượng giả để đạt được sự cô lập trong unit test. Thông qua TestingModule và cơ chế Dependency Injection, việc mock dependency trong NestJS trở nên tự nhiên và trực quan. Chúng ta đã áp dụng kỹ thuật này để viết bộ test hoàn chỉnh cho TaskService (kiểm tra business logic) và TaskController (kiểm tra lớp điều phối HTTP), bao phủ cả trường hợp thành công lẫn trường hợp lỗi.

Cuối cùng, chúng ta học cách đo code coverage để đánh giá mức độ kiểm thử, với nguyên tắc rằng 70-80% là ngưỡng hợp lý cho hầu hết dự án, và chất lượng test quan trọng hơn số lượng. Với kiến thức về kiểm thử, chúng ta đã hoàn thành toàn bộ nền tảng kỹ thuật cần thiết. Phần tiếp theo sẽ áp dụng tất cả vào việc phân tích, thiết kế và triển khai đồ án TodoList Collaboration.
