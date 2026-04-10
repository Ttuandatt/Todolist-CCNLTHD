<!-- THAY TOÀN BỘ Chương 11: Đánh giá và tổng kết -->

# Chương 11: Đánh giá và tổng kết

> **Mục tiêu chương học:** Sau khi hoàn thành chương này, người đọc sẽ đánh giá được mức độ hoàn thành các mục tiêu đề ra ban đầu, nhận diện các lỗi kỹ thuật thường gặp khi làm việc với NestJS, và rút ra bài học kinh nghiệm từ quá trình phát triển thực tế.

Chương này nhìn lại toàn bộ quá trình thực hiện đồ án, đối chiếu kết quả đạt được với mục tiêu ban đầu, phân tích các lỗi kỹ thuật đã gặp phải, và rút ra bài học kinh nghiệm từ việc làm việc thực tế với NestJS.

---

## 11.1. So sánh với mục tiêu ban đầu

Tại thời điểm bắt đầu đồ án, nhóm đã xác định 8 mục tiêu chính cần đạt được (theo **Phần 1, mục 2**). Sau quá trình triển khai, bảng dưới đây đối chiếu từng mục tiêu với kết quả thực tế.

| # | Mục tiêu | Kết quả thực tế | Mức độ |
|---|---------|-----------------|--------|
| 1 | Hiểu kiến trúc NestJS: Modules, Controllers, Providers, Guards, Interceptors | Trình bày đầy đủ ở Chương 4–6, có code minh họa từ dự án thật | **Đạt** |
| 2 | Nắm vững TypeScript trong môi trường Backend | Chương 4 trình bày Interface, Decorator, Generics; TypeScript xuyên suốt toàn bộ codebase | **Đạt** |
| 3 | Xây dựng RESTful API với CRUD đầy đủ | 44 endpoints hoàn chỉnh cho 7 modules (Auth, User, Workspace, Project, Task, Comment, Notification) | **Đạt** |
| 4 | Tích hợp PostgreSQL qua Prisma ORM | 17 models với đầy đủ relations, index, enum; 4 migrations thành công | **Đạt** |
| 5 | Triển khai Authentication và Authorization bằng JWT | JWT + Refresh Token Rotation + Token Blacklist + Global APP_GUARD + @Public() decorator | **Vượt** |
| 6 | Tổ chức code theo kiến trúc Modular | Cấu trúc `modules/` và `shared/` chuẩn, tách biệt feature và infrastructure | **Đạt** |
| 7 | So sánh NestJS với Spring Boot | Đề cập ở Chương 1 (nguồn cảm hứng) và Chương 4 (DI, Module, Decorator tương đồng) | **Sơ lược** |
| 8 | Triển khai Workspace, Project, Task module | Cả 3 module hoàn thành với đầy đủ CRUD, filter, pagination, assign, labels | **Đạt** |

Nhìn chung, nhóm đã hoàn thành 7 trong 8 mục tiêu đề ra. Riêng mục tiêu so sánh NestJS với Spring Boot được đề cập ở mức sơ lược — nhóm đã chỉ ra sự tương đồng về kiến trúc (DI, Module system, Decorator/Annotation) nhưng chưa có bảng so sánh chi tiết chuyên sâu về hiệu năng hay tính năng cụ thể. Đây là điểm có thể cải thiện trong các phiên bản tiếp theo của báo cáo.

Đặc biệt, mục tiêu số 5 về Authentication không chỉ đạt mà còn vượt kỳ vọng ban đầu. Kế hoạch ban đầu chỉ yêu cầu JWT cơ bản, nhưng nhóm đã triển khai thêm cơ chế Token Blacklist — lưu token bị vô hiệu hóa vào bảng `InvalidatedToken` và kiểm tra mỗi request trong `JwtStrategy.validate()` — đảm bảo logout có hiệu lực tức thì thay vì phải chờ token hết hạn.

---

## 11.2. Phân tích lỗi (Bug Reports)

Trong quá trình phát triển, nhóm đã gặp phải và xử lý thành công một số lỗi đáng chú ý. Việc ghi nhận chi tiết các lỗi này không chỉ thể hiện quá trình debug thực tế mà còn cung cấp bài học có giá trị cho các dự án tương lai.

### Bug 1: JwtStrategy crash khi khởi động — "requires a secret or key"

Lỗi này thuộc mức nghiêm trọng vì gây crash toàn bộ ứng dụng ngay tại thời điểm khởi động, với thông báo lỗi:

```
TypeError: JwtStrategy requires a secret or key
    at new JwtStrategy (jwt.strategy.ts:10:5)
```

Nguyên nhân gốc rễ nằm ở thứ tự khởi tạo module: `ConfigModule` — module chịu trách nhiệm đọc file `.env` — chưa được khởi tạo trước khi `AuthModule` tạo instance của `JwtStrategy`. Kết quả là `process.env.JWT_SECRET` trả về `undefined` tại thời điểm JwtStrategy cần sử dụng.

Quá trình debug diễn ra theo ba bước. Đầu tiên, nhóm kiểm tra file `.env` và xác nhận rằng biến `JWT_SECRET` đã được khai báo đầy đủ. Tiếp theo, kiểm tra file `app.module.ts` và phát hiện `AuthModule` đứng trước `ConfigModule` trong mảng imports. Cuối cùng, di chuyển `ConfigModule.forRoot({ isGlobal: true })` lên vị trí đầu tiên:

```typescript
// Trước khi sửa — ConfigModule khởi tạo SAU AuthModule
@Module({
  imports: [AuthModule, ConfigModule.forRoot({ isGlobal: true }), ...]
})

// Sau khi sửa — ConfigModule khởi tạo ĐẦU TIÊN
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, ...]
})
```

Thêm vào đó, nhóm đã bổ sung kiểm tra tường minh trong constructor của `JwtStrategy` để throw error message rõ ràng hơn thay vì để Passport báo lỗi khó hiểu:

```typescript
// backend/src/modules/auth/strategies/jwt.strategy.ts
constructor(private prisma: PrismaService, private config: ConfigService) {
  const secret = config.get<string>('JWT_SECRET');
  if (!secret) {
    throw new Error('JWT_SECRET is not defined. Set JWT_SECRET in .env or environment.');
  }
  // ...
}
```

Bài học rút ra là trong NestJS, thứ tự import trong decorator `@Module` ảnh hưởng trực tiếp đến thứ tự khởi tạo. Các infrastructure modules như `ConfigModule` và `PrismaModule` luôn phải được đặt trước các feature modules trong mảng imports.

### Bug 2: Import path sai hàng loạt sau refactor thư mục

Lỗi này xuất hiện trong bối cảnh nhóm quyết định refactor cấu trúc thư mục từ dạng phẳng (`src/auth/`, `src/user/`...) sang dạng phân tách rõ ràng (`src/modules/auth/`, `src/shared/prisma/`...) nhằm cải thiện tổ chức code. Sau khi di chuyển files, quá trình build báo hàng chục lỗi TypeScript:

```
Cannot find module 'src/auth/guards/jwt-auth.guard'
Property 'user' does not exist on type 'PrismaService'
Module '"@prisma/client"' has no exported member 'ProjectStatus'
```

Phân tích cho thấy có ba vấn đề riêng biệt xảy ra đồng thời. Thứ nhất, các file đã được di chuyển nhưng import paths trong 12 files chưa được cập nhật tương ứng — các absolute paths dạng `src/auth/...` trỏ đến vị trí cũ không còn tồn tại. Thứ hai, Prisma Client chưa được regenerate sau khi `node_modules` được cài lại, khiến TypeScript không tìm thấy các types đã export từ `@prisma/client`. Thứ ba, package `@sendgrid/mail` chưa được install do lúc refactor cũng đổi mail provider.

Nhóm đã khắc phục bằng ba bước: sử dụng grep để tìm tất cả import paths cũ (`grep -r "src/auth" --include="*.ts"`) và cập nhật thành paths mới, chạy `npx prisma generate` để tạo lại Prisma Client, và cài đặt packages còn thiếu. Bài học quan trọng nhất là khi thực hiện refactor cấu trúc thư mục ở quy mô lớn, cần chạy `npm run build` ngay sau khi di chuyển files để TypeScript compiler phát hiện toàn bộ broken imports, thay vì để lỗi tích tụ.

### Bug 3: Avatar path sai khi chạy compiled JavaScript

Lỗi này thuộc mức trung bình, biểu hiện qua việc avatar upload thành công nhưng khi truy cập URL ảnh thì server trả về 404 Not Found. Nguyên nhân nằm ở cách tính đường dẫn lưu file.

Ban đầu, code sử dụng `__dirname` để xác định thư mục lưu trữ:

```typescript
// ❌ SAI — __dirname khác nhau giữa dev và production
const filepath = join(__dirname, '..', '..', 'uploads', 'avatars', filename);
```

Vấn đề là giá trị của `__dirname` trong môi trường development (TypeScript source) khác với môi trường production (compiled JavaScript). Khi chạy `npm run start:dev`, `__dirname` trỏ vào `dist/modules/user/` thay vì thư mục gốc mong muốn. Kết quả là file được lưu ở vị trí sai, và `useStaticAssets()` không tìm thấy file để serve.

Giải pháp hiện tại trong code sử dụng `process.cwd()`:

```typescript
// backend/src/modules/user/user.service.ts
// ✅ ĐÚNG — process.cwd() luôn trả về thư mục nơi lệnh node được chạy
const oldPath = join(process.cwd(), 'uploads', 'avatars', user.avatar);
```

`process.cwd()` luôn trả về thư mục từ đó lệnh `node` được khởi chạy (thường là `backend/`), đảm bảo đường dẫn chính xác bất kể file nguồn nằm ở đâu trong cấu trúc compiled.

---

## 11.3. Nhìn lại quá trình học NestJS

### Những điều nhóm học được ngoài kế hoạch

Bên cạnh các kiến thức kỹ thuật đã đặt ra trong kế hoạch, quá trình thực hiện đồ án đã mang lại cho nhóm bốn bài học quý giá ngoài dự kiến.

Thứ nhất, nhóm nhận ra tầm quan trọng của việc **thiết kế cấu trúc thư mục ngay từ đầu**. Mặc dù NestJS không bắt buộc một cấu trúc cụ thể nào, việc tổ chức hợp lý từ ban đầu — phân tách `modules/` cho feature code và `shared/` cho infrastructure — giúp tiết kiệm rất nhiều công sức refactor về sau. Bug 2 ở trên là minh chứng rõ ràng cho hậu quả của việc không quy hoạch sớm.

Thứ hai, nhóm đã thực hành **Git workflow** trong môi trường làm việc nhóm thực tế, bao gồm quản lý branch `main`/`develop`, giải quyết merge conflict, và tuân thủ convention commit message. Đây là kỹ năng không kém phần quan trọng so với kỹ năng viết code.

Thứ ba, việc sử dụng **Docker để chạy PostgreSQL** đã giải quyết triệt để vấn đề "works on my machine". Mọi thành viên chạy cùng một Docker image PostgreSQL, đảm bảo version, encoding, và cấu hình hoàn toàn nhất quán.

Cuối cùng, **Swagger UI** không chỉ phục vụ mục đích demo mà còn trở thành công cụ test API chính trong suốt quá trình phát triển. NestJS tự động generate documentation từ decorators trên controller và DTO, giúp tài liệu API luôn đồng bộ với code — điều mà Postman hay Hoppscotch không thể đảm bảo.

### Đánh giá NestJS sau khi thực hành

Sau quá trình làm việc thực tế với NestJS, nhóm đưa ra đánh giá tổng quan qua sáu khía cạnh:

| Khía cạnh | Đánh giá | Ghi chú |
|-----------|----------|---------|
| **Learning curve** | Trung bình-Cao | Cần nắm DI, Decorators, Module system trước khi productive |
| **Năng suất phát triển** | Cao | Sau khi quen, CLI generate + convention giúp viết code rất nhanh |
| **TypeScript integration** | Xuất sắc | Type safety xuyên suốt từ schema DB (Prisma) đến API response |
| **Debug khó khăn** | Trung bình | DI injection fail có error message đôi khi không rõ ràng |
| **Phù hợp cho** | Team có convention, project vừa-lớn | Không phù hợp cho prototype nhanh hay project 1 file |
| **So với Spring Boot** | Kiến trúc tương đồng | NestJS nhẹ hơn, startup nhanh hơn, nhưng ecosystem nhỏ hơn |

Về learning curve, NestJS đòi hỏi người học phải nắm vững các khái niệm trừu tượng như Dependency Injection, Decorators và Module system — cao hơn đáng kể so với Express thuần, nơi chỉ cần hiểu middleware pattern là đủ. Tuy nhiên, khoản đầu tư ban đầu này được đền đáp xứng đáng: sau khi đã quen thuộc, năng suất phát triển rất cao nhờ CLI scaffolding và convention rõ ràng.

So với Spring Boot — framework đã truyền cảm hứng cho thiết kế của NestJS — cả hai chia sẻ kiến trúc tương đồng với Controller-Service pattern, DI container, và module system. NestJS có ưu thế về thời gian startup nhanh hơn và footprint nhỏ hơn, trong khi Spring Boot có ecosystem phong phú hơn với hàng nghìn Spring Starter packages cho mọi nhu cầu enterprise.
