<!-- Chèn vào: SAU section 4.5 (Dependency Injection), TRƯỚC bài tập Chương 4 -->

## 4.6. Lỗi thường gặp và Trade-offs

Nắm vững lý thuyết về Modules, Controllers, Services và Dependency Injection là điều kiện cần, nhưng chưa đủ để xây dựng ứng dụng NestJS hiệu quả. Trong quá trình phát triển dự án TodoList Collaboration, nhóm đã gặp phải nhiều lỗi mà tài liệu chính thức ít đề cập. Phần này tổng hợp ba vấn đề phổ biến nhất cùng giải pháp đã được kiểm chứng thực tế.

### 4.6.1. Circular Dependency — phụ thuộc vòng tròn

**Circular Dependency** xảy ra khi Module A import Module B, đồng thời Module B cũng import Module A, tạo thành vòng lặp phụ thuộc. Khi gặp tình huống này, NestJS không thể xác định thứ tự khởi tạo các module — module nào cần được tạo trước? — dẫn đến lỗi ngay khi ứng dụng khởi động.

Trong dự án TodoList Collaboration, tình huống này rất dễ xảy ra giữa `AuthModule` và `UserModule`. `AuthService` cần inject `UserService` để kiểm tra thông tin user khi đăng nhập, trong khi `UserService` có thể cần inject `AuthService` để tạo token sau khi cập nhật mật khẩu. NestJS sẽ báo lỗi với message khó hiểu:

```
Error: Nest cannot create the AuthModule instance.
The module at index [1] of the AuthModule "imports" array is undefined.
A circular dependency between modules...
```

Giải pháp tạm thời là sử dụng `forwardRef()` — một hàm của NestJS cho phép trì hoãn việc resolve reference đến khi cả hai module đều đã được khởi tạo:

```typescript
// backend/src/modules/auth/auth.module.ts
@Module({
  imports: [
    forwardRef(() => UserModule), // ← Trì hoãn resolve reference
    PassportModule,
    JwtModule.register({}),
  ],
  // ...
})
export class AuthModule {}
```

Tuy nhiên, `forwardRef()` chỉ nên là giải pháp tạm thời. Giải pháp tốt hơn là tái cấu trúc module để loại bỏ circular dependency hoàn toàn. Chẳng hạn, tách phần logic dùng chung ra một module riêng (SharedModule) hoặc sử dụng event-based communication giữa hai module. Trong dự án TodoList Collaboration, nhóm đã tránh circular dependency bằng cách để `AuthModule` tự xử lý logic liên quan đến user thông qua `PrismaService` trực tiếp, không cần import `UserModule`.

### 4.6.2. Provider không inject được — quên khai báo

Đây là lỗi phổ biến nhất với người mới học NestJS. Biểu hiện là NestJS báo không thể resolve dependency khi inject một service vào service khác. Giả sử chúng ta muốn inject `MailService` vào `AuthService` nhưng quên khai báo đúng cách, error message sẽ có dạng:

```
Nest can't resolve dependencies of the AuthService (JwtService, PrismaService, ?, ConfigService).
Please make sure that the argument MailService at index [2] is available in the AuthModule context.
```

Dấu `?` trong message chỉ ra vị trí của dependency không resolve được. Để một service có thể được inject vào module khác, ba điều kiện bắt buộc phải thỏa mãn đồng thời. Thứ nhất, service phải được đánh dấu `@Injectable()` — đây là decorator báo cho NestJS biết class này có thể tham gia vào hệ thống DI. Thứ hai, service phải được khai báo trong `exports` của module gốc — nếu không export, service chỉ có phạm vi nội bộ trong module đó. Thứ ba, module gốc phải được khai báo trong `imports` của module đích — đây là cách NestJS biết module nào cung cấp service nào.

Trong dự án TodoList Collaboration, nhóm đã cấu hình đúng cả ba điều kiện cho `MailModule`:

```typescript
// backend/src/shared/mail/mail.module.ts
@Module({
  providers: [MailService],   // Điều kiện 1: MailService có @Injectable()
  exports: [MailService],     // Điều kiện 2: Export ra ngoài
})
export class MailModule {}

// backend/src/modules/auth/auth.module.ts
@Module({
  imports: [
    MailModule,               // Điều kiện 3: Import vào AuthModule
    // ...
  ],
  providers: [AuthService],
})
export class AuthModule {}
```

Riêng `PrismaModule` được đánh dấu `@Global()`, nên không cần import ở từng module — đây là ngoại lệ duy nhất cho quy tắc trên:

```typescript
// backend/src/shared/prisma/prisma.module.ts
@Global() // ← Available toàn app, không cần import ở mỗi module
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 4.6.3. Trade-off: Provider Scope (Singleton vs Request vs Transient)

Khi đăng ký một provider trong NestJS, theo mặc định nó sẽ là **Singleton** — nghĩa là chỉ có duy nhất một instance tồn tại trong toàn bộ vòng đời của ứng dụng. Tuy nhiên, NestJS cung cấp hai scope thay thế là **Request** và **Transient**, mỗi loại phù hợp với trường hợp sử dụng khác nhau.

Bảng dưới đây so sánh chi tiết ba loại scope:

| Tiêu chí | **Singleton** (mặc định) | **Request** | **Transient** |
|----------|--------------------------|-------------|---------------|
| **Thời điểm tạo** | Một lần khi app khởi động | Mỗi HTTP request tạo instance mới | Mỗi lần inject tạo instance mới |
| **Tái sử dụng** | Tất cả request dùng chung 1 instance | Instance riêng cho từng request | Không tái sử dụng |
| **Bộ nhớ** | Tối ưu nhất | Tốn nhiều hơn | Tốn nhiều nhất |
| **Trường hợp sử dụng** | Hầu hết services (stateless) | Multi-tenant, per-request context | Logger riêng cho mỗi consumer |
| **Ảnh hưởng hiệu năng** | Không đáng kể | Đáng kể — tạo mới mỗi request | Cao — tạo mới mỗi lần inject |

Trong 99% trường hợp, **Singleton scope là lựa chọn đúng**. Các service trong dự án TodoList Collaboration — `AuthService`, `UserService`, `TaskService`, `PrismaService` — đều là stateless (không lưu trạng thái giữa các request), nên Singleton hoạt động hoàn hảo. Chỉ khi nào service cần lưu trạng thái riêng cho từng request (ví dụ: thông tin tenant trong hệ thống multi-tenant) thì mới cần cân nhắc Request scope.

Cần lưu ý một điểm quan trọng: khi một provider có Request scope, **tất cả các provider phụ thuộc vào nó cũng bị chuyển thành Request scope**. Điều này gây ra hiệu ứng dây chuyền, làm giảm hiệu năng đáng kể vì NestJS phải tạo mới hàng loạt instances cho mỗi request thay vì tái sử dụng Singleton. Do đó, trước khi đổi scope của bất kỳ provider nào, hãy cân nhắc kỹ tác động lan tỏa đến toàn bộ dependency chain.

Nắm vững cả lý thuyết lẫn các cạm bẫy thường gặp, chúng ta đã sẵn sàng thực hành xây dựng một module hoàn chỉnh.
