<!-- Chèn vào: SAU bài tập Chương 6, cuối chương -->

## 6.7. Tổng kết

Chương này đã trình bày ba cơ chế quan trọng giúp NestJS kiểm soát dữ liệu đầu vào, chuẩn hóa đầu ra, và xử lý file upload. **Pipes** đóng vai trò trạm kiểm soát chất lượng — `ValidationPipe` kết hợp `class-validator` tự động validate mọi request body theo DTO trước khi dữ liệu chạm đến business logic, đảm bảo rằng controller và service chỉ nhận dữ liệu đã được xác minh. **Interceptors** hoạt động ở cả hai chiều request và response — `TransformResponseInterceptor` wrap tất cả response thành format chuẩn `{ success, data, timestamp }`, trong khi `LoggingInterceptor` đo thời gian xử lý từng request, cung cấp dữ liệu quan trọng cho việc giám sát hiệu năng.

**Multer** bổ sung khả năng xử lý file upload — một nhu cầu phổ biến mà NestJS không cung cấp sẵn. Thông qua `FileInterceptor` và `ParseFilePipe`, quá trình validate và lưu trữ file được tích hợp vào kiến trúc NestJS một cách tự nhiên, với cấu hình tập trung tại `multer.config.ts` và static serving qua `useStaticAssets()`. Kết hợp với `HttpExceptionFilter` cho error handling, hệ thống có cơ chế phản hồi nhất quán cho cả trường hợp thành công lẫn thất bại.

Phần trade-offs đã chỉ ra rằng không phải lúc nào `ValidationPipe` global cũng phù hợp, và việc tách riêng Interceptor (success) với ExceptionFilter (error) là thiết kế đúng đắn theo Single Responsibility Principle. API đã có validation đầu vào, response chuẩn hóa, file upload — nhưng bất kỳ ai cũng có thể truy cập. Chương tiếp theo sẽ bảo vệ các endpoint bằng JWT Authentication.
