# Chương 10: Đánh giá và tổng kết

Chương này nhìn lại toàn bộ quá trình thực hiện đồ án, đối chiếu kết quả đạt được với mục tiêu ban đầu, phân tích các lỗi kỹ thuật đã gặp phải, và rút ra bài học kinh nghiệm từ việc làm việc thực tế với NestJS.

---

## 10.1. So sánh với mục tiêu ban đầu

Tại thời điểm bắt đầu đồ án, nhóm đã xác định 8 mục tiêu chính cần đạt được. Sau quá trình triển khai, bảng dưới đây đối chiếu từng mục tiêu với kết quả thực tế.

| # | Mục tiêu | Kết quả | Mức độ |
|---|---------|---------|-------|
| 1 | Hiểu kiến trúc NestJS: Modules, Controllers, Providers, Guards, Interceptors | Trình bày đầy đủ ở Chương 4–6, có code minh họa thực tế | Đạt |
| 2 | Nắm vững TypeScript trong môi trường Backend | Chương 4 trình bày Interface, Decorator, Generics | Đạt |
| 3 | Xây dựng RESTful API với CRUD đầy đủ | 44 endpoints hoàn chỉnh cho 5 modules | Đạt |
| 4 | Tích hợp PostgreSQL qua Prisma ORM | 17 models, 4 migrations, đầy đủ relations | Đạt |
| 5 | Triển khai Authentication và Authorization bằng JWT | JWT + Refresh Token + Token Blacklist + APP_GUARD | Vượt mục tiêu |
| 6 | Tổ chức code theo kiến trúc Modular | Cấu trúc modules/ và shared/ chuẩn | Đạt |
| 7 | So sánh NestJS với Spring Boot | Đề cập ở Chương 1 và Chương 4 (DI, Module, Decorator tương đồng) | Sơ lược |
| 8 | Triển khai Workspace, Project, Task module | Cả 3 module hoàn thành với đầy đủ CRUD | Đạt |

Nhìn chung, nhóm đã hoàn thành 7 trong 8 mục tiêu đề ra. Riêng mục tiêu so sánh NestJS với Spring Boot được đề cập ở mức sơ lược, chưa có bảng so sánh chi tiết chuyên sâu — đây là điểm có thể cải thiện trong các phiên bản tiếp theo của báo cáo. Đặc biệt, mục tiêu số 5 về Authentication không chỉ đạt mà còn vượt kỳ vọng ban đầu nhờ việc triển khai thêm cơ chế Token Blacklist, một kỹ thuật nâng cao không nằm trong kế hoạch ban đầu.

---

## 10.2. Phân tích lỗi (Bug Reports)

Trong quá trình phát triển, nhóm đã gặp phải và xử lý thành công một số lỗi đáng chú ý. Việc ghi nhận chi tiết các lỗi này không chỉ thể hiện quá trình debug thực tế mà còn cung cấp bài học có giá trị cho các dự án tương lai.

### Bug 1: JwtStrategy crash khi khởi động — "requires a secret or key"

Lỗi này thuộc mức nghiêm trọng vì gây crash toàn bộ ứng dụng ngay tại thời điểm khởi động, với thông báo lỗi:

```
TypeError: JwtStrategy requires a secret or key
    at new JwtStrategy (jwt.strategy.ts:10:5)
```

Nguyên nhân gốc rễ nằm ở thứ tự khởi tạo module: `ConfigModule` — module chịu trách nhiệm đọc file `.env` — chưa được khởi tạo trước khi `AuthModule` tạo instance của `JwtStrategy`. Kết quả là `process.env.JWT_SECRET` trả về `undefined` tại thời điểm JwtStrategy cần sử dụng.

Quá trình debug diễn ra theo ba bước. Đầu tiên, nhóm kiểm tra file `.env` và xác nhận rằng biến `JWT_SECRET` đã được khai báo đầy đủ. Tiếp theo, kiểm tra file `app.module.ts` và phát hiện `AuthModule` đứng trước `ConfigModule` trong mảng imports. Cuối cùng, di chuyển `ConfigModule.forRoot({ isGlobal: true })` lên vị trí đầu tiên để đảm bảo nó được khởi tạo trước mọi module khác:

```typescript
// Trước khi sửa — ConfigModule khởi tạo sau AuthModule
@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), ...]
})

// Sau khi sửa — ConfigModule khởi tạo đầu tiên
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, ...]
})
```

Bài học rút ra là trong NestJS, thứ tự import trong decorator `@Module` ảnh hưởng trực tiếp đến thứ tự khởi tạo. Các infrastructure modules như `ConfigModule` và `PrismaModule` luôn phải được đặt trước các feature modules trong mảng imports.

### Bug 2: Import path sai sau khi refactor cấu trúc thư mục

Lỗi này xuất hiện trong bối cảnh nhóm quyết định refactor cấu trúc thư mục từ dạng phẳng (`src/auth/`, `src/user/`...) sang dạng phân tách rõ ràng (`src/modules/`, `src/shared/`) nhằm cải thiện tổ chức code. Sau khi di chuyển files, quá trình build báo hàng chục lỗi TypeScript:

```
Cannot find module 'src/auth/guards/jwt-auth.guard'
Property 'user' does not exist on type 'PrismaService'
Module '"@prisma/client"' has no exported member 'ProjectStatus'
```

Phân tích cho thấy có ba vấn đề riêng biệt xảy ra đồng thời: các file đã được di chuyển nhưng import paths trong 12 files chưa được cập nhật tương ứng; Prisma Client chưa được regenerate sau khi `node_modules` được cài lại; và package `@sendgrid/mail` chưa được install.

Nhóm đã khắc phục bằng cách sử dụng grep để tìm tất cả import paths cũ và cập nhật chúng, chạy `npx prisma generate` để tạo lại Prisma Client, và cài đặt package còn thiếu. Bài học quan trọng nhất là khi thực hiện refactor cấu trúc thư mục ở quy mô lớn, cần kiểm tra toàn bộ import paths — đặc biệt các absolute paths dạng `src/...` — và nên chạy `npm run build` để phát hiện TypeScript errors trước khi commit.

### Bug 3: User.avatar path sai khi upload từ môi trường khác

Lỗi này thuộc mức trung bình, biểu hiện qua việc avatar upload thành công nhưng khi truy cập URL ảnh thì server trả về 404 Not Found. Nguyên nhân nằm ở cách tính đường dẫn lưu file: `UserService.uploadAvatar()` sử dụng `__dirname` để xác định thư mục lưu trữ, nhưng giá trị của `__dirname` trong môi trường development (TypeScript source) khác với môi trường production (compiled JavaScript). Cụ thể, khi chạy `npm run start:dev`, `__dirname` trỏ vào `dist/modules/user/` thay vì thư mục `backend/uploads/avatars/` mong muốn.

Giải pháp là thay thế `__dirname` bằng `process.cwd()`, hàm này luôn trả về thư mục từ đó lệnh `node` được khởi chạy, đảm bảo tính ổn định bất kể vị trí file trong cấu trúc thư mục compiled:

```typescript
const filepath = join(process.cwd(), 'uploads', 'avatars', filename);
```

---

## 10.3. Nhìn lại quá trình học NestJS

### Những điều nhóm học được ngoài kế hoạch

Bên cạnh các kiến thức kỹ thuật đã đặt ra trong kế hoạch, quá trình thực hiện đồ án đã mang lại cho nhóm nhiều bài học quý giá ngoài dự kiến.

Thứ nhất, nhóm nhận ra tầm quan trọng của việc thiết kế cấu trúc thư mục ngay từ đầu. Mặc dù NestJS không bắt buộc một cấu trúc cụ thể nào, việc tổ chức hợp lý từ ban đầu giúp tiết kiệm rất nhiều công sức refactor về sau.

Thứ hai, nhóm đã thực hành Git workflow trong môi trường làm việc nhóm thực tế, bao gồm quản lý nhiều branch, giải quyết merge conflict và tuân thủ convention commit message. Đây là kỹ năng không kém phần quan trọng so với kỹ năng viết code.

Thứ ba, việc sử dụng Docker để chạy PostgreSQL đã giải quyết triệt để vấn đề "works on my machine", đảm bảo mọi thành viên đều làm việc trên cùng một môi trường database nhất quán.

Cuối cùng, Swagger UI không chỉ phục vụ mục đích demo mà còn trở thành công cụ test API chính trong suốt quá trình phát triển, thay thế hiệu quả cho các công cụ như Postman hay Hoppscotch trong nhiều trường hợp.

### Đánh giá NestJS sau khi thực hành

Sau quá trình làm việc thực tế với NestJS, nhóm đưa ra đánh giá tổng quan về framework này. Về learning curve, NestJS đòi hỏi người học phải nắm vững các khái niệm như Dependency Injection, Decorators và Module system — cao hơn đáng kể so với Express thuần. Tuy nhiên, sau khi đã quen thuộc với các khái niệm này, năng suất phát triển rất cao nhờ CLI generate sẵn cấu trúc và convention rõ ràng.

Về tích hợp TypeScript, NestJS thể hiện xuất sắc với type safety xuyên suốt từ schema database đến response trả về. Khó khăn lớn nhất khi debug là các trường hợp DI injection fail, vì error message của NestJS đôi khi không đủ rõ ràng để xác định nguyên nhân gốc rễ.

Nhìn chung, NestJS phù hợp cho các team có convention rõ ràng và các project quy mô vừa đến lớn. So với Spring Boot — framework đã truyền cảm hứng cho thiết kế của NestJS — cả hai có kiến trúc tương đồng nhưng NestJS nhẹ hơn và có thời gian startup nhanh hơn đáng kể.
