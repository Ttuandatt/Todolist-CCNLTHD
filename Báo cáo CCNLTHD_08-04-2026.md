**[ỦY BAN NHÂN DÂN THÀNH PHỐ HỒ CHÍ MINH]{.smallcaps}**

**TRƯỜNG ĐẠI HỌC SÀI GÒN**

**˗˗˗˗˗˗˗˗˗˗˗🙢🕮🙠˗˗˗˗˗˗˗˗˗˗˗**![A blue circle with white text Description
automatically generated](media/image1.png){width="2.591666666666667in"
height="2.433333333333333in"}

**BÁO CÁO CUỐI KỲ**

**HỌC PHẦN: CÁC CÔNG NGHỆ LẬP TRÌNH HIỆN ĐẠI**

**TÌM HIỂU VỀ CÔNG NGHỆ NESTJS**

  ------------------------ ------------------------
  **Mã học phần**          **841072**

  **Nhóm**                 **24**

  **GVHD**                 **Phạm Thi Vương**

  **Danh sách thành        
  viên:**                  

  **3122410490**           **Nguyễn Hoàng Mai Vy**

  **3122410156**           **Trần Khánh Huyền**

  **3122410076**           **Phan Cảnh Tuấn Đạt**

  **3122560057**           **Huỳnh Văn Phú**
  ------------------------ ------------------------

**TP. HỒ CHÍ MINH THÁNG 3 NĂM 2026**

**Lời mở đầu**

Trong bối cảnh cuộc Cách mạng công nghiệp 4.0, lĩnh vực Công nghệ thông
tin nói chung và phát triển phần mềm nói riêng đang chứng kiến những
bước tiến vượt bậc với tốc độ thay đổi nhanh chóng. Đối với lập trình
ứng dụng Web, yêu cầu đặt ra không chỉ dừng lại ở việc hệ thống hoạt
động được, mà còn phải đáp ứng các tiêu chuẩn khắt khe về hiệu năng,
tính bảo mật, khả năng mở rộng và cấu trúc mã nguồn bền vững.

Là những sinh viên chuẩn bị bước vào môi trường làm việc chuyên nghiệp,
nhóm chúng em nhận thức rõ tầm quan trọng của việc không ngừng cập nhật
và làm chủ các công nghệ mới. Bên cạnh những nền tảng đã khẳng định được
vị thế như Java Spring Boot hay .NET, hệ sinh thái Node.js đang vươn lên
mạnh mẽ và trở thành một phần không thể thiếu trong bức tranh công nghệ
toàn cầu.

Chính vì lý do đó, trong khuôn khổ môn học \"Các công nghệ lập trình
hiện đại\", nhóm quyết định lựa chọn đề tài \"Tìm hiểu và ứng dụng công
nghệ NestJS\". Đây không chỉ là cơ hội để chúng tôi tiếp cận với một
framework tiên tiến, được mệnh danh là giải pháp kiến trúc chuẩn mực cho
Node.js, mà còn là dịp để rèn luyện tư duy thiết kế hệ thống, tư duy lập
trình đa ngôn ngữ và kỹ năng làm việc nhóm.

Cuốn báo cáo này là kết quả của quá trình tìm hiểu lý thuyết, nghiên cứu
tài liệu và nỗ lực thực hành xây dựng ứng dụng thực tế của tập thể nhóm.
Mặc dù đã cố gắng hoàn thiện tốt nhất trong khả năng và phạm vi thời
gian cho phép, song chắc chắn báo cáo không thể tránh khỏi những thiếu
sót. Chúng em rất mong nhận được những ý kiến đóng góp quý báu từ Thầy
để đề tài được hoàn thiện hơn, cũng như để chúng em rút ra những bài học
kinh nghiệm quý giá cho chặng đường phát triển nghề nghiệp sắp tới.

**\**

**Mục lục**

[**Phần 1. Giới thiệu** 1](#phần-1.-giới-thiệu)

> [**1.** **Lý do chọn đề tài** 1](#lý-do-chọn-đề-tài)
>
> [**2.** **Mục tiêu của đề tài** 1](#mục-tiêu-của-đề-tài)
>
> [**3.** **Phạm vi báo cáo** 2](#phạm-vi-báo-cáo)
>
> [**4.** **Cấu trúc báo cáo** 3](#cấu-trúc-báo-cáo)

[**Phần 2: Tổng quan về công nghệ NESTJS**
4](#phần-2-tổng-quan-về-công-nghệ-nestjs)

> [**Chương 1: Giới thiệu chung** 4](#chương-1-giới-thiệu-chung)
>
> [1.1. Khái quát về NestJS 4](#khái-quát-về-nestjs)
>
> [1.1.1. Sự phát triển của Node.js 4](#sự-phát-triển-của-node.js)
>
> [1.1.2. Hạn chế của các framework tối giản
> 4](#hạn-chế-của-các-framework-tối-giản)
>
> [1.1.3. Nhu cầu về một framework có kiến trúc
> 5](#nhu-cầu-về-một-framework-có-kiến-trúc)
>
> [1.2. NestJS - Giải pháp cho Backend có tổ chức
> 6](#nestjs---giải-pháp-cho-backend-có-tổ-chức)
>
> [1.2.1. Định nghĩa và Đặc điểm 6](#định-nghĩa-và-đặc-điểm)
>
> [1.2.2. Triết lý thiết kế 6](#triết-lý-thiết-kế)
>
> [1.2.3. Nguồn cảm hứng từ Angular và Spring Boot
> 7](#nguồn-cảm-hứng-từ-angular-và-spring-boot)
>
> [1.3. Lịch sử hình thành và phát triển
> 7](#lịch-sử-hình-thành-và-phát-triển)
>
> [1.3.1. Tác giả và Quá trình ra đời 7](#tác-giả-và-quá-trình-ra-đời)
>
> [1.3.2. Các mốc phiên bản quan trọng 8](#các-mốc-phiên-bản-quan-trọng)
>
> [1.4. Hệ sinh thái NestJS 9](#hệ-sinh-thái-nestjs)
>
> [1.4.1. Công cụ và Thư viện chính thức
> 9](#công-cụ-và-thư-viện-chính-thức)
>
> [1.4.2. Cộng đồng và Mức độ phổ biến
> 10](#cộng-đồng-và-mức-độ-phổ-biến)
>
> [1.5. Tổng kết 11](#tổng-kết)
>
> [**Chương 2: Cơ hội nghề nghiệp và thị trường**
> 12](#chương-2-cơ-hội-nghề-nghiệp-và-thị-trường)
>
> [2.1. Các vị trí công việc liên quan
> 12](#các-vị-trí-công-việc-liên-quan)
>
> [2.2. Nhu cầu tuyển dụng và Xu hướng thị trường
> 12](#nhu-cầu-tuyển-dụng-và-xu-hướng-thị-trường)

[**Phần 3: Nội dung cốt lõi và thực hành**
14](#phần-3-nội-dung-cốt-lõi-và-thực-hành)

> [**Chương 3: Cài đặt môi trường và khởi tạo dự án**
> 14](#chương-3-cài-đặt-môi-trường-và-khởi-tạo-dự-án)
>
> [3.1. Các công cụ được sử dụng và hướng dẫn cài đặt
> 14](#các-công-cụ-được-sử-dụng-và-hướng-dẫn-cài-đặt)
>
> [3.1.1. Node.js và npm 14](#node.js-và-npm)
>
> [3.1.2. NestJS CLI 15](#nestjs-cli)
>
> [3.1.3. PostgreSQL (Khởi chạy qua Docker)
> 15](#postgresql-khởi-chạy-qua-docker)
>
> [3.2. Khởi tạo dự án NestJS 19](#khởi-tạo-dự-án-nestjs)
>
> [3.2.1. Tạo project mới 19](#tạo-project-mới)
>
> [3.2.2. Kiểm tra hoạt động 20](#kiểm-tra-hoạt-động)
>
> [3.2.3. Sử dụng NestJS CLI để generate components
> 20](#sử-dụng-nestjs-cli-để-generate-components)
>
> [3.2.3.1. Generate Module, Controller, Service
> 20](#generate-module-controller-service)
>
> [3.2.3.2. Các lệnh generate phổ biến 21](#các-lệnh-generate-phổ-biến)
>
> [3.3. Giải thích cấu trúc thư mục 22](#giải-thích-cấu-trúc-thư-mục)
>
> [3.4. Bài tập ứng dụng - Khởi tạo project Todolist Collaboration
> 23](#bài-tập-ứng-dụng---khởi-tạo-project-todolist-collaboration)
>
> [3.4.1. Mục tiêu 23](#mục-tiêu)
>
> [3.4.2. Mô tả bài tập 23](#mô-tả-bài-tập)
>
> [3.4.3. Code minh họa 23](#code-minh-họa)
>
> [3.4.4. Kết quả đạt được 27](#kết-quả-đạt-được)
>
> [**Chương 4: Các khái niệm cơ bản của kiến trúc NestJS**
> 28](#chương-4-các-khái-niệm-cơ-bản-của-kiến-trúc-nestjs)
>
> [4.1. TypeScript - Nền tảng xây dựng
> 28](#typescript---nền-tảng-xây-dựng)
>
> [4.1.1. TypeScript là gì? 28](#typescript-là-gì)
>
> [4.1.2. Hệ thống kiểu dữ liệu cơ bản
> 28](#hệ-thống-kiểu-dữ-liệu-cơ-bản)
>
> [4.1.3. Interface và Type Alias 29](#interface-và-type-alias)
>
> [4.1.5. Generics cơ bản 32](#generics-cơ-bản)
>
> [4.2. Modules -- Đơn vị tổ chức code 33](#modules-đơn-vị-tổ-chức-code)
>
> [4.2.1. Module là gì? 33](#module-là-gì)
>
> [4.2.2. Tính đóng gói (Encapsulation) và cấu trúc \@Module decorator
> 35](#tính-đóng-gói-encapsulation-và-cấu-trúc-module-decorator)
>
> [4.2.3. Module types 36](#module-types)
>
> [4.2.3.1. Feature Module 36](#feature-module)
>
> [4.2.3.2. Shared Module 37](#shared-module)
>
> [4.2.3.3. Core Module (Root Module) 38](#core-module-root-module)
>
> [4.2.3.4. Dynamic Module 39](#dynamic-module)
>
> [4.3. Controllers - Xử lý HTTP Requests
> 39](#controllers---xử-lý-http-requests)
>
> [4.3.1. Controller là gì? 40](#controller-là-gì)
>
> [4.3.2 HTTP Method Decorators 41](#http-method-decorators)
>
> [4.3.3. Request Data Decorators 42](#request-data-decorators)
>
> [4.4. Providers & Services - Business Logic
> 43](#providers-services---business-logic)
>
> [4.4.1. Provider là gì? 43](#provider-là-gì)
>
> [4.4.2 \@Injectable decorator 43](#injectable-decorator)
>
> [4.5. Dependency Injection 45](#dependency-injection)
>
> [4.5.1 DI là gì? 45](#di-là-gì)
>
> [4.5.2 Cách hoạt động 46](#cách-hoạt-động)
>
> [4.5.3 Lợi ích của DI 48](#lợi-ích-của-di)
>
> [4.5.4. Quản lý Vòng đời (Lifecycle) tự động thông qua Hooks
> 50](#quản-lý-vòng-đời-lifecycle-tự-động-thông-qua-hooks)
>
> [4.6. Bài tập ứng dụng - Xây dựng Module Student với dữ liệu mô phỏng
> 51](#bài-tập-ứng-dụng---xây-dựng-module-student-với-dữ-liệu-mô-phỏng)
>
> [4.6.1. Mục tiêu 51](#mục-tiêu-1)
>
> [4.6.2. Mô tả bài tập 51](#mô-tả-bài-tập-1)
>
> [4.6.3 Code minh họa 52](#code-minh-họa-1)
>
> [4.6.4. Kết quả đạt được 58](#kết-quả-đạt-được-1)
>
> [4.7. Tổng kết 58](#tổng-kết-1)
>
> [**Chương 5: Làm việc với dữ liệu và Database (TypeORM/ Prisma)**
> 59](#chương-5-làm-việc-với-dữ-liệu-và-database-typeorm-prisma)
>
> [5.1 ORM là gì? Tại sao chọn Prisma?
> 59](#orm-là-gì-tại-sao-chọn-prisma)
>
> [5.1.1 ORM (Object-Relational Mapping)
> 59](#orm-object-relational-mapping)
>
> [5.1.2 Các ORM phổ biến trong Node.js
> 61](#các-orm-phổ-biến-trong-node.js)
>
> [5.1.2.1. TypeORM 61](#typeorm)
>
> [5.1.2.2. Prisma 62](#prisma)
>
> [5.1.2.3. Sequelize 63](#sequelize)
>
> [5.1.2.4. MikroORM 64](#mikroorm)
>
> [5.1.2.5. Mongoose (dành cho MongoDB) 65](#mongoose-dành-cho-mongodb)
>
> [5.1.2.6. Lựa chọn ORM cho đề tài 66](#lựa-chọn-orm-cho-đề-tài)
>
> [5.1.3. Kiến trúc và Workflow của Prisma
> 68](#kiến-trúc-và-workflow-của-prisma)
>
> [5.2. Cài đặt và Cấu hình Prisma 69](#cài-đặt-và-cấu-hình-prisma)
>
> [5.2.1. Cài đặt Dependencies 69](#cài-đặt-dependencies)
>
> [5.2.2. Khởi tạo Prisma 70](#khởi-tạo-prisma)
>
> [5.2.3. Cấu hình Database Connection
> 70](#cấu-hình-database-connection)
>
> [5.3. Schema Definition 70](#schema-definition)
>
> [5.3.1. Cấu trúc file schema.prisma 70](#cấu-trúc-file-schema.prisma)
>
> [5.3.2. Định nghĩa Models và Field Types
> 71](#định-nghĩa-models-và-field-types)
>
> [5.3.3. Định nghĩa Enums 72](#định-nghĩa-enums)
>
> [5.4. Relations (Quan hệ giữa các Models)
> 73](#relations-quan-hệ-giữa-các-models)
>
> [5.4.1. One-to-Many (1-N) 73](#one-to-many-1-n)
>
> [5.4.2. Many-to-Many (N-N) 74](#many-to-many-n-n)
>
> [5.4.3. One-to-One (1-1) 75](#one-to-one-1-1)
>
> [5.4.4. Self-Relation (Quan hệ đệ quy)
> 76](#self-relation-quan-hệ-đệ-quy)
>
> [5.5. Migrations 76](#migrations)
>
> [5.5.1. Tạo Migration trong Development
> 77](#tạo-migration-trong-development)
>
> [5.5.2. Workflow Migration chuẩn 77](#workflow-migration-chuẩn)
>
> [5.5.3. Apply Migration trong Production
> 78](#apply-migration-trong-production)
>
> [5.5.4. Các lệnh Migration bổ trợ 78](#các-lệnh-migration-bổ-trợ)
>
> [5.6. CRUD Operations 78](#crud-operations)
>
> [5.6.1. Create (Tạo mới) 78](#create-tạo-mới)
>
> [5.6.2. Read (Đọc dữ liệu) 79](#read-đọc-dữ-liệu)
>
> [5.6.3. Update (Cập nhật) 81](#update-cập-nhật)
>
> [5.6.4. Delete (Xóa) 82](#delete-xóa)
>
> [5.7. Advanced Queries 83](#advanced-queries)
>
> [5.7.1. Filtering với nhiều điều kiện
> 83](#filtering-với-nhiều-điều-kiện)
>
> [5.7.2. Aggregation 83](#aggregation)
>
> [5.7.3. Transactions 84](#transactions)
>
> [5.8. Tích hợp Prisma với NestJS 84](#tích-hợp-prisma-với-nestjs)
>
> [5.8.1. Tạo Prisma Service 84](#tạo-prisma-service)
>
> [5.8.2. Tạo Prisma Module 85](#tạo-prisma-module)
>
> [5.8.3. Sử dụng trong Service 86](#sử-dụng-trong-service)
>
> [5.9. Bài tập ứng dụng: Kết nối Database và CRUD User với Prisma
> 88](#bài-tập-ứng-dụng-kết-nối-database-và-crud-user-với-prisma)
>
> [5.9.1. Mục tiêu 88](#mục-tiêu-2)
>
> [5.9.2. Mô tả bài tập 89](#mô-tả-bài-tập-2)
>
> [5.9.3. Code minh họa 89](#code-minh-họa-2)
>
> [5.9.4. Kết quả đạt được 99](#kết-quả-đạt-được-2)
>
> [5.10. Tổng kết 100](#tổng-kết-2)
>
> [**Chương 6: Các kỹ thuật nâng cao**
> 100](#chương-6-các-kỹ-thuật-nâng-cao)
>
> [6.1. Request Lifecycle trong NestJS
> 100](#request-lifecycle-trong-nestjs)
>
> [6.2. Pipes -- Validation và Transformation
> 102](#pipes-validation-và-transformation)
>
> [6.2.1. Pipe là gì? 102](#pipe-là-gì)
>
> [6.2.2. ValidationPipe -- Validate dữ liệu tự động
> 102](#validationpipe-validate-dữ-liệu-tự-động)
>
> [6.2.3. Áp dụng vào CreateTaskDto 103](#áp-dụng-vào-createtaskdto)
>
> [6.2.4. ParseUUIDPipe -- Validate tham số URL
> 105](#parseuuidpipe-validate-tham-số-url)
>
> [6.3. Interceptors -- Xử lý Response và Cross-cutting Concerns
> 105](#interceptors-xử-lý-response-và-cross-cutting-concerns)
>
> [6.3.1. Interceptor là gì? 105](#interceptor-là-gì)
>
> [6.3.2. Transform Response Interceptor
> 106](#transform-response-interceptor)
>
> [6.4. Bài tập ứng dụng: Validation, Response chuẩn hóa và Exception
> Filter
> 107](#bài-tập-ứng-dụng-validation-response-chuẩn-hóa-và-exception-filter)
>
> [6.4.1. Mục tiêu 107](#mục-tiêu-3)
>
> [6.4.2. Mô tả bài tập 107](#mô-tả-bài-tập-3)
>
> [6.4.3. Code minh họa 108](#code-minh-họa-3)
>
> [6.4.4. Kết quả đạt được 115](#kết-quả-đạt-được-3)
>
> [**Chương 7: Authentication & Authorization (Bảo mật)**
> 116](#chương-7-authentication-authorization-bảo-mật)
>
> [7.1. Cơ sở lý thuyết 116](#cơ-sở-lý-thuyết)
>
> [7.1.1. Authentication và Authorization
> 116](#authentication-và-authorization)
>
> [7.1.2. JWT (JSON Web Token) 116](#jwt-json-web-token)
>
> [7.2. Triển khai Hệ thống Xác thực (Auth Module)
> 117](#triển-khai-hệ-thống-xác-thực-auth-module)
>
> [7.3. Xây dựng Auth Module 118](#xây-dựng-auth-module)
>
> [7.3.1. Cấu hình Auth Module 118](#cấu-hình-auth-module)
>
> [7.3.2. Data Transfer Objects (DTOs) cho Authentication
> 120](#data-transfer-objects-dtos-cho-authentication)
>
> [7.3.3. Auth Service -- Logic xác thực
> 121](#auth-service-logic-xác-thực)
>
> [7.3.4. Cung cấp API Endpoints (Auth Controller)
> 123](#cung-cấp-api-endpoints-auth-controller)
>
> [7.4. Lớp Rào Chắn Bảo Vệ Hệ Thống (Guards & Strategy)
> 126](#lớp-rào-chắn-bảo-vệ-hệ-thống-guards-strategy)
>
> [7.4.1. JWT Strategy (Bộ giải mã Token)
> 126](#jwt-strategy-bộ-giải-mã-token)
>
> [7.4.2. JwtAuthGuard & Custom Decorator
> 129](#jwtauthguard-custom-decorator)
>
> [7.4.3. Áp dụng vào thực tế (Bảo vệ TaskController)
> 130](#áp-dụng-vào-thực-tế-bảo-vệ-taskcontroller)
>
> [7.5. Bài tập ứng dụng: Bảo vệ API với JWT Authentication
> 133](#bài-tập-ứng-dụng-bảo-vệ-api-với-jwt-authentication)
>
> [7.5.1. Mục tiêu 133](#mục-tiêu-4)
>
> [7.5.2. Mô tả bài tập 133](#mô-tả-bài-tập-4)
>
> [7.5.3. Code minh họa 134](#code-minh-họa-4)
>
> [7.5.4. Kết quả đạt được 150](#kết-quả-đạt-được-4)
>
> [7.6. Tổng kết luồng hoạt động (Workflow Lifecycle)
> 151](#tổng-kết-luồng-hoạt-động-workflow-lifecycle)
>
> [7.7. Kết luận & Hướng phát triển 151](#kết-luận)
>
> [**Chương 8: Kiểm thử đơn vị (Unit Testing)**
> 152](#chương-8-kiểm-thử-đơn-vị-unit-testing)
>
> [8.1. Kiểm thử phần mềm là gì? 152](#kiểm-thử-phần-mềm-là-gì)
>
> [8.1.1. Định nghĩa và tầm quan trọng
> 152](#định-nghĩa-và-tầm-quan-trọng)
>
> [8.1.2. Các cấp độ kiểm thử 152](#các-cấp-độ-kiểm-thử)
>
> [8.1.3. Kim tự tháp kiểm thử (Testing Pyramid)
> 153](#kim-tự-tháp-kiểm-thử-testing-pyramid)
>
> [8.2. Công cụ kiểm thử trong NestJS
> 154](#công-cụ-kiểm-thử-trong-nestjs)
>
> [8.2.1. Jest --- Framework kiểm thử mặc định
> 154](#jest-framework-kiểm-thử-mặc-định)
>
> [8.2.2. \@nestjs/testing --- TestingModule
> 155](#nestjstesting-testingmodule)
>
> [8.2.3. Quy ước đặt tên file và cách chạy test
> 155](#quy-ước-đặt-tên-file-và-cách-chạy-test)
>
> [8.3. Cấu trúc một bài test 156](#cấu-trúc-một-bài-test)
>
> [8.3.1. Các thành phần cơ bản 156](#các-thành-phần-cơ-bản)
>
> [8.3.2. Ví dụ đơn giản với hàm thuần
> 157](#ví-dụ-đơn-giản-với-hàm-thuần)
>
> [8.4. Mocking và Dependency Injection trong test
> 158](#mocking-và-dependency-injection-trong-test)
>
> [8.4.1. Vấn đề dependency trong unit test
> 158](#vấn-đề-dependency-trong-unit-test)
>
> [8.4.2. Jest mock functions 159](#jest-mock-functions)
>
> [8.4.3. Tạo TestingModule với mock dependency
> 160](#tạo-testingmodule-với-mock-dependency)
>
> [8.5.2. Test method create() 162](#test-method-create)
>
> [8.5.3. Test method findAll() 164](#test-method-findall)
>
> [8.5.5. Test method update() 166](#test-method-update)
>
> [8.6. Kiểm thử Controller 167](#kiểm-thử-controller)
>
> [8.6.1. Sự khác biệt giữa test Service và test Controller
> 167](#sự-khác-biệt-giữa-test-service-và-test-controller)
>
> [8.7. Đo độ phủ kiểm thử (Code Coverage)
> 169](#đo-độ-phủ-kiểm-thử-code-coverage)
>
> [8.7.1. Code Coverage là gì? 169](#code-coverage-là-gì)
>
> [8.7.3. Ngưỡng Coverage hợp lý 171](#ngưỡng-coverage-hợp-lý)
>
> [8.8. Bài tập ứng dụng --- Viết Unit Test cho TaskService
> 171](#bài-tập-ứng-dụng-viết-unit-test-cho-taskservice)
>
> [8.8.1. Yêu cầu bài tập 171](#yêu-cầu-bài-tập)
>
> [8.8.2. Hướng dẫn thực hiện 171](#hướng-dẫn-thực-hiện)
>
> [8.8.3. Kết quả mong đợi 175](#_heading=h.j6t93nf5sr9n)
>
> [8.9. Tổng kết 175](#tổng-kết-3)

[**Phần 4: Xây dựng đồ án tổng hợp**
176](#phần-4-xây-dựng-đồ-án-tổng-hợp)

> [**Chương 9: Phân tích và Thiết kế hệ thống (sơ lược)**
> 176](#chương-9-phân-tích-và-thiết-kế-hệ-thống-sơ-lược)
>
> [9.1. Tổng quan dự án 176](#tổng-quan-dự-án)
>
> [9.1.1. Giới thiệu 176](#giới-thiệu)
>
> [9.1.2. Các module chức năng 176](#các-module-chức-năng)
>
> [9.2. Kiến trúc hệ thống 178](#kiến-trúc-hệ-thống)
>
> [9.2.1. Kiến trúc module 178](#kiến-trúc-module)
>
> [9.2.2. Sơ đồ phụ thuộc giữa các module
> 178](#sơ-đồ-phụ-thuộc-giữa-các-module)
>
> [9.3. Thiết kế cơ sở dữ liệu 179](#thiết-kế-cơ-sở-dữ-liệu)
>
> [9.3.1. Tổng quan schema 179](#tổng-quan-schema)
>
> [9.3.2. Biểu đồ quan hệ thực thể (ERD)
> 179](#biểu-đồ-quan-hệ-thực-thể-erd)
>
> [9.5. Biểu đồ tuần tự các chức năng chính
> 180](#biểu-đồ-tuần-tự-các-chức-năng-chính)
>
> [9.5.1. Đăng ký tài khoản (Register)
> 180](#đăng-ký-tài-khoản-user-registration)
>
> [9.5.2. Đăng nhập (Login) 181](#đăng-nhập-user-login)
>
> [9.5.3. Đăng nhập OAuth qua Google/GitHub (OAuth login Google/GitHub)
> 182](#_heading=h.xcy4kt5xgwte)
>
> [9.5.4. Quên mật khẩu (Forgot password) 183](#refresh-token)
>
> [9.5.5. Đặt lại mật khẩu (Reset password) 183](#forgot-password)
>
> [9.5.6. Làm mới mã thông báo (Refresh token) 184](#reset-password)
>
> [9.5.7. Xem hồ sơ (View profile) 184](#logout)
>
> [9.5.8. Cập nhật hồ sơ (Update profile)
> 184](#cập-nhật-hồ-sơ-update-profile)
>
> [9.5.9. Đổi mật khẩu (Change password)
> 185](#đổi-mật-khẩu-change-password)
>
> [9.5.10. Tải Avatar lên (Upload Avatar) 185](#_heading=h.da8tc918ve90)
>
> [9.5.11. Tạo Workspace 186](#upload-avatar)
>
> [9.5.12. Danh sách Workspaces 186](#create-workspace)
>
> [9.5.13. Mời thành viên (Invite members) 186](#list-workspaces)
>
> [9.5.14. Chấp nhận lời mời (Accept invitation)
> 187](#get-workspace-detail)
>
> [9.5.15. Cập nhật vai trò thành viên (Update member role)
> 187](#update-workspace)
>
> [9.5.16. Xóa thành viên (Remove member) 187](#delete-workspace)
>
> [9.5.17. Tạo Project 188](#invite-member-to-workspace)
>
> [9.5.18. Xem Project 188](#accept-workspace-invitation)
>
> [9.5.19. Lưu trữ/ Không lưu trữ Project 188](#get-workspace-members)
>
> [9.5.20. Tạo Task 189](#change-member-role)
>
> [9.5.21. Cập nhật Task 189](#remove-member)
>
> [9.5.22. Thay đổi trạng thái Task dạng kéo thả 190](#leave-workspace)
>
> [9.5.23. Giao các Task 190](#create-project)
>
> [9.5.24. Xóa các Task 190](#list-projects-in-workspace)
>
> [9.5.25. Quản lý các nhiệm vụ con (Manager subtasks)
> 191](#get-project-detail)
>
> [9.5.26. Thêm/ Xóa nhãn (Add/ Remove labels) 191](#update-project)
>
> [9.5.27. Quản lý các tác vụ 191](#delete-project)
>
> [9.5.28. Thêm bình luận (Add comment) 192](#archive-project)
>
> [9.5.29. Trả lời bình luận (Reply comment) 192](#unarchive-project)
>
> [9.5.30. Sửa/ Xóa bình luận (Edit/ Delete comment) 193](#pin-project)
>
> [9.5.31. Xem thông báo (View notifications) 193](#unpin-project)
>
> [9.5.32. Đánh dấu đã đọc (Mark as read) 194](#create-task)
>
> [9.5.33. Đánh dấu tất cả đọc (Mark all as read)
> 194](#list-task-in-project)
>
> [9.5.34. Gửi thông báo 194](#get-task-detail)
>
> [9.5.35. Tải tệp đính kèm (Upload attachment) 195](#update-task)
>
> [9.5.36. Xóa tệp đính kèm (Delete attachment) 195](#delete-task)
>
> [**Chương 10: Triển khai chi tiết** 195](#_heading=h.og19023r9ivh)
>
> [10.1. Cấu trúc thư mục dự án: Giải thích ý nghĩa các thư mục, file
> quan trọng. 195](#_heading=h.k8ryy01fm11c)
>
> [10.2. Hướng dẫn cài đặt và chạy: Các bước để người khác có thể chạy
> được đồ án trên máy của họ. 195](#_heading=h.lqjh1hg9zrfn)
>
> [10.3. Demo sản phẩm: 195](#_heading=h.89v024mr7w0t)

[**Phần 5: Tổng kết** 196](#phần-5-tổng-kết)

> [**Chương 11: Đánh giá và tổng kết**
> 196](#chương-11-đánh-giá-và-tổng-kết)
>
> [**Chương 12: Hướng phát triển trong tương lai**
> 196](#chương-12-hướng-phát-triển-trong-tương-lai)
>
> [**Tài liệu tham khảo** 197](#tài-liệu-tham-khảo)
>
> [**Phụ lục** 198](#phụ-lục)

# **Phần 1. Giới thiệu**

## **1.** **Lý do chọn đề tài**

> Trong kỷ nguyên phát triển mạnh mẽ của các ứng dụng Web hiện đại, hệ
> sinh thái Node.js đã vươn lên trở thành một trong những nền tảng phổ
> biến nhất cho lập trình phía Server (Backend). Tuy nhiên, sự linh hoạt
> quá mức của Node.js thuần (hoặc các framework như Express) thường dẫn
> đến vấn đề về quản lý cấu trúc code (Architecture) khi dự án mở rộng
> quy mô (Scaling), dễ dẫn đến tình trạng \"Spaghetti code\" khó bảo
> trì.
>
> Nhóm chọn tìm hiểu **NestJS** vì đây là một framework mã nguồn mở mang
> tính đột phá, được thiết kế để xây dựng các ứng dụng phía server hiệu
> quả và dễ mở rộng. NestJS giải quyết triệt để bài toán về kiến trúc
> trong Node.js bằng cách kết hợp sức mạnh của **TypeScript**, lập trình
> hướng đối tượng (OOP), lập trình hàm (FP) và lập trình phản ứng (FRP).
>
> Về mặt định hướng cá nhân, việc tìm hiểu NestJS là bước đi chiến lược
> cần thiết. NestJS có nhiều điểm tương đồng với Spring Boot (như cơ chế
> Dependency Injection, Decorators/Annotations, và cấu trúc Module).
> Việc làm chủ NestJS không chỉ giúp các thành viên trong nhóm mở rộng
> tư duy đa ngôn ngữ (Polyglot Programming) mà còn trang bị thêm một
> công cụ mạnh mẽ để đáp ứng nhu cầu tuyển dụng Fullstack/Backend ngày
> càng cao của thị trường, đặc biệt là trong các dự án yêu cầu hiệu năng
> cao và kiến trúc Microservices.

## **2.** **Mục tiêu của đề tài**

> Báo cáo này được thực hiện với nhiều mục tiêu cụ thể, bao gồm cả khía
> cạnh lý thuyết, thực hành và tư duy phát triển phần mềm.
>
> Về mặt lý thuyết, mục tiêu đầu tiên là giúp người đọc hiểu rõ kiến
> trúc và nguyên lý hoạt động của NestJS. Framework này được xây dựng
> trên nền tảng nhiều thành phần cốt lõi như Modules (đơn vị tổ chức
> code), Controllers (xử lý routing và request), Providers (cung cấp các
> services và dependencies), Guards (kiểm soát quyền truy cập), và
> Interceptors (can thiệp vào luồng request/response). Bên cạnh đó, báo
> cáo cũng hướng đến việc giúp người đọc nắm vững cách áp dụng
> TypeScript - ngôn ngữ lập trình strongly-typed - trong môi trường
> Backend, từ đó tận dụng được các lợi ích về type safety và khả năng
> bảo trì code.
>
> Về mặt thực hành, mục tiêu cốt lõi là xây dựng thành công một ứng dụng
> RESTful API hoàn chỉnh. Ứng dụng này sẽ bao gồm đầy đủ các chức năng
> thiết yếu của một hệ thống backend hiện đại: các thao tác CRUD
> (Create - tạo mới, Read - đọc dữ liệu, Update - cập nhật, và Delete -
> xóa), hệ thống xác thực và phân quyền người dùng (Authentication &
> Authorization) để đảm bảo an toàn cho API, cùng với việc tích hợp kết
> nối cơ sở dữ liệu thông qua ORM (Object-Relational Mapping) như Prisma
> để thao tác với data một cách type-safe và hiệu quả.
>
> Về mặt tư duy phát triển phần mềm, báo cáo hướng đến việc rèn luyện
> khả năng tổ chức mã nguồn theo kiến trúc Modular - một cách tiếp cận
> giúp chia nhỏ ứng dụng thành các module độc lập, dễ quản lý. Đồng
> thời, việc tuân thủ các nguyên tắc Clean Code sẽ giúp code sạch sẽ, dễ
> đọc và dễ bảo trì trong dài hạn. Từ những kiến thức và kinh nghiệm
> tích lũy được, người đọc sẽ có đủ nền tảng để so sánh và đánh giá ưu
> nhược điểm giữa hệ sinh thái Node.js (đại diện bởi NestJS) và Java
> (đại diện bởi Spring Boot), từ đó có thể đưa ra lựa chọn công nghệ phù
> hợp cho các dự án thực tế.

## **3.** **Phạm vi báo cáo**

> Để đảm bảo tính tập trung và chuyên sâu, báo cáo này được giới hạn
> trong một phạm vi cụ thể với những ranh giới rõ ràng.
>
> Trọng tâm chính của báo cáo là phát triển Backend API sử dụng NestJS
> framework. Đây là phần core của bất kỳ ứng dụng web hiện đại nào, nơi
> xử lý business logic, quản lý dữ liệu và cung cấp các endpoints cho
> client tiêu thụ. Về mặt lưu trữ dữ liệu, báo cáo sẽ sử dụng cơ sở dữ
> liệu quan hệ (RDBMS), cụ thể là PostgreSQL, kết hợp với Prisma ORM để
> thao tác với database một cách type-safe và hiệu quả.
>
> Trong khía cạnh bảo mật, hệ thống xác thực sẽ được triển khai thông
> qua JWT (JSON Web Token) - một chuẩn mở phổ biến cho việc truyền tải
> thông tin an toàn giữa các bên dưới dạng JSON object. JWT cho phép xây
> dựng hệ thống authentication stateless, phù hợp với kiến trúc RESTful
> API và dễ dàng mở rộng.
>
> Để minh họa cho các kiến thức lý thuyết, báo cáo sẽ xây dựng một ứng
> dụng demo thực tế - cụ thể là Hệ thống TodoList Collaboration (Quản lý
> công việc cộng tác). Ứng dụng này được lựa chọn vì nó bao hàm đầy đủ
> các use cases phổ biến như quản lý users, workspaces, projects, tasks,
> và collaboration features, cho phép áp dụng và thể hiện được hầu hết
> các kiến thức đã học.
>
> Cần lưu ý rằng báo cáo sẽ không đi sâu vào phần lập trình Frontend hay
> thiết kế giao diện người dùng. Thay vào đó, việc kiểm thử API sẽ được
> thực hiện thông qua các công cụ chuyên dụng như Postman hoặc Swagger
> UI - những công cụ cho phép gửi request, xem response và documentation
> của API một cách trực quan mà không cần xây dựng giao diện thực sự.

## **4.** **Cấu trúc báo cáo**

> Bố cục của đồ án được trình bày khoa học qua 5 phần chính, đi từ lý
> thuyết tổng quan đến ứng dụng thực tế:

- Phần 1: Giới thiệu (Chương 1--2) cung cấp bối cảnh tổng quan về NestJS
  --- từ lịch sử ra đời, triết lý thiết kế, hệ sinh thái, đến lý do nhóm
  chọn framework này. Chương 2 giới thiệu đề tài ứng dụng TodoList
  Collaboration, xác định mục tiêu, phạm vi, và phương pháp thực hiện.

- Phần 2: Nền tảng lý thuyết (Chương 3--7) trình bày kiến thức kỹ thuật
  cốt lõi theo trình tự từ cơ bản đến nâng cao. Chương 3 hướng dẫn cài
  đặt môi trường. Chương 4 phân tích kiến trúc NestJS (Modules,
  Controllers, Services, Dependency Injection). Chương 5 đi sâu vào tầng
  dữ liệu với Prisma ORM và PostgreSQL. Chương 6 trình bày các kỹ thuật
  nâng cao gồm Pipes, Interceptors, và File Upload với Multer. Chương 7
  triển khai JWT Authentication, Refresh Token, và Token Blacklist. Mỗi
  chương đều có phần \"Lỗi thường gặp và Trade-offs\" --- phân tích các
  cạm bẫy thực tế và quyết định thiết kế mà nhóm đã đối mặt, giúp người
  đọc tránh lặp lại sai lầm phổ biến.

- Phần 3: Thực hành và kiểm thử (Chương 8) trình bày Unit Testing với
  Jest --- cách viết test cho Services và Controllers, kỹ thuật mock
  dependencies, và phân tích kết quả 41 test cases. Chương này kết nối
  lý thuyết ở Phần 2 với thực hành kiểm thử, đảm bảo code không chỉ hoạt
  động đúng mà còn có thể kiểm chứng.

- Phần 4: Sản phẩm đồ án (Chương 9--10) tổng hợp toàn bộ kết quả thực
  tế. Chương 9 trình bày thiết kế hệ thống chi tiết, bao gồm sơ đồ ERD,
  database schema 17 models, và kiến trúc module. Chương 10 trình bày
  sản phẩm tổng hợp với bảng mapping 36 kỹ thuật NestJS vào từng module,
  demo các luồng nghiệp vụ chính, và kết quả unit test --- cung cấp cái
  nhìn toàn diện về những gì đồ án đã xây dựng.

- Phần 5: Đánh giá và kết luận (Chương 11--12) nhìn lại toàn bộ quá
  trình. Chương 11 đối chiếu kết quả với 8 mục tiêu ban đầu, phân tích
  chi tiết ba bug reports điển hình (JwtStrategy crash, import path sau
  refactor, avatar path sai), và đánh giá NestJS qua sáu khía cạnh sau
  khi thực hành. Chương 12 đề xuất hướng phát triển kỹ thuật cho đồ án
  (WebSocket, OAuth, Redis), cải thiện chất lượng code, infrastructure
  CI/CD, và định hướng phát triển cá nhân của từng thành viên.

#  **Phần 2: Tổng quan về công nghệ NESTJS**

## **Chương 1: Giới thiệu chung**

### 1.1. Khái quát về NestJS

#### 1.1.1. Sự phát triển của Node.js

Để hiểu được giá trị mà NestJS mang lại, trước hết cần nhìn lại bối cảnh
phát triển Backend trong hệ sinh thái JavaScript và Node.js.

Node.js ra đời vào năm 2009, được tạo ra bởi Ryan Dahl với mục tiêu cho
phép JavaScript - vốn chỉ chạy được trên trình duyệt - có thể thực thi
trên phía server. Sự kiện này đánh dấu một bước ngoặt quan trọng trong
lịch sử phát triển web, vì lần đầu tiên các lập trình viên có thể sử
dụng cùng một ngôn ngữ cho cả Frontend và Backend.

Node.js được xây dựng trên V8 JavaScript Engine của Google Chrome, sử
dụng mô hình event-driven và non-blocking I/O. Kiến trúc này cho phép
Node.js xử lý hàng nghìn kết nối đồng thời một cách hiệu quả, đặc biệt
phù hợp với các ứng dụng real-time như chat, streaming, và các hệ thống
cần xử lý nhiều I/O operations.

Với những ưu điểm về hiệu năng và sự tiện lợi của việc sử dụng một ngôn
ngữ duy nhất, Node.js nhanh chóng được các công ty công nghệ lớn như
Netflix, LinkedIn, Uber, và PayPal áp dụng cho các hệ thống backend của
họ. Tính đến năm 2026, Node.js đã trở thành một trong những runtime phổ
biến nhất cho việc phát triển ứng dụng web server-side.

#### 1.1.2. Hạn chế của các framework tối giản

Trong những năm đầu phát triển của Node.js, hệ sinh thái backend bị
thống trị bởi các framework tối giản (minimalist) như Express.js và
Koa.js. Express.js ra đời năm 2010 và nhanh chóng trở thành framework
phổ biến nhất, được mệnh danh là \"standard server framework\" của
Node.js.

Express.js mang lại sự linh hoạt tuyệt đối cho lập trình viên. Nó cung
cấp các tính năng cơ bản như routing, middleware, và xử lý
request/response, nhưng không đưa ra bất kỳ quy ước nào về cách tổ chức
code. Điều này được xem là ưu điểm vì cho phép lập trình viên tự do
thiết kế kiến trúc theo ý muốn.

Tuy nhiên, chính sự tự do này lại trở thành con dao hai lưỡi khi dự án
phát triển lớn hơn. Mỗi dự án, mỗi nhóm phát triển lại tổ chức code theo
một cách khác nhau. Không có chuẩn mực chung về cách đặt tên thư mục,
cách phân chia modules, hay cách triển khai các patterns như dependency
injection. Khi một lập trình viên mới tham gia dự án, họ phải mất nhiều
thời gian để hiểu được cấu trúc code đặc thù của dự án đó.

Vấn đề trở nên nghiêm trọng hơn khi ứng dụng cần mở rộng (scaling). Code
dần trở nên lộn xộn, khó bảo trì, và thiếu tính nhất quán - hiện tượng
mà cộng đồng developer thường gọi là \"Spaghetti Code\". Nhiều đội ngũ
phát triển phải tự xây dựng kiến trúc riêng, dẫn đến hiện tượng
\"Architecture Fatigue\" - mệt mỏi vì phải liên tục đưa ra các quyết
định kiến trúc thay vì tập trung vào business logic.

#### 1.1.3. Nhu cầu về một framework có kiến trúc

Trong khi thế giới Node.js đang loay hoay với vấn đề kiến trúc, các hệ
sinh thái khác đã có sẵn những framework với cấu trúc chuẩn mực. Java có
Spring Boot - một framework mạnh mẽ với dependency injection, modular
architecture, và các conventions rõ ràng. Python có Django với triết lý
\"batteries included\" và cấu trúc project nhất quán. Ruby có Ruby on
Rails với quy ước \"convention over configuration\".

Cộng đồng Node.js bắt đầu nhận ra rằng họ cần một framework tương tự -
một framework cung cấp sẵn kiến trúc, bắt buộc lập trình viên viết code
có tổ chức, nhưng vẫn giữ được tính linh hoạt của JavaScript. Framework
này cần có hệ thống module rõ ràng, dependency injection container, và
các patterns đã được chứng minh hiệu quả trong enterprise development.

Đây chính là bối cảnh mà NestJS ra đời, với mục tiêu mang lại cho
Node.js một framework có kiến trúc enterprise-grade, được lấy cảm hứng
từ những best practices của Angular và Spring Boot.

### 1.2. NestJS - Giải pháp cho Backend có tổ chức

#### 1.2.1. Định nghĩa và Đặc điểm

NestJS (thường được gọi tắt là Nest) là một framework mã nguồn mở dành
cho việc xây dựng các ứng dụng phía máy chủ (server-side applications)
với Node.js. Framework này được thiết kế với mục tiêu tạo ra các ứng
dụng backend hiệu quả, đáng tin cậy, và có khả năng mở rộng (scalable)
cao.

Một trong những đặc điểm nổi bật nhất của NestJS là sự hỗ trợ trọn vẹn
cho TypeScript. Mặc dù vẫn cho phép lập trình viên sử dụng JavaScript
thuần, NestJS được xây dựng hoàn toàn bằng TypeScript và khuyến khích
việc sử dụng ngôn ngữ này. TypeScript mang lại nhiều lợi ích như static
typing, interfaces, decorators, và khả năng phát hiện lỗi tại thời điểm
compile, giúp code an toàn và dễ bảo trì hơn.

NestJS không phát minh lại bánh xe mà xây dựng trên nền tảng của các
HTTP server framework đã có sẵn. Theo mặc định, NestJS sử dụng
Express.js làm underlying HTTP framework, nhưng cũng hỗ trợ Fastify -
một alternative nhanh hơn. Điều quan trọng là NestJS cung cấp một lớp
trừu tượng (abstraction layer) phía trên các framework này, giúp lập
trình viên có thể chuyển đổi giữa Express và Fastify mà không cần thay
đổi code business logic.

#### 1.2.2. Triết lý thiết kế

Điều làm nên sự đặc biệt của NestJS là cách nó kết hợp hài hòa các
nguyên lý từ ba mô hình lập trình lớn.

Đầu tiên là Lập trình hướng đối tượng (OOP - Object Oriented
Programming). NestJS sử dụng classes, interfaces, và inheritance một
cách rộng rãi. Các thành phần như Controllers, Services, và Modules đều
được định nghĩa dưới dạng classes với decorators. Cách tiếp cận này giúp
code có tính đóng gói (encapsulation) cao và dễ dàng tổ chức theo các
responsibility riêng biệt.

Thứ hai là Lập trình hàm (FP - Functional Programming). NestJS khuyến
khích việc sử dụng pure functions, higher-order functions, và
immutability khi phù hợp. Middleware, Pipes, Guards, và Interceptors đều
có thể được implement theo functional style. Điều này mang lại sự linh
hoạt và khả năng compose các chức năng một cách elegant.

Thứ ba là Lập trình phản ứng hàm (FRP - Functional Reactive
Programming). NestJS tích hợp sẵn với RxJS - một thư viện mạnh mẽ cho
reactive programming. Điều này đặc biệt hữu ích khi xử lý các luồng dữ
liệu bất đồng bộ, event streams, hoặc khi cần implement các patterns như
backpressure handling. Việc tích hợp RxJS cũng giúp NestJS xử lý tốt các
use cases như WebSockets và Server-Sent Events.

#### 1.2.3. Nguồn cảm hứng từ Angular và Spring Boot

Kiến trúc của NestJS được lấy cảm hứng mạnh mẽ từ Angular - framework
frontend phổ biến của Google. Điều này thể hiện rõ qua nhiều khía cạnh
trong cách NestJS được thiết kế.

Trước hết là việc sử dụng Decorators. Trong NestJS, hầu hết mọi thứ đều
được định nghĩa thông qua decorators như \@Controller(), \@Injectable(),
\@Module(), \@Get(), \@Post(). Cách tiếp cận này rất quen thuộc với
những người đã làm việc với Angular, nơi mà \@Component(),
\@Injectable(), \@NgModule() được sử dụng phổ biến.

Tiếp theo là hệ thống Module. NestJS tổ chức ứng dụng thành các modules,
mỗi module đóng gói một feature hoặc domain cụ thể. Cấu trúc này tương
tự như cách Angular tổ chức các NgModules, giúp code có tính modular và
dễ dàng tái sử dụng.

Cuối cùng và quan trọng nhất là Dependency Injection (DI). NestJS có một
IoC (Inversion of Control) container mạnh mẽ, tự động quản lý vòng đời
của các dependencies và inject chúng vào nơi cần thiết. Concept này được
lấy trực tiếp từ Angular và cũng rất giống với cách Spring Boot hoạt
động trong Java ecosystem.

Bên cạnh Angular, NestJS cũng chịu ảnh hưởng lớn từ Spring Boot của
Java. Cách tổ chức code theo layers (Controller → Service → Repository),
việc sử dụng annotations (decorators), và triết lý convention over
configuration đều mang đậm dấu ấn của Spring Boot. Điều này giúp những
lập trình viên có background Java có thể nhanh chóng làm quen với
NestJS.

### 1.3. Lịch sử hình thành và phát triển

#### 1.3.1. Tác giả và Quá trình ra đời

NestJS được sáng tạo bởi Kamil Myśliwiec, một kỹ sư phần mềm người Ba
Lan. Kamil là một Google Developer Expert trong lĩnh vực Angular, điều
này giải thích rõ tại sao kiến trúc của NestJS lại mang đậm ảnh hưởng từ
Angular.

Phiên bản đầu tiên của NestJS được công bố vào năm 2017. Kamil bắt đầu
dự án này xuất phát từ trải nghiệm cá nhân khi làm việc với Node.js và
nhận thấy sự thiếu hụt của một framework có kiến trúc chuẩn mực. Mục
tiêu ban đầu của ông là tạo ra một framework cho phép lập trình viên
Node.js viết code có tổ chức giống như cách họ viết code Angular ở
frontend hoặc Spring Boot ở Java.

Hiện tại, NestJS được phát triển và duy trì bởi một cộng đồng mã nguồn
mở đông đảo, cùng với sự hỗ trợ từ Trilon - một công ty tư vấn công nghệ
chuyên về NestJS do chính Kamil sáng lập. Trilon cung cấp các dịch vụ
consulting, training, và enterprise support cho những tổ chức sử dụng
NestJS trong production.

#### 1.3.2. Các mốc phiên bản quan trọng

Kể từ khi ra mắt năm 2017, NestJS đã trải qua nhiều phiên bản nâng cấp
lớn, mỗi phiên bản mang đến những cải tiến đáng kể về tính năng và hiệu
năng.

  ----------- ----------- -----------------------------------------------
  **Phiên     **Thời      **Các thay đổi và cải tiến quan trọng**
  bản**       gian**      

  v1 - v4     2017 - 2018 Giai đoạn sơ khai với việc xây dựng core
                          framework, Dependency Injection container và
                          module system. Các decorators cơ bản được ổn
                          định trong giai đoạn này.

  v5          2018        Cải thiện đáng kể khả năng xử lý bất đồng bộ
                          (Asynchronous context) và tối ưu hóa thời gian
                          khởi động ứng dụng.

  v6          2019        Giới thiệu Injection Scopes (Transient,
                          Request, Singleton) cho phép kiểm soát vòng đời
                          của providers. Cải thiện module GraphQL và hỗ
                          trợ tốt hơn cho Microservices.

  v7          2020        Nâng cấp kiến trúc Microservices, cải thiện
                          việc xử lý Dynamic Modules, và hỗ trợ GraphQL
                          code-first approach tốt hơn.

  v8          2021        Hỗ trợ API Versioning (đánh phiên bản API qua
                          URI, Header, hoặc Media Type), Lazy-loading
                          modules để tăng tốc khởi động, và nâng cấp lên
                          RxJS v7.

  v9          2022        Giới thiệu REPL (Read-Eval-Print Loop) cho việc
                          debug nhanh, Durable Providers tối ưu cho
                          serverless và multi-tenant, và Module Builder
                          API mới.

  v10         2023 - Nay  Đột phá về hiệu năng với việc tích hợp SWC
                          (Speedy Web Compiler) giúp build nhanh gấp 20
                          lần so với trình biên dịch TypeScript truyền
                          thống. Cải thiện testing với khả năng override
                          Modules dễ dàng hơn.
  ----------- ----------- -----------------------------------------------

Qua bảng trên có thể thấy NestJS liên tục được cập nhật và cải tiến để
đáp ứng nhu cầu của cộng đồng developer. Mỗi phiên bản đều mang đến
những tính năng mới giúp việc phát triển ứng dụng trở nên hiệu quả và
thuận tiện hơn.

### 1.4. Hệ sinh thái NestJS

#### 1.4.1. Công cụ và Thư viện chính thức

Một trong những điểm mạnh của NestJS là hệ sinh thái phong phú với nhiều
official packages được phát triển và bảo trì bởi core team. Hệ sinh thái
này được ví như một \"Spring Boot thu nhỏ\" của thế giới
JavaScript/TypeScript.

**Nest CLI** là công cụ dòng lệnh mạnh mẽ đi kèm với NestJS. CLI cho
phép khởi tạo dự án mới với cấu trúc chuẩn, tự động generate các thành
phần như modules, controllers, services (được gọi là scaffolding), và
chạy các lệnh build, test, deploy. Việc sử dụng CLI giúp tiết kiệm đáng
kể thời gian viết boilerplate code và đảm bảo tính nhất quán trong cấu
trúc project.

**Tích hợp Database** là một điểm mạnh khác của NestJS. Framework cung
cấp official packages cho các ORM phổ biến nhất. TypeORM - một ORM mạnh
mẽ với style rất giống Hibernate của Java - được hỗ trợ thông qua
\@nestjs/typeorm. Prisma - ORM thế hệ mới với type-safety tuyệt vời - có
thể tích hợp dễ dàng. Mongoose cho MongoDB cũng được hỗ trợ qua
\@nestjs/mongoose. Trong báo cáo này, chúng ta sẽ sử dụng Prisma vì
những ưu điểm về type safety và developer experience.

**Validation và Transformation** được xử lý elegant thông qua
class-validator và class-transformer. Hai thư viện này cho phép định
nghĩa validation rules trực tiếp trên DTO (Data Transfer Object) classes
bằng decorators. Khi kết hợp với ValidationPipe của NestJS, dữ liệu đầu
vào sẽ được tự động validate và transform trước khi đến business logic.

**API Documentation** được tự động generate thông qua \@nestjs/swagger.
Package này phân tích các decorators trên controllers và DTOs để tạo ra
tài liệu OpenAPI (Swagger UI) hoàn chỉnh. Điều này không chỉ tiết kiệm
thời gian viết documentation mà còn đảm bảo tài liệu luôn đồng bộ với
code thực tế.

**Microservices và Message Queues** là một lĩnh vực mà NestJS hỗ trợ rất
mạnh mẽ. Framework cung cấp native support cho các giao thức và message
brokers phổ biến như gRPC, RabbitMQ, Kafka, MQTT, Redis, và NATS. Việc
chuyển đổi từ monolithic sang microservices architecture trở nên đơn
giản hơn nhiều với NestJS.

**Authentication và Authorization** được hỗ trợ thông qua
\@nestjs/passport và \@nestjs/jwt. Passport.js - thư viện authentication
phổ biến nhất cho Node.js - được tích hợp seamlessly với NestJS. Việc
implement các strategies như JWT, OAuth2, hoặc Local authentication trở
nên đơn giản và có cấu trúc rõ ràng.

#### 1.4.2. Cộng đồng và Mức độ phổ biến

NestJS đã nhanh chóng trở thành một trong những framework Node.js phổ
biến nhất và có tốc độ tăng trưởng nhanh nhất. Tính đến đầu năm 2026,
repository chính của NestJS trên GitHub đã vượt qua mốc 60.000 stars,
đứng trong top các framework backend được yêu thích nhất.

Cộng đồng NestJS rất sôi nổi và hỗ trợ tốt cho newcomers. Server Discord
chính thức của NestJS là nơi các developers có thể đặt câu hỏi và nhận
được support từ cả community members lẫn core team. StackOverflow cũng
có hàng nghìn câu hỏi và câu trả lời liên quan đến NestJS, cho thấy mức
độ phổ biến của framework này.

Điều đáng chú ý là NestJS không chỉ được sử dụng bởi các startup hay
side projects, mà đã được nhiều doanh nghiệp lớn tin tưởng áp dụng cho
các hệ thống production critical. Trong số đó có thể kể đến những tên
tuổi như Adidas, Decathlon, Roche, Autodesk, Capgemini, và nhiều tập
đoàn công nghệ khác. Sự tin tưởng của các doanh nghiệp này là minh chứng
cho độ ổn định và khả năng mở rộng của NestJS trong môi trường
enterprise.

### 1.5. Tổng kết

Chương này đã giới thiệu tổng quan về NestJS - một framework Node.js
hiện đại được thiết kế để giải quyết vấn đề thiếu kiến trúc chuẩn mực
trong hệ sinh thái JavaScript backend. Ra đời vào năm 2017 bởi Kamil
Myśliwiec, NestJS nhanh chóng trở thành lựa chọn hàng đầu cho việc phát
triển enterprise applications nhờ vào kiến trúc module-based, hệ thống
dependency injection mạnh mẽ, và sự hỗ trợ trọn vẹn cho TypeScript.

Với triết lý kết hợp OOP, FP, và FRP, cùng với nguồn cảm hứng từ Angular
và Spring Boot, NestJS mang đến một cách tiếp cận có tổ chức cho việc
xây dựng server-side applications. Hệ sinh thái phong phú với nhiều
official packages cho database, authentication, validation, và
microservices giúp developers có thể nhanh chóng xây dựng các ứng dụng
production-ready.

Trong các chương tiếp theo, chúng ta sẽ đi sâu vào kiến trúc và các
thành phần cốt lõi của NestJS, từ đó áp dụng vào việc xây dựng dự án
TodoList Collaboration - một ứng dụng quản lý công việc cộng tác hoàn
chỉnh.

##  

## **Chương 2: Cơ hội nghề nghiệp và thị trường**

### 2.1. Các vị trí công việc liên quan

NestJS không chỉ là một công cụ đơn lẻ mà thường là \"xương sống\" trong
các hệ thống lớn. Do đó, việc thành thạo NestJS mở ra cơ hội cho nhiều
vị trí quan trọng

> ● **Backend Developer
> ([[Node.js/NestJS]{.underline}](http://node.js/NestJS)):**
>
> ○ *Mô tả công việc:* Thiết kế và xây dựng RESTful APIs hoặc GraphQL
> APIs; làm việc với cơ sở dữ liệu (SQL/NoSQL); tích hợp các dịch vụ bên
> thứ ba (Payment, Email, Cloud); tối ưu hóa hiệu năng hệ thống.
>
> ○ *Yêu cầu:* Thành thạo TypeScript, NestJS core concepts (Modules,
> Guards, Interceptors), TypeORM/Prisma.
>
> ● **Fullstack Developer (TypeScript Stack):**
>
> ○ *Mô tả công việc:* Phụ trách cả hai phía Client (Frontend) và Server
> (Backend). NestJS thường được kết hợp với Angular (do cùng kiến trúc)
> hoặc React/Next.js để tạo thành một \"TypeScript Fullstack\" thống
> nhất.
>
> ○ *Yêu cầu:* Khả năng tư duy đồng bộ giữa Frontend và Backend, chia sẻ
> code (DTO, Interfaces) giữa hai phía.
>
> ● **Software Architect / Tech Lead:**
>
> ○ *Mô tả công việc:* Thiết kế kiến trúc tổng thể cho dự án (Monolith
> hoặc Microservices); quy định chuẩn code (Coding Convention); review
> code và hướng dẫn các thành viên khác (Mentoring).
>
> ○ *Yêu cầu:* Hiểu sâu về Design Patterns, kiến trúc hệ thống, và khả
> năng tận dụng sự chặt chẽ của NestJS để quản lý dự án quy mô lớn.

### 2.2. Nhu cầu tuyển dụng và Xu hướng thị trường

Dựa trên khảo sát từ các nền tảng tuyển dụng lớn tại Việt Nam (như
ITviec, TopCV, LinkedIn) và quốc tế, nhu cầu tuyển dụng lập trình viên
NestJS đang có sự dịch chuyển rõ rệt:

> ● **Sự trỗi dậy của \"Enterprise Node.js\":** Trước đây, Node.js
> thường chỉ dùng cho Startup hoặc dự án nhỏ. Hiện nay, các tập đoàn lớn
> (Enterprise) đang chuyển dịch sang Node.js để tận dụng hiệu năng, và
> họ **bắt buộc chọn NestJS** thay vì ExpressJS thuần túy để đảm bảo
> tính bảo trì và quy chuẩn kiến trúc.
>
> ● **Yêu cầu về TypeScript:** Hơn 80% các tin tuyển dụng Backend
> Node.js hiện đại đều yêu cầu ứng viên biết TypeScript. NestJS là
> framework tiêu biểu nhất cho xu hướng này.
>
> ● **Chuyển đổi số:** Nhu cầu chuyển đổi các hệ thống Monolith cũ sang
> Microservices đang tăng cao, và NestJS là một trong những lựa chọn
> hàng đầu nhờ hỗ trợ native cho kiến trúc Microservices (Kafka, gRPC,
> RabbitMQ).

#  

# **Phần 3: Nội dung cốt lõi và thực hành**

Đây là phần quan trọng nhất, trình bày kiến thức từ cơ bản đến nâng cao.
Mỗi chương tuân thủ cấu trúc: **Lý thuyết -\> Giải thích & Minh họa -\>
Code mẫu -\> Thực hành/Đồ án.**

## **Chương 3: Cài đặt môi trường và khởi tạo dự án**

### 3.1. Các công cụ được sử dụng và hướng dẫn cài đặt

Trước khi bắt đầu phát triển ứng dụng NestJS, chúng ta cần chuẩn bị một
bộ công cụ phù hợp. Việc lựa chọn và cài đặt đúng công cụ ngay từ đầu
không chỉ giúp quá trình phát triển diễn ra suôn sẻ mà còn tránh được
nhiều lỗi phát sinh sau này.

#### 3.1.1. Node.js và npm

Node.js là nền tảng runtime cho phép chạy JavaScript phía server. NestJS
được xây dựng trên Node.js, do đó đây là công cụ bắt buộc đầu tiên cần
**cài đặt trực tiếp lên hệ điều hành (Host Machine)** của ta. Khi cài
đặt Node.js, công cụ npm (Node Package Manager) dùng để tải các thư viện
cho dự án cũng sẽ được tự động cài đặt kèm theo.

**Các bước cài đặt chi tiết dành cho Windows/macOS:**

1.  Truy cập trang chủ chính thức tại: <https://nodejs.org/>

2.  Tại trang chủ, click vào nút tải phiên bản có chữ **LTS (Long Term
    Support)** (nên dùng bản v18 trở lên). Đây là phiên bản ổn định
    nhất, khuyên dùng cho hầu hết người dùng.

3.  Mở file .msi (Windows) hoặc .pkg (macOS) vừa tải về để bắt đầu quá
    trình cài đặt.

4.  Trong cửa sổ cài đặt, bấm **Next** liên tục, đồng ý với các điều
    khoản (Accept License Agreement). Đảm bảo rằng lựa chọn \"Add to
    PATH\" mặc định đã được tick chọn (điều này giúp ta gọi được lệnh
    node từ mọi thư mục). Bấm **Install** và đợi tiến trình hoàn tất.

Phiên bản tối thiểu yêu cầu là Node.js v18 trở lên, vì các phiên bản cũ
hơn không hỗ trợ đầy đủ các tính năng ES Module và TypeScript mà NestJS
sử dụng. Khi cài đặt Node.js, npm (Node Package Manager) sẽ được tự động
cài đặt kèm theo --- đây là công cụ quản lý các thư viện (packages) mà
dự án cần sử dụng.

Sau khi cài đặt xong, hãy xác minh bằng cách mở Terminal (hoặc Command
Prompt / PowerShell trên Windows) và gõ hai lệnh sau:

![](media/image2.gif){width="6.267716535433071in"
height="0.5555555555555556in"}

#### 3.1.2. NestJS CLI

NestJS CLI (Command Line Interface) là công cụ dòng lệnh chính thức của
NestJS, giúp tự động hóa nhiều tác vụ phổ biến trong quá trình phát
triển. CLI có thể tạo project mới với cấu trúc chuẩn, generate các
components (module, controller, service) chỉ bằng một lệnh, và chạy ứng
dụng ở chế độ development với tính năng hot-reload.

Công cụ này được **cài đặt thông qua lệnh trên Terminal/Command Prompt**
bằng npm. Định dạng global (-g) cho phép sử dụng lệnh nest ở bất kỳ thư
mục nào trên máy:

![](media/image3.gif){width="6.267716535433071in"
height="0.7777777777777778in"}

#### 3.1.3. PostgreSQL (Khởi chạy qua Docker)

PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở, được chọn
cho dự án TodoList Collaboration nhờ khả năng hỗ trợ JSON columns,
full-text search, và tích hợp hoàn hảo với Prisma ORM.

Để đảm bảo tính nhất quán giữa các môi trường phát triển và tránh việc
phải thiết lập database rườm rà lên máy host (máy tính cá nhân), dự án
sử dụng **Docker** và docker-compose để khởi chạy PostgreSQL. Việc này
giúp đóng gói môi trường database vào một container độc lập.

Thay vì cài đặt trực tiếp, ta khởi chạy database bằng Docker (chạy lệnh
trong terminal tại thư mục gốc của dự án chứa file docker-compose.yml):

![](media/image4.gif){width="6.267716535433071in"
height="0.5555555555555556in"}

Trình tự thiết lập như sau:

**Bước 1:** Cài đặt Docker Desktop

Truy cập
[[https://www.docker.com/products/docker-desktop/]{.underline}](https://www.docker.com/products/docker-desktop/)
tải bản Docker Desktop cho hệ điều hành của bạn.

Chạy file cài đặt và làm theo hướng dẫn (bấm Next và OK, giữ nguyên cài
đặt mặc định). Sau khi cài xong, đôi lúc hệ thống sẽ yêu cầu khởi động
lại máy tính.

Mở ứng dụng Docker Desktop lên và đợi biểu tượng thanh trạng thái góc
dưới cùng bên trái hiện màu xanh lá cây (Running).

**Bước 2:** Chuẩn bị file docker-compose.yml Thay vì gõ hàng tá lệnh cấu
hình dài dòng, Docker cung cấp công cụ docker-compose giúp bạn khai báo
cấu hình Database sẵn vào một file tên là docker-compose.yml. Tại thư
mục gốc của dự án của bạn (ví dụ thư mục todolist-collaboration), tạo
một file text, lưu với tên docker-compose.yml (hoặc mở file đã có sẵn)
và paste nội dung sau vào:

![](media/image5.gif){width="6.267716535433071in"
height="3.611111111111111in"}

*Trong đó:*

> ● image: Tải PostgreSQL bản số 15.
>
> ● environment: Chúng ta đặt User là admin, mật khẩu secretpassword, và
> tên database là todolist_collaboration.
>
> ● ports: Kết nối cổng 5432 của máy thật (host) với cổng 5432 bên trong
> Database. Bằng cách này, ứng dụng NestJS của bạn có thể giao tiếp với
> DB qua localhost:5432.
>
> ● volumes: Giúp dữ liệu không bị xoá mất khi bạn tắt máy ngang.

**Bước 3:** Khởi chạy Database bằng lệnh

1.  Mở Terminal / Command Prompt.

2.  Dùng lệnh cd để điều hướng vào thư mục chứa file docker-compose.yml
    (Ví dụ: cd d:\\IT\\Projects\\CCNLTHD).

3.  Chạy lệnh:

![](media/image6.jpg){width="6.267716535433071in"
height="0.4444444444444444in"}

*Trong đó:* up là lệnh khởi động các dịch vụ khai báo trong file. Cờ -d
(detached) có nghĩa là chạy ngầm, bạn có thể tắt tab terminal đi mà
Database vẫn chạy.

**3.1.4. Hoppscotch**

Hoppscotch là công cụ API testing mã nguồn mở, chạy trực tiếp trên trình
duyệt tại [[https://hoppscotch.io]{.underline}](https://hoppscotch.io/)
mà không cần cài đặt ứng dụng desktop. Lý do sử dụng công cụ Hoppscotch
là:

- Chạy trực tiếp trên trình duyệt, không cần cài đặt phần mềm desktop
  như Postman, giúp tiết kiệm dung lượng và thời gian khởi động.

- Giao diện đơn giản, dễ sử dụng, phù hợp để test nhanh các REST API
  trong quá trình phát triển backend NestJS.

- Hỗ trợ đầy đủ các phương thức HTTP như GET, POST, PUT, DELETE, phù hợp
  với các endpoint của hệ thống.

- Có thể gửi request tới server chạy local (localhost) khi sử dụng
  Browser Extension hoặc Hoppscotch Agent, giúp test API NestJS thuận
  tiện trong môi trường phát triển.

- Hoạt động nhẹ, tiêu tốn ít RAM hơn so với các công cụ như Postman, phù
  hợp khi chạy đồng thời Node.js, database và frontend.

- Hỗ trợ gửi JSON body, header Authorization, query params, giúp kiểm
  thử đầy đủ các chức năng của API.

- Cho phép lưu lại request để sử dụng lại, thuận tiện khi test nhiều lần
  trong quá trình phát triển.

- Dễ tích hợp trong quy trình phát triển backend NestJS để kiểm tra API
  trước khi kết nối với frontend.

Vì project hiện tại là hệ thống backend NestJS chạy local, yêu cầu test
API thường xuyên, không cần automation phức tạp, nên Hoppscotch là lựa
chọn phù hợp nhất.

Trong project NestJS, Hoppscotch được sử dụng để:

- Kiểm tra các endpoint của NestJS

- Test API trước khi gọi từ frontend

- Kiểm tra dữ liệu trả về JSON

- Debug lỗi request

- Test API khi phát triển module mới

Tuy nhiên, vì Hoppscotch chạy trên web nên bị ràng buộc bởi chính sách
CORS (Cross-Origin Resource Sharing) của trình duyệt --- nghĩa là mặc
định sẽ không thể gửi request tới localhost. Để giải quyết vấn đề này,
cần cài đặt **Hoppscotch Browser Extension**.

**Cài đặt Extension**

Truy cập link tương ứng với trình duyệt đang sử dụng:

> ● Chrome / Edge / Brave (Chromium-based): [[Chrome Web Store ---
> Hoppscotch Browser
> Extension]{.underline}](https://chromewebstore.google.com/detail/hoppscotch-browser-extens/amknoiejhlmhancpahfcfcfhllgkpbld)
>
> ● Firefox: [[Firefox Add-ons --- Hoppscotch
> Extension]{.underline}](https://addons.mozilla.org/en-US/firefox/addon/hoppscotch/)

Nhấn **Add to Chrome** (hoặc **Add to Firefox**) để cài đặt extension.

**Cấu hình Extension**

Sau khi cài đặt xong, thực hiện các bước sau:

> 1\. Click vào icon Hoppscotch trên thanh toolbar của trình duyệt.
>
> 2\. Trong danh sách **Active Origins**, đảm bảo đã có hoppscotch.io.
> Nếu chưa có, thêm https://hoppscotch.io vào danh sách.
>
> 3\. Truy cập
> [[https://hoppscotch.io]{.underline}](https://hoppscotch.io/) và
> refresh lại trang.
>
> 4\. Vào **Settings** (biểu tượng bánh răng ở sidebar trái) → mục
> **Interceptors** → chọn **Browser Extension**.
>
> 5\. Nếu extension đã được nhận diện thành công, phiên bản extension sẽ
> hiển thị bên cạnh (ví dụ: v0.37).

**Kiểm tra kết nối**

Sau khi cấu hình xong, thử gửi một GET request tới server NestJS đang
chạy local:

> ● URL: http://localhost:3000 (hoặc port mà project đang sử dụng)
>
> ● Method: GET
>
> ● Nhấn **Send**

Nếu nhận được response thành công (ví dụ status 200 OK), extension đã
hoạt động đúng và sẵn sàng để test API.

**Lưu ý:**

> ● Extension chỉ hoạt động trên trình duyệt Chromium-based và Firefox,
> không hỗ trợ Safari.
>
> ● Nếu gặp lỗi CORS khi gửi request tới localhost, kiểm tra lại
> interceptor đã chuyển sang **Browser Extension** chưa, và đảm bảo
> origin hoppscotch.io đã được thêm trong extension.
>
> ● Ngoài Browser Extension, Hoppscotch cũng cung cấp **Hoppscotch
> Agent** --- một ứng dụng nhỏ chạy trên máy local, đóng vai trò tương
> tự nhưng không yêu cầu extension trình duyệt. Có thể tải Agent tại mục
> Interceptors trên trang Settings.

### 3.2. Khởi tạo dự án NestJS

#### 3.2.1. Tạo project mới

NestJS CLI cung cấp lệnh nest new để tạo một project mới với cấu trúc
thư mục chuẩn, các file cấu hình cần thiết, và dependencies cơ bản. Khi
chạy lệnh này, CLI sẽ hỏi package manager muốn sử dụng (npm, yarn, hoặc
pnpm). Đối với dự án TodoList Collaboration, chúng ta sẽ sử dụng npm:

![](media/image7.jpg){width="6.267716535433071in"
height="1.5555555555555556in"}

Sau khi lệnh hoàn tất, di chuyển vào thư mục project và khởi động ứng
dụng ở chế độ development:

![](media/image8.jpg){width="6.267716535433071in"
height="0.7083333333333334in"}

Lệnh npm run start:dev sử dụng chế độ watch mode --- ứng dụng sẽ tự động
restart mỗi khi có thay đổi trong code, giúp developer không cần phải
dừng và khởi động lại server thủ công. Khi ứng dụng khởi động thành
công, terminal sẽ hiển thị thông báo \"Nest application successfully
started\" và ứng dụng sẵn sàng nhận request tại
[[http://localhost:3000]{.underline}](http://localhost:3000/).

#### 3.2.2. Kiểm tra hoạt động

Để xác nhận ứng dụng đang chạy đúng, mở trình duyệt và truy cập
http://localhost:3000. Nếu mọi thứ được cài đặt chính xác, trang sẽ hiển
thị dòng chữ \"Hello World!\" --- đây là response mặc định từ
AppController mà NestJS CLI tạo sẵn.

Ngoài ra, có thể sử dụng curl hoặc Hoppscotch để test:

![](media/image9.jpg){width="6.267716535433071in"
height="0.5694444444444444in"}

#### 3.2.3. Sử dụng NestJS CLI để generate components

##### 3.2.3.1. Generate Module, Controller, Service

NestJS CLI cung cấp lệnh nest generate (viết tắt nest g) để tự động tạo
các components. Đây là cách nhanh nhất và ít lỗi nhất để thêm feature
mới vào dự án, vì CLI sẽ tự động tạo file với đúng cấu trúc, import cần
thiết, và cập nhật module tương ứng.

Ví dụ, khi cần tạo module Task cho dự án, chúng ta chạy ba lệnh sau:

Flag \--no-spec bỏ qua việc tạo file test (.spec.ts), giúp giữ thư mục
gọn gàng trong giai đoạn phát triển ban đầu. Sau khi chạy xong ba lệnh
trên, NestJS CLI đã tạo ra một TaskModule hoàn chỉnh với controller và
service, đồng thời tự động import TaskModule vào AppModule.

##### 3.2.3.2. Các lệnh generate phổ biến

Bảng dưới đây tổng hợp các lệnh generate thường dùng nhất khi phát triển
dự án NestJS:

  ------------------ ------------------------------------ ---------------
  **Lệnh**           **Kết quả**                          **Mô tả**

  nest g module task src/task/task.module.ts              Tạo module mới

  nest g controller  src/task/task.controller.ts          Tạo controller
  task                                                    

  nest g service     src/task/task.service.ts             Tạo service
  task                                                    

  nest g resource    Module + Controller + Service + DTOs Tạo trọn bộ
  task                                                    CRUD resource

  nest g guard       src/jwt-auth.guard.ts                Tạo guard
  jwt-auth                                                

  nest g interceptor src/logging.interceptor.ts           Tạo interceptor
  logging                                                 

  nest g pipe        src/validation.pipe.ts               Tạo pipe
  validation                                              
  ------------------ ------------------------------------ ---------------

Lệnh nest g resource đặc biệt hữu ích vì nó tạo ra toàn bộ CRUD
boilerplate cho một feature, bao gồm module, controller với các
endpoints REST đầy đủ (GET, POST, PATCH, DELETE), service, và các DTO
files. Khi được hỏi transport layer, chọn \"REST API\" cho dự án web
application.

### 3.3. Giải thích cấu trúc thư mục

[Sau khi tạo project mới, NestJS CLI sinh ra cấu trúc thư mục sau đây.
Mỗi file có vai trò cụ thể trong kiến trúc của ứng dụng:]{.mark}

todolist-collaboration/

├── src/

│ ├── main.ts → Entry point - khởi động ứng dụng

│ ├── app.module.ts → Root module - tập hợp tất cả modules

│ ├── app.controller.ts → Controller mặc định - xử lý GET /

│ ├── app.service.ts → Service mặc định - chứa logic \"Hello World\"

│ └── app.controller.spec.ts → Unit test cho AppController

├── test/

│ ├── app.e2e-spec.ts → End-to-end test

│ └── jest-e2e.json → Cấu hình Jest cho E2E testing

├── node_modules/ → Thư viện dependencies

├── package.json → Thông tin project và dependencies

├── tsconfig.json → Cấu hình TypeScript compiler

├── tsconfig.build.json → Cấu hình build production

├── nest-cli.json → Cấu hình NestJS CLI

└── .eslintrc.js → Cấu hình ESLint

### 3.4. Bài tập ứng dụng - Khởi tạo project Todolist Collaboration

#### 3.4.1. Mục tiêu

Vận dụng toàn bộ kiến thức đã học trong Chương 3 để khởi tạo dự án
TodoList Collaboration --- ứng dụng quản lý công việc cộng tác sẽ được
xây dựng xuyên suốt đồ án. Sau khi hoàn thành, người đọc sẽ:

- Thành thạo quy trình tạo dự án NestJS mới bằng CLI.

- Biết cách cài đặt và khởi chạy PostgreSQL bằng Docker.

- Hiểu cấu trúc thư mục và vai trò của từng file trong dự án NestJS.

- Kiểm tra hoạt động ứng dụng bằng trình duyệt và công cụ API testing.

#### 3.4.2. Mô tả bài tập

Tạo dự án NestJS **todolist-collaboration**, cấu hình PostgreSQL thông
qua Docker, và xác nhận ứng dụng hoạt động đúng. Đây là bước nền tảng
--- các chương sau sẽ tiếp tục mở rộng dự án này.

**Yêu cầu cụ thể:**

1.  Sử dụng NestJS CLI để tạo dự án mới với tên todolist-collaboration.

2.  Tạo file docker-compose.yml để khởi chạy PostgreSQL.

3.  Chạy ứng dụng ở chế độ development và xác nhận hoạt động.

4.  Sử dụng Hoppscotch để gửi request kiểm tra.

#### 3.4.3. Code minh họa

**Bước 1: Khởi tạo dự án**

Mở Terminal và chạy lệnh sau để tạo project mới:

![](media/image10.png){width="3.3333333333333335in"
height="0.5520833333333334in"}

Khi được hỏi package manager, chọn **npm**. CLI sẽ tự động tạo cấu trúc
thư mục chuẩn và cài đặt các dependencies cần thiết.

Kết quả:

![](media/image11.png){width="6.267716535433071in"
height="2.111111111111111in"}

![](media/image12.png){width="6.267716535433071in" height="2.0in"}

Cấu trúc project vừa khởi tạo:

![](media/image13.png){width="3.0729166666666665in"
height="4.083333333333333in"}

**Bước 2: Cấu hình PostgreSQL với Docker**

Tạo file docker-compose.yml tại thư mục gốc của dự án với nội dung:

![](media/image14.png){width="6.267716535433071in"
height="3.2777777777777777in"}

Sau đó khởi chạy database:

![](media/image15.png){width="2.5104166666666665in"
height="0.5104166666666666in"}

Kết quả:

![](media/image16.png){width="6.267716535433071in"
height="1.8472222222222223in"}

**Bước 3: Khởi chạy ứng dụng**

Chạy lệnh:

![](media/image17.png){width="3.5104166666666665in"
height="0.7291666666666666in"}

Terminal sẽ hiển thị thông báo Nest application successfully started khi
ứng dụng sẵn sàng nhận request tại http://localhost:3000.

Kết quả:

![](media/image18.png){width="6.267716535433071in"
height="1.8472222222222223in"}

**Bước 4: Kiểm tra bằng Hoppscotch**

Truy cập Hoppscotch tại https://hoppscotch.io, gửi request:

- **Method:** GET

- **URL:** http://localhost:3000

- **Expected Response:** Hello World!

![](media/image19.png){width="6.267716535433071in"
height="2.8194444444444446in"}

#### 3.4.4. Kết quả đạt được

Sau khi hoàn thành bài tập:

- Tạo thành công dự án NestJS todolist-collaboration bằng CLI.

- Khởi chạy PostgreSQL trên Docker, sẵn sàng kết nối ở cổng 5435 (host)
  → 5432 (container).

- Ứng dụng NestJS hoạt động ở chế độ development với hot-reload.

- Xác nhận endpoint mặc định phản hồi đúng qua Hoppscotch.

Dự án này sẽ được sử dụng làm nền tảng cho các bài tập ở các chương tiếp
theo --- bắt đầu từ việc xây dựng các Module, Controller, và Service
trong Chương 4.

##  

## **Chương 4: Các khái niệm cơ bản của kiến trúc NestJS**

### 4.1. TypeScript - Nền tảng xây dựng

#### 4.1.1. TypeScript là gì?

TypeScript là ngôn ngữ lập trình mã nguồn mở được phát triển bởi
Microsoft. Về bản chất, TypeScript là một \"superset\" của JavaScript,
nghĩa là mọi đoạn code JavaScript hợp lệ đều là code TypeScript hợp lệ.
Điểm khác biệt quan trọng nhất của TypeScript so với JavaScript nằm ở hệ
thống kiểu dữ liệu tĩnh (static typing).

Trong JavaScript thuần, biến có thể thay đổi kiểu dữ liệu tùy ý trong
quá trình chạy chương trình, điều này tuy linh hoạt nhưng dễ gây ra lỗi
khó phát hiện. TypeScript giải quyết vấn đề này bằng cách yêu cầu khai
báo kiểu dữ liệu ngay từ lúc viết code. Trình biên dịch TypeScript sẽ
kiểm tra và báo lỗi nếu phát hiện sự không tương thích về kiểu, giúp lập
trình viên phát hiện lỗi sớm trước khi chương trình được chạy.

NestJS được viết hoàn toàn bằng TypeScript và tận dụng triệt để các tính
năng nâng cao của ngôn ngữ này như Decorators, Generics và Interfaces.
Do đó, việc nắm vững TypeScript là điều kiện tiên quyết để làm việc hiệu
quả với NestJS.

Trong kiến trúc của NestJS, TypeScript đóng vai trò cốt lõi nhờ vào ba
đặc điểm chính. Đầu tiên là Static Typing (Định kiểu tĩnh), giúp phát
hiện lỗi ngay trong quá trình phát triển (compile-time) thay vì đợi đến
khi chạy ứng dụng (run-time). Tiếp theo là khả năng chỉnh sửa mã nguồn
an toàn (Refactoring) --- nhờ hệ thống kiểu dữ liệu, việc thay đổi cấu
trúc code trong dự án NestJS trở nên ít rủi ro hơn. Cuối cùng là tính
tương thích hoàn hảo với OOP --- NestJS dựa trên lập trình hướng đối
tượng, và TypeScript cung cấp đầy đủ các tính năng như Class, Interface,
Access Modifiers (private, public, protected).

#### 4.1.2. Hệ thống kiểu dữ liệu cơ bản

TypeScript cung cấp một hệ thống kiểu phong phú bao gồm các kiểu dữ liệu
nguyên thủy (primitive types) và các kiểu dữ liệu phức hợp. Kiểu string
dùng để đại diện cho dữ liệu văn bản. Kiểu number bao gồm cả số nguyên
và số thực, khác với nhiều ngôn ngữ khác, TypeScript không phân tách
thành int hay float. Kiểu boolean lưu giá trị logic true hoặc false.
Kiểu Array có hai cách khai báo là type\[\] hoặc sử dụng Generic
Array\<type\>.

Ví dụ minh họa các kiểu dữ liệu cơ bản trong context dự án TodoList:

![](media/image20.gif){width="6.267716535433071in"
height="0.9861111111111112in"}

Đối với các cấu trúc dữ liệu phức tạp hơn như object, TypeScript sử dụng
Interface hoặc Type để định nghĩa hình dạng (shape) của dữ liệu. Điều
này đảm bảo rằng mọi object thuộc một kiểu nhất định đều phải có đầy đủ
các thuộc tính được yêu cầu.

#### 4.1.3. Interface và Type Alias

Interface và Type Alias là hai cách để định nghĩa kiểu dữ liệu tùy chỉnh
trong TypeScript. Mặc dù có nhiều điểm tương đồng, chúng được sử dụng
trong các ngữ cảnh khác nhau.

Interface thường được dùng để mô tả hình dạng của object hoặc để định
nghĩa contract cho các class. Interface có khả năng mở rộng (extend) và
hợp nhất (merge), phù hợp cho việc định nghĩa các entity trong ứng dụng.
Trong dự án TodoList Collaboration, chúng ta sử dụng Interface để định
nghĩa cấu trúc các entity chính:

Ví dụ:

![](media/image21.gif){width="6.07248031496063in"
height="3.4843755468066493in"}

**Type Alias** được sử dụng để đặt tên cho các kiểu phức tạp, đặc biệt
là Union Types (kiểu hợp) và Intersection Types (kiểu giao). Trong dự
án, chúng ta sử dụng Type Alias để định nghĩa các trạng thái của Task.

Ví dụ:

![](media/image22.gif){width="6.267716535433071in"
height="1.6805555555555556in"}

Sự kết hợp giữa Interface và Type Alias giúp mã nguồn trở nên tường
minh, dễ bảo trì và tận dụng được khả năng kiểm tra kiểu mạnh mẽ của
TypeScript.

Trong TypeScript, cả hai đều dùng để định nghĩa hình dáng (shape) của
đối tượng, nhưng chúng có những khác biệt quan trọng về khả năng mở rộng
và mục đích sử dụng.

  ------------------ ------------------------ --------------------------
  **Đặc điểm**       **Interface**            **Type Alias**

  **Kế thừa          Sử dụng từ khóa extends. Sử dụng giao điểm
  (Inheritance)**                             (Intersection - &).

  **Declaration      **Có.** Có thể định      **Không.** Sẽ báo lỗi nếu
  Merging**          nghĩa cùng tên nhiều     định nghĩa trùng tên.
                     lần, TS sẽ tự gộp lại.   

  **Khả năng mở      Rất tốt cho việc định    Thường dùng cho các kiểu
  rộng**             nghĩa API hoặc Library.  phức tạp (Union, Tuple).

  **Union Types**    Không hỗ trợ trực tiếp.  **Có.** (Ví dụ: type
                                              Status = \'open\' \|
                                              \'closed\').

  **Tính ứng dụng**  Khuyên dùng cho cấu trúc Khuyên dùng cho các kiểu
                     Object, Class.           dữ liệu biến hóa, logic
                                              phức tạp.
  ------------------ ------------------------ --------------------------

#### 

#### 

####  4.1.4. Decorators trong TypeScript

Đây là phần quan trọng nhất để hiểu NestJS. Decorator là một tính năng
đặc biệt của TypeScript cho phép thêm metadata hoặc thay đổi hành vi của
class, method, property hoặc parameter. Trong NestJS, Decorators đóng
vai trò then chốt, được sử dụng rộng rãi để định nghĩa Controllers,
Services, và các thiết lập khác.

Về mặt cú pháp, Decorator được viết với ký hiệu @ theo sau là tên
decorator. Decorator thực chất là một hàm nhận tham số và có thể thực
hiện các thao tác trên đối tượng được decorate. Để minh họa, hãy xem
cách các Decorators được sử dụng trong TaskController của dự án:

Ví dụ:

![](media/image23.gif){width="6.267716535433071in"
height="3.9305555555555554in"}

Trong ví dụ trên, \@Controller(\'tasks\') là một Class Decorator đánh
dấu class TaskController là một controller xử lý các request đến route
/tasks. Các decorator \@Get() và \@Post() là Method Decorators định
nghĩa HTTP method cho từng phương thức. Decorator \@Body() và
\@Param(\'id\') là Parameter Decorators dùng để lấy dữ liệu từ request
body và URL parameters.

**Phân loại Decorators**

Decorators trong NestJS được chia thành bốn nhóm chính dựa trên đối
tượng mà chúng tác động. Hiểu rõ từng nhóm giúp lập trình viên nhanh
chóng nhận biết vai trò của mỗi decorator khi đọc code.

**a) Class Decorators --- Gắn lên class**

Class Decorators định nghĩa vai trò và hành vi tổng thể của một class
trong ứng dụng NestJS.

  ------------------------ --------------- ------------------- -------------------------
  **Decorator**            **Ý nghĩa**     **Trường hợp sử     **Ví dụ**
                                           dụng**              

  \@Module()               Khai báo class  Tổ chức code thành  \@Module({ imports:
                           là một NestJS   các khối chức năng  \[\...\], providers:
                           Module                              \[\...\] })

  \@Controller(\'path\')   Khai báo class  Tạo endpoint API    \@Controller(\'tasks\') →
                           xử lý HTTP      cho một nhóm route  route /tasks
                           requests                            

  \@Injectable()           Đánh dấu class  Tạo Service, Guard, \@Injectable() export
                           có thể được     Interceptor, Pipe   class TaskService {}
                           inject qua DI                       

  \@Global()               Biến Module     Chia sẻ Service cho \@Global()
                           thành module    tất cả module mà    \@Module({\...}) export
                           toàn cục        không cần import    class PrismaModule {}

  \@WebSocketGateway()     Khai báo class  Xử lý kết nối       \@WebSocketGateway({
                           là WebSocket    real-time           namespace: \'/events\' })
                           gateway                             
  ------------------------ --------------- ------------------- -------------------------

Ví dụ thực tế từ dự án --- AuthModule sử dụng \@Module() để kết nối
Controller, Service và import các module phụ thuộc:

> \@Module({\
> imports: \[PassportModule, JwtModule.register({\...}), MailModule\],\
> controllers: \[AuthController\],\
> providers: \[AuthService, JwtStrategy, JwtAuthGuard\],\
> exports: \[AuthService\],\
> })\
> export class AuthModule {}

**b) Method Decorators --- Gắn lên method**

Method Decorators quy định cách một method phản hồi với HTTP request
hoặc WebSocket event.

  ---------------------- ------------- ------------------------------ ------------------------------------------------
  **Decorator**          **Ý nghĩa**   **Trường hợp sử dụng**         **Ví dụ**

  \@Get(\'path\')        Bắt HTTP GET  Đọc dữ liệu (danh sách, chi    \@Get(\':id\') → GET /tasks/abc-123
                         request       tiết)                          

  \@Post(\'path\')       Bắt HTTP POST Tạo mới tài nguyên             \@Post() → POST /tasks
                         request                                      

  \@Patch(\'path\')      Bắt HTTP      Cập nhật một phần tài nguyên   \@Patch(\':id\') → PATCH /tasks/abc-123
                         PATCH request                                

  \@Delete(\'path\')     Bắt HTTP      Xóa tài nguyên                 \@Delete(\':id\') → DELETE /tasks/abc-123
                         DELETE                                       
                         request                                      

  \@HttpCode(200)        Ghi đè HTTP   \@Post mặc định trả 201, đổi   \@HttpCode(200) trên login endpoint
                         status code   thành 200                      
                         mặc định                                     

  \@UseGuards(Guard)     Gắn Guard bảo Kiểm tra                       \@UseGuards(JwtAuthGuard)
                         vệ route      authentication/authorization   

  \@UseInterceptors(I)   Gắn           Transform response, upload     \@UseInterceptors(FileInterceptor(\'avatar\'))
                         Interceptor   file                           
                         xử lý                                        
                         trước/sau                                    

  \@SubscribeMessage()   Lắng nghe     Xử lý event real-time từ       \@SubscribeMessage(\'joinRoom\')
                         WebSocket     client                         
                         event                                        
  ---------------------- ------------- ------------------------------ ------------------------------------------------

Ví dụ thực tế --- AuthController sử dụng \@HttpCode(200) vì login không
\"tạo mới\" tài nguyên nên không nên trả 201:

> \@Post(\'login\')\
> \@HttpCode(200) // Override mặc định 201 của \@Post\
> login(@Body() dto: LoginDto) {\
> return this.authService.login(dto);\
> }

**c) Parameter Decorators --- Gắn lên tham số của method**

Parameter Decorators trích xuất dữ liệu cụ thể từ HTTP request và truyền
thẳng vào tham số của method.

  -------------------- ----------- ------------------- ------------------------------
  **Decorator**        **Ý nghĩa** **Trường hợp sử     **Ví dụ**
                                   dụng**              

  \@Body()             Lấy toàn bộ Nhận DTO khi        create(@Body() dto:
                       request     tạo/cập nhật        CreateTaskDto)
                       body                            

  \@Body(\'field\')    Lấy một     Chỉ cần 1 giá trị   \@Body(\'title\') title:
                       field cụ                        string
                       thể từ body                     

  \@Param(\'key\')     Lấy route   Lấy ID từ URL       findOne(@Param(\'id\') id:
                       parameter                       string)
                       từ URL                          

  \@Query()            Lấy toàn bộ Nhận                findAll(@Query() filter:
                       query       filter/pagination   FilterTaskDto)
                       string      DTO                 

  \@Query(\'key\')     Lấy một     Lấy giá trị lọc cụ  \@Query(\'status\') status:
                       query       thể                 string
                       parameter                       

  \@Headers(\'key\')   Lấy giá trị Đọc Authorization   \@Headers(\'authorization\')
                       HTTP header token               token: string

  \@UploadedFile()     Lấy file từ Xử lý upload file   uploadAvatar(@UploadedFile()
                       multipart                       file)
                       request                         
  -------------------- ----------- ------------------- ------------------------------

Ví dụ thực tế --- endpoint upload avatar kết hợp nhiều Parameter
Decorators:

> \@Post(\'me/avatar\')\
> \@UseInterceptors(FileInterceptor(\'avatar\', avatarMulterConfig))\
> uploadAvatar(\
> \@CurrentUser(\'id\') userId: string, // Custom param decorator\
> \@UploadedFile(new ParseFilePipe({\...})) file: Express.Multer.File,\
> ) {\
> return this.userService.uploadAvatar(userId, file);\
> }

**d) Property Decorators --- Gắn lên thuộc tính của class**

Property Decorators thường được sử dụng trong DTOs (Data Transfer
Objects) để khai báo quy tắc validation cho từng thuộc tính, hoặc trong
WebSocket Gateway để inject server instance.

  --------------------- --------------------- ----------- -------------------------------
  **Decorator**         **Nguồn**             **Ý nghĩa** **Ví dụ**

  \@IsString()          class-validator       Bắt buộc    \@IsString() title: string
                                              giá trị là  
                                              chuỗi       

  \@IsEmail()           class-validator       Validate    \@IsEmail() email: string
                                              định dạng   
                                              email       

  \@MinLength(n)        class-validator       Chuỗi tối   \@MinLength(8) password: string
                                              thiểu n ký  
                                              tự          

  \@IsOptional()        class-validator       Cho phép    \@IsOptional() description?:
                                              field không string
                                              bắt buộc    

  \@IsEnum(E)           class-validator       Giá trị     \@IsEnum(TaskStatus) status:
                                              phải thuộc  TaskStatus
                                              enum E      

  \@Matches(regex)      class-validator       Giá trị     \@Matches(/\^(?=.\*\[A-Z\])/)
                                              phải khớp   password: string
                                              regex       

  \@Type(() =\> T)      class-transformer     Chuyển đổi  \@Type(() =\> Number) page:
                                              kiểu (query number
                                              string →    
                                              number)     

  \@WebSocketServer()   \@nestjs/websockets   Inject      \@WebSocketServer() server:
                                              WebSocket   Server
                                              server      
                                              instance    
  --------------------- --------------------- ----------- -------------------------------

Ví dụ thực tế --- CreateTaskDto kết hợp nhiều validation decorators:

> export class CreateTaskDto {\
> \@IsString()\
> \@MinLength(1, { message: \'Title must not be empty\' })\
> title: string;\
> \
> \@IsOptional()\
> \@IsString()\
> description?: string;\
> \
> \@IsEnum(TaskPriority)\
> priority: TaskPriority;\
> \
> \@IsOptional()\
> \@IsDateString()\
> dueDate?: string;\
> }

**e) Custom Decorators --- Tự tạo decorator riêng**

Ngoài các decorator có sẵn, NestJS cho phép tạo decorator tùy chỉnh để
giải quyết các nhu cầu đặc thù của dự án. Trong dự án TodoList
Collaboration, nhóm đã tạo hai custom decorators:

  ----------------- ----------- ---------- ------------------------------
  **Decorator**     **Loại**    **Ý        **Cách tạo**
                                nghĩa**    

  \@Public()        Method      Đánh dấu   SetMetadata(\'isPublic\',
                    Decorator   route      true)
                                không cần  
                                JWT        

  \@CurrentUser()   Parameter   Lấy thông  createParamDecorator(\...)
                    Decorator   tin user   
                                từ request 
  ----------------- ----------- ---------- ------------------------------

> // \@Public() --- cho phép truy cập không cần đăng nhập\
> export const IS_PUBLIC_KEY = \'isPublic\';\
> export const Public = () =\> SetMetadata(IS_PUBLIC_KEY, true);\
> \
> // Sử dụng: route register và login không cần JWT\
> \@Public()\
> \@Post(\'register\')\
> register(@Body() dto: RegisterDto) { \... }

// \@CurrentUser() --- trích xuất user từ request.user (do JwtStrategy
gắn vào)

export const CurrentUser = createParamDecorator(

(data: string \| undefined, ctx: ExecutionContext) =\> {

const request = ctx.switchToHttp().getRequest();

const user = request.user;

return data ? user?.\[data\] : user;

},

);

// Sử dụng: lấy userId mà không cần inject \@Req()

\@Get(\'me\')

getProfile(@CurrentUser(\'id\') userId: string) { \... }

#### 4.1.5. Generics cơ bản

Generics là một tính năng mạnh mẽ cho phép viết code linh hoạt và có thể
tái sử dụng cho nhiều kiểu dữ liệu khác nhau. Thay vì viết nhiều hàm
riêng biệt cho từng kiểu, chúng ta có thể viết một hàm generic hoạt động
với bất kỳ kiểu nào được truyền vào.

Trong NestJS và Prisma, Generics được sử dụng thường xuyên. Ví dụ, khi
tạo một hàm response chuẩn hóa cho API, chúng ta có thể viết hàm generic
để sử dụng lại cho mọi loại dữ liệu trả về:

![](media/image24.gif){width="6.267716535433071in"
height="3.3055555555555554in"}

Cú pháp \<T\> định nghĩa một type parameter có tên là T. Khi gọi hàm
hoặc sử dụng interface, chúng ta truyền kiểu cụ thể (Task, Task\[\]) vào
vị trí của T. Trình biên dịch sẽ tự động suy luận kiểu trả về dựa trên
type parameter được truyền vào, đảm bảo type safety xuyên suốt ứng dụng.

#### 4.1.6. Các từ khóa nền tảng của TypeScript

Trước khi đi sâu vào kiến trúc NestJS, cần nắm vững các từ khóa nền tảng
mà TypeScript kế thừa và mở rộng từ JavaScript. Những từ khóa này xuất
hiện ở mọi file trong dự án và là \"ngữ pháp\" cơ bản mà mọi đoạn code
NestJS đều tuân theo.

##### 4.1.6.1. import / export --- Hệ thống module ES

Trong một dự án NestJS, code được chia thành hàng chục file riêng biệt:
mỗi Controller, Service, DTO, Guard nằm ở file khác nhau. Từ khóa import
và export chính là cơ chế giúp các file này \"nói chuyện\" được với
nhau.

**\`export\`** --- công khai một thành phần ra bên ngoài file. Bất kỳ
class, function, biến hay interface nào có từ khóa export phía trước đều
có thể được file khác sử dụng. Ngược lại, nếu không có export, thành
phần đó chỉ tồn tại trong phạm vi file chứa nó.

**\`import\`** --- nhập một thành phần đã được export từ file khác hoặc
từ thư viện bên ngoài.

> // ── task.service.ts ──\
> // export class → cho phép file khác import TaskService\
> export class TaskService {\
> async findAll() { \... }\
> }\
> \
> // ── task.controller.ts ──\
> // import → nhập TaskService từ file task.service.ts\
> import { TaskService } from \'./task.service\';\
> // import từ thư viện NestJS\
> import { Controller, Get } from \'@nestjs/common\';\
> \
> \@Controller(\'tasks\')\
> export class TaskController {\
> constructor(private readonly taskService: TaskService) {}\
> }

Có hai kiểu export cần phân biệt. **Named export** (xuất có tên) cho
phép một file export nhiều thành phần, khi import phải dùng cặp ngoặc
nhọn {} và đúng tên. **Default export** (xuất mặc định) cho phép mỗi
file export một thành phần chính, khi import có thể đặt tên tùy ý và
không cần ngoặc nhọn:

> // Named export --- một file có thể export nhiều thứ\
> export class TaskService { \... }\
> export class TaskHelper { \... }\
> export const MAX_TASKS = 100;\
> // Import: phải dùng đúng tên\
> import { TaskService, MAX_TASKS } from \'./task.service\';\
> \
> // Default export --- mỗi file chỉ một default\
> export default class TaskService { \... }\
> // Import: đặt tên tùy ý, không cần {}\
> import MyTaskService from \'./task.service\';

Trong dự án NestJS, quy ước chung là **luôn dùng Named export** vì nó rõ
ràng và IDE hỗ trợ auto-import tốt hơn. Đây cũng là lý do mọi file trong
dự án TodoList Collaboration đều viết export class \... thay vì export
default class \....

##### 4.1.6.2. async / await --- Lập trình bất đồng bộ

Trong một ứng dụng backend, hầu hết các thao tác đều mất thời gian chờ:
truy vấn database, gọi API bên ngoài, đọc file, gửi email. Nếu viết code
\"đồng bộ\" (synchronous), server sẽ bị treo cứng tại mỗi thao tác chờ
này, không thể xử lý request khác cho đến khi thao tác hoàn tất.

**\`async\`** --- đặt trước một function để đánh dấu hàm đó là bất đồng
bộ. Hàm async luôn trả về một Promise --- một \"lời hứa\" rằng kết quả
sẽ có trong tương lai.

**\`await\`** --- chỉ dùng được bên trong hàm async, ra lệnh cho
JavaScript tạm dừng tại dòng đó và chờ cho đến khi Promise trả về kết
quả rồi mới chạy tiếp dòng kế tiếp.

> // Không có async/await --- code chạy tuần tự, server bị block\
> function findTask(id: string) {\
> const task = prisma.task.findUnique({ where: { id } }); // Trả về
> Promise, chưa có data!\
> console.log(task); // In ra: Promise { \<pending\> } --- không phải
> task thật!\
> }\
> \
> // Có async/await --- chờ đúng lúc, nhận đúng data\
> async function findTask(id: string) {\
> const task = await prisma.task.findUnique({ where: { id } }); // Chờ
> query xong\
> console.log(task); // In ra: { id: \'\...\', title: \'\...\', \... }
> --- data thật!\
> }

Trong dự án, mọi method gọi database đều bắt buộc dùng async/await vì
Prisma Client trả về Promise:

> \@Injectable()\
> export class TaskService {\
> // async → hàm bất đồng bộ, trả về Promise\<Task\[\]\>\
> async findByProject(projectId: string) {\
> // await → chờ Prisma query database xong mới return\
> return await this.prisma.task.findMany({\
> where: { projectId },\
> orderBy: { position: \'asc\' },\
> });\
> }\
> \
> async create(dto: CreateTaskDto) {\
> // Có thể await nhiều lần trong cùng một hàm\
> const project = await this.prisma.project.findUnique({ where: { id:
> dto.projectId } });\
> if (!project) throw new NotFoundException(\'Project not found\');\
> \
> const task = await this.prisma.task.create({ data: dto });\
> return task;\
> }\
> }

Khi cần chạy nhiều thao tác bất đồng bộ cùng lúc (song song) để tiết
kiệm thời gian, sử dụng Promise.all(). Trong dự án, Prisma \$transaction
cũng hoạt động theo nguyên lý tương tự:

> // Tuần tự --- chậm: chờ xong cái này mới chạy cái kia\
> const users = await this.prisma.user.count(); // 100ms\
> const tasks = await this.prisma.task.count(); // 100ms\
> // Tổng: \~200ms\
> \
> // Song song --- nhanh: chạy đồng thời, chờ cái lâu nhất\
> const \[users, tasks\] = await Promise.all(\[\
> this.prisma.user.count(), // 100ms ─┐\
> this.prisma.task.count(), // 100ms ─┤ chạy cùng lúc\
> \]); // Tổng: \~100ms\
> \
> // Prisma \$transaction --- đảm bảo tất cả thành công hoặc tất cả
> rollback\
> await this.prisma.\$transaction(\[\
> this.prisma.user.update({ where: { id }, data: { password:
> hashedPassword } }),\
> this.prisma.refreshToken.updateMany({ where: { userId: id }, data: {
> revokedAt: new Date() } }),\
> \]);

##### 4.1.6.3. class, extends, implements --- Lập trình hướng đối tượng

NestJS được xây dựng hoàn toàn trên nền tảng lập trình hướng đối tượng
(OOP). Ba từ khóa class, extends và implements là bộ khung xương cho mọi
thành phần trong ứng dụng.

**\`class\`** --- khai báo một lớp, là bản thiết kế (blueprint) để tạo
ra các đối tượng. Trong NestJS, gần như mọi thứ đều là class:
Controller, Service, Guard, Interceptor, Filter, DTO, Module.

**\`extends\`** --- cho phép một class kế thừa (inherit) toàn bộ thuộc
tính và phương thức từ class cha. Class con có thể sử dụng tất cả những
gì class cha có, đồng thời bổ sung hoặc ghi đè (override) theo nhu cầu
riêng.

**\`implements\`** --- bắt buộc một class phải tuân theo \"hợp đồng\"
(contract) được định nghĩa bởi một interface. Nếu class thiếu bất kỳ
method nào mà interface yêu cầu, TypeScript sẽ báo lỗi ngay lúc compile.

> // ── class cơ bản ──\
> class TaskService {\
> async findAll() { \... }\
> }\
> \
> // ── extends --- kế thừa ──\
> // PrismaService kế thừa PrismaClient → có sẵn tất cả method query
> database\
> class PrismaService extends PrismaClient {\
> // Không cần viết lại findMany, create, update\... --- đã có từ
> PrismaClient\
> }\
> \
> // ── implements --- tuân theo interface ──\
> // Interface OnModuleInit yêu cầu phải có method onModuleInit()\
> // Interface OnModuleDestroy yêu cầu phải có method onModuleDestroy()\
> class PrismaService extends PrismaClient implements OnModuleInit,
> OnModuleDestroy {\
> async onModuleInit() { // Bắt buộc --- nếu thiếu sẽ báo lỗi\
> await this.\$connect();\
> }\
> async onModuleDestroy() { // Bắt buộc --- nếu thiếu sẽ báo lỗi\
> await this.\$disconnect();\
> }\
> }

Một ví dụ khác từ dự án --- JwtAuthGuard kế thừa AuthGuard của Passport
và ghi đè method canActivate để thêm logic bypass cho route public:

> // extends AuthGuard(\'jwt\') → kế thừa toàn bộ logic xác thực JWT từ
> Passport\
> // Ghi đè canActivate() → thêm logic kiểm tra \@Public() metadata\
> \@Injectable()\
> export class JwtAuthGuard extends AuthGuard(\'jwt\') {\
> constructor(private reflector: Reflector) {\
> super(); // Gọi constructor của class cha\
> }\
> \
> canActivate(context: ExecutionContext) {\
> const isPublic =
> this.reflector.getAllAndOverride\<boolean\>(\'isPublic\', \[\
> context.getHandler(),\
> context.getClass(),\
> \]);\
> if (isPublic) return true; // Route \@Public() → cho qua không cần
> JWT\
> return super.canActivate(context); // Route bình thường → gọi logic
> JWT của class cha\
> }\
> }

  --------------- ---------------------- --------------------------------
  **Từ khóa**     **Vai trò**            **Ví dụ trong dự án**

  class           Khai báo lớp           class TaskService {}, class
                                         CreateTaskDto {}

  extends         Kế thừa class cha      PrismaService extends
                                         PrismaClient

  implements      Tuân theo interface    PrismaService implements
                                         OnModuleInit

  super()         Gọi constructor/method super.canActivate(context) trong
                  của class cha          Guard
  --------------- ---------------------- --------------------------------

##### 4.1.6.4. Access Modifiers --- private, readonly, protected

Access Modifiers (Bộ điều chỉnh truy cập) kiểm soát phạm vi truy cập của
thuộc tính và phương thức trong class. TypeScript cung cấp ba modifier
chính.

**\`public\`** (mặc định) --- truy cập được từ bất kỳ đâu. Nếu không
viết modifier nào, TypeScript mặc định là public.

**\`private\`** --- chỉ truy cập được từ bên trong class chứa nó. Code
bên ngoài không thể đọc hoặc ghi trực tiếp.

**\`protected\`** --- giống private, nhưng class con (extends) cũng có
thể truy cập.

**\`readonly\`** --- cho phép đọc nhưng cấm ghi lại sau khi đã gán giá
trị ban đầu. Thường kết hợp với private để tạo thuộc tính bất biến.

> \@Injectable()\
> export class AuthService {\
> // private readonly → chỉ dùng bên trong AuthService, không thể gán
> lại\
> constructor(\
> private readonly prisma: PrismaService,\
> private readonly jwtService: JwtService,\
> private readonly mailService: MailService,\
> ) {}\
> \
> // private method → chỉ gọi được từ bên trong AuthService\
> private async generateTokens(userId: string, email: string) {\
> const accessToken = this.jwtService.sign({ sub: userId, email });\
> const refreshToken = this.jwtService.sign(\
> { sub: userId, email },\
> { secret: process.env.JWT_REFRESH_SECRET, expiresIn: \'7d\' },\
> );\
> return { accessToken, refreshToken };\
> }\
> \
> // public method (mặc định) → Controller có thể gọi\
> async login(dto: LoginDto) {\
> const user = await this.prisma.user.findUnique({ where: { email:
> dto.email } });\
> // \...\
> return this.generateTokens(user.id, user.email); // Gọi private method
> nội bộ\
> }\
> }

Trong NestJS, cú pháp private readonly trong constructor có một tính
năng đặc biệt gọi là **Parameter Properties** --- TypeScript tự động vừa
khai báo thuộc tính vừa gán giá trị, giúp code ngắn gọn hơn nhiều so với
cách viết truyền thống:

> // Cách viết đầy đủ (truyền thống) --- dài dòng\
> class TaskService {\
> private readonly prisma: PrismaService;\
> constructor(prisma: PrismaService) {\
> this.prisma = prisma;\
> }\
> }\
> \
> // Cách viết rút gọn (Parameter Properties) --- NestJS convention\
> class TaskService {\
> constructor(private readonly prisma: PrismaService) {}\
> // ↑ Một dòng này tương đương cả 4 dòng ở trên!\
> }

  ---------------- -------------------- ---------------------------------
  **Modifier**     **Phạm vi truy cập** **Ví dụ dự án**

  public           Mọi nơi (mặc định)   async login(dto) --- Controller
                                        gọi được

  private          Chỉ trong class      private generateTokens() --- chỉ
                                        AuthService gọi

  protected        Class + class con    Ít dùng trong NestJS, có thể gặp
                                        khi extend base class

  readonly         Đọc, không ghi lại   private readonly prisma --- không
                                        thể this.prisma = khác
  ---------------- -------------------- ---------------------------------

##### 4.1.6.5. Enum --- Tập hằng số có tên

Enum (Enumeration) cho phép định nghĩa một tập hợp các hằng số có tên,
giúp code dễ đọc hơn so với việc dùng chuỗi hoặc số trực tiếp. Trong dự
án TodoList Collaboration, Enum được sử dụng rộng rãi để định nghĩa các
trạng thái, mức ưu tiên và vai trò.

Có hai loại Enum phổ biến. **String Enum** --- mỗi thành viên có giá trị
là chuỗi, phổ biến trong NestJS vì dễ đọc khi debug và tương thích tốt
với database. **Numeric Enum** --- mỗi thành viên có giá trị là số tự
tăng (0, 1, 2\...), ít dùng trong NestJS vì khó đọc khi debug.

> // ── String Enum --- dùng trong dự án ──\
> enum TaskStatus {\
> TODO = \'TODO\',\
> IN_PROGRESS = \'IN_PROGRESS\',\
> REVIEW = \'REVIEW\',\
> DONE = \'DONE\',\
> }\
> \
> enum TaskPriority {\
> LOW = \'LOW\',\
> NORMAL = \'NORMAL\',\
> HIGH = \'HIGH\',\
> URGENT = \'URGENT\',\
> }\
> \
> enum WorkspaceRole {\
> OWNER = \'OWNER\',\
> ADMIN = \'ADMIN\',\
> MEMBER = \'MEMBER\',\
> }\
> \
> // Sử dụng Enum thay vì magic string\
> const task = await this.prisma.task.findMany({\
> where: { status: TaskStatus.TODO }, // ✅ Rõ ràng, IDE gợi ý\
> // thay vì: where: { status: \'TODO\' }, // ❌ Dễ typo, không gợi ý\
> });

Trong Prisma schema, Enum được khai báo bằng từ khóa enum và Prisma tự
động sinh ra TypeScript Enum tương ứng để sử dụng trong code:

> // prisma/schema.prisma\
> enum TaskStatus {\
> TODO\
> IN_PROGRESS\
> REVIEW\
> DONE\
> }
>
> // Prisma tự sinh --- import trực tiếp, không cần tự định nghĩa\
> import { TaskStatus } from \'@prisma/client\';\
> // Sử dụng y hệt enum thường: TaskStatus.TODO, TaskStatus.DONE

  --------------------- -------------------------- ---------------------
  **Enum trong dự án**  **Các giá trị**            **Nơi sử dụng**

  TaskStatus            TODO, IN_PROGRESS, REVIEW, Task entity, filter,
                        DONE                       update

  TaskPriority          LOW, NORMAL, HIGH, URGENT  Task entity, filter,
                                                   sort

  WorkspaceRole         OWNER, ADMIN, MEMBER       WorkspaceMember, phân
                                                   quyền

  UserStatus            ACTIVE, INACTIVE, BANNED   User entity, trạng
                                                   thái tài khoản

  ProjectStatus         ACTIVE, ARCHIVED           Project entity, lọc
                                                   dự án

  NotificationType      TASK_ASSIGNED,             Notification entity
                        COMMENT_ADDED, \... (10    
                        loại)                      

  InvitationStatus      PENDING, ACCEPTED,         WorkspaceInvite
                        EXPIRED, REVOKED           entity

  ActivityLogAction     WORKSPACE_CREATED,         Activity log tracking
                        MEMBER_ADDED, \... (10     
                        loại)                      
  --------------------- -------------------------- ---------------------

##### 4.1.6.6. Utility Types --- Partial, Pick, Omit

TypeScript cung cấp sẵn một bộ **Utility Types** --- các \"công cụ biến
hình\" cho phép tạo kiểu mới từ kiểu đã có mà không cần viết lại từ đầu.
Trong NestJS, Utility Types đặc biệt hữu ích khi xây dựng DTOs cho các
thao tác CRUD --- bộ field cần thiết khi tạo mới sẽ khác khi cập nhật.

**\`Partial\<T\>\`** --- biến tất cả thuộc tính của T thành optional.
Rất phù hợp cho Update DTO --- khi cập nhật, user có thể chỉ gửi một vài
field thay vì toàn bộ:

> interface Task {\
> id: string;\
> title: string;\
> description: string;\
> status: TaskStatus;\
> priority: TaskPriority;\
> }\
> \
> type UpdateTaskInput = Partial\<Task\>;\
> // Tương đương viết tay:\
> // {\
> // id?: string;\
> // title?: string;\
> // description?: string;\
> // status?: TaskStatus;\
> // priority?: TaskPriority;\
> // }

**\`Pick\<T, Keys\>\`** --- chọn ra một tập con các thuộc tính từ T. Phù
hợp khi chỉ cần một vài field cụ thể:

> type TaskSummary = Pick\<Task, \'id\' \| \'title\' \| \'status\'\>;\
> // Tương đương:\
> // { id: string; title: string; status: TaskStatus; }\
> \
> // Dùng cho danh sách task --- không cần load toàn bộ field\
> const tasks: TaskSummary\[\] = await this.prisma.task.findMany({\
> select: { id: true, title: true, status: true },\
> });

**\`Omit\<T, Keys\>\`** --- loại bỏ một số thuộc tính khỏi T. Phù hợp
khi tạo mới --- server tự sinh id và createdAt:

> type CreateTaskInput = Omit\<Task, \'id\' \| \'createdAt\' \|
> \'updatedAt\'\>;\
> // Có tất cả field của Task TRỪ id, createdAt, updatedAt

**\`Record\<Keys, Value\>\`** --- tạo object type với key và value được
chỉ định. Phù hợp cho cấu hình dạng key-value:

> // Đếm số task theo từng status\
> type TaskCountByStatus = Record\<TaskStatus, number\>;\
> // Tương đương: { TODO: number; IN_PROGRESS: number; REVIEW: number;
> DONE: number; }\
> \
> const counts: TaskCountByStatus = {\
> TODO: 5,\
> IN_PROGRESS: 3,\
> REVIEW: 2,\
> DONE: 10,\
> };

Trong dự án thực tế, các Utility Types thường được kết hợp với nhau để
tạo ra type chính xác cho từng tình huống:

> // Kết hợp Pick + Partial: chọn một số field, tất cả đều optional\
> type UpdateProfileInput = Partial\<Pick\<User, \'displayName\' \|
> \'bio\' \| \'name\'\>\>;\
> \
> // Kết hợp Omit + Required: bỏ id, bắt buộc các field còn lại\
> type CreateProjectInput = Required\<Omit\<Project, \'id\' \|
> \'createdAt\' \| \'updatedAt\'\>\>;

  ------------------ ------------------------- -------------------------
  **Utility Type**   **Tác dụng**              **Use-case phổ biến**

  Partial\<T\>       Tất cả field → optional   Update DTO

  Pick\<T, K\>       Chỉ giữ các field được    Summary/List response
                     chọn                      

  Omit\<T, K\>       Bỏ các field được chọn    Create DTO (bỏ id,
                                               timestamps)

  Record\<K, V\>     Tạo object type key-value Config, count aggregation

  Required\<T\>      Tất cả field → bắt buộc   Đảm bảo không thiếu field

  Readonly\<T\>      Tất cả field → không thể  Config bất biến, select
                     ghi                       fields
  ------------------ ------------------------- -------------------------

#### 4.1.7. Bài tập ứng dụng TypeScript

**Bài 1 --- Interface, Enum và Type Alias:** Cho hệ thống quản lý
Workspace, hãy định nghĩa:

> // 1. Enum WorkspaceRole với 3 giá trị: OWNER, ADMIN, MEMBER\
> // 2. Interface WorkspaceMember gồm: id, userId, workspaceId, role
> (WorkspaceRole), joinedAt\
> // 3. Interface Workspace gồm: id, name, description?, ownerId,
> members (mảng WorkspaceMember), createdAt\
> // 4. Type CreateWorkspaceInput = chỉ gồm name và description (dùng
> Pick hoặc Omit)\
> // 5. Type WorkspaceSummary = chỉ gồm id, name, role của user hiện tại

Đáp án:

> enum WorkspaceRole {\
> OWNER = \'OWNER\',\
> ADMIN = \'ADMIN\',\
> MEMBER = \'MEMBER\',\
> }\
> \
> interface WorkspaceMember {\
> id: string;\
> userId: string;\
> workspaceId: string;\
> role: WorkspaceRole;\
> joinedAt: Date;\
> }\
> \
> interface Workspace {\
> id: string;\
> name: string;\
> description?: string;\
> ownerId: string;\
> members: WorkspaceMember\[\];\
> createdAt: Date;\
> }\
> \
> type CreateWorkspaceInput = Pick\<Workspace, \'name\' \|
> \'description\'\>;\
> \
> type WorkspaceSummary = Pick\<Workspace, \'id\' \| \'name\'\> & {
> role: WorkspaceRole };

**Bài 2 --- async/await:** Viết hàm getTaskDashboard truy vấn song song
ba thao tác rồi trả về kết quả gộp:

> // Yêu cầu: dùng Promise.all để chạy song song ba query:\
> // 1. Đếm tổng tasks\
> // 2. Đếm tasks có status DONE\
> // 3. Lấy 5 tasks gần nhất (orderBy createdAt desc, take 5)\
> // Trả về object { total, completed, recentTasks }\
> \
> async function getTaskDashboard(projectId: string): Promise\<{\
> total: number;\
> completed: number;\
> recentTasks: Task\[\];\
> }\> {\
> // Viết code ở đây\
> }

Đáp án:

> async function getTaskDashboard(projectId: string) {\
> const \[total, completed, recentTasks\] = await Promise.all(\[\
> prisma.task.count({ where: { projectId } }),\
> prisma.task.count({ where: { projectId, status: TaskStatus.DONE } }),\
> prisma.task.findMany({\
> where: { projectId },\
> orderBy: { createdAt: \'desc\' },\
> take: 5,\
> }),\
> \]);\
> \
> return { total, completed, recentTasks };\
> }

**Bài 3 --- class, extends, private readonly:** Hoàn thành class
NotificationService kế thừa pattern từ TaskService:

> // Yêu cầu:\
> // 1. Class NotificationService với \@Injectable()\
> // 2. Inject PrismaService và EventsService qua constructor (private
> readonly)\
> // 3. Private method: buildNotificationData(\...) → tạo object
> notification\
> // 4. Public method: createAndNotify(userId, type, data) →\
> // - Tạo notification trong database\
> // - Emit event qua WebSocket đến user\
> // - Return notification đã tạo\
> \
> // Viết code ở đây

Đáp án:

\@Injectable()

export class NotificationService {

constructor(

private readonly prisma: PrismaService,

private readonly eventsService: EventsService,

) {}

private buildNotificationData(userId: string, type: NotificationType,
data: any) {

return {

userId,

type,

title: data.title,

content: data.content,

entityId: data.entityId,

actorId: data.actorId,

};

}

async createAndNotify(userId: string, type: NotificationType, data: any)
{

const notificationData = this.buildNotificationData(userId, type, data);

const notification = await this.prisma.notification.create({

data: notificationData,

});

this.eventsService.emitToUser(userId, \'notification:new\',
notification);

return notification;

}

}

### 4.2. Modules -- Đơn vị tổ chức code

#### 4.2.1. Module là gì?

Trong NestJS, Module là đơn vị cơ bản để tổ chức ứng dụng. Mỗi Module
đóng gói một nhóm các thành phần có liên quan với nhau, bao gồm
Controllers, Services, và các Providers khác. Cách tổ chức này tuân theo
nguyên tắc \"Separation of Concerns\" (Phân tách mối quan tâm), giúp
code dễ quản lý, bảo trì và kiểm thử.

Một ứng dụng NestJS luôn có ít nhất một Module gốc (root module), thường
được đặt tên là AppModule. Module gốc này import các Module con khác để
tạo thành cây dependencies hoàn chỉnh. Trong sơ đồ cấu trúc module,
Application Module (hay Root Module) đóng vai trò là điểm bắt đầu của
ứng dụng, thực hiện việc kết nối và quản lý toàn bộ hệ thống thông qua
việc import các module chức năng chính.

Module là một class được gắn decorator \@Module(). Decorator này cung
cấp metadata mà NestJS sử dụng để tổ chức cấu trúc ứng dụng. Hãy xem ví
dụ TaskModule --- module quản lý công việc trong dự án TodoList
Collaboration:

![](media/image25.gif){width="6.267716535433071in"
height="2.013888888888889in"}

![](media/image26.jpg){width="6.267716535433071in"
height="3.4027777777777777in"}

Trong sơ đồ trên, Application Module (hay Root Module) đóng vai trò là
điểm bắt đầu của ứng dụng, thực hiện việc kết nối và quản lý toàn bộ hệ
thống thông qua việc import các module chức năng chính.

Tầng Module cấp một: Application Module trực tiếp import ba module con
là Users Module, Orders Module, và Chat Module.

Tầng Module chức năng (Features): Bên dưới các module chính, hệ thống có
thể tiếp tục phân tách thành các Feature Module 1, 2, và 3. Việc chia
nhỏ này giúp quản lý các tính năng chuyên biệt mà không làm ảnh hưởng
đến cấu trúc tổng thể.

Cách tổ chức theo sơ đồ hình cây này giúp ứng dụng đạt được tính
Modularization (mô-đun hóa). Khi ứng dụng phát triển lớn hơn, ta có thể
dễ dàng bảo trì hoặc thay thế một module cụ thể (ví dụ: nâng cấp Chat
Module) mà không gây tác động dây chuyền đến các phần khác của hệ thống.

#### 4.2.2. Tính đóng gói (Encapsulation) và cấu trúc \@Module decorator

Một trong những concept quan trọng nhất của NestJS là Tính đóng gói
(Encapsulation). Theo mặc định, mọi thứ (Service, Provider) bạn tạo ra
bên trong một Module đều là \"trạng thái Private\" (bí mật). Chỉ có các
Controller và Service nằm cùng chung một Module mới được phép sử dụng
chúng.

Để các Module có thể giao tiếp và chia sẻ Service cho nhau, chúng ta sử
dụng decorator \@Module() với 4 thuộc tính cấu hình cốt lõi: providers,
controllers, exports, và imports.

Hãy xem xét một kịch bản thực tế: TaskModule cần truy cập cơ sở dữ liệu
để tìm danh sách công việc, do đó nó cần sử dụng PrismaService - vốn
đang nằm tít bên trong PrismaModule. Quá trình \"trao đổi\" này bắt buộc
phải diễn ra qua 3 bước liên tiếp. Đầu tiên, PrismaModule phải \"công
khai\" PrismaService ra bên ngoài thông qua mảng exports. Nếu không có
bước này, PrismaService mãi mãi bị khóa chặt bên trong PrismaModule.

![](media/image27.jpg){width="6.236111111111111in"
height="1.4027777777777777in"}

Tiếp theo, TaskModule không thể tự ý lấy PrismaService về dùng trực
tiếp. Thay vào đó, nó phải \"xin phép kết nối\" với PrismaModule bằng
cách khai báo import toàn bộ module bên ngoài đó thông qua mảng imports.

![](media/image28.jpg){width="6.267716535433071in"
height="1.3055555555555556in"}

Chỉ khi hoàn thành đúng 2 bước exports và imports ở 2 file Module như
trên, thì bên trong file task.service.ts, chúng ta mới có thể \"tiêm\"
(Inject) PrismaService vào constructor và sử dụng bình thường. Quy tắc
quan trọng cần nhớ: ta phải import nguyên một Module (PrismaModule), chứ
không thể import trực tiếp một Service (PrismaService) từ module khác.

![](media/image29.jpg){width="6.267716535433071in"
height="1.9305555555555556in"}

Trong một dự án thực tế, PrismaService (kết nối Database) là thứ mà hầu
như Module nào cũng cần (Auth, User, Project, Task\...). Việc bắt Module
nào cũng phải khai báo imports: \[PrismaModule\] sẽ gây lặp code rườm
rà. Để giải quyết, NestJS cung cấp một giải pháp gọn gàng hơn: biến
PrismaModule thành Module toàn cầu bằng decorator \@Global(). Khi bạn
gắn decorator này lên PrismaModule và import nó duy nhất một lần tại
AppModule (Root), PrismaService sẽ tự động được cung cấp cho toàn bộ ứng
dụng. Lúc này, TaskModule hay bất kỳ Module nào khác đều có thể lấy
PrismaService ra dùng mà không cần khai báo imports: \[PrismaModule\]
nữa.

#### 4.2.3. Module types

Trong một ứng dụng NestJS thực tế, chúng ta thường phân loại Module
thành bốn nhóm chính dựa trên mục đích sử dụng, nhằm giúp quản lý mã
nguồn theo hướng Modular Design.

##### 4.2.3.1. Feature Module

Feature Module là các Module chứa logic cho một tính năng cụ thể của ứng
dụng. Trong dự án TodoList Collaboration, các Feature Module bao gồm
AuthModule (xác thực người dùng), TaskModule (quản lý công việc),
WorkspaceModule (quản lý không gian làm việc) và ProjectModule (quản lý
dự án). Mỗi Feature Module hoạt động hoàn toàn độc lập, chỉ tập trung
vào một domain cụ thể và chỉ export những gì nó muốn chia sẻ với bên
ngoài.

Ví dụ:

![](media/image30.gif){width="6.267716535433071in" height="1.875in"}

![](media/image31.gif){width="6.267716535433071in"
height="3.2916666666666665in"}

##### 4.2.3.2. Shared Module

Shared Module là các Module cung cấp các service dùng chung cho toàn bộ
ứng dụng. Ví dụ điển hình là PrismaModule cung cấp kết nối database cho
tất cả các Module khác. Shared Module thường được đánh dấu là \@Global()
để không cần import lặp đi lặp lại ở mọi nơi.

![](media/image32.gif){width="6.267716535433071in"
height="1.6944444444444444in"}

![](media/image33.gif){width="6.267716535433071in"
height="2.611111111111111in"}

##### 4.2.3.3. Core Module (Root Module)

Core Module thường chỉ có một trong ứng dụng, đó là AppModule. Module
này đóng vai trò là điểm khởi đầu, nơi tập hợp và khởi tạo tất cả các
Module khác:

![](media/image34.jpg){width="6.267716535433071in"
height="3.1527777777777777in"}

##### 4.2.3.4. Dynamic Module

Dynamic Module là các Module có thể được cấu hình khác nhau tùy theo nơi
import. Thay vì hard-code cấu hình, Dynamic Module cho phép truyền
options khi import thông qua các static methods như forRoot(),
forRootAsync() hoặc register().

![](media/image35.jpg){width="6.267716535433071in"
height="3.013888888888889in"}

Tóm lại, mỗi loại Module đảm nhận một vị trí riêng trong tổng thể kiến
trúc: Feature Module là các \"bộ phận chức năng\" độc lập (TaskModule,
AuthModule), Shared Module là \"nguồn điện trung tâm\" phục vụ cho mọi
phòng ban (PrismaModule), Core Module là \"Ban giám đốc\" điều phối toàn
bộ (AppModule), và Dynamic Module là những \"thiết bị tự cài đặt\" có
thể cấu hình linh hoạt tùy ngữ cảnh (ConfigModule, JwtModule).

Việc tổ chức ứng dụng theo kiến trúc module hóa mang lại nhiều lợi ích
thiết thực. Đầu tiên là nguyên tắc Separation of Concerns --- khi mỗi
module chỉ tập trung vào một domain, code trở nên dễ hiểu hơn. Tiếp theo
là tính tái sử dụng code --- TaskService có thể được export và sử dụng
bởi nhiều module khác nhau. Ngoài ra, kiến trúc này giúp kiểm thử dễ
dàng vì mỗi module có thể được test độc lập, và hỗ trợ làm việc nhóm
hiệu quả vì mỗi thành viên có thể phát triển module riêng mà không gây
xung đột mã nguồn.

### 4.3. Controllers - Xử lý HTTP Requests

#### 4.3.1. Controller là gì?

Trong kiến trúc của NestJS, Controller đóng vai trò như người gác cổng
của ứng dụng - nơi tiếp nhận mọi HTTP request từ phía client. Để hiểu rõ
vai trò này, hãy hình dung Controller như một nhân viên lễ tân tại một
công ty: họ tiếp nhận yêu cầu từ khách hàng, xác định khách cần gặp ai
hoặc cần dịch vụ gì, sau đó chuyển tiếp yêu cầu đến đúng bộ phận xử lý,
và cuối cùng trả kết quả về cho khách.

Khi một HTTP request đến server, Controller là thành phần đầu tiên xử lý
request đó. Controller phân tích xem client muốn thực hiện thao tác gì
dựa trên HTTP method (GET, POST, PUT, DELETE) và đường dẫn URL, sau đó
chuyển tiếp yêu cầu đến tầng Service để thực hiện business logic. Khi
Service hoàn thành công việc và trả về kết quả, Controller sẽ đóng gói
kết quả đó thành HTTP response với status code và format phù hợp rồi gửi
về cho client.

Để đánh dấu một class là Controller, chúng ta sử dụng decorator
\@Controller() với tham số là đường dẫn route cơ sở. Ví dụ, khi khai báo
\@Controller(\'tasks\'), mọi endpoint bên trong Controller này sẽ bắt
đầu bằng đường dẫn /tasks. Nếu bên trong có một method được đánh dấu
\@Get(\'active\'), thì endpoint đầy đủ sẽ là GET /tasks/active. Cách tổ
chức này giúp nhóm các endpoints liên quan lại với nhau, tạo nên cấu
trúc URL rõ ràng và dễ quản lý.

Một nguyên tắc thiết kế quan trọng cần tuân thủ là nguyên tắc Single
Responsibility: Controller không nên chứa business logic phức tạp như
validation nghiệp vụ, tính toán, hay truy vấn database trực tiếp. Vai
trò duy nhất của Controller là nhận request, extract dữ liệu cần thiết
từ request (body, params, query), gọi Service tương ứng, và format
response trả về. Việc tách biệt rõ ràng này mang lại nhiều lợi ích: code
dễ test hơn vì có thể test Controller và Service độc lập, business logic
có thể được tái sử dụng ở nhiều nơi khác nhau, và khi cần thay đổi logic
xử lý, chúng ta chỉ cần sửa trong Service mà không ảnh hưởng đến cách
nhận/trả request.

![](media/image36.jpg){width="6.267716535433071in"
height="2.7222222222222223in"}

#### 4.3.2 HTTP Method Decorators

Trong chuẩn RESTful API, mỗi thao tác CRUD (Create, Read, Update,
Delete) tương ứng với một HTTP method. NestJS cung cấp các decorator
tương ứng để khai báo trực tiếp trên từng phương thức trong Controller.
Decorator \@Get() bắt yêu cầu đọc dữ liệu; khi kết hợp với tham số route
như \@Get(\':id\'), nó sẽ bắt yêu cầu đọc một bản ghi cụ thể theo ID.
Decorator \@Post() xử lý yêu cầu tạo mới, \@Patch(\':id\') cho cập nhật
một phần, và \@Delete(\':id\') cho xóa bản ghi. Dưới đây là toàn bộ
TaskController từ dự án, thể hiện rõ cách áp dụng các decorator này:

![](media/image37.jpg){width="6.267716535433071in"
height="5.486111111111111in"}

#### 4.3.3. Request Data Decorators

NestJS cung cấp bộ Parameter Decorators để trích xuất dữ liệu từ các
phần khác nhau của HTTP request, thay thế hoàn toàn việc phải tự tay moi
móc từ object request như trong Express.js thuần túy. Decorator \@Body()
lấy toàn bộ nội dung body dưới dạng object --- đây là cách ta nhận
CreateTaskDto khi user gọi POST /tasks. Nếu chỉ muốn lấy một field cụ
thể, có thể dùng \@Body(\'title\'). Decorator \@Param(\'id\') trích xuất
giá trị biến động trong URL --- ví dụ khi URL là /tasks/abc-123, tham số
id sẽ có giá trị là chuỗi abc-123. Decorator \@Query() lấy tham số truy
vấn (query string) từ URL --- ví dụ /tasks?status=TODO&page=1 cho phép
lọc và phân trang danh sách tasks. Cuối cùng,
\@Headers(\'authorization\') dùng để đọc giá trị JWT Token từ HTTP
header khi cần xác thực thủ công.

Ví dụ endpoint tìm kiếm và lọc tasks với nhiều query parameters:

![](media/image38.gif){width="6.267716535433071in"
height="1.5555555555555556in"}

### 4.4. Providers & Services - Business Logic

#### 4.4.1. Provider là gì?

Provider là một khái niệm cơ bản trong NestJS. Hầu hết các class cơ bản
trong Nest đều có thể được coi là một provider: services, repositories,
factories, helpers, v.v. Ý tưởng chính của một provider là nó có thể
được inject (tiêm) vào các class khác làm dependency. Service là loại
Provider phổ biến nhất, chứa business logic --- tức là logic xử lý
nghiệp vụ thực sự của ứng dụng.

#### 4.4.2 \@Injectable decorator

Để đánh dấu một class là Provider được NestJS quản lý, chúng ta sử dụng
decorator \@Injectable(). Decorator này làm nhiệm vụ \"giơ tay báo
danh\" với NestJS rằng: \"Đây là một Provider, xin hãy quản lý nó giúp
tôi\". Khi đó, class này sẽ được đưa vào IoC Container (Inversion of
Control Container - Thùng chứa Đảo ngược Điều khiển).

Đối với người mới, \"Đảo ngược điều khiển/IoC\" nghe có vẻ hàn lâm nhưng
thực chất rất đơn giản. Bình thường, khi cần dùng một Service (ví dụ gửi
email), bạn phải tự tay khởi tạo nó bằng từ khóa new (Ví dụ: const
emailService = new EmailService()). Tuy nhiên, khi dùng IoC Container,
bạn \"đảo ngược\" (từ bỏ) quyền kiểm soát đó, giao phó hoàn toàn phần
việc vất vả là cấp phát bộ nhớ, khởi tạo và dọn dẹp biến cho hệ thống
NestJS tự động lo liệu. Container chính là cái \"nhà kho\" chứa tất cả
các biến đã được NestJS tạo sẵn để nằm chờ bạn lấy ra dùng.

Hãy xem TaskService --- service chứa toàn bộ business logic xử lý công
việc trong dự án:

![](media/image39.jpg){width="6.267716535433071in"
height="7.902777777777778in"}

Trong ví dụ trên, TaskService sử dụng PrismaService (được inject qua
constructor) để tương tác với database. Mỗi method đại diện cho một thao
tác nghiệp vụ: tìm tasks theo project, lấy chi tiết task, tạo mới, cập
nhật, và xóa mềm (soft delete). Decorator \@Injectable() cho phép NestJS
tự động tạo instance của TaskService và inject PrismaService vào
constructor khi cần.

Sau khi tạo Service, cần đăng ký nó vào Module tương ứng:

![](media/image40.jpg){width="6.267716535433071in"
height="1.2638888888888888in"}

### 4.5. Dependency Injection

#### 4.5.1 DI là gì?

Dependency Injection (DI) là một design pattern quan trọng mà các
dependency được \"tiêm\" vào từ bên ngoài thay vì class tự khởi tạo.
Trong NestJS, DI là cơ chế chính để kết nối các thành phần với nhau.

Để hiểu rõ hơn, hãy so sánh hai cách tiếp cận. Cách truyền thống (không
có DI), mỗi class phải tự tay tạo ra các công cụ mà nó cần dùng. Điều
này dẫn đến tình trạng Tight Coupling (Lệ thuộc chặt chẽ) --- giống như
một chiếc xe hơi bị hàn chết cứng động cơ vào khung gầm, nếu động cơ
hỏng là phải ném bỏ cả chiếc xe vì không thể tháo rời để bảo trì riêng.

![](media/image41.jpg){width="6.267716535433071in"
height="1.5694444444444444in"}

Vấn đề của cách viết này là TaskController tự tạo cả TaskService lẫn
PrismaService bằng từ khóa new. Điều này tạo ra hai hệ quả nghiêm trọng:
một là, nếu muốn thay PrismaService bằng một thư viện database khác, lập
trình viên phải mở vào sửa tận trong file Controller --- một nơi vốn
không nên biết gì về database; hai là, không thể viết unit test cho
Controller mà không có kết nối database thật, khiến việc kiểm thử trở
nên chậm và rủi ro.

Trái lại, với Dependency Injection trong NestJS, bộ công cụ (dependency)
được đẩy vào từ bên ngoài thông qua constructor chứ class không tự tạo.
Đây gọi là Loose Coupling (Phụ thuộc lỏng lẻ) --- các bộ phận giờ đây
được lắp ghép linh hoạt như các mảnh Lego, cực kỳ dễ dàng tháo lắp và
thay thế bằng các mảnh ghép khác có cùng hình dáng khi có nhu cầu đổi
mới:

![](media/image42.gif){width="4.611111111111111in"
height="1.1944444444444444in"}

Đoạn code rút gọn này chỉ có một dòng trong constructor, nhưng ẩn chứa
rất nhiều: cú pháp private readonly taskService: TaskService vừa khai
báo biến thành viên, vừa đánh dấu cho NestJS biết cần inject TaskService
vào đây. NestJS sẽ tự tìm instance TaskService thich hợp từ IoC
Container và truyền vào, Controller hoàn toàn không biết --- và cũng
không cần biết --- TaskService được tạo ra như thế nào hay phụ thuộc vào
gì.

#### 4.5.2 Cách hoạt động

Cơ chế Dependency Injection trong NestJS được triển khai thông qua IoC
(Inversion of Control) Container và diễn ra theo một quy trình gồm ba
giai đoạn chính:

Bước 1: Đăng ký Provider

Khi ứng dụng khởi động, NestJS tiến hành quét toàn bộ metadata được khai
báo thông qua các decorator như \@Module() và \@Injectable().

Tại thời điểm này, framework xây dựng một dependency graph (đồ thị phụ
thuộc), mô tả mối quan hệ giữa các module và provider trong hệ thống.

Các class được khai báo trong mảng providers của một module sẽ được đăng
ký vào IoC Container và trở thành các Provider có thể được inject ở
những nơi khác.

Bước 2: Phân tích Dependencies

Sau khi hoàn tất việc đăng ký, NestJS sử dụng cơ chế TypeScript
Reflection để phân tích constructor của từng class.

Thông qua thông tin kiểu dữ liệu (type metadata) của các tham số trong
constructor, framework xác định chính xác những dependency mà class đó
yêu cầu.

Dựa trên dependency graph đã xây dựng, IoC Container sẽ tìm kiếm
Provider tương ứng cho từng dependency trong phạm vi module hiện tại
hoặc các module đã được import.

Bước 3: Khởi tạo và Inject Instance

Khi một class cần được khởi tạo (ví dụ: Controller được sử dụng để xử lý
request), NestJS thực hiện quy trình sau:

> 1\. Kiểm tra xem instance của Provider đã tồn tại trong container hay
> chưa
>
> 2\. Nếu chưa tồn tại, framework sẽ đệ quy khởi tạo toàn bộ các
> dependency cần thiết
>
> 3\. Tạo instance của class với các dependency đã được chuẩn bị
>
> 4\. Lưu instance vào IoC Container để tái sử dụng

Theo mặc định, NestJS áp dụng Singleton scope, nghĩa là mỗi Provider chỉ
được khởi tạo một lần duy nhất trong vòng đời ứng dụng và được tái sử
dụng ở mọi nơi có yêu cầu.

Cơ chế này giúp:

> \- Giảm thiểu việc khởi tạo dư thừa
>
> \- Tối ưu bộ nhớ
>
> \- Tăng khả năng kiểm thử (testability)
>
> \- Đảm bảo tính tách biệt giữa các thành phần (loose coupling)

![](media/image43.gif){width="6.267716535433071in"
height="7.791666666666667in"}

#### 4.5.3 Lợi ích của DI

Dependency Injection mang lại ba lợi ích chính cho việc phát triển ứng
dụng.

Lợi ích đầu tiên là Loose Coupling (Giảm phụ thuộc chặt chẽ).
TaskController không cần biết TaskService được tạo như thế nào hay phụ
thuộc vào những gì. Nếu sau này cần thay đổi implementation (ví dụ:
chuyển từ PrismaService sang TypeORM Repository), chỉ cần thay đổi ở một
nơi mà không ảnh hưởng đến Controller.

Lợi ích thứ hai đến từ việc nó cực kỳ thuận lợi cho những tester (kiểm
thử). Khi viết kịch bản kiểm thử (Unit Tests) cho TaskController, ta
tuyệt nhiên không hề muốn hàm này chọc phá và làm hỏng Database chứa dữ
liệu thật của khách hàng. Nhờ sự lỏng lẻo của DI, ta có thể đánh tráo
PrismaService thật bằng các Mock Objects (Vật đóng thế).

Mock object là những đối tượng giả lập, phác họa vỏ bọc y hệt bản gốc
nhưng phần lõi bên trong chỉ là dữ liệu tĩnh bịa ra khống. Bằng cách lén
\"tiêm\" vật đóng thế này vào trong constructor, ta có thể lừa
Controller để test chức năng một cách an toàn, hoàn toàn cô lập lập với
bên ngoài và chạy siêu tốc (vì không phải chờ kết nối mạng hay ổ cứng
truy vấn Database thật).

Ví dụ, tạo một mock PrismaService giả lập hàm tìm kiếm:

![](media/image44.jpg){width="6.267716535433071in"
height="2.9583333333333335in"}

Có hai yếu tố kỹ thuật cần hiểu trong đoạn code này.
jest.fn().mockResolvedValue(\[\...\]) tạo ra một hàm giả (fake
function): khi bất kỳ ai gọi findMany(), nó không thực sự chạy query
database mà lập tức trả về mảng dữ liệu giả được khai báo sẵn. Phần chạy
test thì dùng cú pháp { provide: PrismaService, useValue:
mockPrismaService } --- đây là cách ra lệnh cho NestJS DI: \"Bất cứ ai
xin PrismaService, thay vì đưa bản thật thì đưa cái mockPrismaService
này vào\". Kết quả là TaskService chạy toàn bộ logic như bình thường
nhưng không bao giờ chạm vào database thật.

Lợi ích thứ ba là tái sử dụng code hiệu quả. Một Service có thể được
inject vào nhiều nơi khác nhau. Ví dụ, TaskService có thể được sử dụng
trong cả TaskController và NotificationService (để gửi thông báo khi
task được cập nhật).

#### 4.5.4. Quản lý Vòng đời (Lifecycle) tự động thông qua Hooks

Tương tự như một con người kinh qua các giai đoạn sinh ra và mất đi, các
Module hay Provider trong ứng dụng NestJS cũng trải qua một Vòng đời
(Lifecycle) cụ thể: từ khoảnh khắc ứng dụng xẹt điện khởi động, tải file
vào bộ nhớ, nhận lệnh phục vụ, cho đến giây phút ứng dụng bị tắt lệnh
(kill/stop).

Nhà kho NestJS IoC Container nhận trọng trách giám sát sinh tử - vòng
đời này thông qua các công cụ gọi là Lifecycle Hooks. Bạn cứ hình dung
Hooks như hàng loạt các \"trạm kiểm soát\" hoặc \"báo thức\" được NestJS
gắn sẵn dọc theo trục lộ thời gian tồn tại của ứng dụng. Nhờ mắc ngoặc
móc (hook) những đoạn code của ta vào các trạm này, ta có thể sai bảo
NestJS: \"Ê, hãy thực thi đoạn code A này ngay khoảnh khắc mày vừa được
sinh ra nhé!\" hoặc \"Nhớ chạy câu lệnh B này dọn rác ngay trước khi mày
nhắm mắt nhé!\".

Trong ứng dụng NestJS, onModuleInit là \"chuông gọi dậy\" rung ngay khi
module vừa tải xong vào RAM --- đây là khoảnh khắc vàng để mở các kết
nối tới Database hoặc các hệ thống bên ngoài. Ngược lại, onModuleDestroy
là \"chuông cảnh báo đỏ\" rung lên một vạch ngay trước khi module bị tắt
nguồn hoàn toàn --- thời điểm hoàn hảo để đóng cổng kết nối Database một
cách an toàn, tránh tình trạng connection bị treo lơ lửng gây rò rỉ bộ
nhớ.

Ví dụ điển hình nhất chính là PrismaService trong dự án --- bắt buộc
dùng Lifecycle Hooks để đảm bảo cổng kết nối Database luôn được bật và
tắt đúng lúc:

![](media/image45.jpg){width="6.267716535433071in"
height="1.9861111111111112in"}

PrismaService vừa kế thừa PrismaClient (có được tất cả các phương thức
query database), vừa implement hai interface OnModuleInit và
OnModuleDestroy để móc vào vòng đời của NestJS. Method onModuleInit()
được gọi tự động ngay sau khi module được tải xong vào bộ nhớ --- đây là
lúc thích hợp để gọi \$connect() mở kết nối vì chỉ sau bước này các
service mới có thể chạy query. Ngược lại, onModuleDestroy() được gọi
ngay trước khi server nhận tín hiệu tắt (SIGTERM hoặc SIGINT) --- đây là
lúc cần gọi \$disconnect() để đóng toàn bộ các kết nối trong connection
pool đúng cách, tránh tình trạng kết nối bị treo lơ lửng gây rò rỉ bộ
nhớ.

### 4.6. Lỗi thường gặp và Trade-offs

#### 4.6.1. Circular Dependency --- phụ thuộc vòng tròn

#### 4.6.2. Provider không inject được --- quên khai báo

#### 4.6.3. Trade-off: Provider Scope (Singleton vs Request)

### 4.7. Bài tập ứng dụng - Xây dựng Module Student với dữ liệu mô phỏng

#### 4.7.1. Mục tiêu

Vận dụng các khái niệm cốt lõi đã học trong Chương 4 --- Modules,
Controllers, Providers/Services, và Dependency Injection --- để xây dựng
module quản lý người dùng (User Module) cho dự án TodoList
Collaboration. Sau khi hoàn thành, người đọc sẽ:

- Biết cách sử dụng NestJS CLI để generate các thành phần (Module,
  Controller, Service).

- Hiểu cách Controller nhận request và uỷ thác xử lý cho Service thông
  qua Dependency Injection.

- Xây dựng được các endpoint RESTful với các HTTP Method Decorators và
  Request Data Decorators.

- Quan sát nguyên tắc Single Responsibility: Controller chỉ nhận/trả
  request, Service chứa business logic.

#### 4.7.2. Mô tả bài tập

Tiếp tục từ dự án todolist-collaboration đã tạo ở Chương 3, xây dựng
module **User** với các endpoint quản lý hồ sơ người dùng. Ở giai đoạn
này, dữ liệu được lưu tạm trong một mảng in-memory --- việc kết nối
database sẽ được thực hiện ở Chương 5.

**Yêu cầu cụ thể:**

1.  Sử dụng NestJS CLI để generate UserModule, UserController,
    UserService.

2.  Triển khai hai endpoint ban đầu:

    - GET /users/:id --- Lấy thông tin hồ sơ người dùng

    - PATCH /users/:id --- Cập nhật hồ sơ người dùng (displayName, bio)

3.  Minh họa Dependency Injection giữa Controller và Service.

4.  Kiểm tra API bằng Hoppscotch.

#### 4.7.3 Code minh họa

**Bước 1: Generate các thành phần bằng CLI**

![](media/image46.png){width="3.4791666666666665in"
height="0.8854166666666666in"}

Ba lệnh trên sẽ tạo các file tương ứng trong thư mục src/user/ và tự
động cập nhật UserModule. Flag \--no-spec bỏ qua file test để giữ thư
mục gọn gàng.

Kết quả:

![](media/image47.png){width="6.267716535433071in"
height="1.8611111111111112in"}

Cấu trúc project:

![](media/image48.png){width="3.1875in" height="5.770833333333333in"}

**Bước 2: Triển khai UserService (In-memory)**

![](media/image49.png){width="6.267716535433071in"
height="2.5in"}![](media/image50.png){width="5.822916666666667in"
height="5.875in"}![](media/image51.png){width="6.267716535433071in"
height="2.138888888888889in"}

Điểm cần lưu ý:

- Decorator \@Injectable() đánh dấu class này là Provider, cho phép
  NestJS quản lý và inject vào các class khác.

- NotFoundException là built-in exception của NestJS, tự động trả về
  HTTP 404.

- Mảng users đóng vai trò \"database tạm\" --- Chương 5 sẽ thay bằng
  Prisma ORM.

**Bước 3: Triển khai UserController**

![](media/image52.png){width="6.267716535433071in"
height="3.9583333333333335in"}

Điểm cần lưu ý:

- \@Controller(\'users\') đặt route prefix /users cho toàn bộ
  controller.

- constructor(private readonly userService: UserService) --- đây chính
  là **Dependency Injection**. NestJS tự động tạo instance UserService
  và truyền vào constructor. Controller không cần biết UserService được
  tạo như thế nào hay phụ thuộc vào gì.

- \@Param(\'id\') trích xuất giá trị từ URL parameter :id.

- \@Body() lấy toàn bộ nội dung body dưới dạng object.

- Controller chỉ nhận request và gọi Service --- **không chứa business
  logic** (nguyên tắc Single Responsibility).

**Bước 4: Kiểm tra UserModule**

![](media/image53.png){width="5.5in" height="2.1770833333333335in"}

NestJS CLI đã tự động đăng ký UserController và UserService vào module,
và import UserModule vào AppModule.

**Bước 5: Kiểm tra bằng Hoppscotch**

**Test 1 --- Lấy hồ sơ người dùng:**

- **Method:** GET

- **URL:** http://localhost:3000/users/1

- **Expected:** Object chứa thông tin user với id: \"1\".

![](media/image54.png){width="6.267716535433071in"
height="3.111111111111111in"}

**Test 2 --- Cập nhật hồ sơ:**

- **Method:** PATCH

- **URL:** http://localhost:3000/users/1

- **Body (JSON):**

![](media/image55.png){width="4.145833333333333in" height="1.15625in"}

- **Expected:** Object user với displayName và bio đã cập nhật.

![](media/image56.png){width="5.442708880139983in"
height="2.813193350831146in"}

**Test 3 --- Trường hợp không tìm thấy:**

- **Method:** GET

- **URL:** http://localhost:3000/users/999

- **Expected:** Status 404 --- \"User not found\".

![](media/image57.png){width="6.267716535433071in"
height="2.263888888888889in"}

#### 4.7.4. Kết quả đạt được

Sau khi hoàn thành bài tập:

- Tạo **UserModule** đóng gói toàn bộ chức năng quản lý người dùng.

- **UserController** tiếp nhận HTTP request và uỷ thác xử lý cho Service
  --- tuân thủ nguyên tắc Single Responsibility.

- **UserService** chứa business logic với dữ liệu in-memory.

- Cơ chế **Dependency Injection** giữa Controller và Service hoạt động
  đúng --- Controller không tự tạo instance Service mà nhận từ NestJS
  IoC Container.

Tuy nhiên, dữ liệu in-memory sẽ bị mất mỗi khi ứng dụng restart. Chương
tiếp theo sẽ giải quyết vấn đề này bằng cách kết nối với cơ sở dữ liệu
PostgreSQL thông qua Prisma ORM.

### 4.8. Tổng kết

Chương này đã trình bày các khái niệm nền tảng tạo nên kiến trúc của
NestJS. Hành trình bắt đầu từ TypeScript --- ngôn ngữ cung cấp hệ thống
kiểu dữ liệu mạnh mẽ, Decorators, và Generics làm nền tảng cho toàn bộ
framework. Tiếp theo, chúng ta đã tìm hiểu cách Modules tổ chức ứng dụng
thành các khối chức năng độc lập, cách Controllers đóng vai trò tiếp
nhận và phân phối HTTP requests, và cách Providers (đặc biệt là
Services) chứa business logic thực sự của ứng dụng.

Điểm then chốt kết nối tất cả các thành phần lại với nhau là Dependency
Injection --- cơ chế cho phép NestJS tự động quản lý việc tạo và inject
các dependencies, giúp code loosely coupled, dễ test, và dễ bảo trì. Tất
cả các ví dụ trong chương đều sử dụng module Task từ dự án TodoList
Collaboration, giúp người đọc thấy được cách các khái niệm này phối hợp
với nhau trong một ứng dụng thực tế.

Với nền tảng kiến thức này, chương tiếp theo sẽ đi sâu vào cách làm việc
với database thông qua Prisma ORM --- công cụ giúp TaskService tương tác
với dữ liệu một cách type-safe và hiệu quả.

## **Chương 5: Làm việc với dữ liệu và Database (TypeORM/ Prisma)**

### 5.1 ORM là gì? Tại sao chọn Prisma?

#### 5.1.1 ORM (Object-Relational Mapping)

Trong quá trình phát triển ứng dụng, một trong những thách thức lớn nhất
mà developers thường gặp phải là khoảng cách giữa cách tổ chức code theo
hướng đối tượng và cách database lưu trữ dữ liệu dưới dạng bảng quan hệ.
Đây chính là lúc ORM phát huy vai trò của mình như một "cầu nối" giúp
giải quyết vấn đề này một cách hiệu quả.

ORM, viết tắt của Object-Relational Mapping, là một kỹ thuật cho phép
developers làm việc với database thông qua các đối tượng trong code,
thay vì phải viết trực tiếp các câu lệnh SQL. Để dễ hình dung, hãy tưởng
tượng ORM như một "phiên dịch viên" thông minh, tự động chuyển đổi qua
lại giữa ngôn ngữ của code và ngôn ngữ của database. Khi bạn gọi một
method trong code, ORM sẽ tự động sinh ra câu SQL tương ứng và gửi đến
database; khi database trả về kết quả, ORM lại chuyển đổi dữ liệu thành
các objects mà code có thể sử dụng trực tiếp.

Để hiểu rõ hơn sự khác biệt, hãy xem xét ví dụ sau. Khi không sử dụng
ORM, bạn phải viết SQL thuần túy để thực hiện các thao tác với database:

![](media/image58.jpg){width="6.267716535433071in"
height="1.5833333333333333in"}

Trong khi đó, khi sử dụng Prisma ORM, các thao tác tương tự được thực
hiện thông qua các method calls có cú pháp rõ ràng và type-safe:

![](media/image59.jpg){width="6.267716535433071in"
height="2.361111111111111in"}

Việc sử dụng ORM mang lại nhiều lợi ích đáng kể cho quá trình phát triển
phần mềm. Đầu tiên và quan trọng nhất là về Type Safety - ORM tự động
sinh ra các types từ schema, giúp IDE có thể auto-complete và phát hiện
lỗi ngay trong quá trình viết code. Điều này đặc biệt có giá trị trong
môi trường TypeScript vì cho phép developer bắt lỗi sớm ở giai đoạn
compile thay vì phải đợi đến runtime, tiết kiệm đáng kể thời gian debug.

Bên cạnh đó, ORM còn tăng đáng kể năng suất làm việc của team phát
triển. Thay vì phải viết hàng trăm dòng SQL boilerplate cho các thao tác
CRUD cơ bản, developer chỉ cần vài dòng code ngắn gọn và trực quan. Thời
gian tiết kiệm được có thể dành để tập trung vào phần business logic -
vốn là phần cốt lõi và tạo nên giá trị thực sự của ứng dụng.

Về mặt bảo trì lâu dài, code sử dụng ORM dễ đọc và dễ hiểu hơn nhiều so
với các câu SQL strings nằm rải rác khắp nơi trong codebase. Khi một
developer mới tham gia dự án, họ có thể nhanh chóng hiểu được luồng dữ
liệu mà không cần phải phân tích các câu query phức tạp.

Một lợi ích quan trọng khác là về bảo mật. ORM tự động escape các input
từ người dùng thông qua cơ chế parameterized queries, giúp giảm thiểu
đáng kể rủi ro SQL Injection - một trong những lỗ hổng bảo mật phổ biến
và nguy hiểm nhất trong các ứng dụng web.

Cuối cùng, ORM cung cấp một lớp abstraction cho phép ứng dụng không bị
phụ thuộc quá chặt vào một database cụ thể. Nếu sau này cần chuyển từ
PostgreSQL sang MySQL hay ngược lại, phần lớn code business logic vẫn
giữ nguyên, chỉ cần thay đổi cấu hình connection.

#### 5.1.2 Các ORM phổ biến trong Node.js

NestJS là một framework linh hoạt, không bắt buộc sử dụng một ORM cụ thể
nào. Thay vào đó, NestJS cung cấp các integration packages cho nhiều ORM
khác nhau, cho phép developers lựa chọn công cụ phù hợp nhất với nhu cầu
dự án. Dưới đây là những ORM phổ biến nhất được sử dụng trong các dự án
NestJS.

##### 5.1.2.1. TypeORM

TypeORM là ORM được tích hợp chính thức và sâu nhất với NestJS thông qua
package \@nestjs/typeorm. Ra đời năm 2016, TypeORM được thiết kế từ đầu
để hỗ trợ TypeScript, sử dụng decorators để định nghĩa entities - cách
tiếp cận rất tương đồng với style của NestJS.

TypeORM hỗ trợ cả hai patterns phổ biến trong ORM: Active Record và Data
Mapper. Với Active Record pattern, entity class chứa cả data và các
methods để tương tác với database. Với Data Mapper pattern, entities chỉ
chứa data thuần túy, còn logic tương tác database được đặt trong các
repository riêng biệt. Đây là pattern được khuyến khích sử dụng trong
NestJS vì phù hợp với dependency injection.

Về mặt tính năng, TypeORM cung cấp đầy đủ các khả năng cần thiết bao gồm
migrations, relations (one-to-one, one-to-many, many-to-many), eager và
lazy loading, transactions, và query builder. TypeORM hỗ trợ rất nhiều
database engines như MySQL, PostgreSQL, SQLite, Microsoft SQL Server,
Oracle, và cả MongoDB.

Tuy nhiên, TypeORM cũng có một số hạn chế đáng lưu ý. Type safety không
hoàn toàn chặt chẽ - khi query với select partial fields hay relations,
TypeScript không đảm bảo types chính xác 100%. Ngoài ra, hệ thống
migrations của TypeORM đôi khi require manual intervention và có thể gặp
issues khi schema phức tạp. Một số developers cũng phản ánh rằng
documentation không được cập nhật thường xuyên.

![](media/image60.jpg){width="6.267716535433071in"
height="3.1805555555555554in"}

##### 5.1.2.2. Prisma

Prisma là ORM thế hệ mới (next-generation ORM) ra đời năm 2019, được
thiết kế với triết lý hoàn toàn khác biệt so với các ORM truyền thống.
Thay vì sử dụng classes và decorators trong code, Prisma áp dụng cách
tiếp cận "schema-first" - toàn bộ cấu trúc database được định nghĩa
trong một file schema riêng sử dụng Prisma Schema Language (PSL).

Điểm mạnh nổi bật nhất của Prisma là type safety tuyệt đối. Prisma
Client được auto-generate từ schema, có nghĩa là mọi query, mọi field,
mọi relation đều có types chính xác và cập nhật tự động khi schema thay
đổi. IDE có thể cung cấp autocomplete chính xác đến từng field của từng
model, và TypeScript sẽ báo lỗi ngay lập tức nếu truy cập field không
tồn tại hoặc truyền sai kiểu dữ liệu.

Prisma bao gồm ba thành phần chính làm việc cùng nhau. Prisma Client là
query builder type-safe được generate riêng cho schema của dự án. Prisma
Migrate là hệ thống migrations tự động detect changes và generate SQL
scripts. Prisma Studio là GUI tool trực quan để browse và edit data
trong browser.

Mặc dù Prisma không có official NestJS package như TypeORM, việc tích
hợp vẫn rất đơn giản thông qua một PrismaService wrapper. Prisma hỗ trợ
PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, và CockroachDB.

![](media/image61.jpg){width="6.267716535433071in"
height="1.8888888888888888in"}

##### 5.1.2.3. Sequelize

Sequelize là một trong những ORM lâu đời và ổn định nhất trong hệ sinh
thái Node.js, ra đời từ năm 2011. NestJS cung cấp integration thông qua
package \@nestjs/sequelize. Với hơn một thập kỷ phát triển, Sequelize có
cộng đồng lớn và documentation phong phú.

Sequelize theo hướng tiếp cận Active Record pattern, trong đó mỗi model
class đại diện cho một bảng và các instances của class đại diện cho các
rows. API của Sequelize khá trực quan và dễ học, đặc biệt phù hợp với
những người mới bắt đầu với ORM.

Về mặt tính năng, Sequelize hỗ trợ đầy đủ transactions, relations, eager
loading, migrations, và seeders. Nó cũng cung cấp raw query capabilities
khi cần thực hiện các queries phức tạp mà ORM không cover được.

Tuy nhiên, Sequelize ban đầu được viết cho JavaScript thuần. Mặc dù đã
có TypeScript support thông qua sequelize-typescript, việc tích hợp
không seamless như TypeORM hay Prisma. Types đôi khi không chính xác
100%, đặc biệt với các queries phức tạp hoặc khi sử dụng associations.

![](media/image62.jpg){width="6.267716535433071in"
height="2.6666666666666665in"}

##### 5.1.2.4. MikroORM

MikroORM là một ORM tương đối mới hơn, ra đời năm 2018, được thiết kế
với focus vào TypeScript và lấy cảm hứng từ Doctrine ORM của PHP. NestJS
có thể tích hợp thông qua package \@mikro-orm/nestjs.

MikroORM theo Data Mapper pattern với Unit of Work và Identity Map - các
patterns giúp quản lý entity state hiệu quả và tối ưu performance. Thay
vì save từng entity riêng lẻ, các thay đổi được track và persist trong
một transaction khi gọi flush. Điều này giảm số lượng database
round-trips.

Một điểm mạnh của MikroORM là hỗ trợ TypeScript rất tốt với automatic
type inference. MikroORM cũng cung cấp CLI tool mạnh mẽ cho migrations,
schema generation, và entity scaffolding.

MikroORM hỗ trợ nhiều database backends bao gồm PostgreSQL, MySQL,
MariaDB, SQLite, và MongoDB. Tuy nhiên, vì là ORM mới hơn nên cộng đồng
và ecosystem còn nhỏ hơn so với TypeORM hay Sequelize.

![](media/image63.jpg){width="6.267716535433071in"
height="2.6527777777777777in"}

##### 5.1.2.5. Mongoose (dành cho MongoDB)

Mặc dù không phải là ORM theo đúng nghĩa (mà là ODM - Object Document
Mapper), Mongoose xứng đáng được đề cập vì là giải pháp phổ biến nhất
khi sử dụng MongoDB với NestJS. NestJS cung cấp integration chính thức
thông qua package \@nestjs/mongoose.

Mongoose cho phép định nghĩa schemas với TypeScript decorators, tương tự
như cách làm việc với NestJS decorators. Nó cung cấp validation,
middleware (hooks), virtuals, và populate (tương đương với relations
trong SQL databases).

Điểm mạnh của Mongoose là sự linh hoạt của MongoDB schema. Không giống
như SQL databases yêu cầu schema cố định, MongoDB cho phép documents có
structure khác nhau trong cùng một collection. Mongoose cung cấp một lớp
schema validation để cân bằng giữa flexibility và data integrity.

Tuy nhiên, nếu dự án sử dụng relational database như PostgreSQL hay
MySQL, Mongoose không phải là lựa chọn phù hợp. Mongoose chỉ hoạt động
với MongoDB.

![](media/image64.jpg){width="6.267716535433071in"
height="2.1805555555555554in"}

##### 5.1.2.6. Lựa chọn ORM cho đề tài

Để có cái nhìn tổng quan và so sánh trực tiếp giữa các ORM đã giới
thiệu, bảng dưới đây tổng hợp các tiêu chí quan trọng:

  ----------------- ------------- ------------- --------------- -------------- --------------
  **Tiêu chí**      **TypeORM**   **Prisma**    **Sequelize**   **MikroORM**   **Mongoose**

  **Năm ra đời**    2016          2019          2011            2018           2010

  **Type Safety**   Tốt           Xuất sắc      Trung bình      Tốt            Trung bình

  **Schema          Decorators    Declarative   Decorators      Decorators     Decorators
  Definition**                    file                                         

  **Auto-generate   Không         Có            Không           Một phần       Không
  Types**                                                                      

  **Migrations**    Thủ công/Sync Tự động       Thủ công        Tự động        Không cần

  **NestJS          Official      Community     Official        Official       Official
  Package**                                                                    

  **Database        SQL + MongoDB SQL + MongoDB SQL only        SQL + MongoDB  MongoDB only
  Support**                                                                    

  **Learning        Trung bình    Thấp          Thấp            Trung bình     Thấp
  Curve**                                                                      

  **GUI Tool**      Không         Prisma Studio Không           Không          Không

  **Cộng đồng**     Lớn           Đang phát     Rất lớn         Nhỏ            Rất lớn
                                  triển                                        
  ----------------- ------------- ------------- --------------- -------------- --------------

Sau khi phân tích và đánh giá các ORM phổ biến dựa trên bảng so sánh
trên, nhóm đã quyết định lựa chọn Prisma làm ORM chính cho dự án
TodoList Collaboration. Quyết định này dựa trên nhiều yếu tố quan trọng
phù hợp với đặc thù của đề tài.

Trước hết, dự án sử dụng TypeScript làm ngôn ngữ chính, và Prisma cung
cấp type safety vượt trội so với các ORM khác. Như đã thể hiện trong
bảng so sánh, Prisma là ORM duy nhất có khả năng auto-generate types
hoàn toàn từ schema. Với Prisma Client được tự động sinh ra, mọi thay
đổi về cấu trúc database đều được phản ánh ngay lập tức trong types của
code, giúp giảm thiểu bugs liên quan đến data layer và tăng tốc quá
trình development.

Thứ hai, hệ thống migrations của Prisma Migrate hoạt động trơn tru và tự
động, phù hợp với một dự án học tập cần iterate nhanh. Trong khi TypeORM
và Sequelize yêu cầu viết migrations thủ công hoặc sử dụng sync (không
an toàn cho production), Prisma tự động detect changes trong schema và
generate các SQL scripts tương ứng. Nhóm có thể tập trung vào việc phát
triển business logic thay vì lo lắng về database synchronization.

Thứ ba, Prisma Studio cung cấp một công cụ visualization trực quan -
điều mà các ORM khác không có sẵn. Khả năng browse, filter, và edit data
trực tiếp trong browser giúp việc debug và kiểm tra data trở nên dễ dàng
hơn nhiều, đặc biệt có giá trị trong quá trình học tập và phát triển.

Thứ tư, learning curve của Prisma tương đối thấp với syntax declarative
đơn giản. File schema.prisma dễ đọc và dễ hiểu, không đòi hỏi phải nắm
vững nhiều concepts phức tạp như decorators, metadata reflection, hay
design patterns như các ORM class-based.

Cuối cùng, mặc dù không có official NestJS package như TypeORM hay
Sequelize, việc tích hợp Prisma với NestJS thông qua PrismaService vẫn
rất đơn giản và clean. Documentation của Prisma cũng rất chi tiết với
nhiều examples thực tế, giúp nhóm nhanh chóng làm quen và áp dụng vào dự
án.

#### 5.1.3. Kiến trúc và Workflow của Prisma

Để hiểu rõ hơn về cách Prisma hoạt động trong thực tế, phần này sẽ đi
sâu vào kiến trúc và quy trình làm việc với Prisma. Kiến trúc của Prisma
bao gồm ba thành phần chính hoạt động phối hợp với nhau:

**Prisma Client** là thư viện query builder được auto-generated từ
schema của bạn. Đây là phần mà developers tương tác trực tiếp trong code
để thực hiện các thao tác CRUD. Điểm đặc biệt của Prisma Client là nó
được \"tailored\" riêng cho schema của từng dự án - mỗi field, mỗi
relation đều có types cụ thể, giúp IDE cung cấp autocomplete chính xác
và phát hiện lỗi ngay lập tức.

**Prisma Migrate** là hệ thống quản lý database migrations. Khi bạn thay
đổi schema, Prisma Migrate sẽ so sánh với trạng thái database hiện tại
và tự động generate các SQL migration scripts cần thiết. Các migration
files này được version control cùng với source code, cho phép team làm
việc cùng nhau và đảm bảo mọi môi trường (development, staging,
production) đều có cùng cấu trúc database.

**Prisma Studio** là một GUI tool cho phép browse, filter, và edit data
trực tiếp trong browser. Công cụ này cực kỳ hữu ích trong quá trình
development khi cần inspect data, tạo test records, hoặc debug các
issues liên quan đến data. Không cần cài đặt database GUI client riêng,
chỉ cần chạy lệnh npx prisma studio là có thể truy cập.

Workflow làm việc với Prisma tuân theo một quy trình rõ ràng và có thể
lặp lại:

Schema Definition → Generate Client → Use in Code → Modify Schema →
Migrate → Regenerate

Đầu tiên, developer định nghĩa hoặc cập nhật cấu trúc database trong
file schema.prisma. Tiếp theo, chạy lệnh generate để Prisma tạo ra
client code với đầy đủ types. Sau đó sử dụng client này trong
application code để query và mutate data. Khi cần thay đổi schema, quay
lại bước đầu, sửa schema, chạy migration để cập nhật database, và
regenerate client. Quy trình này tạo ra một feedback loop chặt chẽ giữa
schema và code.

Prisma hỗ trợ nhiều database engines phổ biến bao gồm PostgreSQL, MySQL,
SQLite, SQL Server, MongoDB, và CockroachDB. Điều này cho phép linh hoạt
lựa chọn database phù hợp với từng dự án mà không phải học một ORM khác.
Trong dự án TodoList Collaboration, chúng ta sử dụng PostgreSQL vì đây
là database mạnh mẽ, miễn phí, có hỗ trợ tốt cho các tính năng như JSON
columns, full-text search và advanced indexing.

### 5.2. Cài đặt và Cấu hình Prisma

#### 5.2.1. Cài đặt Dependencies

Để tích hợp Prisma vào một dự án NestJS, trước tiên cần cài đặt hai
packages cần thiết. Package đầu tiên là prisma - đây là CLI tool cung
cấp các lệnh để generate client, chạy migrations, và mở Prisma Studio.
Vì chỉ sử dụng trong quá trình development nên package này được cài đặt
như một dev dependency. Package thứ hai là \@prisma/client - đây là thư
viện runtime thực sự được sử dụng trong code để thực hiện các queries,
do đó cần được cài đặt như một production dependency.

![](media/image65.jpg){width="6.267716535433071in"
height="0.6111111111111112in"}

#### 5.2.2. Khởi tạo Prisma

Sau khi cài đặt xong, bước tiếp theo là khởi tạo Prisma trong project
bằng lệnh npx prisma init. Lệnh này sẽ tự động tạo ra thư mục prisma/
chứa file schema.prisma - nơi định nghĩa toàn bộ cấu trúc database.
Ngoài ra, nếu project chưa có file .env, Prisma cũng sẽ tạo file này và
thêm biến môi trường DATABASE_URL làm mẫu.

![](media/image66.jpg){width="6.267716535433071in"
height="0.4722222222222222in"}

#### 5.2.3. Cấu hình Database Connection

Connection string đến database được cấu hình trong file .env thông qua
biến DATABASE_URL. Với PostgreSQL, format của connection string bao gồm
các thành phần: protocol, username, password, host, port, và tên
database.

![](media/image67.jpg){width="6.267716535433071in"
height="0.4722222222222222in"}

Trong connection string trên, postgresql:// chỉ định protocol kết nối,
postgres:password là username và password của database user,
localhost:5432 là địa chỉ host và cổng của PostgreSQL server,
todolist_db là tên database sẽ sử dụng, và ?schema=public chỉ định
schema namespace trong PostgreSQL (mặc định là public).

Cần lưu ý rằng file .env chứa các thông tin nhạy cảm như credentials, do
đó tuyệt đối không được commit file này lên git repository. Hãy đảm bảo
rằng .env đã được thêm vào file .gitignore ngay từ đầu dự án.

### 5.3. Schema Definition

Schema đóng vai trò như \"bản thiết kế\" của database, nơi định nghĩa
cấu trúc các bảng (trong Prisma gọi là models), quan hệ giữa chúng, và
các ràng buộc cần thiết. Một schema được thiết kế tốt là nền tảng cho
việc phát triển ứng dụng thuận lợi về sau.

#### 5.3.1. Cấu trúc file schema.prisma

File schema.prisma được tổ chức thành ba phần chính với vai trò riêng
biệt. Phần đầu tiên là Generator block, nơi cấu hình cách Prisma sinh ra
client code. Với setting provider = \"prisma-client-js\", Prisma sẽ
generate một TypeScript/JavaScript client có thể import và sử dụng trực
tiếp trong code.

Phần thứ hai là Datasource block, nơi chỉ định loại database và
connection URL. Prisma hiện hỗ trợ nhiều database engines bao gồm
PostgreSQL, MySQL, SQLite, SQL Server, và MongoDB. URL được lấy từ biến
môi trường thông qua hàm env() để tách biệt configuration khỏi code.

Phần thứ ba và cũng là phần quan trọng nhất là các Model definitions.
Mỗi model trong Prisma tương ứng với một bảng trong database, và các
fields trong model chính là các cột của bảng đó.

![](media/image68.jpg){width="6.267716535433071in"
height="2.513888888888889in"}

#### 5.3.2. Định nghĩa Models và Field Types

Khi định nghĩa một model trong Prisma, mỗi field được khai báo theo
format: tên field, kiểu dữ liệu, các modifiers (nếu có), và các
attributes. Kiểu dữ liệu trong Prisma sẽ được map sang kiểu tương ứng
trong database. Ví dụ, String sẽ thành VARCHAR hoặc TEXT trong
PostgreSQL, Int thành INTEGER, DateTime thành TIMESTAMP, và Boolean
thành BOOLEAN.

Prisma cung cấp hai modifiers để thay đổi tính chất của field. Dấu ? sau
kiểu dữ liệu cho biết field đó có thể nhận giá trị null (optional),
trong khi \[\] biểu thị một array của kiểu dữ liệu đó.

Các attributes được sử dụng để thêm các ràng buộc và behavior đặc biệt
cho fields. Attribute \@id đánh dấu field là primary key của bảng.
\@default() cho phép chỉ định giá trị mặc định, có thể là một giá trị cố
định hoặc một function như uuid() để tự động generate UUID, hay now() để
lấy thời gian hiện tại. Attribute \@unique đảm bảo tất cả các giá trị
trong column đều là duy nhất. \@updatedAt là một attribute đặc biệt giúp
tự động cập nhật timestamp mỗi khi record được modify.

![](media/image69.jpg){width="6.267716535433071in"
height="2.0555555555555554in"}

Ở cấp độ model, có thể sử dụng các block-level attributes.
@@map(\"users\") cho phép đặt tên bảng trong database khác với tên model
trong code - điều này hữu ích khi làm việc với database có sẵn hoặc khi
muốn tuân theo naming conventions cụ thể. @@index(\[email\]) tạo
database index trên một hoặc nhiều columns để tối ưu hiệu năng query.

#### 5.3.3. Định nghĩa Enums

Trong nhiều trường hợp, một field chỉ nên nhận một số giá trị cố định và
biết trước. Ví dụ, trạng thái của một task chỉ có thể là TODO,
IN_PROGRESS, REVIEW, hoặc DONE. Để enforce ràng buộc này, Prisma cho
phép định nghĩa Enums.

![](media/image70.jpg){width="6.267716535433071in"
height="3.4166666666666665in"}

Khi sử dụng enum trong code, TypeScript sẽ chỉ cho phép các giá trị nằm
trong tập hợp đã định nghĩa. Nếu cố gắng truyền một giá trị không hợp
lệ, compiler sẽ báo lỗi ngay lập tức thay vì đợi đến runtime. Điều này
giúp ngăn chặn các bug liên quan đến typo hay nhầm lẫn giá trị ngay từ
giai đoạn development.

### 5.4. Relations (Quan hệ giữa các Models)

Trong database relational, sức mạnh thực sự nằm ở khả năng mô hình hóa
các quan hệ giữa các entities. Prisma hỗ trợ đầy đủ ba loại quan hệ
chính thường gặp trong thiết kế database.

#### 5.4.1. One-to-Many (1-N)

Quan hệ One-to-Many là loại quan hệ phổ biến nhất trong hầu hết các ứng
dụng. Trong quan hệ này, một record của bảng A có thể liên kết với nhiều
records của bảng B, nhưng mỗi record của bảng B chỉ thuộc về một record
của bảng A. Một ví dụ điển hình trong dự án TodoList là quan hệ giữa
User và Task: một User có thể tạo nhiều Tasks, nhưng mỗi Task chỉ được
tạo bởi một User duy nhất.

![](media/image71.jpg){width="6.267716535433071in"
height="2.3333333333333335in"}

Trong schema trên, cần phân biệt hai loại fields. Field tasks Task\[\]
trong model User là một relation field - nó không thực sự tồn tại trong
database mà chỉ là cách để Prisma biết cần include những tasks nào khi
query user. Ngược lại, createdById String trong model Task là một
foreign key field - đây là column thực sự được lưu trong database, chứa
ID của user đã tạo task. Annotation \@relation(fields: \[createdById\],
references: \[id\]) khai báo rằng field createdById trỏ đến field id của
model User.

Khi làm việc với relation trong code, Prisma cung cấp các operations như
connect để liên kết với record có sẵn, hoặc create để tạo record mới và
liên kết trong cùng một operation.

![](media/image72.jpg){width="6.267716535433071in"
height="2.0416666666666665in"}

#### 5.4.2. Many-to-Many (N-N)

Quan hệ Many-to-Many xảy ra khi một record của bảng A có thể liên kết
với nhiều records của bảng B, và ngược lại, một record của bảng B cũng
có thể liên kết với nhiều records của bảng A. Trong dự án TodoList, một
ví dụ điển hình là quan hệ giữa Task và Label: một Task có thể được gắn
nhiều Labels, và một Label cũng có thể được gắn cho nhiều Tasks.

Prisma hỗ trợ hai cách để implement quan hệ Many-to-Many. Cách đầu tiên
là Implicit relation, trong đó Prisma tự động tạo và quản lý junction
table ở tầng database. Cách này đơn giản và phù hợp khi không cần lưu
thêm thông tin gì về quan hệ.

Cách thứ hai là Explicit relation, trong đó developer tự định nghĩa
junction table (còn gọi là pivot table). Cách này được khuyến khích khi
cần lưu trữ thêm metadata về quan hệ, ví dụ như thời điểm gắn label, ai
là người gắn, hoặc bất kỳ thông tin bổ sung nào khác.

![](media/image73.jpg){width="6.267716535433071in"
height="4.069444444444445in"}

Trong thiết kế trên, model TaskLabel đóng vai trò junction table với hai
foreign keys trỏ đến Task và Label. Field addedAt là ví dụ về metadata
được lưu trữ cho mỗi quan hệ. Constraint @@unique(\[taskId, labelId\])
đảm bảo rằng một label không thể được gắn hai lần cho cùng một task.
Option onDelete: Cascade chỉ định rằng khi Task hoặc Label bị xóa, các
records liên quan trong TaskLabel cũng sẽ bị xóa tự động.

#### 5.4.3. One-to-One (1-1)

Quan hệ One-to-One ít gặp hơn trong thực tế, thường được sử dụng khi
muốn tách một số fields ra bảng riêng vì lý do về security, performance,
hoặc tổ chức code. Ví dụ, có thể tách user preferences ra một bảng riêng
để không phải load toàn bộ mỗi khi query user.

![](media/image74.jpg){width="6.267716535433071in"
height="2.3194444444444446in"}

Điểm mấu chốt để tạo quan hệ 1-1 nằm ở constraint \@unique trên foreign
key field (userId). Constraint này đảm bảo rằng mỗi User chỉ có thể có
một UserSettings, và ngược lại mỗi UserSettings chỉ thuộc về một User.

#### 5.4.4. Self-Relation (Quan hệ đệ quy)

Self-Relation là trường hợp đặc biệt khi một model có quan hệ với chính
nó. Đây là pattern phổ biến trong các tính năng như threaded comments
(comment reply comment khác), hierarchical categories, hoặc
organizational structure. Trong dự án TodoList, tính năng reply comment
sử dụng self-relation để cho phép một Comment có thể là reply của
Comment khác.

![](media/image75.jpg){width="6.267716535433071in" height="1.5in"}

Trong schema trên, một Comment có thể có một parent (comment mà nó
reply), và đồng thời cũng có thể có nhiều replies (các comments reply
lại nó). Field parentId là optional vì không phải comment nào cũng là
reply - những comments ở root level sẽ có parentId là null. Relation
name \"CommentReplies\" được sử dụng để disambiguate hai relation fields
đang cùng trỏ đến model Comment.

### 5.5. Migrations

Migrations là cơ chế để đồng bộ schema định nghĩa trong code với cấu
trúc database thực tế. Thay vì phải manually chạy các câu ALTER TABLE
hay CREATE TABLE, Prisma sẽ tự động detect những thay đổi và generate
các SQL statements cần thiết. Mỗi migration được lưu thành một file
riêng, cho phép track history và rollback khi cần.

#### 5.5.1. Tạo Migration trong Development

Trong môi trường development, lệnh npx prisma migrate dev là công cụ
chính để làm việc với migrations. Khi chạy lệnh này với flag \--name để
đặt tên mô tả, Prisma sẽ thực hiện một chuỗi các bước: so sánh schema
hiện tại trong file schema.prisma với trạng thái của database, generate
một migration file chứa các SQL statements cần thiết để đồng bộ, apply
migration đó vào database, và cuối cùng regenerate Prisma Client để
reflect những thay đổi.

![](media/image76.jpg){width="6.267716535433071in"
height="0.4583333333333333in"}

Các migration files được lưu trong thư mục prisma/migrations/, mỗi
migration nằm trong một subfolder với timestamp prefix để đảm bảo thứ tự
thực thi. Bên trong mỗi folder là file migration.sql chứa các SQL
statements thực tế.

![](media/image77.jpg){width="6.267716535433071in"
height="2.0555555555555554in"}

#### 5.5.2. Workflow Migration chuẩn

Một workflow migration chuẩn trong quá trình development thường diễn ra
như sau. Đầu tiên, developer sửa đổi file schema.prisma để thêm, sửa,
hoặc xóa các fields/models theo yêu cầu. Sau đó chạy lệnh migrate dev
với một tên mô tả ngắn gọn về thay đổi, ví dụ add_avatar_to_user. Prisma
sẽ generate migration file tương ứng.

Bước quan trọng tiếp theo là review migration file đã được generate.
Trong đa số trường hợp, SQL được generate sẽ chính xác, nhưng đôi khi
cần adjust cho các cases đặc biệt như data migration hay thêm default
values cho columns mới trong bảng đã có data. Sau khi review và test
locally, migration files cần được commit lên git cùng với các thay đổi
code khác.

#### 5.5.3. Apply Migration trong Production

Môi trường production có workflow khác biệt với development. Ở đây sử
dụng lệnh npx prisma migrate deploy để apply các migrations đã được tạo
và test ở development. Lệnh này chỉ chạy những migrations chưa được
apply, không tạo mới migrations - đảm bảo tính ổn định và
reproducibility. Thông thường, lệnh này được integrate vào CI/CD
pipeline và chạy tự động trước khi deploy ứng dụng mới.

![](media/image78.jpg){width="6.267716535433071in"
height="0.4861111111111111in"}

#### 5.5.4. Các lệnh Migration bổ trợ

Ngoài hai lệnh chính, Prisma còn cung cấp một số lệnh bổ trợ hữu ích.
Lệnh npx prisma migrate status cho phép xem trạng thái hiện tại của
migrations - những migrations nào đã được apply và những migrations nào
đang pending. Lệnh npx prisma migrate reset sẽ xóa toàn bộ database và
apply lại tất cả migrations từ đầu - cực kỳ hữu ích trong development
nhưng không bao giờ nên sử dụng trong production. Cuối cùng, npx prisma
generate cho phép regenerate Prisma Client mà không chạy migration,
thường dùng sau khi pull code mới về hoặc khi chỉ muốn refresh types.

### 5.6. CRUD Operations

CRUD là viết tắt của Create, Read, Update, và Delete - bốn thao tác cơ
bản mà mọi ứng dụng đều cần thực hiện với dữ liệu. Prisma Client cung
cấp một API trực quan và type-safe để thực hiện tất cả các thao tác này.

#### 5.6.1. Create (Tạo mới)

Để tạo một record mới trong database, sử dụng method create() với object
data chứa các field values. Method này trả về record vừa được tạo với
đầy đủ thông tin bao gồm cả các generated fields như id hay createdAt.

![](media/image79.jpg){width="6.267716535433071in" height="1.375in"}

Prisma cũng hỗ trợ tạo record cùng với các related records trong cùng
một transaction thông qua nested creates. Trong ví dụ dưới đây, một User
được tạo đồng thời với một Workspace mà user đó sở hữu. Option include
cho phép chỉ định những relations nào cần được trả về trong response.

![](media/image80.jpg){width="6.267716535433071in"
height="2.4444444444444446in"}

Khi cần tạo nhiều records cùng lúc, method createMany() cho phép batch
insert với hiệu năng tốt hơn so với việc gọi create() nhiều lần. Method
này trả về số lượng records đã được tạo.

![](media/image81.jpg){width="6.267716535433071in"
height="1.5416666666666667in"}

#### 5.6.2. Read (Đọc dữ liệu)

Prisma cung cấp nhiều methods để query dữ liệu phù hợp với các use cases
khác nhau. Method findUnique() được sử dụng khi biết chính xác unique
identifier của record cần tìm, có thể là primary key hoặc bất kỳ field
nào có constraint \@unique. Method này trả về một record hoặc null nếu
không tìm thấy.

![](media/image82.jpg){width="6.267716535433071in"
height="0.7638888888888888in"}

Khi cần tìm record đầu tiên thỏa mãn một số điều kiện nhất định,
findFirst() là lựa chọn phù hợp. Method này đặc biệt hữu ích khi kết hợp
với orderBy để lấy record \"mới nhất\" hoặc \"cũ nhất\" theo một tiêu
chí nào đó.

![](media/image83.jpg){width="6.267716535433071in"
height="0.9305555555555556in"}

Để query nhiều records, sử dụng findMany(). Method này hỗ trợ đầy đủ các
options cho filtering, sorting, và pagination.

![](media/image84.jpg){width="6.267716535433071in"
height="1.7083333333333333in"}

Một trong những tính năng mạnh mẽ nhất của Prisma là khả năng include
related data trong cùng một query. Thay vì phải chạy nhiều queries riêng
biệt rồi manually join kết quả, chỉ cần khai báo những relations cần
include và Prisma sẽ handle việc join ở database level.

![](media/image85.jpg){width="6.267716535433071in"
height="2.1944444444444446in"}

Khi chỉ cần một số fields cụ thể thay vì toàn bộ record, option select
cho phép chỉ định chính xác những fields nào cần trả về. Điều này đặc
biệt quan trọng khi làm việc với những models có nhiều fields hoặc khi
cần tránh expose các sensitive fields như password.

![](media/image86.jpg){width="6.267716535433071in"
height="1.4166666666666667in"}

#### 5.6.3. Update (Cập nhật)

Để cập nhật một record, sử dụng method update() với where clause để xác
định record cần update và data object chứa các giá trị mới. Method này
trả về record đã được cập nhật.

![](media/image87.jpg){width="6.267716535433071in"
height="1.4027777777777777in"}

Khi cần update nhiều records thỏa mãn một điều kiện, updateMany() cho
phép batch update. Ví dụ dưới đây đánh dấu tất cả các tasks quá hạn là
URGENT.

![](media/image88.jpg){width="6.267716535433071in"
height="1.5972222222222223in"}

Một pattern phổ biến là \"upsert\" - update nếu record tồn tại, create
nếu chưa có. Prisma hỗ trợ trực tiếp pattern này thông qua method
upsert(), giúp code gọn gàng hơn thay vì phải check existence trước rồi
mới quyết định create hay update.

![](media/image89.jpg){width="6.267716535433071in"
height="1.6666666666666667in"}

#### 5.6.4. Delete (Xóa)

Method delete() xóa một record dựa trên unique identifier và trả về
record đã bị xóa. Nếu record không tồn tại, Prisma sẽ throw error.

![](media/image90.jpg){width="6.267716535433071in"
height="0.7916666666666666in"}

Tương tự, deleteMany() cho phép xóa nhiều records thỏa mãn điều kiện.

![](media/image91.jpg){width="6.267716535433071in"
height="0.9305555555555556in"}

Trong thực tế, nhiều ứng dụng không thực sự xóa dữ liệu mà chỉ đánh dấu
là đã xóa - pattern này gọi là Soft Delete. Để implement soft delete,
thêm một optional DateTime field như deletedAt vào model. Khi \"xóa\",
update field này với timestamp hiện tại. Khi query, thêm điều kiện
deletedAt: null để chỉ lấy những records chưa bị xóa. Pattern này cho
phép khôi phục dữ liệu khi cần và giữ lại audit trail.

![](media/image92.jpg){width="6.267716535433071in"
height="1.8333333333333333in"}

### 5.7. Advanced Queries

#### 5.7.1. Filtering với nhiều điều kiện

Prisma hỗ trợ các logical operators AND, OR, và NOT để xây dựng các điều
kiện filter phức tạp. Trong ví dụ dưới đây, query tìm các tasks đồng
thời thỏa mãn: có status là TODO và priority cao (AND), hoặc có chữ
\"urgent\" trong title hoặc đã quá hạn (OR), và chưa bị soft delete
(NOT).

![](media/image93.jpg){width="6.267716535433071in"
height="2.6666666666666665in"}

#### 5.7.2. Aggregation

Các operations tổng hợp dữ liệu như đếm, tính tổng, tính trung bình cũng
được Prisma hỗ trợ đầy đủ. Method count() đếm số lượng records thỏa mãn
điều kiện. Method aggregate() cho phép tính các giá trị thống kê như
sum, average, min, max. Method groupBy() nhóm dữ liệu theo một hoặc
nhiều fields và tính aggregate cho mỗi nhóm.

![](media/image94.jpg){width="6.267716535433071in"
height="2.8055555555555554in"}

#### 5.7.3. Transactions

Khi cần đảm bảo nhiều database operations được thực hiện một cách
atomic - tức là hoặc tất cả đều thành công, hoặc tất cả đều được
rollback - Prisma cung cấp transactions. Trong ví dụ dưới đây, việc
chuyển task sang project khác và log activity được wrap trong một
transaction. Nếu bất kỳ operation nào fail, tất cả các thay đổi sẽ được
rollback tự động.

![](media/image95.jpg){width="6.267716535433071in"
height="3.4444444444444446in"}

### 5.8. Tích hợp Prisma với NestJS

Mặc dù Prisma không có official NestJS package như TypeORM hay Mongoose,
việc tích hợp Prisma vào một application NestJS vẫn rất đơn giản và
elegant. Cách tiếp cận phổ biến nhất là tạo một PrismaService để wrap
Prisma Client, sau đó expose service này thông qua một global module.
Phần này sẽ hướng dẫn chi tiết từng bước để setup và sử dụng Prisma
trong kiến trúc NestJS.

#### 5.8.1. Tạo Prisma Service

Trong triết lý của NestJS, mọi external dependency đều nên được wrap
trong một injectable service. Điều này mang lại nhiều lợi ích quan
trọng. Đầu tiên, việc wrap Prisma Client trong service cho phép tận dụng
đầy đủ dependency injection system của NestJS. Thay vì import và sử dụng
Prisma Client trực tiếp (tight coupling), các modules khác chỉ cần
inject PrismaService - pattern này giúp code loosely coupled và dễ test
hơn.

Thứ hai, việc có một service trung tâm cho database connection giúp quản
lý lifecycle một cách nhất quán. NestJS cung cấp các lifecycle hooks như
OnModuleInit và OnModuleDestroy, cho phép control chính xác khi nào
connect và disconnect khỏi database. Điều này đặc biệt quan trọng để đảm
bảo connections được cleanup properly khi application shutdown.

Thứ ba, trong testing, việc mock toàn bộ database layer trở nên cực kỳ
đơn giản. Chỉ cần provide một mock implementation của PrismaService
trong testing module, và tất cả các services sử dụng nó sẽ tự động nhận
mock thay vì real database connection.

Dưới đây là implementation đầy đủ của PrismaService:

![](media/image96.jpg){width="6.267716535433071in"
height="2.9722222222222223in"}

Trong implementation trên, PrismaService extends trực tiếp từ
PrismaClient, có nghĩa là nó sẽ kế thừa tất cả các methods của Prisma
Client như prisma.user.create(), prisma.task.findMany(), v.v. Decorator
\@Injectable() đánh dấu class này có thể được inject vào các classes
khác thông qua constructor. Hai lifecycle hooks OnModuleInit và
OnModuleDestroy đảm bảo connection được establish khi application khởi
động và được gracefully close khi shutdown.

#### 5.8.2. Tạo Prisma Module

Bước tiếp theo là tạo một module để export PrismaService. Có hai cách
tiếp cận chính: local module (import ở mỗi feature module cần sử dụng)
hoặc global module (import một lần ở root level và available
everywhere). Với database service - một dependency được sử dụng ở hầu
hết các places trong application - global module là lựa chọn phù hợp
hơn.

![](media/image97.jpg){width="6.267716535433071in"
height="1.6944444444444444in"}

Decorator \@Global() là key ở đây. Khi một module được đánh dấu global,
các providers mà nó export sẽ available ở bất kỳ đâu trong application
mà không cần explicit import. Tuy nhiên, PrismaModule vẫn cần được
import một lần ở AppModule để register với NestJS\'s IoC container.

![](media/image98.jpg){width="6.267716535433071in"
height="1.8333333333333333in"}

Sau bước này, PrismaService sẽ automatically available để inject trong
bất kỳ service hay controller nào của application.

#### 5.8.3. Sử dụng trong Service

Với PrismaService đã được setup, việc sử dụng trong các feature services
trở nên straightforward và elegant. Inject PrismaService thông qua
constructor (như mọi dependency khác trong NestJS), sau đó sử dụng như
một Prisma Client thông thường. Tất cả các queries đều type-safe và có
đầy đủ intellisense support từ IDE.

Dưới đây là ví dụ một TaskService hoàn chỉnh với các operations phổ
biến:

![](media/image99.jpg){width="6.083333333333333in"
height="8.333333333333334in"}

![](media/image100.jpg){width="6.267716535433071in"
height="3.0833333333333335in"}

Trong ví dụ trên, có thể thấy một số patterns quan trọng. Option include
được sử dụng xuyên suốt để eager load các related data cần thiết, tránh
N+1 query problem. Option select trong nested includes cho phép chọn chỉ
những fields cần thiết từ related records, giảm data transfer và improve
performance. Error handling với NotFoundException đảm bảo API trả về
response phù hợp khi resource không tồn tại. Soft delete pattern được
implement bằng cách update deletedAt thay vì xóa thực sự, và filter
deletedAt: null trong queries đảm bảo chỉ lấy active records.

### 5.9. Lỗi thường gặp và Trade-offs

#### 5.9.1. Vấn đề N+1 Query

#### 5.9.2. Trade-off: include vs select

#### 5.9.3. Khi nào KHÔNG nên dùng Prisma Migrate

### 5.10. Bài tập ứng dụng: Kết nối Database và CRUD User với Prisma

#### 5.10.1. Mục tiêu

Vận dụng kiến thức về Prisma ORM đã học trong Chương 5 để thay thế dữ
liệu in-memory bằng cơ sở dữ liệu PostgreSQL thực tế. Sau khi hoàn
thành, người đọc sẽ:

- Biết cách cài đặt, cấu hình Prisma và định nghĩa model trong schema.

- Thành thạo quy trình migration: từ schema → SQL → database.

- Tích hợp Prisma vào kiến trúc NestJS thông qua PrismaService
  (injectable, lifecycle hooks) và PrismaModule (global).

- Thực hiện các thao tác CRUD với database thực, sử dụng Prisma Client
  type-safe.

#### 5.10.2. Mô tả bài tập

Tiếp tục từ dự án todolist-collaboration ở Chương 4, thay thế mảng
in-memory trong UserService bằng PostgreSQL thông qua Prisma ORM.

Yêu cầu cụ thể:

1.  Cài đặt Prisma và khởi tạo cấu hình.

2.  Định nghĩa model User trong file schema.prisma.

3.  Tạo PrismaService với lifecycle hooks (onModuleInit,
    onModuleDestroy).

4.  Tạo PrismaModule với decorator \@Global().

5.  Refactor UserService: thay toàn bộ logic mảng in-memory bằng Prisma
    Client queries.

6.  Kiểm tra bằng Hoppscotch và Prisma Studio.

#### 5.10.3. Code minh họa

**Bước 1: Cài đặt và khởi tạo Prisma**

![](media/image101.png){width="6.21875in" height="1.2083333333333333in"}

Cấu hình kết nối database trong file .env:

![](media/image102.png){width="6.267716535433071in"
height="0.4166666666666667in"}

Kết quả:

![](media/image103.png){width="6.267716535433071in"
height="2.4444444444444446in"}

**Bước 2: Định nghĩa Model User**

![](media/image104.png){width="6.267716535433071in"
height="7.027777777777778in"}

Giải thích các attribute:

- \@id \@default(uuid()) --- Primary key, tự động sinh UUID.

- \@unique --- Email không được trùng lặp trong hệ thống.

- String? --- Dấu ? đánh dấu trường là optional (có thể null).

- \@default(ACTIVE) --- Trạng thái mặc định khi tạo user mới.

- \@updatedAt --- Tự động cập nhật timestamp khi record bị sửa đổi.

- @@map(\"users\") --- Tên bảng trong database là users (snake_case
  convention).

- enum UserStatus --- Giới hạn trạng thái chỉ nhận 3 giá trị hợp lệ.

Chạy migration:

![](media/image105.png){width="6.267716535433071in"
height="0.5555555555555556in"}

Kết quả:

![](media/image106.png){width="6.267716535433071in" height="3.125in"}

**Bước 3: Tạo PrismaService với Lifecycle Hooks**

Đây là file thực tế từ dự án TodoList Collaboration:

![](media/image107.png){width="6.267716535433071in"
height="5.638888888888889in"}

Điểm cần lưu ý:

- extends PrismaClient --- Kế thừa tất cả methods query database
  (this.user.findMany(), this.user.create(), \...). Không cần tạo
  instance riêng.

- implements OnModuleInit, OnModuleDestroy --- Móc vào vòng đời NestJS:
  mở kết nối khi module khởi tạo, đóng kết nối khi app shutdown.

- Tại sao không gọi \$connect() trong constructor? Vì constructor không
  hỗ trợ async. Lifecycle hooks là nơi đúng để thực hiện các thao tác
  bất đồng bộ.

**Bước 4: Tạo PrismaModule (Global)**

![](media/image108.png){width="6.267716535433071in"
height="2.0555555555555554in"}

- \@Global() --- PrismaService sẽ available ở mọi module trong ứng dụng
  mà không cần import PrismaModule lặp lại. Chỉ cần import một lần ở
  AppModule.

- exports: \[PrismaService\] --- Bắt buộc. Nếu thiếu dòng này, dù có
  \@Global() thì module khác vẫn không thể inject PrismaService.

Import vào AppModule:

![](media/image109.png){width="6.267716535433071in"
height="1.8472222222222223in"}

**Bước 5: Refactor UserService --- Thay in-memory bằng Prisma**

Dưới đây là UserService thực tế từ dự án, sử dụng Prisma Client thay cho
mảng in-memory:

![](media/image110.png){width="6.267716535433071in"
height="6.791666666666667in"}

![](media/image111.png){width="6.267716535433071in"
height="3.4027777777777777in"}

So sánh với phiên bản Chương 4:

- this.users.find() → this.prisma.user.findUnique() (query database
  thực).

- Trực tiếp mutate object → this.prisma.user.update() (cập nhật
  database).

- Các methods giờ là async vì thao tác database là bất đồng bộ.

- Option select chỉ trả về các trường được liệt kê --- đặc biệt quan
  trọng để không bao giờ trả password về cho client.

- Kiểu as const giúp TypeScript hiểu rằng đây là object bất biến, hỗ trợ
  type inference chính xác hơn.

**Bước 6: Kiểm tra bằng Hoppscotch**

Trước tiên, cần tạo dữ liệu test. Mở Prisma Studio:

![](media/image112.png){width="6.267716535433071in"
height="0.5972222222222222in"}

Truy cập [[http://localhost:5555]{.underline}](http://localhost:5555) ,
vào bảng users, tạo một bản ghi mới với các trường: email, password (giá
trị bất kỳ), name, displayName.

![](media/image113.png){width="2.2604166666666665in" height="8.5625in"}

**Test 1 --- Lấy hồ sơ người dùng (READ):**

- **Method:** GET

- **URL:** http://localhost:3000/users/{id-từ-prisma-studio}

- **Expected:** Object user với các trường đã select (không có
  password).

![](media/image114.png){width="6.267716535433071in"
height="4.986111111111111in"}

**Test 2 --- Cập nhật hồ sơ (UPDATE):**

- Method: PATCH

- URL: http://localhost:3000/users/{id}

- Body:

![](media/image115.png){width="6.267716535433071in"
height="1.2916666666666667in"}

![](media/image116.png){width="6.267716535433071in"
height="3.8333333333333335in"}

**Test 3 --- Xem dữ liệu đã cập nhật trên Prisma Studio:**

![](media/image117.png){width="6.267716535433071in"
height="0.7222222222222222in"}

#### 5.10.4. Kết quả đạt được

Sau khi hoàn thành bài tập:

- Cài đặt và cấu hình Prisma ORM, định nghĩa model User với đầy đủ field
  types, attributes, và enum.

- Tạo PrismaService tích hợp lifecycle hooks --- tự động mở/đóng kết nối
  database đúng thời điểm.

- Tạo PrismaModule với \@Global() --- PrismaService available ở mọi nơi
  trong ứng dụng.

- Refactor thành công UserService từ in-memory sang Prisma Client --- dữ
  liệu giờ đây được lưu trữ bền vững trong PostgreSQL.

- Option select đảm bảo không bao giờ trả trường nhạy cảm (password) về
  cho client.

Tuy nhiên, API hiện tại chưa có cơ chế kiểm tra tính hợp lệ của dữ liệu
đầu vào (ví dụ: displayName không quá 50 ký tự) và response chưa được
chuẩn hóa format. Chương tiếp theo sẽ giải quyết hai vấn đề này bằng
Pipes và Interceptors.

### 5.11. Tổng kết

Chương này đã trình bày toàn diện về việc làm việc với database trong
ứng dụng NestJS sử dụng Prisma ORM. Hành trình bắt đầu từ việc tìm hiểu
khái niệm ORM và vai trò của nó như cầu nối giữa thế giới hướng đối
tượng trong code và thế giới quan hệ trong database. Sau khi khảo sát
các ORM phổ biến trong hệ sinh thái NestJS bao gồm TypeORM, Sequelize,
MikroORM, và Mongoose, chúng ta đã lựa chọn Prisma vì những ưu điểm vượt
trội về type safety, developer experience, và khả năng tự động hóa
migrations.

Về mặt kỹ thuật, chương đã đi sâu vào kiến trúc ba thành phần của Prisma
gồm Prisma Client, Prisma Migrate, và Prisma Studio. Quy trình làm việc
với Prisma Schema Language để định nghĩa models, field types, enums, và
các loại relations (One-to-Many, Many-to-Many, One-to-One,
Self-Relation) đã được minh họa chi tiết với các ví dụ thực tế từ dự án
TodoList Collaboration.

Phần thực hành đã cover toàn bộ các thao tác CRUD cơ bản cùng với những
advanced queries như filtering phức tạp, aggregation, và transactions.
Cuối cùng, việc tích hợp Prisma vào kiến trúc NestJS thông qua
PrismaService và PrismaModule đảm bảo rằng database layer được quản lý
một cách nhất quán và tận dụng được dependency injection system của
framework.

Với nền tảng kiến thức này, chúng ta đã sẵn sàng để xây dựng tầng data
access hoàn chỉnh cho ứng dụng TodoList Collaboration, đảm bảo việc
tương tác với database được thực hiện một cách hiệu quả, an toàn, và dễ
bảo trì trong dài hạn.

## **Chương 6: Các kỹ thuật nâng cao**

### 6.1. Request Lifecycle trong NestJS

Trước khi đi vào từng kỹ thuật cụ thể, cần hiểu rõ vòng đời của một HTTP
request khi đi qua ứng dụng NestJS. Mỗi request sẽ phải \"bước qua\" một
chuỗi các trạm kiểm soát theo thứ tự cố định, và mỗi kỹ thuật trong
chương này sẽ can thiệp vào một giai đoạn cụ thể.

Đầu tiên, request sẽ gặp Middleware. Đây là trạm xử lý vòng ngoài cùng,
thường làm các nhiệm vụ chung chung như ghi log (Logging) hoặc cấp phép
tên miền (CORS) trước cả khi hệ thống điều hướng (routing) biết request
này sẽ đi về đâu. Tiếp theo, request phải đi qua lớp Guards (Người gác
cổng an ninh). Lớp này kiểm tra thẻ chứng minh (ví dụ như JwtAuthGuard)
để xem người dùng đã được hệ thống cấp phép hợp lệ chưa, rồi mới quyết
định cho đi tiếp hay đuổi về.

Sau khi qua cửa an ninh, request sẽ đi qua lớp Interceptors đoạn trước
(Kẻ đánh chặn đầu vào). Đây là nơi lý tưởng để biến đổi cấu trúc request
hoặc bấm đồng hồ bắt đầu tính thời gian chạy. Kế đến, request bị giữ lại
bởi Pipes (Máy soi an ninh). Hệ thống ống dẫn này có nhiệm vụ kiểm tra
dữ liệu đầu vào xem có đúng định dạng chuẩn (Validation) để tạo Task mới
hay không, đồng thời tự động ép kiểu dữ liệu cho khớp với yêu cầu của hệ
thống.

Khi đã rũ bỏ những dữ liệu rác rưởi bên ngoài và qua trót lọt mọi bài
kiểm tra, request mới chính thức diện kiến Controller - trung tâm đầu
não phân phối nơi chứa toàn bộ Business Logic (ví dụ TaskController gọi
tới Service xử lý việc cập nhật công việc). Sau khi Controller xử lý
xong và gói ghém dữ liệu chuẩn bị trả về, kết quả lại một lần nữa rơi
vào vòng tay của Interceptors đoạn sau (Kẻ đánh chặn đầu ra). Lớp này
lãnh trách nhiệm bọc kết quả lại theo một định dạng response chuẩn chỉnh
trước khi gửi thẳng về lại người dùng.

Trong suốt dọc hành trình tuyến tính đó, nếu có bất cứ biến cố, lỗi rác
(Exception) nào ném ra một cách khó kiểm soát, Exception Filters (Lưới
lọc lỗi) sẽ xuất hiện để hứng trọn vẹn. Nó gom các thông báo lỗi xấu xí
khô khan lại và gói gém thành dạng JSON tiêu chuẩn dễ đọc.

Việc thấu hiểu trình tự trước-sau của các trạm kiểm soát này vô cùng
quan trọng. Nhờ đó lập trình viên mới biết chính xác nên nhét logic xử
lý vào đâu cho tối ưu (Ví dụ: logic từ chối độ dài chuỗi title ngắn phải
đặt ở thư mục Pipes chứ không được dồn nén ra Middleware, vì Middleware
vốn dĩ chưa vớt được thông tin về hàm (route handler) chuẩn bị xử lý
chuỗi đó).

### 6.2. Pipes -- Validation và Transformation

#### 6.2.1. Pipe là gì?

Nếu coi Controller là \"Lễ tân\" tiếp nhận yêu cầu, thì Pipe đóng vai
trò như \"Máy soi an ninh\" đặt ngay trước cửa ngõ Controller. Về mặt kỹ
thuật, Pipe là một class được gắn \@Injectable() và implement interface
PipeTransform --- interface này bắt buộc phải có method transform(value,
metadata) để NestJS gọi vào mỗi khi có dữ liệu cần xử lý. Một request
mang theo dữ liệu (payload) từ client gửi lên sẽ bị Pipe giữ lại để thực
hiện hai nhiệm vụ cốt lõi: Validation (Kiểm tra tính hợp lệ) và
Transformation (Biến đổi dữ liệu).

Về Validation, Pipe sẽ soi xem dữ liệu có chứa mã độc, có bị thiếu
trường bắt buộc, thiếu định dạng email (@) hay không. Nếu phát hiện vi
phạm, Pipe lập tức \"tuýt còi\" (throw exception) và chặn đứng request
ngay tại chỗ, trả luôn lỗi về cho người dùng mà không thèm báo cáo vào
trong cho Controller biết gì cả. Về Transformation, đôi khi dữ liệu
người dùng gửi lên đúng về mặt ý nghĩa nhưng sai về định dạng --- ví dụ:
gửi ID dạng chuỗi chữ \"123\" nhưng Controller lại cần ID dạng số nguyên
123. Pipe sẽ tự động \"ép kiểu\" dữ liệu thành đúng định dạng trước khi
nhồi vào hàm xử lý bên trong.

NestJS cung cấp sẵn các \"máy soi\" mạnh mẽ như: ValidationPipe (kiểm
duyệt toàn diện form data mượt mà dựa trên DTO), ParseIntPipe (tự ép
String thành Integer), ParseBoolPipe (chuyển chuỗi \"true\" / \"false\"
thành kiểu boolean), hay ParseUUIDPipe (chỉ cho phép các ID có định dạng
mã UUID siêu dài đi qua).

#### 6.2.2. ValidationPipe -- Validate dữ liệu tự động

ValidationPipe là pipe quan trọng nhất và được sử dụng rộng rãi nhất
trong NestJS. Pipe này phối hợp với thư viện class-validator và
class-transformer để tự động validate request body dựa trên decorators
trong DTO class.

Đầu tiên, cần cài đặt hai thư viện hỗ trợ:

![](media/image118.gif){width="6.267716535433071in"
height="0.5277777777777778in"}

Tiếp theo, kích hoạt ValidationPipe ở cấp global trong \`main.ts\` để áp
dụng cho toàn bộ ứng dụng:

![](media/image119.gif){width="6.267716535433071in"
height="2.888888888888889in"}

Option \`whitelist: true\` là tính năng bảo mật quan trọng --- nó tự
động loại bỏ bất kỳ field nào client gửi lên mà không được khai báo
trong DTO. Ví dụ, nếu client cố gắng gửi \`{ title: \"Task\", role:
\"admin\" }\`, field \`role\` sẽ bị loại bỏ vì không tồn tại trong
CreateTaskDto.

#### 6.2.3. Áp dụng vào CreateTaskDto

Khi ValidationPipe đã được kích hoạt global, mọi DTO sử dụng
class-validator decorators sẽ được validate tự động:

![](media/image120.gif){width="6.267716535433071in"
height="5.805555555555555in"}

Cấu trúc CreateTaskDto được xây dựng theo nguyên tắc từng trường có bộ
decorator riêng để kiểm soát chặt chẽ. Trường title bắt buộc phải là
chuỗi không được rỗng và không vượt 200 ký tự --- thay vì hàng chục dòng
code if-else thủ công, chỉ cần ba dòng decorator là đủ. Trường status và
priority dùng \@IsEnum() để bảo đảm client chỉ có thể gửi đúng một trong
các giá trị được định nghĩa sẵn trong enum, nếu gửi chữ \"xong\" thay vì
\"DONE\" sẽ bị từ chối ngay lập tức. Trường dueDate yêu cầu đúng chuẩn
ISO 8601 nên client không thể gửi các định dạng ngày tùy tiện như
\"23/2/2026\". Cuối cùng, projectId bắt buộc phải là UUID chuẩn để tránh
các ID rác từ phía client chị được truyền xuống hàm query Database.

#### 6.2.4. ParseUUIDPipe -- Validate tham số URL

Ngoài validate body, chúng ta cần validate cả URL parameters. Ví dụ,
endpoint GET /tasks/:id cần đảm bảo :id là UUID hợp lệ:

![](media/image121.gif){width="6.267716535433071in"
height="0.8055555555555556in"}

Nếu client gửi GET /tasks/abc (không phải UUID), ParseUUIDPipe sẽ tự
động trả về lỗi 400 thay vì để request đi đến service và query database
với giá trị không hợp lệ.

### 6.3. Interceptors -- Xử lý Response và Cross-cutting Concerns

#### 6.3.1. Interceptor là gì?

Khác với Pipe chỉ đứng chặn cửa lúc đi vào, Interceptor có quyền năng to
lớn hơn: nó có thể chặn request trước khi vào Controller, VÀ chặn luôn
mớ dữ liệu sau khi Controller làm xong chuẩn bị trả về client. Theo tài
liệu chính thức NestJS, Interceptors được xây dựng dựa trên tư tưởng AOP
(Aspect-Oriented Programming --- Lập trình Hướng Khía cạnh), một phương
pháp thiết kế phần mềm cho phép tách khỏi các logic lặp đi lặp lại (như
logging, caching) ra khỏi mã nghiệp vụ chính. Về mặt kỹ thuật,
Interceptor là class được gắn \@Injectable() và implement interface
NestInterceptor. Method intercept(context, next) của nó nhận vào next:
CallHandler --- một stream RxJS Observable đại diện cho luồng dữ liệu xử
lý. Khi gọi next.handle(), bạn quán sát (\"subscribe\") vào bước kế tiếp
của pipeline, sau đó có thể dùng toán tử RxJS như map() để biến đổi kết
quả hoặc tap() để quan sát mà không đụng vào dữ liệu.

Ba \"nỗi lo chung\" (\"Cross-cutting Concerns\") điển hình nhất mà
Interceptor có thể hỗ trợ giải quyết bao gồm:

- Logging (bấm giờ từ lúc request vào đến lúc response ra, đo thời gian
  xử lý từng API)

- Transform Response (bọc kết quả JSON trả về theo một định dạng chung {
  success: true, data: \[\...\] } cho toàn hệ thống)

- Caching (trả người dùng kết quả có sẵn trong bộ nhớ tạm nếu câu hỏi
  giống hệt trong khoảng thời gian hiệu lực, tiết kiệm hẳn một chuyến
  truy vấn DB).

#### 6.3.2. Transform Response Interceptor

Trong dự án TodoList Collaboration, chúng ta muốn tất cả API responses
có cùng một format chuẩn để frontend dễ xử lý. Thay vì wrap response thủ
công trong từng controller method, tạo một interceptor áp dụng toàn cục:

![](media/image122.gif){width="6.267716535433071in"
height="4.013888888888889in"}

Có một số điểm kỹ thuật quan trọng cần hiểu trong đoạn code trên.
TransformResponseInterceptor implement interface NestInterceptor\<T,
ApiResponse\<T\>\> --- trong đó tham số đầu tiên T là kiểu dữ liệu đầu
vào từ Controller, tham số thứ hai ApiResponse\<T\> là kiểu dữ liệu đầu
ra sau khi đã bọc. Trong method intercept(), việc gọi next.handle() có
nghĩa là \"cho phép request tiếp tục chạy xuống Controller\" và đợi kết
quả trả về dưới dạng một RxJS Observable. Toán tử map() sau đó lần lượt
xử lý từng giá trị chạy ra khỏi stream đó, bọc chúng vào format {
success, data, timestamp } rồi mới gửi về client. Nhờ kiến trúc này, khi
áp dụng interceptor toàn củc, mọi API trong hệ thống đều tự động có cùng
format response mà không cần chạm vào bất kỳ Controller nào.

![](media/image123.gif){width="6.267716535433071in"
height="0.9722222222222222in"}

### 6.4. File Upload với Multer

Bên cạnh việc validate dữ liệu JSON và transform response, một nhu cầu
phổ biến khác trong ứng dụng web là xử lý file upload. Khi người dùng
muốn thay đổi ảnh đại diện, đính kèm tài liệu, hay tải lên bất kỳ file
nào, request gửi lên server không còn là JSON thuần túy nữa mà sử dụng
encoding hoàn toàn khác --- **multipart/form-data**. Đây là định dạng
cho phép gửi đồng thời cả dữ liệu text lẫn binary (file) trong cùng một
HTTP request. Express.js và NestJS không xử lý được loại request này
theo mặc định, do đó cần một middleware chuyên biệt.

#### 6.4.1. Multer là gì và tại sao cần Multer?

Để xử lý được loại request multipart/form-data này, NestJS dựa vào
**Multer** --- một middleware Node.js chuyên biệt cho việc parse dữ liệu
multipart. Khi client gửi request chứa file, Express chỉ nhận được một
chuỗi binary thô mà không biết đâu là file, đâu là metadata, đâu là ranh
giới giữa các phần. Multer đảm nhận toàn bộ quá trình phân tích chuỗi
binary đó, tách từng file ra, validate, và lưu trữ --- giúp controller
chỉ cần nhận file đã được xử lý sẵn.

NestJS tích hợp Multer thông qua package \@nestjs/platform-express, cung
cấp FileInterceptor và decorator \@UploadedFile() để làm việc với file
upload một cách khai báo (*declarative*), phù hợp với kiến trúc module
của framework. Thay vì viết middleware thủ công như trong Express thuần,
chúng ta chỉ cần gắn một decorator lên method trong controller ---
NestJS sẽ tự động gọi Multer ở đúng thời điểm trong request pipeline.

#### 6.4.2. Lý thuyết hoạt động

Sau khi biết Multer là gì và vai trò của nó trong NestJS, phần này đi
sâu vào cơ chế hoạt động bên trong --- từ cấu trúc của request multipart
cho đến chiến lược lưu trữ file và luồng xử lý end-to-end.

#### Cấu trúc multipart/form-data

Để hiểu tại sao cần Multer, trước hết cần hiểu multipart/form-data khác
JSON như thế nào. Với JSON, toàn bộ request body là một chuỗi text có
cấu trúc rõ ràng --- server chỉ cần JSON.parse() là xong. Nhưng khi gửi
file, request body trở thành hỗn hợp giữa text và binary, được chia
thành nhiều phần (*parts*) ngăn cách bởi một chuỗi đặc biệt gọi là
*boundary*. Mỗi part có header riêng mô tả kiểu nội dung, và phần cuối
cùng kết thúc bằng boundary kèm dấu \--.

Dưới đây là cấu trúc thực tế của một request upload avatar:

![](media/image124.png){width="6.267716535433071in"
height="1.9722222222222223in"}

Server nhận được chuỗi bytes thô này và cần: tìm boundary string, tách
từng part, đọc header Content-Disposition để biết tên field và tên file
gốc, đọc Content-Type để biết loại file, rồi tách phần binary data ra
khỏi header. Quá trình này phức tạp hơn nhiều so với parse JSON, và đó
chính là lý do Express không cung cấp middleware mặc định cho multipart
--- phần việc đó được giao cho Multer.

#### Storage strategy: memoryStorage vs diskStorage

Sau khi Multer parse xong request và tách được file ra, câu hỏi tiếp
theo là lưu file ở đâu. Multer cung cấp hai chiến lược lưu trữ:

  -------------- ----------------------------- --------------------------
  **Tiêu chí**   **\*\*memoryStorage\*\***     **\*\*diskStorage\*\***

  **Lưu ở đâu**  RAM --- file tồn tại dưới     Disk --- file được ghi
                 dạng Buffer trong bộ nhớ      trực tiếp vào ổ đĩa

  **Truy cập     Qua file.buffer (mảng bytes)  Qua file.path và
  file**                                       file.filename

  **Ưu điểm**    Cho phép xử lý file trước khi Không tốn RAM, an toàn với
                 lưu (resize, compress, upload file lớn
                 lên cloud)                    

  **Nhược điểm** Tốn RAM, nguy cơ              File đã nằm trên disk
                 Out-Of-Memory nếu nhiều user  trước khi business logic
                 upload đồng thời              chạy

  **Phù hợp      Ứng dụng cần transform file   Ứng dụng lưu file trực
  cho**          trước khi lưu                 tiếp, không cần xử lý
                                               trung gian
  -------------- ----------------------------- --------------------------

Trong dự án TodoList Collaboration, nhóm dự tính chọn **diskStorage** vì
avatar chỉ cần lưu thẳng vào thư mục uploads/avatars/ mà không cần
resize hay compress. Multer tự động ghi file ra disk ngay trong quá
trình parse request --- khi code trong controller chạy, file đã nằm sẵn
trên ổ đĩa rồi.

#### Luồng xử lý trong NestJS

Khi một request upload avatar được gửi đến hệ thống, luồng xử lý đi qua
nhiều lớp trước khi business logic thực sự chạy:

![](media/image125.png){width="6.267716535433071in"
height="5.652777777777778in"}

*Hình 6.1: Luồng xử lý file upload qua Multer trong NestJS*

Điểm đáng chú ý là file được validate **hai lần**: lần đầu bởi Multer
(fileFilter kiểm tra MIME type), lần hai bởi ParseFilePipe của NestJS
(kiểm tra kích thước). Chiến lược *defense in depth* --- phòng thủ nhiều
lớp --- này đảm bảo rằng ngay cả khi một lớp bị bypass hoặc cấu hình
thiếu, lớp còn lại vẫn bắt được file không hợp lệ. Đây là nguyên tắc bảo
mật quan trọng khi xử lý dữ liệu từ bên ngoài.

#### 6.4.3. Cấu hình Multer trong dự án

Nắm được lý thuyết về storage strategy và luồng xử lý, bước tiếp theo là
triển khai cấu hình Multer cụ thể cho dự án. File cấu hình này tập trung
toàn bộ logic liên quan đến việc lưu trữ và validate file tại một nơi,
tách biệt khỏi controller và service. Cách tổ chức này tuân theo nguyên
tắc *Separation of Concerns* --- nếu sau này cần thay đổi thư mục lưu
trữ hoặc thêm định dạng file mới, chỉ cần sửa một file duy nhất.

File cấu hình Multer tập trung toàn bộ logic liên quan đến việc lưu trữ
và validate file tại một nơi, tách biệt khỏi controller và service. Cách
tổ chức này tuân theo nguyên tắc *Separation of Concerns* --- nếu sau
này cần thay đổi thư mục lưu trữ hoặc thêm định dạng file mới, chỉ cần
sửa một file duy nhất:

![](media/image126.png){width="6.267716535433071in"
height="5.861111111111111in"}

Cấu hình trên bao gồm ba thành phần chính. **storage** sử dụng
diskStorage với hai callback: destination chỉ định thư mục lưu file, và
filename tạo tên file duy nhất bằng cách kết hợp fieldname, timestamp
(Date.now()) và số ngẫu nhiên --- đảm bảo không bao giờ trùng lặp kể cả
khi nhiều user upload cùng lúc. **limits** giới hạn kích thước file tối
đa 5MB, ngăn chặn việc upload file quá lớn gây tốn tài nguyên server ---
Multer sẽ reject request ngay khi đọc đủ 5MB mà không cần đợi toàn bộ
file. **fileFilter** kiểm tra MIME type --- chỉ cho phép ba định dạng
ảnh phổ biến, reject mọi loại file khác ngay trước khi lưu vào disk.

Ngoài ra, đoạn code đầu file tự động tạo thư mục uploads/avatars/ nếu
chưa tồn tại. Sử dụng existsSync và mkdirSync (đồng bộ) ở đây là hợp lý
vì đoạn này chỉ chạy **một lần duy nhất** khi ứng dụng khởi tạo, không
ảnh hưởng đến hiệu năng xử lý request.

#### 6.4.4. Controller nhận file upload

Với cấu hình Multer đã sẵn sàng, bước tiếp theo là kết nối nó vào
Controller --- nơi endpoint nhận request upload từ client. Tại đây, các
decorator của NestJS đóng vai trò cầu nối giữa cấu hình Multer và logic
xử lý request:

Tại tầng Controller, endpoint upload avatar sử dụng các decorator của
NestJS để kết nối với Multer và validate file:

![](media/image127.png){width="6.267716535433071in"
height="3.5555555555555554in"}

Đoạn code trên tuy ngắn gọn nhưng chứa nhiều lớp xử lý đan xen.
\@UseInterceptors(FileInterceptor(\'avatar\', avatarMulterConfig)) chỉ
định rằng endpoint này nhận file từ field có tên avatar trong form-data,
sử dụng cấu hình đã định nghĩa ở multer.config.ts. FileInterceptor chính
là cầu nối giữa NestJS và Multer --- nó gọi Multer để parse request,
chạy fileFilter và limits, rồi lưu file vào disk thông qua diskStorage.

\@UploadedFile() kết hợp ParseFilePipe tạo lớp validate thứ hai. Tại đây
MaxFileSizeValidator kiểm tra lại kích thước file --- tưởng như thừa vì
limits trong Multer đã giới hạn 5MB, nhưng thực tế đây là lớp phòng thủ
bổ sung phòng trường hợp cấu hình Multer bị thay đổi mà quên cập nhật.
Sau khi qua tất cả kiểm tra, file chứa đầy đủ metadata: filename (tên
file trên disk), originalname (tên file gốc từ client), mimetype, size,
và path (đường dẫn đầy đủ trên disk).

#### 6.4.5. Service lưu file và cập nhật DB

Sau khi Controller nhận và validate file thành công, nó chuyển tiếp sang
Service --- nơi chứa business logic thực sự. UserService.uploadAvatar()
xử lý toàn bộ phần còn lại: tìm user, dọn dẹp file cũ, và cập nhật
database.

UserService.uploadAvatar() xử lý toàn bộ business logic sau khi file đã
được Multer lưu vào disk:

![](media/image128.png){width="6.267716535433071in"
height="4.166666666666667in"}

Logic xử lý đi qua bốn bước tuần tự.

Bước đầu tiên kiểm tra file tồn tại --- mặc dù ParseFilePipe đã
validate, kiểm tra tại service vẫn cần thiết để method có thể hoạt động
độc lập khi được gọi từ nơi khác.

Bước thứ hai tìm user trong database và lấy tên avatar hiện tại.

Bước thứ ba xóa file avatar cũ trên disk nếu có --- fs.unlink() kết hợp
.catch(() =\> {}) bỏ qua lỗi khi file đã bị xóa trước đó hoặc không tồn
tại, tránh crash toàn bộ quá trình upload. Nếu không thực hiện bước xóa
này, mỗi lần user thay avatar sẽ để lại một file không sử dụng trên
disk, dần dần chiếm hết dung lượng.

Bước cuối cùng cập nhật tên file mới vào database --- chỉ lưu
file.filename (tên file) thay vì đường dẫn tuyệt đối, nhờ vậy khi di
chuyển thư mục uploads/ sang vị trí khác, chỉ cần thay đổi cấu hình
static serving mà không cần cập nhật database.

Một điểm quan trọng cần lưu ý: vì sử dụng diskStorage, file đã được
Multer ghi vào disk **trước khi** code trong service chạy. Service không
cần gọi fs.writeFile() --- chỉ cần lấy file.filename mà Multer đã tạo
sẵn. Đây là khác biệt cốt lõi so với memoryStorage, nơi file chỉ tồn tại
trong RAM dưới dạng file.buffer và developer phải tự ghi ra disk.

#### 6.4.6. Phục vụ file tĩnh (Static File Serving)

Đến đây, file đã được lưu trên disk và đường dẫn đã được ghi vào
database. Tuy nhiên, điều đó chưa đủ --- client cần có cách truy cập
file qua URL để hiển thị ảnh đại diện trên giao diện. NestJS cung cấp
method useStaticAssets() cho mục đích này --- tương tự express.static()
trong Express thuần:

![](media/image129.png){width="5.270833333333333in" height="1.0in"}

Với cấu hình trên, file avatar lưu tại
backend/uploads/avatars/avatar-123.jpg sẽ có thể truy cập qua URL
http://localhost:3333/uploads/avatars/avatar-123.jpg. process.cwd() trả
về thư mục nơi lệnh node được chạy (thường là backend/), đảm bảo đường
dẫn chính xác bất kể môi trường development hay production.

Prefix /uploads/ đóng vai trò giới hạn phạm vi truy cập --- chỉ các file
trong thư mục uploads/ mới được serve. Nếu đặt prefix là /, browser có
thể truy cập bất kỳ file nào trong thư mục gốc, gây rủi ro bảo mật
nghiêm trọng. Nhờ prefix, chúng ta kiểm soát chính xác những gì được
phép truy cập từ bên ngoài.

#### 

#### 6.4.7. Kết quả

Sau khi hoàn tất cả bốn tầng --- cấu hình Multer, Controller validate,
Service xử lý business logic, và static file serving --- hệ thống upload
avatar đã sẵn sàng hoạt động. Khi upload thành công qua endpoint POST
/api/v1/users/me/avatar, API trả về thông tin profile đã cập nhật, được
wrap trong format chuẩn nhờ TransformResponseInterceptor đã trình bày ở
**mục 6.3**:

![](media/image130.png){width="5.854166666666667in"
height="3.4583333333333335in"}

Client sử dụng field avatar kết hợp base URL để tạo đường dẫn đầy đủ
truy cập ảnh:
http://localhost:3333/uploads/avatars/avatar-1712345678901-123456789.jpg.
Chú ý rằng response chỉ chứa tên file chứ không chứa đường dẫn đầy đủ
--- client tự ghép base URL, giúp hệ thống linh hoạt khi thay đổi domain
hoặc CDN.

#### 6.4.8. Khi nào dùng / không nên dùng Multer

Dù hỗ trợ upload file hiệu quả như đã minh họa qua tính năng avatar,
Multer không phải giải pháp phù hợp cho mọi tình huống upload file. Bảng
dưới đây tổng hợp các trường hợp nên và không nên sử dụng Multer:

  ----------------- ------------------------- ---------------------------
  **Trường hợp**    **\*\*Nên dùng            **\*\*Không nên dùng
                    Multer\*\***              Multer\*\***

  Kích thước file   File nhỏ-vừa (\< 50MB)    File rất lớn (\> 100MB) ---
                                              tốn RAM hoặc disk I/O

  Lưu trữ           Local disk hoặc chuyển    Cần upload trực tiếp lên
                    tiếp sang cloud           S3/GCS --- dùng presigned
                                              URL

  Số lượng          Upload 1-10 files mỗi     Batch upload hàng trăm
                    request                   files

  Processing        Cần validate hoặc         Client upload thẳng lên
                    transform file trên       cloud, server chỉ nhận URL
                    server                    

  Infrastructure    Single server             Nhiều server (load
                                              balanced) --- file local
                                              không sync
  ----------------- ------------------------- ---------------------------

Trong dự án TodoList Collaboration, Multer là lựa chọn phù hợp vì chỉ
cần upload avatar --- file ảnh nhỏ, một file mỗi request, lưu trên local
disk. Khi mở rộng lên production với nhiều server, nên chuyển sang giải
pháp cloud storage như Amazon S3 kết hợp presigned URL, để client upload
trực tiếp lên cloud mà không tốn bandwidth của application server. Hướng
phát triển này sẽ được đề cập chi tiết ở **Chương 12**.

### 6.5. Lỗi thường gặp và Trade-offs

#### 6.5.1. Khi nào KHÔNG dùng ValidationPipe global

Trong main.ts của dự án TodoList Collaboration, ValidationPipe được đăng
ký ở cấp global với option whitelist: true và forbidNonWhitelisted:
true. Cấu hình này hoạt động hoàn hảo cho hầu hết các endpoint nhận JSON
body --- tự động loại bỏ fields không khai báo trong DTO và báo lỗi nếu
client gửi fields lạ.

Tuy nhiên, ValidationPipe global có thể gây xung đột với hai loại
endpoint đặc biệt. Thứ nhất là endpoint nhận **multipart/form-data**
(file upload) --- vì khi whitelist được bật, ValidationPipe có thể strip
mất metadata của file hoặc báo lỗi vì form fields không match DTO. Thứ
hai là **webhook endpoints** nhận payload từ dịch vụ bên ngoài ---
payload này có cấu trúc do bên thứ ba quyết định, không thể kiểm soát
bằng DTO.

Trong những trường hợp này, giải pháp là override ValidationPipe ở cấp
method hoặc controller:

![](media/image131.png){width="6.267716535433071in"
height="1.4305555555555556in"}

Trong dự án TodoList Collaboration, endpoint upload avatar không gặp vấn
đề này vì FileInterceptor xử lý multipart/form-data trước khi
ValidationPipe can thiệp. Tuy nhiên, nếu sau này cần thêm webhook (ví
dụ: webhook từ Stripe cho thanh toán), cần nhớ override ValidationPipe
cho endpoint đó.

#### 6.5.2. Trade-off: Interceptor vs Middleware

Ngoài vấn đề ValidationPipe, một câu hỏi thường gặp khi thiết kế ứng
dụng NestJS là khi nào nên dùng Interceptor và khi nào nên dùng
Middleware. Hai cơ chế này có vẻ tương tự --- đều cho phép chèn logic
trước khi request đến handler --- nhưng thực tế chúng hoạt động ở các vị
trí khác nhau trong pipeline và phục vụ những mục đích khác nhau. Để
hiểu rõ sự khác biệt, cần phân tích từng khía cạnh cụ thể.

#### Vị trí trong request pipeline

Sự khác biệt quan trọng nhất nằm ở **thứ tự thực thi**. Middleware chạy
đầu tiên trong pipeline --- trước cả Guards, Pipes, và Interceptors.
Điều này có nghĩa Middleware xử lý request ở dạng \"thô\" nhất, khi
NestJS chưa biết request sẽ được route đến controller hay method nào.
Ngược lại, Interceptor chạy **sau Guards** (đã xác thực xong) và **bao
quanh Handler** --- tức là nó có thể can thiệp cả trước lẫn sau khi
handler trả về kết quả. Chính vì chạy ở cả hai phía của handler,
Interceptor có khả năng transform response --- điều mà Middleware không
thể làm được vì nó đã chạy xong trước khi handler bắt đầu.

![](media/image132.png){width="5.166666666666667in"
height="7.885416666666667in"}

#### Khả năng truy cập Dependency Injection Container

Middleware trong NestJS có hai dạng: **function middleware** và **class
middleware**. Function middleware là một hàm đơn giản nhận (req, res,
next) --- hoàn toàn giống Express middleware truyền thống --- và không
có khả năng inject service từ DI container. Class middleware có thể
inject service qua constructor, nhưng bị hạn chế bởi cách NestJS đăng ký
middleware (qua consumer.apply() trong module), khiến việc quản lý
dependencies kém linh hoạt hơn.

Interceptor, ngược lại, là một class đầy đủ với decorator
\@Injectable(), được NestJS quản lý hoàn toàn trong DI container. Nó có
thể inject bất kỳ service nào --- từ ConfigService để đọc cấu hình, đến
Logger để ghi log, hay bất kỳ custom service nào trong ứng dụng. Khả
năng này đặc biệt quan trọng khi logic trước/sau request cần tương tác
với database, cache, hoặc các service khác.

#### Xử lý response và tính năng RxJS

Đây là điểm khác biệt mang tính quyết định khi chọn giữa hai cơ chế.
Middleware chỉ xử lý **request** --- nó nhận req, có thể đọc/sửa
headers, body, rồi gọi next() để chuyển tiếp. Sau khi gọi next(),
Middleware không có cách nào can thiệp vào response trả về (trừ khi hack
bằng cách override res.json(), nhưng đây là anti-pattern).

Interceptor hoạt động theo mô hình **Observable** của RxJS. Method
intercept() trả về một Observable, và handler của controller cũng được
wrap thành Observable. Nhờ đó, Interceptor có toàn bộ sức mạnh của RxJS
operators: map() để transform response data, tap() để thực hiện
side-effect (logging, metrics) mà không thay đổi data, catchError() để
xử lý lỗi, hay timeout() để giới hạn thời gian xử lý. Ví dụ,
TransformResponseInterceptor trong dự án sử dụng map() để wrap mọi
response thành format { success, data, timestamp } --- một thao tác mà
Middleware đơn giản không thể thực hiện.

#### Truy cập ExecutionContext

Interceptor nhận tham số ExecutionContext --- một object chứa metadata
phong phú về request hiện tại: controller nào đang xử lý, method nào sẽ
chạy, metadata từ decorators (như \@Roles() hay \@Public()), và cả thông
tin về transport layer (HTTP, WebSocket, hay gRPC). Khả năng này cho
phép Interceptor đưa ra quyết định dựa trên ngữ cảnh --- ví dụ, chỉ
cache response cho những method được đánh dấu \@Cacheable(), hoặc bỏ qua
logging cho health-check endpoints.

Middleware không có ExecutionContext. Nó chỉ nhận req, res, next --- ba
đối tượng Express thuần. Middleware không biết request sẽ đến controller
nào, không đọc được custom decorators, và không phân biệt được các
transport layers. Điều này giới hạn Middleware vào những tác vụ không
cần biết \"ai sẽ xử lý request này\" --- như CORS, body parsing, hay
request logging cơ bản.

#### Phạm vi áp dụng

Middleware được đăng ký theo **route** trong method configure() của
module --- áp dụng cho các đường dẫn cụ thể (ví dụ: forRoutes(\'users\')
hoặc forRoutes({ path: \'auth/\*\', method: RequestMethod.POST })). Cách
tiếp cận route-based này phù hợp cho những tác vụ cần áp dụng theo URL
pattern, nhưng không có cách đơn giản để áp dụng cho \"tất cả method
trong một controller\" hay \"chỉ method này trong controller kia\".

Interceptor linh hoạt hơn với ba cấp độ: **global** (áp dụng toàn app),
**controller** (áp dụng mọi method trong controller đó qua
\@UseInterceptors() trên class), hoặc **method** (chỉ áp dụng cho một
endpoint cụ thể qua \@UseInterceptors() trên method). Hệ thống phân cấp
này cho phép kiểm soát chính xác interceptor nào chạy ở đâu mà không cần
khai báo route patterns.

#### Bảng so sánh tổng hợp

Sau khi phân tích từng khía cạnh, bảng dưới đây tóm tắt sự khác biệt
giữa Interceptor và Middleware để tiện tra cứu nhanh:

  -------------------- ------------------------- --------------------------
  **Tiêu chí**         **\*\*Interceptor\*\***   **\*\*Middleware\*\***

  **Vị trí trong       Sau Guards, trước/sau     Đầu tiên, trước Guards
  pipeline**           Handler                   

  **Truy cập DI        Có --- inject bất kỳ      Không (function
  Container**          service nào               middleware) hoặc hạn chế
                                                 (class middleware)

  **Xử lý response**   Có --- wrap/transform     Không --- chỉ xử lý
                       response qua RxJS map()   request

  **Truy cập           Có --- biết handler nào   Không --- chỉ có req, res,
  ExecutionContext**   sẽ chạy                   next

  **Tính năng RxJS**   Đầy đủ --- tap(), map(),  Không có
                       catchError()              

  **Phạm vi áp dụng**  Global, controller, hoặc  Route-based
                       method                    
  -------------------- ------------------------- --------------------------

#### Lựa chọn trong dự án TodoList Collaboration

Dựa trên những phân tích trên, nhóm đã chọn Interceptor cho hai mục đích
chính. TransformResponseInterceptor wrap tất cả response thành chuẩn {
success, data, timestamp } --- điều này chỉ Interceptor mới làm được vì
cần truy cập response data sau khi handler trả về. LoggingInterceptor
ghi log thời gian xử lý request --- cần đo thời gian từ trước đến sau
handler, Interceptor với RxJS tap() thực hiện điều này rất tự nhiên.

Middleware được NestJS tự động sử dụng cho CORS (Cross-Origin Resource
Sharing) --- đây là trường hợp điển hình cần xử lý ở đầu pipeline, trước
mọi logic khác. Ngoài ra, body parsing (json(), urlencoded()) cũng là
middleware mặc định. Nói cách khác, Middleware phù hợp cho những tác vụ
\"infrastructure\" chạy sớm trong pipeline và không cần biết về business
logic, còn Interceptor phù hợp cho những tác vụ cần hiểu ngữ cảnh và can
thiệp vào cả request lẫn response.

#### 6.5.3. Interceptor chỉ wrap success --- lỗi \"quên\" xử lý error

Một lỗi thường gặp khi viết Interceptor là chỉ wrap response thành công
mà bỏ qua trường hợp lỗi. Xem xét TransformResponseInterceptor của dự
án:

![](media/image133.png){width="6.267716535433071in"
height="3.2083333333333335in"}

Interceptor này chỉ dùng map() --- operator chỉ chạy khi handler trả về
thành công. Khi handler throw exception, map() bị bỏ qua hoàn toàn, và
response lỗi sẽ không có format chuẩn. Nếu developer cố gắng xử lý cả
error trong Interceptor bằng catchError(), code sẽ trở nên phức tạp và
vi phạm Single Responsibility Principle.

Giải pháp đúng --- và cũng là cách dự án TodoList Collaboration đã làm
--- là **tách riêng** trách nhiệm xử lý success và error thành hai thành
phần:

![](media/image134.png){width="6.267716535433071in"
height="3.2222222222222223in"}

TransformResponseInterceptor xử lý response thành công (success: true),
còn HttpExceptionFilter xử lý response lỗi (success: false). Cả hai đều
trả về format nhất quán, giúp frontend chỉ cần kiểm tra field success để
biết request thành công hay thất bại --- không cần xử lý nhiều format
khác nhau.

### 6.6. Bài tập ứng dụng: Validation, Response chuẩn hóa và Exception Filter

#### 6.6.1. Mục tiêu

Vận dụng các kỹ thuật nâng cao đã học trong Chương 6 --- Pipes,
Interceptors, và Exception Filters --- vào dự án TodoList Collaboration.
Sau khi hoàn thành, người đọc sẽ:

- Biết cách tạo DTO với các validation rules sử dụng class-validator.

- Hiểu cách ValidationPipe tự động kiểm tra dữ liệu đầu vào.

- Xây dựng TransformResponseInterceptor để chuẩn hóa format response
  thành công.

- Xây dựng HttpExceptionFilter để chuẩn hóa format response lỗi.

- Phân biệt rõ vai trò: Pipe (kiểm tra đầu vào) → Controller →
  Interceptor (bọc đầu ra) → Filter (bắt lỗi).

#### 6.6.2. Mô tả bài tập

Tiếp tục từ dự án ở Chương 5, bổ sung ba cơ chế quan trọng: kiểm tra dữ
liệu đầu vào (Validation Pipe + DTO), chuẩn hóa response thành công
(Interceptor), và chuẩn hóa response lỗi (Exception Filter).

Yêu cầu cụ thể:

1.  Cài đặt class-validator và class-transformer.

2.  Tạo UpdateProfileDto với validation: displayName (optional, max 50
    ký tự), bio (optional, max 160 ký tự).

3.  Kích hoạt ValidationPipe toàn cục với whitelist và
    forbidNonWhitelisted.

4.  Tạo TransformResponseInterceptor bọc response thành { success, data,
    timestamp }.

5.  Tạo HttpExceptionFilter bọc lỗi thành { success: false, statusCode,
    message, path, timestamp }.

6.  Đăng ký tất cả trong main.ts.

#### 6.6.3. Code minh họa

**Bước 1: Cài đặt thư viện**

![](media/image135.png){width="6.267716535433071in" height="0.5in"}

**Bước 2: Tạo UpdateProfileDto**

Đây là DTO thực tế từ dự án TodoList Collaboration:

![](media/image136.png){width="6.267716535433071in"
height="2.0416666666666665in"}

Mỗi trường được bảo vệ bởi decorator:

- \@IsOptional() --- Trường này không bắt buộc. Nếu không gửi, sẽ không
  bị validate.

- \@IsString() --- Nếu có gửi, giá trị phải là chuỗi ký tự.

- \@MaxLength(50) --- Giới hạn độ dài tối đa. Tham số message tuỳ chỉnh
  thông báo lỗi.

- Dấu ? sau tên trường (displayName?) đánh dấu trường là optional trong
  TypeScript.

**Bước 3: Cập nhật Controller sử dụng DTO**

![](media/image137.png){width="6.267716535433071in"
height="3.1805555555555554in"}

Khi \@Body() nhận kiểu UpdateProfileDto, ValidationPipe sẽ tự động
validate body theo các decorators trong DTO trước khi dữ liệu đến
Controller.

**Bước 4: Tạo TransformResponseInterceptor**

Đây là Interceptor thực tế từ dự án:

![](media/image138.png){width="6.267716535433071in"
height="4.638888888888889in"}

- next.handle() cho phép request đi tiếp vào Controller xử lý.

- Toán tử map() của RxJS nhận kết quả trả về từ Controller và bọc vào
  format { success, data, timestamp }.

- Nhờ áp dụng toàn cục, mọi API đều tự động có cùng format response mà
  không cần sửa bất kỳ Controller nào.

**Bước 5: Tạo HttpExceptionFilter**

Đây là Exception Filter thực tế từ dự án:

![](media/image139.png){width="6.267716535433071in"
height="5.736111111111111in"}

- \@Catch(HttpException) --- Bắt tất cả HttpException (400, 401, 404,
  409, \...).

- Response lỗi có format nhất quán: { success: false, statusCode,
  message, path, timestamp }.

- Logger ghi log lỗi ra console để dễ debug trong quá trình phát triển.

- Filter này hoạt động \"dọc hành trình\" --- bất kỳ lỗi nào throw ra
  trong Pipe, Guard, Controller, hay Service đều bị bắt.

**Bước 6: Đăng ký tất cả trong main.ts**

Đây là file main.ts thực tế từ dự án:

![](media/image140.png){width="6.267716535433071in"
height="4.402777777777778in"}

Thứ tự đăng ký phản ánh Request Lifecycle: Request → Pipe (validate) →
Controller → Interceptor (bọc response) → Filter (bắt lỗi).

**Bước 7: Kiểm tra bằng Hoppscotch**

**Test 1 --- Gửi displayName quá dài (validation lỗi):**

- Method: PATCH

- URL: http://localhost:3333/api/v1/users/{id}

- Body:

![](media/image141.png){width="6.267716535433071in"
height="0.6805555555555556in"}

- Expected: Status 400 --- format lỗi chuẩn hóa từ Filter:

![](media/image142.png){width="6.267716535433071in"
height="1.3194444444444444in"}

Kết quả:

![](media/image143.png){width="6.267716535433071in"
height="3.4305555555555554in"}

**Test 2 --- Gửi trường không tồn tại trong DTO
(forbidNonWhitelisted):**

- Method: PATCH

- URL: http://localhost:3333/api/v1/users/{id}

- Body:

![](media/image144.png){width="6.267716535433071in"
height="0.8888888888888888in"}

- Expected: Status 400 --- \"property isAdmin should not exist\".

Kết quả:

![](media/image145.png){width="6.267716535433071in"
height="3.3333333333333335in"}

**Test 3 --- Gửi request hợp lệ (response chuẩn hóa từ Interceptor):**

- Method: PATCH

- URL: http://localhost:3333/api/v1/users/{id}

- Body:

![](media/image146.png){width="6.145833333333333in" height="1.03125in"}

- Expected: Status 200 --- response được bọc bởi Interceptor:

![](media/image147.png){width="6.267716535433071in"
height="1.9305555555555556in"}

Kết quả:

![](media/image148.png){width="6.267716535433071in"
height="3.5972222222222223in"}

**Test 4 --- Truy cập user không tồn tại (Exception Filter):**

- Method: GET

- URL:
  http://localhost:3333/api/v1/users/00000000-0000-0000-0000-000000000000

- Expected: Status 404 --- format lỗi chuẩn hóa:

![](media/image149.png){width="6.267716535433071in"
height="1.3472222222222223in"}

Kết quả:

![](media/image150.png){width="6.267716535433071in" height="2.5in"}

#### 6.6.4. Kết quả đạt được

Sau khi hoàn thành bài tập:

- Tạo UpdateProfileDto với validation decorators --- dữ liệu đầu vào
  được kiểm tra tự động.

- ValidationPipe toàn cục với whitelist và forbidNonWhitelisted bảo vệ
  API khỏi dữ liệu rác và trường lạ.

- TransformResponseInterceptor chuẩn hóa mọi response thành công thành {
  success: true, data, timestamp }.

- HttpExceptionFilter chuẩn hóa mọi response lỗi thành { success: false,
  statusCode, message, path, timestamp }.

- Toàn bộ đều được đăng ký trong main.ts --- áp dụng toàn cục cho mọi
  endpoint mà không cần sửa từng Controller.

API giờ đây có hệ thống kiểm tra dữ liệu đầu vào chặt chẽ và format đầu
ra nhất quán cho cả trường hợp thành công lẫn thất bại. Tuy nhiên, bất
kỳ ai cũng có thể truy cập API mà không cần xác thực. Chương tiếp theo
sẽ bảo vệ các endpoint bằng JWT Authentication.

##  

##  

## **Chương 7: Authentication & Authorization (Bảo mật)**

### 7.1. Cơ sở lý thuyết

#### 7.1.1. Authentication và Authorization

Trong bảo mật ứng dụng web, hai khái niệm thường bị nhầm lẫn nhất là
Authentication (Xác thực) và Authorization (Phân quyền). Mặc dù cả hai
đều liên quan đến việc kiểm soát quyền truy cập, chúng giải quyết hai
câu hỏi hoàn toàn khác nhau.

Authentication (Xác thực - \"Who are you?\"): Là quá trình hệ thống kiểm
chứng danh tính của người dùng. Trong kiến trúc hiện tại, quá trình này
được thực hiện ở cổng vào (Gateway/Controller) bằng cách kiểm tra sự tồn
tại và tính hợp lệ của JWT Token trong HTTP Header.

Authorization (Phân quyền - \"What can you do?\"): Diễn ra sau khi đã
xác định được danh tính. Dù người dùng đã đăng nhập thành công, hệ thống
vẫn phải kiểm tra xem ID của người dùng đó có khớp với ID của chủ sở hữu
bản ghi (Task/Project) hay không, hoặc họ có role (vai trò) phù hợp
không.

Trong dự án TodoList Collaboration, hai quá trình này hoạt động tuần tự
và bổ trợ cho nhau. Khi một user muốn tạo Task mới (POST /tasks), đầu
tiên hệ thống thực hiện Authentication bằng cách kiểm tra JWT token
trong request header để xác định danh tính: "Đây là user có ID xyz".
Ngay sau đó, hệ thống chuyển sang Authorization: "User xyz có phải là
thành viên của Project này không? Nếu không, từ chối yêu cầu". Thiếu bất
kỳ bước nào trong hai bước này đều dẫn đến lỗ hổng bảo mật nghiêm trọng.

#### 7.1.2. JWT (JSON Web Token)

JWT (JSON Web Token) là một tiêu chuẩn mở (RFC 7519) dùng để truyền tải
thông tin an toàn, nhỏ gọn và tự chứa giữa các bên dưới dạng JSON. JWT
thường được dùng để xác thực (authentication) và ủy quyền
(authorization) trong ứng dụng web/di động, cho phép server xác minh
người dùng mà không cần lưu trữ phiên làm việc.

Một JWT token có cấu trúc gồm ba phần, được phân tách bởi dấu chấm:
\`Header.Payload.Signature\`. Phần Header chứa thông tin về thuật toán
mã hóa (thường là HS256). Phần Payload chứa các claims --- dữ liệu về
user như userId, email, và thời gian hết hạn. Phần Signature được tạo
bằng cách mã hóa Header và Payload với một secret key, đảm bảo token
không bị giả mạo.

Ưu điểm chính của JWT so với session-based authentication là khả năng
stateless. Server không cần lưu trữ thông tin session trong bộ nhớ hay
database, giúp ứng dụng dễ dàng scale horizontally. Mỗi request mang
theo đầy đủ thông tin cần thiết trong token, server chỉ cần verify
signature là có thể xác định user.

Trong dự án, chúng ta sử dụng hai loại token: Access Token (thời hạn
ngắn, thường 15 phút đến 7 ngày) dùng để xác thực mỗi request, và
Refresh Token (thời hạn dài hơn) dùng để cấp lại Access Token mới khi
token cũ hết hạn.

![](media/image151.gif){width="5.916666666666667in"
height="1.9444444444444444in"}

### 7.2. Triển khai Hệ thống Xác thực (Auth Module)

Hệ thống được xây dựng thông qua một tập hợp các package mạnh mẽ của hệ
sinh thái [[Node.js]{.underline}](http://node.js/):

+------------------------------------------------------------------+
| npm install \@nestjs/passport \@nestjs/jwt passport passport-jwt |
| bcrypt                                                           |
|                                                                  |
| npm install -D \@types/passport-jwt \@types/bcrypt               |
+------------------------------------------------------------------+

Package \@nestjs/passport là wrapper tích hợp Passport.js (thư viện
authentication phổ biến nhất của Node.js) vào NestJS thông qua Guards và
Strategies. Package \@nestjs/jwt cung cấp JwtModule và JwtService để tạo
và verify JWT tokens. Package bcrypt dùng để hash mật khẩu trước khi lưu
vào database --- không bao giờ lưu mật khẩu dạng plain text. Các
packages có prefix \@types/ là TypeScript type definitions, giúp IDE hỗ
trợ auto-complete.

### 7.3. Xây dựng Auth Module

#### 7.3.1. Cấu hình Auth Module

Auth Module là feature module chịu trách nhiệm toàn bộ quy trình xác
thực trong ứng dụng. Module này cần import PrismaModule (để truy cập
database tìm kiếm user), JwtModule (để tạo và verify JWT tokens), và
PassportModule (để sử dụng authentication strategies).

+-------------------------------------------------------------------+
| > // auth/auth.module.ts                                          |
| >                                                                 |
| > import { Module } from \'@nestjs/common\';                      |
| >                                                                 |
| > import { JwtModule } from \'@nestjs/jwt\';                      |
| >                                                                 |
| > import { PassportModule } from \'@nestjs/passport\';            |
| >                                                                 |
| > import { AuthController } from \'./auth.controller\';           |
| >                                                                 |
| > import { AuthService } from \'./auth.service\';                 |
| >                                                                 |
| > import { JwtStrategy } from \'./strategies/jwt.strategy\';      |
| >                                                                 |
| > \@Module({                                                      |
| >                                                                 |
| > imports: \[                                                     |
| >                                                                 |
| > PassportModule.register({ defaultStrategy: \'jwt\' }),          |
| >                                                                 |
| > JwtModule.register({                                            |
| >                                                                 |
| > secret: process.env.JWT_SECRET \|\| \'todolist-secret-key\',    |
| >                                                                 |
| > signOptions: { expiresIn: \'7d\' },                             |
| >                                                                 |
| > }),                                                             |
| >                                                                 |
| > \],                                                             |
| >                                                                 |
| > controllers: \[AuthController\],                                |
| >                                                                 |
| > providers: \[AuthService, JwtStrategy\],                        |
| >                                                                 |
| > exports: \[AuthService, JwtModule\],                            |
| >                                                                 |
| > })                                                              |
| >                                                                 |
| > export class AuthModule {}                                      |
+-------------------------------------------------------------------+

Trong cấu hình trên, PassportModule.register({ defaultStrategy: \'jwt\'
}) thiết lập JWT làm strategy mặc định cho authentication.
JwtModule.register() cấu hình secret key dùng để ký token và thời hạn
token là 7 ngày. JwtStrategy được khai báo trong providers vì nó là một
Injectable class mà Passport cần sử dụng.

#### 7.3.2. Data Transfer Objects (DTOs) cho Authentication

Trước khi viết logic xác thực, cần định nghĩa DTOs (Data Transfer
Objects) để validate dữ liệu đầu vào từ client. DTO đảm bảo rằng request
body chứa đúng các fields cần thiết với đúng kiểu dữ liệu:

+-----------------------------------------------------------------------+
| // auth/dto/register.dto.ts                                           |
|                                                                       |
| import { IsEmail, IsNotEmpty, IsString, MinLength } from              |
| \'class-validator\';                                                  |
|                                                                       |
| export class RegisterDto {                                            |
|                                                                       |
| > \@IsString()                                                        |
| >                                                                     |
| > \@IsNotEmpty()                                                      |
| >                                                                     |
| > name: string;                                                       |
| >                                                                     |
| > \@IsEmail()                                                         |
| >                                                                     |
| > email: string;                                                      |
| >                                                                     |
| > \@IsString()                                                        |
| >                                                                     |
| > \@MinLength(6)                                                      |
| >                                                                     |
| > password: string;                                                   |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

+-----------------------------------------------------------------------+
| // auth/dto/login.dto.ts                                              |
|                                                                       |
| import { IsEmail, IsNotEmpty, IsString } from \'class-validator\';    |
|                                                                       |
| export class LoginDto {                                               |
|                                                                       |
| \@IsEmail()                                                           |
|                                                                       |
| email: string;                                                        |
|                                                                       |
| \@IsString()                                                          |
|                                                                       |
| \@IsNotEmpty()                                                        |
|                                                                       |
| password: string;                                                     |
|                                                                       |
| }                                                                     |
+-----------------------------------------------------------------------+

Các decorators như \@IsEmail(), \@MinLength(6) đến từ thư viện
class-validator, phối hợp với ValidationPipe của NestJS để tự động
validate và trả về lỗi rõ ràng nếu dữ liệu không hợp lệ.

#### 7.3.3. Auth Service -- Logic xác thực

AuthService chứa toàn bộ business logic cho việc đăng ký và đăng nhập.
Service này inject PrismaService để truy vấn database và JwtService để
tạo token:

+-----------------------------------------------------------------------+
| > // auth/auth.service.ts                                             |
| >                                                                     |
| > import { Injectable, ConflictException, UnauthorizedException }     |
| > from \'@nestjs/common\';                                            |
| >                                                                     |
| > import { JwtService } from \'@nestjs/jwt\';                         |
| >                                                                     |
| > import { PrismaService } from \'../prisma/prisma.service\';         |
| >                                                                     |
| > import { RegisterDto } from \'./dto/register.dto\';                 |
| >                                                                     |
| > import { LoginDto } from \'./dto/login.dto\';                       |
| >                                                                     |
| > import \* as bcrypt from \'bcrypt\';                                |
| >                                                                     |
| > \@Injectable()                                                      |
| >                                                                     |
| > export class AuthService {                                          |
| >                                                                     |
| > constructor(                                                        |
| >                                                                     |
| > private readonly prisma: PrismaService,                             |
| >                                                                     |
| > private readonly jwtService: JwtService,                            |
| >                                                                     |
| > ) {}                                                                |
| >                                                                     |
| > // ================= TẠO TÀI KHOẢN MỚI =================            |
| >                                                                     |
| > async register(dto: RegisterDto) {                                  |
| >                                                                     |
| > // 1. Kiểm tra chống trùng lặp Email                                |
| >                                                                     |
| > const existingUser = await this.prisma.user.findUnique({            |
| >                                                                     |
| > where: { email: dto.email },                                        |
| >                                                                     |
| > });                                                                 |
| >                                                                     |
| > if (existingUser) {                                                 |
| >                                                                     |
| > throw new ConflictException(\'Email này đã được đăng ký trên hệ     |
| > thống\');                                                           |
| >                                                                     |
| > }                                                                   |
| >                                                                     |
| > // 2. Hash mật khẩu (Bcrypt salt rounds = 10)                       |
| >                                                                     |
| > // Thuật toán băm một chiều bảo vệ mật khẩu kể cả khi DB bị tấn     |
| > công                                                                |
| >                                                                     |
| > const hashedPassword = await bcrypt.hash(dto.password, 10);         |
| >                                                                     |
| > // 3. Lưu xuống Database                                            |
| >                                                                     |
| > const user = await this.prisma.user.create({                        |
| >                                                                     |
| > data: {                                                             |
| >                                                                     |
| > name: dto.name,                                                     |
| >                                                                     |
| > email: dto.email,                                                   |
| >                                                                     |
| > password: hashedPassword,                                           |
| >                                                                     |
| > },                                                                  |
| >                                                                     |
| > });                                                                 |
| >                                                                     |
| > // 4. Sinh Token và ẩn mật khẩu trước khi trả về                    |
| >                                                                     |
| > return this.generateTokenResponse(user.id, user.email);             |
| >                                                                     |
| > }                                                                   |
| >                                                                     |
| > // ================= ĐĂNG NHẬP =================                    |
| >                                                                     |
| > async login(dto: LoginDto) {                                        |
| >                                                                     |
| > // 1. Tra cứu user                                                  |
| >                                                                     |
| > const user = await this.prisma.user.findUnique({                    |
| >                                                                     |
| > where: { email: dto.email },                                        |
| >                                                                     |
| > });                                                                 |
| >                                                                     |
| > if (!user) {                                                        |
| >                                                                     |
| > throw new UnauthorizedException(\'Thông tin đăng nhập không chính   |
| > xác\');                                                             |
| >                                                                     |
| > }                                                                   |
| >                                                                     |
| > // 2. So sánh mật khẩu bằng hàm compare của Bcrypt                  |
| >                                                                     |
| > const isPasswordValid = await bcrypt.compare(dto.password,          |
| > user.password);                                                     |
| >                                                                     |
| > if (!isPasswordValid) {                                             |
| >                                                                     |
| > // Tránh thông báo \"Sai mật khẩu\" để kẻ gian không biết email có  |
| > tồn tại hay không                                                   |
| >                                                                     |
| > throw new UnauthorizedException(\'Thông tin đăng nhập không chính   |
| > xác\');                                                             |
| >                                                                     |
| > }                                                                   |
| >                                                                     |
| > return this.generateTokenResponse(user.id, user.email);             |
| >                                                                     |
| > }                                                                   |
| >                                                                     |
| > // ================= HÀM TIỆN ÍCH =================                 |
| >                                                                     |
| > private generateTokenResponse(userId: string, email: string) {      |
| >                                                                     |
| > // Payload là nội dung public của Token (tuyệt đối không bỏ         |
| > password vào đây)                                                   |
| >                                                                     |
| > const payload = { sub: userId, email: email };                      |
| >                                                                     |
| > return {                                                            |
| >                                                                     |
| > access_token: this.jwtService.sign(payload),                        |
| >                                                                     |
| > };                                                                  |
| >                                                                     |
| > }                                                                   |
| >                                                                     |
| > }                                                                   |
+-----------------------------------------------------------------------+

#### 7.3.4. Cung cấp API Endpoints (Auth Controller)

+--------------------------------------------------------------------+
| > // src/auth/auth.controller.ts                                   |
| >                                                                  |
| > import { Controller, Post, Body, HttpCode, HttpStatus } from     |
| > \'@nestjs/common\';                                              |
| >                                                                  |
| > import { AuthService } from \'./auth.service\';                  |
| >                                                                  |
| > import { RegisterDto } from \'./dto/register.dto\';              |
| >                                                                  |
| > import { LoginDto } from \'./dto/login.dto\';                    |
| >                                                                  |
| > \@Controller(\'auth\')                                           |
| >                                                                  |
| > export class AuthController {                                    |
| >                                                                  |
| > constructor(private readonly authService: AuthService) {}        |
| >                                                                  |
| > \@Post(\'register\')                                             |
| >                                                                  |
| > register(@Body() registerDto: RegisterDto) {                     |
| >                                                                  |
| > return this.authService.register(registerDto);                   |
| >                                                                  |
| > }                                                                |
| >                                                                  |
| > \@Post(\'login\')                                                |
| >                                                                  |
| > \@HttpCode(HttpStatus.OK) // Thay vì 201 Created mặc định của    |
| > \@Post, trả về 200 OK cho việc Login                             |
| >                                                                  |
| > login(@Body() loginDto: LoginDto) {                              |
| >                                                                  |
| > return this.authService.login(loginDto);                         |
| >                                                                  |
| > }                                                                |
| >                                                                  |
| > }                                                                |
+--------------------------------------------------------------------+

### 7.4. Lớp Rào Chắn Bảo Vệ Hệ Thống (Guards & Strategy)

Để các module khác (như Task, UserProfile) được bảo vệ, chúng ta cần
triển khai Pattern Strategy của Passport.

#### 7.4.1. JWT Strategy (Bộ giải mã Token)

Lớp này đóng vai trò như một nhân viên bảo vệ quét vé. Nó tự động tìm
kiếm header Authorization: Bearer \<token\>, lấy token ra, dùng khóa bí
mật (JWT_SECRET) để xác minh chữ ký.

+-------------------------------------------------------------------+
| > // src/auth/strategies/jwt.strategy.ts                          |
| >                                                                 |
| > import { Injectable } from \'@nestjs/common\';                  |
| >                                                                 |
| > import { PassportStrategy } from \'@nestjs/passport\';          |
| >                                                                 |
| > import { ExtractJwt, Strategy } from \'passport-jwt\';          |
| >                                                                 |
| > \@Injectable()                                                  |
| >                                                                 |
| > export class JwtStrategy extends PassportStrategy(Strategy) {   |
| >                                                                 |
| > constructor() {                                                 |
| >                                                                 |
| > super({                                                         |
| >                                                                 |
| > // Chỉ định cách lấy token từ request (từ Auth Header dạng      |
| > Bearer)                                                         |
| >                                                                 |
| > jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),       |
| >                                                                 |
| > ignoreExpiration: false, // Từ chối thẳng tay các token đã hết  |
| > hạn                                                             |
| >                                                                 |
| > secretOrKey: process.env.JWT_SECRET \|\|                        |
| > \'super-secret-key-do-not-use-in-prod\',                        |
| >                                                                 |
| > });                                                             |
| >                                                                 |
| > }                                                               |
| >                                                                 |
| > // Hàm này CHỈ ĐƯỢC GỌI khi token hợp lệ và chưa hết hạn.       |
| >                                                                 |
| > // Payload chính là cục dữ liệu ta nhét vào lúc                 |
| > auth.service.sign()                                             |
| >                                                                 |
| > async validate(payload: any) {                                  |
| >                                                                 |
| > // Object trả về ở đây sẽ được NestJS tự động nhúng vào đối     |
| > tượng \`request.user\`                                          |
| >                                                                 |
| > return { userId: payload.sub, email: payload.email };           |
| >                                                                 |
| > }                                                               |
| >                                                                 |
| > }                                                               |
+-------------------------------------------------------------------+

#### 7.4.2. JwtAuthGuard & Custom Decorator

Thay vì phải gọi đi gọi lại logic giải mã ở mọi API, ta đóng gói nó vào
Guard và một Custom Decorator để giữ code \"sạch sẽ\" (Clean Code).

**Bảo vệ route (Guard):**

+-------------------------------------------------------------------+
| > // src/auth/guards/jwt-auth.guard.ts                            |
| >                                                                 |
| > import { Injectable } from \'@nestjs/common\';                  |
| >                                                                 |
| > import { AuthGuard } from \'@nestjs/passport\';                 |
| >                                                                 |
| > \@Injectable()                                                  |
| >                                                                 |
| > export class JwtAuthGuard extends AuthGuard(\'jwt\') {}         |
+-------------------------------------------------------------------+

> **Trích xuất thông tin người dùng thanh lịch (Decorator):**

+-------------------------------------------------------------------+
| > // src/auth/decorators/current-user.decorator.ts                |
| >                                                                 |
| > import { createParamDecorator, ExecutionContext } from          |
| > \'@nestjs/common\';                                             |
| >                                                                 |
| > export const CurrentUser = createParamDecorator(                |
| >                                                                 |
| > (data: unknown, ctx: ExecutionContext) =\> {                    |
| >                                                                 |
| > // Lấy request object từ context của framework                  |
| >                                                                 |
| > const request = ctx.switchToHttp().getRequest();                |
| >                                                                 |
| > // Biến user này chính là thứ được return từ                    |
| > JwtStrategy.validate()                                          |
| >                                                                 |
| > return request.user;                                            |
| >                                                                 |
| > },                                                              |
| >                                                                 |
| > );                                                              |
+-------------------------------------------------------------------+

#### 7.4.3. Áp dụng vào thực tế (Bảo vệ TaskController)

> Đây là kết quả của toàn bộ công sức xây dựng kiến trúc ở trên.
> Controller quản lý công việc (Task) giờ đây được bảo vệ an toàn và
> trích xuất dữ liệu cực kỳ gọn gàng.

+-------------------------------------------------------------------+
| > // src/tasks/tasks.controller.ts                                |
| >                                                                 |
| > import { Controller, Get, Post, Body, UseGuards } from          |
| > \'@nestjs/common\';                                             |
| >                                                                 |
| > import { TasksService } from \'./tasks.service\';               |
| >                                                                 |
| > import { CreateTaskDto } from \'./dto/create-task.dto\';        |
| >                                                                 |
| > import { JwtAuthGuard } from \'../auth/guards/jwt-auth.guard\'; |
| >                                                                 |
| > import { CurrentUser } from                                     |
| > \'../auth/decorators/current-user.decorator\';                  |
| >                                                                 |
| > // Áp dụng Guard cho TOÀN BỘ endpoint trong controller này      |
| >                                                                 |
| > \@Controller(\'tasks\')                                         |
| >                                                                 |
| > \@UseGuards(JwtAuthGuard)                                       |
| >                                                                 |
| > export class TasksController {                                  |
| >                                                                 |
| > constructor(private readonly tasksService: TasksService) {}     |
| >                                                                 |
| > \@Post()                                                        |
| >                                                                 |
| > create(                                                         |
| >                                                                 |
| > \@Body() createTaskDto: CreateTaskDto,                          |
| >                                                                 |
| > \@CurrentUser() user: { userId: string, email: string } //      |
| > Trích xuất thông tin user đang request                          |
| >                                                                 |
| > ) {                                                             |
| >                                                                 |
| > // Truyền userId vào service để Database gán người tạo          |
| > (createdById) cho Task                                          |
| >                                                                 |
| > return this.tasksService.create(createTaskDto, user.userId);    |
| >                                                                 |
| > }                                                               |
| >                                                                 |
| > \@Get()                                                         |
| >                                                                 |
| > findAll(@CurrentUser() user: any) {                             |
| >                                                                 |
| > // Chỉ lấy ra các Tasks thuộc về User này (Authorization cấp độ |
| > dữ liệu)                                                        |
| >                                                                 |
| > return this.tasksService.findAllByUserId(user.userId);          |
| >                                                                 |
| > }                                                               |
| >                                                                 |
| > }                                                               |
+-------------------------------------------------------------------+

#### 7.4.4. Token Blacklist --- Vô hiệu hóa Token tức thì

#### Vấn đề: JWT stateless và kịch bản nguy hiểm

Bản chất *stateless* của JWT là con dao hai lưỡi. Server không lưu trạng
thái session, giúp hệ thống dễ scale --- nhưng đồng thời cũng có nghĩa
server không thể \"hủy\" một token đã cấp. Hãy xem xét kịch bản sau:
user A đăng nhập lúc 8:00 và nhận được access token có hiệu lực 15 phút.
Lúc 9:00, user A nhấn nút logout. Tuy nhiên, nếu kẻ tấn công đã đánh cắp
được access token trước đó (qua XSS, network sniffing, hoặc log file),
kẻ tấn công vẫn có thể sử dụng token đó cho đến khi nó hết hạn --- dù
user đã logout.

Trong 15 phút đó, kẻ tấn công có toàn quyền truy cập API với tư cách
user A: đọc thông tin cá nhân, sửa task, thậm chí mời thành viên vào
workspace. Đây là lỗ hổng bảo mật nghiêm trọng mà bất kỳ hệ thống JWT
nào cũng phải đối mặt.

#### Giải pháp: Token Blacklist với Prisma

Dự án TodoList Collaboration giải quyết vấn đề này bằng cơ chế **Token
Blacklist** --- một bảng trong database lưu danh sách các token đã bị vô
hiệu hóa. Mỗi khi user logout, access token hiện tại được thêm vào
blacklist. Mọi request tiếp theo sử dụng token đó sẽ bị từ chối ngay lập
tức.

Đầu tiên, model InvalidatedToken trong Prisma schema định nghĩa cấu trúc
bảng lưu token bị vô hiệu hóa:

![](media/image152.png){width="6.267716535433071in"
height="1.8611111111111112in"}

Khi user gọi endpoint POST /api/v1/auth/logout, AuthService.logout()
thực hiện hai việc: revoke tất cả refresh tokens và thêm access token
hiện tại vào blacklist:

![](media/image153.png){width="5.203125546806649in"
height="3.842674978127734in"}

Điểm đáng chú ý là expiresAt được tính từ field exp trong JWT payload.
Field này cho biết thời điểm token tự hết hạn. Lưu giá trị này giúp cron
job sau này có thể xóa các records đã hết hạn --- vì token đã hết hạn
không cần nằm trong blacklist nữa.

Phía kiểm tra, JwtStrategy.validate() --- method được gọi mỗi khi có
request cần xác thực --- kiểm tra token có nằm trong blacklist không:

![](media/image154.png){width="6.267716535433071in"
height="3.111111111111111in"}

Nếu token được tìm thấy trong bảng invalidated_tokens, strategy throw
UnauthorizedException --- request bị reject với HTTP 401 ngay lập tức,
bất kể token chưa hết hạn.

#### Kết quả trước và sau khi có Token Blacklist

Bảng dưới đây so sánh hành vi hệ thống trước và sau khi triển khai Token
Blacklist:

  ---------------------- ----------------------- ------------------------
  **Tình huống**         **\*\*Không có          **\*\*Có Blacklist\*\***
                         Blacklist\*\***         

  User logout, kẻ tấn    Token vẫn hoạt động đến Token bị reject ngay lập
  công dùng token cũ     khi hết hạn             tức (401)

  User đổi mật khẩu      Token cũ vẫn hoạt động  Token cũ có thể được
                                                 thêm vào blacklist

  Admin vô hiệu hóa tài  Token vẫn hoạt động     Thêm token vào
  khoản                                          blacklist, hiệu lực tức
                                                 thì
  ---------------------- ----------------------- ------------------------

#### Trade-off và hướng tối ưu

Cơ chế Token Blacklist có một trade-off rõ ràng: **mỗi request được bảo
vệ tốn thêm một database query** để kiểm tra blacklist. Với PostgreSQL,
query này mất khoảng 1-3ms nhờ index trên column token, nhưng khi hệ
thống có hàng nghìn request mỗi giây, overhead sẽ tích lũy đáng kể.

Trong môi trường production, có hai hướng tối ưu. Thứ nhất, thay thế
PostgreSQL bằng **Redis** cho blacklist --- Redis lưu dữ liệu trong RAM,
thời gian truy vấn dưới 0.1ms, và hỗ trợ TTL (Time To Live) tự động xóa
record hết hạn mà không cần cron job. Thứ hai, thiết lập **cron job**
định kỳ dọn dẹp các token đã hết hạn trong bảng invalidated_tokens:

![](media/image155.png){width="5.145833333333333in" height="0.65625in"}

Việc dọn dẹp định kỳ giúp bảng blacklist luôn nhỏ gọn, đảm bảo query
kiểm tra luôn nhanh bất kể hệ thống đã hoạt động bao lâu.

### 7.5. Lỗi thường gặp và Trade-offs

#### 7.5.1. Lỗi JWT_SECRET không load --- thứ tự import module

Đây là lỗi nghiêm trọng nhất liên quan đến authentication trong NestJS,
vì nó gây crash toàn bộ ứng dụng ngay khi khởi động. Error message xuất
hiện dưới dạng:

![](media/image156.png){width="4.46875in" height="0.6770833333333334in"}

Nguyên nhân nằm ở thứ tự khai báo modules trong AppModule. JwtStrategy
cần đọc JWT_SECRET từ biến môi trường khi được khởi tạo. Nếu
ConfigModule --- module chịu trách nhiệm load file .env vào process.env
--- chưa được khởi tạo trước AuthModule, thì tại thời điểm JwtStrategy
chạy constructor, process.env.JWT_SECRET vẫn là undefined.

Giải pháp là đảm bảo ConfigModule.forRoot() luôn đứng đầu tiên trong
mảng imports. Trong dự án TodoList Collaboration, app.module.ts đã được
cấu hình đúng:

![](media/image157.png){width="6.267716535433071in"
height="2.9027777777777777in"}

Ngoài ra, JwtStrategy trong dự án cũng có thêm một lớp bảo vệ --- kiểm
tra và throw error rõ ràng nếu secret không tồn tại, thay vì để Passport
throw error khó hiểu:

![](media/image158.png){width="6.267716535433071in"
height="2.263888888888889in"}

Bài học rút ra là các infrastructure modules (ConfigModule,
PrismaModule) phải luôn được import trước các feature modules
(AuthModule, UserModule) --- thứ tự trong mảng imports quyết định thứ tự
khởi tạo.

#### 7.5.2. Trade-off: Access Token ngắn hạn vs dài hạn

Thời gian sống (TTL --- Time To Live) của access token là quyết định
thiết kế quan trọng ảnh hưởng trực tiếp đến bảo mật và trải nghiệm người
dùng. Bảng dưới đây phân tích hai chiến lược đối lập:

  ----------------- -------------------------- -------------------------
  **Tiêu chí**      **\*\*Ngắn hạn (15         **\*\*Dài hạn (7
                    phút)\*\***                ngày)\*\***

  **Bảo mật**       Cao --- token bị đánh cắp  Thấp --- kẻ tấn công có 7
                    chỉ dùng được 15 phút      ngày khai thác

  **Trải nghiệm     Cần silent refresh ---     Đơn giản --- user hiếm
  UX**              phức tạp hơn cho frontend  khi bị logout bất ngờ

  **Độ phức tạp**   Cần implement refresh      Không cần refresh token
                    token rotation             

  **Token           Bảng blacklist nhỏ (token  Bảng blacklist rất lớn
  Blacklist**       hết hạn nhanh)             theo thời gian

  **Phù hợp cho**   Ứng dụng chứa dữ liệu nhạy Ứng dụng ít rủi ro bảo
                    cảm                        mật
  ----------------- -------------------------- -------------------------

Dự án TodoList Collaboration dự tính chọn chiến lược **access token 15
phút kết hợp refresh token 7 ngày**. Đây là cách tiếp cận cân bằng:
access token ngắn hạn giảm thiểu thiệt hại khi bị đánh cắp, trong khi
refresh token dài hạn đảm bảo user không phải đăng nhập lại thường
xuyên. Khi access token hết hạn, frontend gọi POST /api/v1/auth/refresh
với refresh token để nhận access token mới --- quá trình này diễn ra
\"im lặng\" (silent refresh), user không nhận thấy.

![](media/image159.png){width="6.267716535433071in"
height="1.9583333333333333in"}

Ngoài ra, refresh token được lưu vào database (bảng refresh_tokens) và
có cơ chế revoke --- khi user logout hoặc đổi mật khẩu, tất cả refresh
tokens đều bị thu hồi, buộc kẻ tấn công phải có credentials mới để lấy
token mới.

#### 7.5.3. Khi nào KHÔNG dùng APP_GUARD global

Dự án TodoList Collaboration dự tính đăng ký JwtAuthGuard ở cấp global
thông qua APP_GUARD trong AppModule:

![](media/image160.png){width="3.8541666666666665in"
height="1.5833333333333333in"}

Cách tiếp cận này có ưu điểm rõ ràng: **mọi endpoint đều được bảo vệ mặc
định** --- developer không thể vô tình quên đặt guard và để lộ endpoint.
Tuy nhiên, một số endpoint cần được truy cập công khai mà không cần JWT:
register, login, refresh, forgot-password, reset-password.

Giải pháp là sử dụng custom decorator \@Public() để đánh dấu các
endpoint không cần xác thực:

![](media/image161.png){width="5.885416666666667in" height="3.59375in"}

JwtAuthGuard kiểm tra metadata isPublic trước khi thực hiện xác thực.
Nếu endpoint được đánh dấu \@Public(), guard bỏ qua JWT check và cho
request đi qua:

![](media/image162.png){width="6.267716535433071in"
height="2.263888888888889in"}

Triết lý thiết kế ở đây là **secure by default, opt-out explicitly** ---
mặc định bảo mật, chỉ mở ra khi có lý do rõ ràng. Mỗi endpoint public
đều phải được developer chủ động đánh dấu \@Public(), giảm thiểu rủi ro
để lộ endpoint nhạy cảm do sơ suất.

### 7.6. Bài tập ứng dụng: Bảo vệ API với JWT Authentication

#### 7.6.1. Mục tiêu

Vận dụng kiến thức Authentication & Authorization đã học trong Chương 7
để bảo vệ toàn bộ API của dự án TodoList Collaboration. Sau khi hoàn
thành, người đọc sẽ:

- Biết cách triển khai hệ thống đăng ký (Register) và đăng nhập (Login)
  với JWT.

- Hiểu cơ chế hoạt động của Passport Strategy và Guards trong NestJS.

- Tạo được Custom Decorators (@Public(), \@CurrentUser()) để tăng tính
  tiện dụng.

- Đăng ký Guard toàn cục qua APP_GUARD --- bảo vệ mọi endpoint mặc định,
  chỉ mở cho route công khai.

- Phân biệt rõ luồng request có token (200 OK) và không có token (401
  Unauthorized).

#### 7.6.2. Mô tả bài tập

Tiếp tục từ dự án ở Chương 6, bổ sung module Auth với JWT
Authentication. Mọi endpoint mặc định đều yêu cầu xác thực, chỉ những
route được đánh dấu \@Public() mới cho phép truy cập tự do.

Yêu cầu cụ thể:

1.  Cài đặt dependencies: \@nestjs/passport, passport, \@nestjs/jwt,
    passport-jwt, bcrypt.

2.  Tạo AuthModule với hai endpoint chính: POST /auth/register và POST
    /auth/login.

3.  Mã hóa mật khẩu bằng bcrypt trước khi lưu database.

4.  Khi đăng nhập/đăng ký thành công, trả về cặp JWT token (access +
    refresh).

5.  Tạo JwtStrategy để xác minh token từ header Authorization: Bearer
    \<token\>.

6.  Tạo JwtAuthGuard với hỗ trợ \@Public() decorator --- cho phép mở
    route công khai.

7.  Đăng ký JwtAuthGuard toàn cục qua APP_GUARD trong AppModule.

8.  Tạo \@CurrentUser() decorator để lấy thông tin user từ request.

9.  Bảo vệ UserController --- chỉ user đã đăng nhập mới xem/cập nhật hồ
    sơ.

#### 7.6.3. Code minh họa

**Bước 1: Cài đặt dependencies**

![](media/image163.png){width="6.267716535433071in"
height="0.6111111111111112in"}

- \@nestjs/passport và passport cung cấp framework xác thực linh hoạt.

- \@nestjs/jwt và passport-jwt xử lý việc tạo và kiểm tra JWT token.

- bcrypt mã hóa mật khẩu một chiều (không thể giải mã ngược).

**Bước 2: Tạo Auth DTOs**

RegisterDto --- Kiểm tra dữ liệu đăng ký:

![](media/image164.png){width="6.267716535433071in"
height="4.305555555555555in"}

Điểm nổi bật:

- \@Matches() sử dụng regex để enforce chính sách mật khẩu mạnh: ít nhất
  1 chữ hoa, 1 chữ thường, 1 số, 1 ký tự đặc biệt.

- \@MinLength(8) kết hợp \@Matches() tạo hai lớp kiểm tra --- đảm bảo cả
  độ dài lẫn độ phức tạp.

**LoginDto** --- Kiểm tra dữ liệu đăng nhập:

![](media/image165.png){width="6.267716535433071in"
height="2.013888888888889in"}

**Bước 3: Triển khai AuthService**

Đây là file thực tế từ dự án TodoList Collaboration (trích đoạn register
và login):

![](media/image166.png){width="6.267716535433071in"
height="5.041666666666667in"}

![](media/image167.png){width="6.267716535433071in"
height="5.694444444444445in"}

![](media/image168.png){width="6.267716535433071in"
height="4.166666666666667in"}

Điểm cần lưu ý:

- bcrypt.hash(password, 10) mã hóa mật khẩu với 10 salt rounds --- mật
  khẩu gốc không bao giờ được lưu trực tiếp vào database.

- bcrypt.compare() so sánh mật khẩu người dùng nhập với hash đã lưu ---
  rút salt từ trong hash, hash lại, rồi so sánh.

- Message lỗi đăng nhập cố tình không phân biệt \"sai email\" hay \"sai
  mật khẩu\" để tránh lộ thông tin --- đây là best practice bảo mật.

- Promise.all() tạo access token và refresh token song song --- tối ưu
  hiệu suất.

- JWT payload chứa sub (userId) và email --- thông tin này sẽ được giải
  mã trong Strategy.

**Bước 4: Tạo AuthController**

![](media/image169.png){width="6.267716535433071in"
height="5.986111111111111in"}

Điểm cần lưu ý:

- \@Public() đánh dấu route là công khai --- JwtAuthGuard sẽ bỏ qua kiểm
  tra token cho các route này.

- \@HttpCode(HttpStatus.OK) override status mặc định 201 của \@Post()
  --- vì login/logout không tạo resource mới.

- \@CurrentUser(\'id\') trích xuất userId từ request.user --- chỉ hoạt
  động khi có JWT token hợp lệ.

- \@Headers(\'authorization\') lấy header Authorization để trích xuất
  raw token cho blacklist.

**Bước 5: Tạo \@Public() Decorator**

![](media/image170.png){width="6.267716535433071in"
height="1.0138888888888888in"}

- SetMetadata(key, value) gắn metadata isPublic = true vào route
  handler.

- Metadata này sẽ được đọc bởi JwtAuthGuard qua Reflector để quyết định
  có bỏ qua JWT check hay không.

**Bước 6: Tạo \@CurrentUser() Decorator**

![](media/image171.png){width="6.267716535433071in"
height="3.0277777777777777in"}

- createParamDecorator tạo decorator cho tham số method --- tương tự
  \@Body(), \@Param().

- Tham số data là giá trị truyền vào decorator: \@CurrentUser(\'id\') →
  data = \'id\'.

- request.user được gắn tự động bởi JwtStrategy.validate() sau khi token
  được xác minh.

**Bước 7: Tạo JwtStrategy**

![](media/image172.png){width="6.267716535433071in"
height="4.569444444444445in"}

Điểm cần lưu ý:

- ExtractJwt.fromAuthHeaderAsBearerToken() tự động trích xuất token từ
  header Authorization: Bearer \<token\>.

- secretOrKey phải khớp với secret dùng để ký token trong
  AuthService.generateTokens().

- passReqToCallback: true cho phép validate() nhận thêm Request object
  --- cần thiết để kiểm tra token blacklist.

- Method validate() được gọi sau khi Passport xác minh JWT signature hợp
  lệ --- giá trị { id, email } trả về sẽ được gắn vào request.user.

**Bước 8: Tạo JwtAuthGuard với hỗ trợ \@Public()**

![](media/image173.png){width="6.267716535433071in"
height="3.9444444444444446in"}

Điểm quan trọng:

- Reflector được inject qua constructor --- đây là lý do Guard cần được
  đăng ký qua APP_GUARD thay vì app.useGlobalGuards() (xem Bước 9).

- getAllAndOverride() đọc metadata từ cả method handler lẫn class ---
  cho phép đặt \@Public() ở cấp method hoặc cấp controller.

- Logic đơn giản: \@Public() → cho qua; không có \@Public() → kiểm tra
  JWT.

**Bước 9: Cấu hình AuthModule và đăng ký Guard toàn cục**

**AuthModule:**

![](media/image174.png){width="6.267716535433071in"
height="3.4166666666666665in"}

**Đăng ký Guard toàn cục qua APP_GUARD trong AppModule:**

![](media/image175.png){width="6.267716535433071in"
height="4.291666666666667in"}

Với cách đăng ký này, mọi endpoint trong toàn bộ ứng dụng đều yêu cầu
JWT token --- trừ những route được đánh dấu \@Public().

**Bước 10: Bảo vệ UserController**

![](media/image176.png){width="6.267716535433071in"
height="4.194444444444445in"}

Điểm nổi bật so với Chương 4--6:

- Thay \@Param(\'id\') bằng \@CurrentUser(\'id\') --- user ID được lấy
  từ JWT token, không từ URL. Điều này đảm bảo user chỉ thao tác trên dữ
  liệu của chính mình.

- \@UseGuards(JwtAuthGuard) ở cấp class --- toàn bộ endpoint đều cần
  token hợp lệ.

- Kết hợp với APP_GUARD global, UserController được bảo vệ hai lớp (tuy
  chỉ cần một).

**Bước 11: Kiểm tra luồng hoàn chỉnh bằng Hoppscotch**

**Test 1 --- Đăng ký tài khoản (Register):**

- Method: POST

- URL: http://localhost:3333/api/v1/auth/register

- Body:

![](media/image177.png){width="4.78125in" height="1.3541666666666667in"}

- Expected: Status 201 --- trả về thông tin user (không có password) +
  tokens:

![](media/image178.png){width="5.760416666666667in"
height="3.4270833333333335in"}

Kết quả:

![](media/image179.png){width="6.267716535433071in"
height="3.8055555555555554in"}

**Test 2 --- Đăng nhập (Login):**

- Method: POST

- URL: http://localhost:3333/api/v1/auth/login

- Body:

![](media/image180.png){width="6.267716535433071in" height="1.0in"}

- Expected: Status 200 --- trả về user info + tokens (response được bọc
  bởi TransformResponseInterceptor):

![](media/image181.png){width="6.267716535433071in"
height="1.5138888888888888in"}

Kết quả:

![](media/image182.png){width="6.267716535433071in" height="3.625in"}

**Test 3 --- Truy cập hồ sơ KHÔNG CÓ token (401):**

- Method: GET

- URL: http://localhost:3333/api/v1/users/me

- Headers: Không có Authorization

- Expected: Status 401 --- format lỗi chuẩn hóa từ HttpExceptionFilter:

![](media/image183.png){width="5.65625in" height="1.5416666666666667in"}

Kết quả:

![](media/image184.png){width="6.267716535433071in"
height="2.5277777777777777in"}

**Test 4 --- Truy cập hồ sơ CÓ token (200):**

- Method: GET

- URL: http://localhost:3333/api/v1/users/me

- Headers: Authorization: Bearer eyJhbGc\... (copy accessToken từ Test
  2)

- Expected: Status 200 --- thông tin hồ sơ user được bọc trong response
  chuẩn hóa:

![](media/image185.png){width="6.267716535433071in"
height="2.361111111111111in"}

Kết quả:

![](media/image186.png){width="6.267716535433071in"
height="3.3472222222222223in"}

**Test 5 --- Đăng nhập sai mật khẩu (401):**

- Method: POST

- URL: http://localhost:3333/api/v1/auth/login

- Body:

![](media/image187.png){width="6.041666666666667in"
height="1.0104166666666667in"}

- Expected: Status 401 --- thông báo chung, không tiết lộ email có tồn
  tại hay không:

![](media/image188.png){width="5.46875in" height="1.5416666666666667in"}

Kết quả:

![](media/image189.png){width="6.267716535433071in"
height="3.0277777777777777in"}

**Test 6 --- Đăng ký với password yếu (validation lỗi):**

- Method: POST

- URL: http://localhost:3333/api/v1/auth/register

- Body:

![](media/image190.png){width="5.614583333333333in"
height="1.3958333333333333in"}

- Expected: Status 400 --- validation từ RegisterDto:

![](media/image191.png){width="6.267716535433071in"
height="1.5138888888888888in"}

Kết quả:

![](media/image192.png){width="6.267716535433071in"
height="3.4444444444444446in"}

#### 7.6.4. Kết quả đạt được

Sau khi hoàn thành bài tập:

- Triển khai hệ thống xác thực hoàn chỉnh với Register, Login, và
  Logout.

- Mật khẩu được mã hóa an toàn bằng bcrypt --- không bao giờ lưu
  plaintext vào database.

- JWT token (access + refresh) được sinh ra khi đăng nhập/đăng ký, chứa
  sub và email trong payload.

- JwtStrategy xác minh token và kiểm tra blacklist, JwtAuthGuard hỗ trợ
  \@Public() để mở route công khai.

- APP_GUARD đăng ký Guard toàn cục qua module system --- hỗ trợ
  Dependency Injection đầy đủ (khác với app.useGlobalGuards()).

- Custom Decorators (@Public(), \@CurrentUser()) giúp code gọn gàng và
  dễ đọc.

- UserController được bảo vệ --- user chỉ xem/cập nhật hồ sơ của chính
  mình thông qua \@CurrentUser(\'id\').

Kết hợp với các cơ chế từ các chương trước --- Prisma (Ch.5),
Validation + Response chuẩn hóa (Ch.6) --- API giờ đây có đầy đủ: kết
nối database, kiểm tra dữ liệu đầu vào, format response nhất quán, và
bảo mật JWT. Đây là nền tảng hoàn chỉnh để xây dựng các tính năng nghiệp
vụ trong phần tiếp theo của đồ án.

### 7.7. Tổng kết luồng hoạt động (Workflow Lifecycle)

Quá trình bảo mật một request đi qua các bước nghiêm ngặt sau:

> 1\. Phát hành token(Authentication): Client gửi POST /auth/login. Hệ
> thống xác minh qua DB, tạo JWT Token, ký mã hóa bằng Secret Key và gửi
> về Client.
>
> 2\. Mang token đi sử dụng: Client muốn tạo công việc mới, gửi POST
> /tasks kèm HTTP Header: Authorization: Bearer \<Token_nhận_được\>.
>
> 3\. Bảo vệ cổng gác (Guard): JwtAuthGuard tại TasksController chặn
> request lại.
>
> 4\. Kiểm tra token (Strategy): JwtStrategy trích xuất Token, kiểm tra
> chữ ký và hạn sử dụng. Nếu vé giả/hết hạn -\> Trả về lỗi 401
> Unauthorized ngay lập tức.
>
> 5\. Dán nhãn định danh: Nếu hợp lệ, giải mã Payload, lấy userId, gắn
> vào đối tượng HTTP Request.
>
> 6\. Xử lý nghiệp vụ: API chạy qua Custom Decorator \@CurrentUser() để
> lấy ID, sau đó Service xử lý lưu Database. Không một user nào có thể
> tạo Task bằng danh nghĩa của user khác.

### 7.8. Kết luận

Chương này đã trình bày một cách có hệ thống quá trình thiết kế và triển
khai lớp bảo mật cho ứng dụng NestJS, bao quát từ nền tảng lý thuyết đến
hiện thực hóa trong mã nguồn dự án TodoList Collaboration.

**Về mặt lý thuyết**, chương đã phân tích hai trụ cột của bảo mật ứng
dụng web: Authentication (xác thực danh tính --- \"Bạn là ai?\") và
Authorization (phân quyền --- \"Bạn được làm gì?\"), đồng thời làm rõ cơ
chế hoạt động của JWT (JSON Web Token) theo chuẩn RFC 7519 với cấu trúc
ba phần Header--Payload--Signature và ưu điểm stateless so với
session-based authentication truyền thống.

**Về mặt triển khai**, chương đã xây dựng hoàn chỉnh các thành phần sau:

- **AuthModule** với hai luồng nghiệp vụ chính: Register (kiểm tra trùng
  email → hash mật khẩu bằng bcrypt với salt rounds → tạo user → cấp
  token) và Login (tìm user → so sánh mật khẩu → cấp token). Cả hai
  luồng đều tuân thủ các nguyên tắc bảo mật quan trọng như không lưu mật
  khẩu dạng plain text và thông báo lỗi không tiết lộ sự tồn tại của
  email.

- **JwtStrategy** kế thừa từ PassportStrategy, đóng vai trò cầu nối giữa
  thư viện Passport.js và hệ sinh thái NestJS --- tự động trích xuất
  token từ Authorization header, verify chữ ký số, kiểm tra thời hạn, và
  gắn thông tin user vào request.user.

- **JwtAuthGuard** kết hợp decorator \@UseGuards() ở cấp class hoặc cấp
  method, cung cấp cơ chế bảo vệ route linh hoạt. Khi được đăng ký là
  APP_GUARD, guard áp dụng chiến lược \"secure by default\" --- mọi
  endpoint đều yêu cầu xác thực trừ khi được đánh dấu \@Public().

- **Custom Decorator \@CurrentUser()** sử dụng createParamDecorator() để
  trích xuất thông tin user hiện tại, thay thế cách truy cập trực tiếp
  request.user --- giúp mã nguồn controller biểu đạt đúng ý định
  (declarative) và giảm sự phụ thuộc vào object request của Express.

- **Token Blacklist** giải quyết hạn chế cố hữu của JWT stateless bằng
  bảng InvalidatedToken, đảm bảo token bị thu hồi ngay khi user logout
  thay vì chờ hết hạn tự nhiên.

**Về mặt kiến trúc**, các thành phần trên phối hợp theo đúng Request
Lifecycle của NestJS: Guard chặn request trước khi đến Controller,
Strategy xác thực token và trả về user identity, Decorator trích xuất dữ
liệu cần thiết, và Service thực thi logic nghiệp vụ với userId đã được
xác thực. Mô hình này tuân thủ nguyên lý Single Responsibility Principle
--- mỗi thành phần chỉ đảm nhận một trách nhiệm duy nhất --- và nguyên
lý DRY (Don\'t Repeat Yourself) --- logic xác thực được tập trung tại
một điểm thay vì lặp lại ở từng controller.

Toàn bộ kiến trúc bảo mật được xây dựng trong chương này tạo nền tảng
vững chắc cho các tính năng cộng tác ở những chương tiếp theo: khi user
tạo Task, tham gia Project, hay gửi Comment, hệ thống luôn biết chính
xác **ai** đang thực hiện hành động đó và **liệu** họ có đủ quyền hay
không.

## **Chương 8: Kiểm thử đơn vị (Unit Testing)**

Sau khi hoàn thành chương này, ta sẽ hiểu được tầm quan trọng của kiểm
thử phần mềm, nắm vững cách sử dụng Jest và \@nestjs/testing để viết
unit test trong NestJS, biết cách mock các dependency thông qua
Dependency Injection, và có khả năng tự viết bộ kiểm thử hoàn chỉnh cho
TaskService cũng như TaskController trong dự án TodoList Collaboration.

### 8.1. Kiểm thử phần mềm là gì?

#### 8.1.1. Định nghĩa và tầm quan trọng

Kiểm thử phần mềm (Software Testing) là quá trình đánh giá và xác minh
rằng một sản phẩm phần mềm hoạt động đúng theo yêu cầu đã đặt ra. Trong
suốt các chương trước, chúng ta đã xây dựng hệ thống TodoList
Collaboration với đầy đủ các tính năng từ kiến trúc module (Chương 4),
kết nối database (Chương 5), xử lý nâng cao với Pipes và Exception
Filters (Chương 6), cho đến bảo mật với JWT Authentication (Chương 7).
Tuy nhiên, việc phát triển tính năng chỉ là một nửa của quy trình phần
mềm chuyên nghiệp --- nửa còn lại chính là kiểm thử để đảm bảo mọi thứ
hoạt động đúng đắn. Một ứng dụng không có test giống như một tòa nhà
chưa qua kiểm định chất lượng: có thể trông ổn bên ngoài, nhưng tiềm ẩn
những lỗi nghiêm trọng bên trong.

Kiểm thử phần mềm mang lại nhiều lợi ích thiết thực cho dự án. Thứ nhất,
nó giúp phát hiện lỗi sớm trong quá trình phát triển, khi chi phí sửa
chữa còn thấp --- một bug được tìm ra trong giai đoạn coding rẻ hơn gấp
nhiều lần so với khi đã deploy lên production. Thứ hai, bộ test đóng vai
trò như tài liệu sống (living documentation) cho code, giúp các thành
viên mới trong nhóm hiểu nhanh cách mỗi module hoạt động. Thứ ba, khi có
bộ test đầy đủ, developer có thể tự tin refactor code mà không lo phá vỡ
các tính năng hiện có, bởi test sẽ ngay lập tức báo đỏ nếu có gì sai.

#### 8.1.2. Các cấp độ kiểm thử

Kiểm thử phần mềm được chia thành nhiều cấp độ, mỗi cấp độ phục vụ một
mục đích khác nhau và kiểm tra ở phạm vi khác nhau. Ba cấp độ phổ biến
nhất trong phát triển ứng dụng web là Unit Testing, Integration Testing,
và End-to-End (E2E) Testing.

Unit Testing (Kiểm thử đơn vị) là cấp độ thấp nhất và cơ bản nhất, tập
trung vào việc kiểm tra từng \"đơn vị\" nhỏ nhất của code một cách độc
lập. Một đơn vị có thể là một function, một method trong class, hoặc một
service. Điểm mấu chốt của unit test là **sự cô lập** (isolation): khi
test một service, chúng ta không muốn phụ thuộc vào database thật, API
bên ngoài, hay bất kỳ dependency nào khác. Thay vào đó, tất cả các
dependency được thay thế bằng các đối tượng giả (mock). Ví dụ, khi test
TaskService.create(), chúng ta không cần database thật --- chỉ cần đảm
bảo rằng method đó gọi đúng câu lệnh Prisma với đúng dữ liệu.

Integration Testing (Kiểm thử tích hợp) kiểm tra sự phối hợp giữa nhiều
đơn vị với nhau. Ở cấp độ này, chúng ta có thể test xem TaskService và
PrismaService có hoạt động đúng khi kết nối với nhau không, hoặc liệu
AuthGuard có chặn đúng các request không có token hay không. Integration
test thường sử dụng database thật (hoặc database test) và kiểm tra luồng
dữ liệu xuyên suốt nhiều layer.

End-to-End Testing (Kiểm thử đầu cuối) mô phỏng hành vi thực tế của
người dùng, gửi HTTP request thật đến ứng dụng và kiểm tra response trả
về. Ví dụ, một E2E test có thể gửi POST request đến /auth/login với
email và password, rồi kiểm tra xem response có chứa JWT token hợp lệ
hay không. E2E test chạy chậm hơn nhưng mang lại độ tin cậy cao nhất vì
kiểm tra toàn bộ hệ thống hoạt động như một khối thống nhất.

#### 8.1.3. Kim tự tháp kiểm thử (Testing Pyramid)

Mối quan hệ giữa ba cấp độ kiểm thử được minh họa bằng khái niệm **Kim
tự tháp kiểm thử** (Testing Pyramid) do Mike Cohn đề xuất. Ở đáy kim tự
tháp là Unit Test --- chiếm số lượng lớn nhất, chạy nhanh nhất, và chi
phí thấp nhất. Tầng giữa là Integration Test --- số lượng vừa phải, chạy
chậm hơn do cần khởi tạo nhiều thành phần. Đỉnh kim tự tháp là E2E Test
--- ít nhất về số lượng, chạy chậm nhất nhưng kiểm tra toàn diện nhất.

Nguyên tắc của kim tự tháp là: nên viết nhiều unit test vì chúng chạy
nhanh, dễ bảo trì, và cho phản hồi tức thì khi code bị lỗi. Trong chương
này, chúng ta sẽ tập trung hoàn toàn vào Unit Testing --- cấp độ mà mọi
developer đều cần thành thạo trước khi tiến đến các cấp độ kiểm thử cao
hơn.

![Testing Pyramid](media/image193.png){width="5.333333333333333in"
height="4.604166666666667in"}

### 8.2. Công cụ kiểm thử trong NestJS

#### 8.2.1. Jest --- Framework kiểm thử mặc định

NestJS tích hợp sẵn **Jest** làm test framework mặc định ngay từ khi
khởi tạo dự án bằng Nest CLI. Jest là một framework kiểm thử JavaScript
được phát triển bởi Meta (Facebook), nổi tiếng với triết lý \"zero
configuration\" --- nghĩa là hầu như không cần cấu hình gì thêm để bắt
đầu viết test. Jest cung cấp đầy đủ các công cụ cần thiết trong một gói
duy nhất: test runner (chạy test), assertion library (so sánh kết quả),
mocking system (tạo đối tượng giả), và code coverage (đo độ phủ).

Khi tạo dự án NestJS mới, file package.json đã được cấu hình sẵn Jest
thông qua phần jest configuration. Jest sẽ tự động tìm và chạy tất cả
các file có đuôi .spec.ts hoặc .test.ts trong dự án. Ngoài ra, Jest hỗ
trợ chế độ watch (\--watch) để tự động chạy lại test mỗi khi file source
code thay đổi, giúp developer nhận phản hồi ngay lập tức trong quá trình
phát triển.

#### 8.2.2. \@nestjs/testing --- TestingModule

Package \@nestjs/testing cung cấp class Test với method
createTestingModule(), cho phép tạo ra một module NestJS thu nhỏ dành
riêng cho mục đích kiểm thử. TestingModule hoạt động giống hệt AppModule
trong runtime --- nó khởi tạo Dependency Injection container, resolve
các provider, và inject dependency vào đúng chỗ. Điểm khác biệt duy nhất
là trong TestingModule, chúng ta có thể thay thế bất kỳ provider nào
bằng mock object, từ đó đạt được sự cô lập hoàn toàn cho unit test.

Cách tiếp cận này tận dụng triệt để cơ chế Dependency Injection đã được
trình bày trong Chương 4. Khi TaskService yêu cầu PrismaService thông
qua constructor injection, TestingModule sẽ inject mock object thay vì
PrismaService thật. TaskService hoàn toàn không biết nó đang làm việc
với object giả --- đây chính là sức mạnh của DI trong kiểm thử.

#### 8.2.3. Quy ước đặt tên file và cách chạy test

Trong NestJS, file test được đặt cạnh file source code tương ứng và tuân
theo quy ước đặt tên \*.spec.ts. Ví dụ, file test của task.service.ts sẽ
là task.service.spec.ts, và chúng nằm cùng thư mục. Cách tổ chức này
giúp developer dễ dàng tìm thấy file test tương ứng với mỗi file source
code, đồng thời đảm bảo tính nhất quán trong toàn bộ dự án.

Để chạy test, NestJS cung cấp sẵn các npm scripts trong package.json:

> \# Chạy toàn bộ unit test\
> npm run test
>
> \# Chạy test ở chế độ watch --- tự động chạy lại khi file thay đổi\
> npm run test:watch
>
> \# Chạy test và đo code coverage\
> npm run test:cov

Lệnh npm run test sẽ thực thi Jest, quét toàn bộ project để tìm các file
.spec.ts, biên dịch TypeScript và chạy tất cả test case. Chế độ
test:watch đặc biệt hữu ích trong quá trình phát triển vì nó theo dõi sự
thay đổi của file và chỉ chạy lại những test liên quan, giúp tiết kiệm
thời gian đáng kể so với việc chạy lại toàn bộ.

### 8.3. Cấu trúc một bài test

#### 8.3.1. Các thành phần cơ bản

Một file test trong Jest được tổ chức theo cấu trúc phân cấp rõ ràng,
bao gồm bốn thành phần chính: describe(), it() (hoặc test()), expect(),
và các hook beforeEach() / afterEach().

Hàm describe() đóng vai trò như một nhóm (group) chứa các test case liên
quan đến cùng một chức năng hoặc một đơn vị code. Mỗi describe() nhận
hai tham số: một chuỗi mô tả tên nhóm, và một callback function chứa các
test case bên trong. Các describe() có thể lồng nhau (nested) để tạo cấu
trúc phân cấp chi tiết hơn --- ví dụ, describe(\'TaskService\') bên
ngoài chứa describe(\'create\') và describe(\'findOne\') bên trong.

Hàm it() (hoặc test() --- hai hàm này hoàn toàn tương đương) định nghĩa
một test case cụ thể. Mỗi it() mô tả một kịch bản kiểm thử duy nhất và
chứa logic kiểm tra bên trong. Quy ước đặt tên phổ biến là bắt đầu bằng
\"should\" để tạo câu đọc tự nhiên: it(\'should return a task when valid
ID is provided\'). Mỗi test case nên kiểm tra một và chỉ một hành vi ---
nguyên tắc này giúp dễ dàng xác định nguyên nhân khi test fail.

Hàm expect() tạo ra một assertion --- phép so sánh giữa giá trị thực tế
và giá trị mong đợi. Jest cung cấp nhiều matcher methods như .toBe() (so
sánh giá trị nguyên thủy), .toEqual() (so sánh deep equality cho
object), .toThrow() (kiểm tra exception), .toHaveBeenCalledWith() (kiểm
tra mock function được gọi với tham số nào). Nếu assertion fail, Jest sẽ
báo lỗi chi tiết cho biết giá trị nhận được (received) khác giá trị mong
đợi (expected) ở điểm nào

Các hook beforeEach() và afterEach() chạy tự động trước và sau mỗi test
case trong cùng block describe(). Hook beforeEach() thường được sử dụng
để khởi tạo TestingModule, reset mock, và chuẩn bị dữ liệu test. Hook
afterEach() dùng để dọn dẹp tài nguyên sau mỗi test. Việc sử dụng
beforeEach() đảm bảo mỗi test case bắt đầu với trạng thái sạch, không bị
ảnh hưởng bởi test case trước đó.

#### 8.3.2. Ví dụ đơn giản với hàm thuần

Trước khi đi vào kiểm thử các thành phần NestJS, hãy bắt đầu với một ví
dụ đơn giản nhất: kiểm thử một hàm thuần (pure function) không có
dependency nào. Giả sử trong dự án TodoList Collaboration, chúng ta có
một hàm tiện ích tính tiến độ hoàn thành task dựa trên số subtask đã
hoàn thành.

![](media/image194.png){width="6.270138888888889in"
height="2.0833333333333335in"}

Hàm calculateTaskProgress nhận vào số subtask đã hoàn thành và tổng số
subtask, trả về phần trăm tiến độ. Đây là một hàm thuần --- output chỉ
phụ thuộc vào input, không có side effect --- nên rất dễ viết test.

![](media/image195.png){width="6.270138888888889in"
height="4.336111111111111in"}

Mỗi test case trong ví dụ trên kiểm tra một kịch bản cụ thể: trường hợp
không có subtask nào, trường hợp bình thường, trường hợp hoàn thành
100%, và trường hợp cần làm tròn. Lưu ý rằng tên các test case được viết
mô tả rõ ràng hành vi mong đợi, giúp khi đọc output của Jest ta có thể
hiểu ngay test nào pass và test nào fail mà không cần xem code. Đây là
nền tảng để chúng ta tiến đến kiểm thử các thành phần phức tạp hơn trong
NestJS.

### 8.4. Mocking và Dependency Injection trong test

#### 8.4.1. Vấn đề dependency trong unit test

Trong thực tế, hầu hết các service trong NestJS đều có dependency.
TaskService phụ thuộc vào PrismaService để thao tác database,
AuthService phụ thuộc vào JwtService để tạo token, và các controller phụ
thuộc vào service tương ứng. Nếu chúng ta sử dụng dependency thật trong
unit test, nhiều vấn đề sẽ phát sinh: test cần kết nối database thật
(chậm và không ổn định), kết quả test phụ thuộc vào trạng thái database
(không reproducible), và một lỗi ở PrismaService sẽ khiến test của
TaskService cũng fail (vi phạm nguyên tắc cô lập).

Giải pháp cho vấn đề này là **Mocking** --- kỹ thuật thay thế dependency
thật bằng các đối tượng giả (mock objects) mà chúng ta hoàn toàn kiểm
soát được. Mock object có cùng interface với dependency thật nhưng không
thực hiện logic thật. Thay vào đó, chúng ta có thể lập trình sẵn giá trị
trả về cho mock, và sau đó kiểm tra xem mock có được gọi đúng cách hay
không.

#### 8.4.2. Jest mock functions

Jest cung cấp hàm jest.fn() để tạo mock function --- một function giả mà
Jest theo dõi toàn bộ lịch sử gọi: bao nhiêu lần được gọi, với tham số
gì, và trả về giá trị nào. Ngoài ra, jest.spyOn() cho phép \"theo dõi\"
một method có sẵn trên object, vừa giữ nguyên implementation gốc vừa có
thể override khi cần. Hai công cụ này là nền tảng của mọi unit test
trong NestJS.

Để mock PrismaService trong test của TaskService, chúng ta tạo một
object có cùng cấu trúc với PrismaService nhưng tất cả các method đều là
jest.fn(). Object này sẽ được inject vào TaskService thay cho
PrismaService thật thông qua TestingModule.

![](media/image196.png){width="4.406864610673666in"
height="2.4170034995625547in"}

Đoạn code trên tạo ra một mock object mô phỏng cấu trúc của
PrismaService, cụ thể là phần Prisma Client delegate cho model task. Mỗi
method (create, findMany, findUnique, update, delete) đều là jest.fn(),
nghĩa là chúng không làm gì cả khi được gọi (trả về undefined), nhưng
Jest sẽ ghi lại mọi lần gọi để chúng ta kiểm tra sau.

#### 8.4.3. Tạo TestingModule với mock dependency

Sau khi có mock object, bước tiếp theo là tạo TestingModule và đăng ký
mock thay cho dependency thật. Cú pháp { provide: PrismaService,
useValue: mockPrismaService } yêu cầu NestJS DI container: \"Khi có ai
yêu cầu PrismaService, hãy trả về mockPrismaService thay vì tạo instance
thật.\"

![](media/image197.png){width="5.389458661417323in"
height="5.568531277340332in"}

Trong đoạn code trên, beforeEach() đảm bảo mỗi test case đều bắt đầu với
một TestingModule mới. Hàm module.get\<TaskService\>(TaskService) lấy
instance của TaskService từ DI container --- instance này đã được inject
mockPrismaService thay vì PrismaService thật. Lệnh jest.clearAllMocks()
rất quan trọng: nó reset lịch sử gọi của tất cả mock function, đảm bảo
test case này không bị ảnh hưởng bởi các lần gọi trong test case trước.

### 8.5. Kiểm thử Service

#### 8.5.1. Thiết lập file test cho TaskService

Với kiến thức về mocking và TestingModule, bây giờ chúng ta sẽ viết bộ
test hoàn chỉnh cho TaskService --- service chính quản lý Task trong dự
án TodoList Collaboration. File test sẽ kiểm tra các method: create(),
findAll(), findOne(), và update().

Đầu tiên, chúng ta thiết lập cấu trúc cơ bản của file test, bao gồm
import các module cần thiết, tạo mock PrismaService, và khởi tạo
TestingModule trong beforeEach().

![](media/image198.png){width="5.792474846894138in"
height="6.667597331583552in"}

Phần thiết lập này tái sử dụng kỹ thuật đã trình bày ở mục 8.4. Biến
service chứa instance TaskService cần test, và biến prisma chứa mock
PrismaService để chúng ta có thể lập trình hành vi và kiểm tra lịch sử
gọi.

#### 8.5.2. Test method create()

Method create() của TaskService nhận vào userId, projectId, và DTO chứa
thông tin task, sau đó gọi prisma.task.create() để lưu vào database.
Unit test cần xác minh hai điều: method trả về đúng kết quả, và
prisma.task.create() được gọi với đúng dữ liệu.

![](media/image199.png){width="6.270138888888889in" height="6.9875in"}

Trong test case trên, jest.spyOn(prisma.task,
\'create\').mockResolvedValue(expectedTask) lập trình cho mock: khi
prisma.task.create() được gọi, nó sẽ trả về một Promise resolve thành
expectedTask. Sau khi gọi service.create(), chúng ta sử dụng ba
assertion: expect(result).toEqual(expectedTask) kiểm tra giá trị trả về
đúng, toHaveBeenCalledTimes(1) xác nhận mock chỉ được gọi đúng một lần,
và toHaveBeenCalledWith() kiểm tra tham số truyền vào có chứa đúng dữ
liệu. Matcher expect.objectContaining() cho phép kiểm tra một phần của
object --- rất hữu ích khi object thực tế có thể chứa thêm các field như
createdAt mà chúng ta không muốn kiểm tra cứng.

#### 8.5.3. Test method findAll()

Method findAll() trả về danh sách tất cả task trong một project. Test
case cần xác minh rằng method gọi prisma.task.findMany() và trả về đúng
mảng kết quả.

Ở test case thứ hai, chúng ta kiểm tra trường hợp biên (edge case) khi
project chưa có task nào. Việc test cả trường hợp bình thường lẫn trường
hợp biên giúp đảm bảo method xử lý đúng trong mọi tình huống. Assertion
toHaveLength(0) là cách tường minh để xác nhận mảng trả về thực sự rỗng.

#### 8.5.4. Test method findOne()

Method findOne() là trường hợp thú vị vì nó có hai nhánh logic: trả về
task khi tìm thấy, hoặc throw NotFoundException khi task không tồn tại.
Chúng ta cần viết test case cho cả hai nhánh.

![](media/image200.png){width="6.261290463692038in"
height="6.678015091863517in"}

Lưu ý cú pháp đặc biệt khi test exception trong async function: await
expect(service.findOne(\...)).rejects.toThrow(NotFoundException). Phần
.rejects cho Jest biết Promise sẽ bị reject, và
.toThrow(NotFoundException) kiểm tra rằng lỗi ném ra là đúng loại
NotFoundException. Đây là pattern quan trọng vì trong NestJS, các HTTP
exception như NotFoundException sẽ tự động được chuyển thành response
404 bởi Exception Filter mặc định (đã trình bày ở Chương 6).

#### 8.5.5. Test method update()

Method update() nhận vào taskId và DTO chứa dữ liệu cần cập nhật, sau đó
gọi prisma.task.update(). Chúng ta cần kiểm tra rằng method truyền đúng
tham số cho Prisma.

![](media/image201.png){width="6.270138888888889in"
height="6.059027777777778in"}\
Test case thứ hai cho update() xác minh rằng khi cố cập nhật task không
tồn tại, method sẽ throw NotFoundException thay vì gọi
prisma.task.update(). Điều này đảm bảo service thực hiện validation
trước khi thao tác database --- đây là best practice trong mọi ứng dụng
backend.

### 8.6. Kiểm thử Controller

#### 8.6.1. Sự khác biệt giữa test Service và test Controller

Kiểm thử Controller khác biệt cơ bản so với kiểm thử Service ở chỗ:
trong test Controller, chúng ta mock Service thay vì mock database
layer. Controller chỉ đóng vai trò \"người điều phối\" --- nhận request,
gọi service tương ứng, và trả về response. Do đó, unit test cho
Controller chỉ cần xác minh rằng Controller gọi đúng method của Service
với đúng tham số, chứ không cần kiểm tra logic nghiệp vụ (vì logic đó
thuộc về Service và đã được test riêng).

Cách tiếp cận này tuân theo nguyên tắc Single Responsibility: mỗi layer
chỉ test trách nhiệm của chính nó. Controller test kiểm tra \"routing\"
và \"parameter passing\", Service test kiểm tra \"business logic\", và
nếu có Integration test thì sẽ kiểm tra sự phối hợp giữa các layer.

**8.6.2. Thiết lập và viết test cho TaskController**

Để test TaskController, chúng ta tạo TestingModule với TaskController là
controller và mock TaskService là provider. Mock TaskService chứa các
mock function tương ứng với mỗi method của service thật.

![](media/image202.png){width="6.115436351706037in"
height="3.3963068678915134in"}

![](media/image203.png){width="6.230036089238845in"
height="3.135854111986002in"}

![](media/image204.png){width="5.981821959755031in"
height="6.19051290463692in"}

![](media/image205.png){width="6.270138888888889in"
height="2.813888888888889in"}

Trong đoạn code trên, mỗi test case của Controller đều theo cùng một
pattern: chuẩn bị dữ liệu đầu vào, lập trình mock service trả về giá trị
mong muốn, gọi method của controller, và kiểm tra kết quả cùng lịch sử
gọi service. Pattern này nhất quán và dễ mở rộng khi thêm các endpoint
mới. Lưu ý rằng chúng ta không test logic nghiệp vụ ở đây --- ví dụ,
không kiểm tra NotFoundException vì đó là trách nhiệm của Service layer.

### 8.7. Đo độ phủ kiểm thử (Code Coverage)

#### 8.7.1. Code Coverage là gì?

Code Coverage (Độ phủ code) là một chỉ số đo lường tỷ lệ code đã được
thực thi trong quá trình chạy test. Chỉ số này giúp developer xác định
những phần code nào chưa được test, từ đó bổ sung test case cho phù hợp.
Jest tích hợp sẵn công cụ đo coverage dựa trên Istanbul, cho phép tạo
báo cáo chi tiết mà không cần cài đặt thêm gì.

Coverage được đo theo bốn tiêu chí khác nhau, mỗi tiêu chí phản ánh một
khía cạnh riêng của mức độ kiểm thử. Bảng sau tóm tắt ý nghĩa của từng
tiêu chí:

  -----------------------------------------------------------------------
  **Tiêu chí**     **Ý nghĩa**                **Ví dụ**
  ---------------- -------------------------- ---------------------------
  Statements (%    Tỷ lệ câu lệnh đã được     Mỗi dòng code đơn lẻ
  Stmts)           thực thi                   

  Branches (%      Tỷ lệ nhánh điều kiện đã   Cả nhánh if lẫn else
  Branch)          được kiểm tra              

  Functions (%     Tỷ lệ hàm đã được gọi      Mỗi method trong service
  Funcs)                                      

  Lines (% Lines)  Tỷ lệ dòng code đã được    Tương tự Statements nhưng
                   thực thi                   tính theo dòng vật lý
  -----------------------------------------------------------------------

**8.7.2. Cách chạy và đọc báo cáo Coverage**

Để tạo báo cáo coverage, chúng ta chạy lệnh npm run test:cov. Jest sẽ
thực thi toàn bộ test, đồng thời theo dõi những dòng code nào được chạy
qua và những dòng nào bị bỏ qua. Sau khi hoàn tất, Jest in ra bảng tổng
hợp trên terminal.\
![](media/image206.png){width="6.270138888888889in"
height="1.7854166666666667in"}

Bảng trên cho thấy task.controller.ts đạt 100% ở mọi tiêu chí --- tất cả
code trong controller đã được test. Trong khi đó, task.service.ts có
Branch coverage chỉ 66.67%, nghĩa là có một nhánh điều kiện chưa được
kiểm tra. Cột \"Uncovered Line #s\" chỉ rõ dòng 45-48 chưa được chạy qua
--- developer cần xem lại những dòng này và viết thêm test case phù hợp.

Ngoài bảng trên terminal, Jest còn tạo thư mục coverage/ chứa báo cáo
HTML chi tiết. Mở file coverage/lcov-report/index.html trong trình duyệt
sẽ thấy giao diện trực quan với code được đánh dấu màu: xanh cho dòng đã
được test, đỏ cho dòng chưa test. Đây là công cụ rất hữu ích để review
coverage một cách trực quan.

#### 8.7.3. Ngưỡng Coverage hợp lý

Một câu hỏi thường gặp là: bao nhiêu phần trăm coverage là đủ? Trong
thực tế, ngưỡng 70-80% được coi là hợp lý cho hầu hết các dự án. Ngưỡng
này đảm bảo phần lớn logic quan trọng đã được kiểm thử, đồng thời không
tạo áp lực quá lớn lên developer phải viết test cho những đoạn code
trivial.

Theo đuổi 100% coverage không phải lúc nào cũng là mục tiêu đúng đắn.
Một số đoạn code rất khó test nhưng lại đơn giản đến mức không cần test
--- ví dụ getter/setter đơn thuần hoặc constructor chỉ gán giá trị. Việc
ép viết test cho những đoạn code như vậy tốn thời gian mà không mang lại
giá trị thực sự. Quan trọng hơn số phần trăm là **chất lượng** test: một
bộ test 70% coverage nhưng kiểm tra đúng các business logic quan trọng
và edge case sẽ có giá trị hơn nhiều so với bộ test 100% coverage nhưng
chỉ kiểm tra happy path.

### 8.8. Bài tập ứng dụng --- Viết Unit Test cho TaskService

#### 8.8.1. Yêu cầu bài tập

Dựa trên kiến thức đã học trong chương này, hãy viết bộ unit test hoàn
chỉnh cho TaskService bao gồm bốn method chính: create(), findAll(),
update(), và delete(). Mỗi method cần có ít nhất hai test case: một cho
trường hợp thành công (happy path) và một cho trường hợp lỗi (error
case).

#### 8.8.2. Hướng dẫn thực hiện

**Bước 1:** Tạo file task.service.spec.ts trong thư mục src/task/ (nếu
chưa có).

**Bước 2:** Thiết lập TestingModule với mock PrismaService theo cấu trúc
đã trình bày ở mục 8.4.

**Bước 3:** Viết các test case theo danh sách sau:

![](media/image207.png){width="6.209199475065617in"
height="6.5946708223972in"}

![](media/image208.png){width="6.270138888888889in"
height="6.299305555555556in"}

![](media/image209.png){width="6.250872703412074in"
height="4.583973097112861in"}

![](media/image210.png){width="6.270138888888889in"
height="4.754166666666666in"}

**8.8.3. Kết quả mong đợi**

Sau khi hoàn thành bài tập và chạy npm run test, kết quả mong đợi sẽ
hiển thị như sau:

![](media/image211.png){width="6.270138888888889in"
height="3.2743055555555554in"}

Tất cả 7 test case đều pass (dấu tích xanh), nghĩa là TaskService xử lý
đúng cả trường hợp thành công lẫn trường hợp lỗi. Thời gian chạy chỉ
khoảng 3 giây --- minh chứng cho ưu điểm tốc độ của unit test so với
integration test hay E2E test.

### 8.9. Tổng kết

Trong chương này, chúng ta đã tìm hiểu toàn bộ quy trình kiểm thử đơn vị
trong NestJS, từ lý thuyết đến thực hành. Chúng ta bắt đầu với các khái
niệm nền tảng về kiểm thử phần mềm, hiểu được sự khác biệt giữa ba cấp
độ kiểm thử (Unit, Integration, E2E) và tại sao unit test nằm ở đáy kim
tự tháp kiểm thử với số lượng nhiều nhất. Tiếp theo, chúng ta làm quen
với bộ công cụ Jest và \@nestjs/testing --- hai thành phần cốt lõi để
viết test trong hệ sinh thái NestJS.

Phần trọng tâm của chương là kỹ thuật Mocking --- cách thay thế
dependency thật bằng đối tượng giả để đạt được sự cô lập trong unit
test. Thông qua TestingModule và cơ chế Dependency Injection, việc mock
dependency trong NestJS trở nên tự nhiên và trực quan. Chúng ta đã áp
dụng kỹ thuật này để viết bộ test hoàn chỉnh cho TaskService (kiểm tra
business logic) và TaskController (kiểm tra lớp điều phối HTTP), bao phủ
cả trường hợp thành công lẫn trường hợp lỗi.

Cuối cùng, chúng ta học cách đo code coverage để đánh giá mức độ kiểm
thử, với nguyên tắc rằng 70-80% là ngưỡng hợp lý cho hầu hết dự án, và
chất lượng test quan trọng hơn số lượng. Với kiến thức về kiểm thử,
chúng ta đã hoàn thành toàn bộ nền tảng kỹ thuật cần thiết. Phần tiếp
theo sẽ áp dụng tất cả vào việc phân tích, thiết kế và triển khai đồ án
TodoList Collaboration.

#  

# **Phần 4: Xây dựng đồ án tổng hợp**

## **Chương 9: Phân tích và Thiết kế hệ thống (sơ lược)**

### 9.1. Tổng quan dự án

#### 9.1.1. Giới thiệu

TodoList Collaboration là ứng dụng quản lý công việc cộng tác, cho phép
nhiều người dùng cùng làm việc trong các workspace chung. Dự án được xây
dựng bằng NestJS (backend) và React (frontend), sử dụng PostgreSQL làm
hệ quản trị cơ sở dữ liệu và Prisma làm ORM.

Ứng dụng hướng đến việc giải quyết bài toán quản lý task trong môi
trường nhóm --- nơi mỗi thành viên cần theo dõi tiến độ công việc, phân
công nhiệm vụ, và trao đổi thông qua bình luận. Khác với các ứng dụng
todo đơn giản chỉ phục vụ cá nhân, TodoList Collaboration được thiết kế
với hệ thống phân quyền đa cấp (Owner, Admin, Member) để phù hợp với quy
trình làm việc thực tế của các nhóm dự án.

#### 9.1.2. Các module chức năng

Hệ thống được chia thành các module theo nguyên tắc phân tách trách
nhiệm, mỗi module đóng gói một domain nghiệp vụ riêng biệt:

  ------------------ ------------------------------------------ --------------
  **Module**         **Chức năng chính**                        **Trạng thái**

  **Auth**           Đăng ký, đăng nhập, refresh token, logout, Hoàn thành
                     quên/đặt lại mật khẩu                      

  **User**           Xem/cập nhật profile, đổi mật khẩu, upload Hoàn thành
                     avatar                                     

  **Workspace**      Tạo/quản lý workspace, mời thành viên,     Đang triển
                     phân quyền                                 khai

  **Project**        Tạo/quản lý project trong workspace        Sắp triển khai

  **Task**           CRUD task, phân công, subtask, đổi trạng   Sắp triển khai
                     thái                                       

  **Comment**        Bình luận trên task, reply                 Sắp triển khai

  **Notification**   Thông báo realtime                         Sắp triển khai

  **Label**          Nhãn phân loại task                        Sắp triển khai
  ------------------ ------------------------------------------ --------------

### 9.2. Kiến trúc hệ thống

#### 9.2.1. Kiến trúc module

Ứng dụng tuân theo kiến trúc module hóa của NestJS (đã trình bày ở
Chương 4), với AppModule đóng vai trò Root Module điều phối toàn bộ:

![](media/image212.jpg){width="6.267716535433071in"
height="1.9583333333333333in"}

Mỗi Feature Module (Auth, User) tuân theo cấu trúc ba tầng nhất quán:

![](media/image213.jpg){width="6.267716535433071in"
height="2.111111111111111in"}

Cấu trúc ba tầng này phản ánh nguyên tắc Separation of Concerns:
Controller chỉ tiếp nhận và phân phối request, Service chứa toàn bộ
logic nghiệp vụ, DTO đảm bảo dữ liệu đầu vào hợp lệ. Khi cần thay đổi
logic nghiệp vụ, chỉ cần sửa Service; khi thêm endpoint mới, chỉ cần sửa
Controller. Các tầng hoàn toàn độc lập và có thể test riêng biệt.

#### 9.2.2. Sơ đồ phụ thuộc giữa các module

Sơ đồ cho thấy ba nhóm phụ thuộc chính trong hệ thống.

Nhóm thứ nhất là **PrismaService** --- được đánh dấu \@Global() nên mọi
service đều inject trực tiếp mà không cần khai báo import trong từng
module. Đây là node trung tâm mà toàn bộ tầng Service đều phụ thuộc vào
để truy cập database.

Nhóm thứ hai là **module exports/imports** (mũi tên liền): AuthModule
export AuthService; WorkspaceModule export WorkspacePermissionService để
ProjectModule và LabelModule kiểm tra quyền theo workspace;
ProjectModule export ProjectService để TaskModule xác minh task thuộc
đúng project. Thứ tự phụ thuộc này phản ánh dependency chain nghiệp vụ:
Workspace → Project → Task.

Nhóm thứ ba là **cross-module service injection** (mũi tên đứt):
ActivityService được inject vào WorkspaceService, TaskService, và
CommentService để ghi nhật ký hoạt động tự động mỗi khi có thao tác
nghiệp vụ quan trọng. Tương tự, EventsGateway được inject vào
TaskService, CommentService, và NotificationService để phát sự kiện
realtime qua WebSocket ngay tại tầng Service --- không cần controller
gọi thêm.

JwtAuthGuard được đăng ký làm Global Guard tại AppModule thông qua
APP_GUARD, bảo vệ mọi endpoint mặc định. Các endpoint công khai
(register, login, accept-invite) phải được đánh dấu tường minh bằng
decorator \@Public() để bypass guard.

### 9.3. Thiết kế cơ sở dữ liệu

#### 9.3.1. Tổng quan schema

#### 9.3.2. Biểu đồ quan hệ thực thể (ERD)

ERD tổng quan hệ thống --- thể hiện quan hệ giữa 17 bảng trong cơ sở dữ
liệu:

![](media/image214.png){width="6.267716535433071in"
height="3.0972222222222223in"}

### 9.5. Biểu đồ tuần tự các chức năng chính

Biểu đồ tuần tự (Sequence Diagram) mô tả trình tự tương tác giữa các
thành phần trong hệ thống khi xử lý một request. Dưới đây là các luồng
chức năng chính:

#### 9.5.1. Đăng ký tài khoản (User Registration)

![](media/image215.png){width="6.267716535433071in"
height="5.555555555555555in"}

#### 9.5.2. Đăng nhập (User Login)

![](media/image216.png){width="6.267716535433071in"
height="5.430555555555555in"}

#### 9.5.3. Refresh Token

![](media/image217.png){width="6.267716535433071in"
height="5.444444444444445in"}

#### 9.5.4. Forgot password

![](media/image218.png){width="6.267716535433071in"
height="3.6527777777777777in"}

#### 9.5.5. Reset Password

![](media/image219.png){width="6.267716535433071in" height="4.5in"}

#### 9.5.6. Logout

![](media/image220.png){width="6.267716535433071in"
height="2.7777777777777777in"}

#### 9.5.7. View Profile

![](media/image221.png){width="6.267716535433071in" height="2.875in"}

#### 9.5.8. Cập nhật hồ sơ (Update profile)

![](media/image222.png){width="6.267716535433071in"
height="2.6666666666666665in"}

#### 9.5.9. Đổi mật khẩu (Change password)

![](media/image223.png){width="6.267716535433071in" height="3.5in"}

#### 9.5.10. Upload Avatar

![](media/image224.png){width="6.267716535433071in"
height="2.9444444444444446in"}

#### 9.5.11. Create Workspace

![](media/image225.png){width="6.267716535433071in"
height="2.0694444444444446in"}

#### 9.5.12. List Workspaces

![](media/image226.png){width="6.267716535433071in"
height="2.2777777777777777in"}

#### 9.5.13. Get Workspace Detail

![](media/image227.png){width="6.267716535433071in"
height="3.3472222222222223in"}

#### 9.5.14. Update Workspace

![](media/image228.png){width="6.267716535433071in"
height="3.0277777777777777in"}

#### 9.5.15. Delete Workspace

![](media/image229.png){width="6.267716535433071in"
height="3.2916666666666665in"}

#### 9.5.16. Invite Member to Workspace

![](media/image230.png){width="6.267716535433071in"
height="3.6527777777777777in"}

#### 9.5.17. Accept Workspace Invitation

![](media/image231.png){width="6.267716535433071in"
height="3.6527777777777777in"}

#### 9.5.18. Get Workspace Members

![](media/image232.png){width="6.267716535433071in"
height="3.1805555555555554in"}

#### 9.5.19. Change Member Role

![](media/image233.png){width="6.267716535433071in"
height="2.5277777777777777in"}

#### 9.5.20. Remove Member

![](media/image234.png){width="6.267716535433071in"
height="2.736111111111111in"}

#### 9.5.21. Leave Workspace

![](media/image235.png){width="6.267716535433071in"
height="3.1527777777777777in"}

#### 9.5.22. Create Project

![](media/image236.png){width="6.267716535433071in"
height="2.9027777777777777in"}

#### 9.5.23. List Projects in Workspace

![](media/image237.png){width="6.267716535433071in"
height="2.638888888888889in"}

#### 9.5.24. Get Project Detail

![](media/image238.png){width="6.267716535433071in"
height="3.2083333333333335in"}

#### 9.5.25. Update Project

![](media/image239.png){width="6.267716535433071in"
height="3.388888888888889in"}

#### 9.5.26. Delete Project

![](media/image240.png){width="6.267716535433071in"
height="3.5694444444444446in"}

#### 9.5.27. Archive Project

![](media/image241.png){width="6.267716535433071in"
height="3.4583333333333335in"}

#### 9.5.28. Unarchive Project

![](media/image242.png){width="6.267716535433071in"
height="3.361111111111111in"}

#### 9.5.29. Pin Project

![](media/image243.png){width="6.267716535433071in"
height="3.4444444444444446in"}

#### 9.5.30. Unpin Project

![](media/image244.png){width="6.267716535433071in"
height="3.736111111111111in"}

#### 9.5.31. Create Task

![](media/image245.png){width="6.267716535433071in"
height="3.2777777777777777in"}

#### 9.5.32. List Task in Project

![](media/image246.png){width="6.267716535433071in"
height="2.8055555555555554in"}

#### 9.5.33. Get Task Detail

![](media/image247.png){width="6.267716535433071in"
height="3.1805555555555554in"}

####  9.5.34. Update Task

![](media/image248.png){width="6.267716535433071in"
height="3.0277777777777777in"}

#### 9.5.35. Delete Task

![](media/image249.png){width="6.267716535433071in"
height="3.361111111111111in"}

#### 9.5.36. Change Task Status

![](media/image250.png){width="6.267716535433071in"
height="2.9166666666666665in"}

#### 9.5.37. Assign Member to Task

![](media/image251.png){width="6.267716535433071in"
height="4.694444444444445in"}

#### 9.5.38. Unassign Member to Task

![](media/image252.png){width="6.267716535433071in"
height="3.6527777777777777in"}

#### 9.5.39. Manage Task Labels

![](media/image253.png){width="6.267716535433071in"
height="8.041666666666666in"}

#### 9.5.40. Manage Subtasks

![](media/image254.png){width="6.12245406824147in"
height="9.036458880139982in"}

#### 9.5.41. Add Comment

![](media/image255.png){width="6.267716535433071in"
height="2.9166666666666665in"}

#### 9.5.42. Reply Comment

![](media/image256.png){width="6.267716535433071in"
height="2.9583333333333335in"}

#### 9.5.43. Internal Notification Creation

#### ![](media/image257.png){width="6.267716535433071in" height="3.361111111111111in"}

#  

# **Chương 10: Sản phẩm tổng hợp --- TodoList Collaboration**

Chương này trình bày sản phẩm đồ án hoàn chỉnh, bao gồm cấu trúc mã
nguồn, cách các kỹ thuật đã học ở Phần 2 được tích hợp vào từng module,
giao diện và kết quả vận hành hệ thống, cũng như hướng dẫn cài đặt và sử
dụng.

## **10.1. Cấu trúc thư mục mã nguồn**

Dự án TodoList Collaboration được tổ chức theo mô hình
Infrastructure-separated Architecture, phân tách rõ ràng giữa feature
modules (chứa nghiệp vụ) và shared infrastructure (chứa các thành phần
dùng chung). Cách tổ chức này giúp developer nhanh chóng xác định vị trí
code cần sửa đổi, đồng thời đảm bảo tính nhất quán khi mở rộng hệ thống
thêm các module mới.

![](media/image258.png){width="5.776042213473316in"
height="10.402622484689413in"}

Việc tách thư mục modules/ khỏi shared/ giúp phân biệt rõ ràng giữa code
nghiệp vụ (feature code) và code hạ tầng (infrastructure code). Hệ thống
gồm **8 feature modules**: Auth, User, Workspace, Project, Task xử lý
nghiệp vụ CRUD chính; Comment và Notification bổ sung tương tác cộng
tác; Events cung cấp kênh WebSocket để đẩy dữ liệu real-time tới client.
Mỗi feature module tuân theo cấu trúc nhất quán gồm bốn thành phần: DTOs
để validate đầu vào, Service chứa business logic, Controller định nghĩa
API endpoints, và Module kết nối các thành phần lại với nhau.

Thư mục shared/prisma/ được đánh dấu \@Global() vì PrismaService là
thành phần nền tảng được sử dụng ở mọi module mà không cần khai báo
import lại. shared/mail/ sử dụng Brevo API để gửi email giao dịch (đặt
lại mật khẩu, xác nhận email, chào mừng), hỗ trợ mock mode khi phát
triển local. Các filters và interceptors trong shared/common/ được đăng
ký global trong main.ts, tự động áp dụng cho toàn bộ API --- đảm bảo mọi
response đều được chuẩn hóa và mọi request đều được ghi log.

## **10.2. Tích hợp kỹ thuật** 

Một trong những yêu cầu cốt lõi của đồ án là các kỹ thuật đã được trình
bày ở Phần 3 (lý thuyết) phải được áp dụng trực tiếp vào sản phẩm thực
tế. Phần này trình bày cách từng nhóm kỹ thuật được tích hợp vào các
module cụ thể trong hệ thống TodoList Collaboration, và vấn đề thực tế
mà chúng giải quyết.

### 10.2.1. Nhóm kỹ thuật TypeScript cơ bản (Chương 4)

Toàn bộ codebase của dự án được viết bằng TypeScript, tận dụng hệ thống
kiểu dữ liệu mạnh mẽ để phát hiện lỗi tại compile-time thay vì runtime.
Interface và Type được sử dụng xuyên suốt trong các DTOs, Services và
Controllers để đảm bảo type-safety. Hệ thống Decorators của TypeScript
là nền tảng cho toàn bộ cách NestJS hoạt động --- từ \@Controller(),
\@Injectable(), \@Module() đến \@Get(), \@Post(), \@Body(), \@Param()
--- cho phép định nghĩa routing và metadata một cách khai báo
(declarative) thay vì mệnh lệnh (imperative).

### 10.2.2. Nhóm kỹ thuật Kiến trúc NestJS (Chương 4)

Hệ thống được tổ chức thành 8 feature modules (Auth, User, Workspace,
Project, Task, Comment, Notification, Events), mỗi module đóng gói trọn
vẹn một domain nghiệp vụ. Dependency Injection là cơ chế kết nối các
tầng: mọi Service đều inject PrismaService để truy cập database mà không
cần tạo instance thủ công, đảm bảo loose coupling và dễ thay thế
implementation. PrismaModule được khai báo là \@Global() --- chỉ cần
import một lần tại AppModule mà toàn bộ 8 modules đều sử dụng được.
Lifecycle Hooks (onModuleInit, onModuleDestroy) trong PrismaService đảm
bảo kết nối database được mở và đóng đúng thời điểm, tránh connection
leak.

### 10.2.3. Nhóm kỹ thuật Prisma ORM (Chương 5)

Toàn bộ tương tác với database PostgreSQL được thực hiện thông qua
Prisma ORM với 17 models được định nghĩa trong file schema.prisma. Các
quan hệ phân cấp One-to-Many (User → Task, Workspace → Project → Task)
mô hình hóa cấu trúc workspace/project/task. Quan hệ Many-to-Many thông
qua bảng trung gian (TaskLabel, TaskAssignment) cho phép gắn nhiều nhãn
và phân công nhiều người cho một task. Prisma Transactions được sử dụng
trong các thao tác cần tính nguyên tử --- ví dụ khi đổi mật khẩu, việc
hash password mới và revoke tất cả token cũ phải xảy ra cùng nhau hoặc
không xảy ra gì cả. Tùy chọn select trong UserService.getProfile() đảm
bảo field password không bao giờ bị trả về cho client.

### 10.2.4. Nhóm kỹ thuật Pipes và Interceptors (Chương 6)

ValidationPipe kết hợp với class-validator được đăng ký global, tự động
kiểm tra mọi request đầu vào dựa trên DTO decorators --- email phải đúng
format, password phải đủ dài, UUID phải đúng chuẩn. ParseUUIDPipe
validate tham số :id trong URL, trả về 400 nếu format sai.
TransformResponseInterceptor chuẩn hóa toàn bộ response thành format
thống nhất {success, data, timestamp}. LoggingInterceptor ghi log mọi
request kèm thời gian xử lý để hỗ trợ debug và monitoring.
HttpExceptionFilter bắt mọi exception và trả về response lỗi chuẩn
{success: false, statusCode, message, path}.

Ngoài ra, kỹ thuật File Upload với Multer được áp dụng cho tính năng
upload avatar trong UserModule. Multer middleware parse
multipart/form-data, validate loại file (JPEG/PNG/GIF) và kích thước
(tối đa 5MB), sau đó Controller nhận file qua \@UploadedFile() và
Service lưu file ra disk, đồng thời tự động xóa avatar cũ khi upload ảnh
mới.

### 10.2.5. Nhóm kỹ thuật Authentication và JWT (Chương 7)

Hệ thống xác thực được xây dựng trên nền JWT với chiến lược Dual Token:
Access Token (15 phút) dùng cho mọi request authenticated, và Refresh
Token (15 ngày) dùng để cấp lại access token mà không cần đăng nhập lại.
JwtStrategy tích hợp Passport.js để tự động verify token và trích xuất
user identity từ Authorization header. JwtAuthGuard được đăng ký là
APP_GUARD --- bảo vệ toàn bộ API theo nguyên tắc \"secure by default\",
chỉ những endpoint được đánh dấu \@Public() mới cho phép truy cập không
cần token.

Đặc biệt, cơ chế Token Blacklist giải quyết hạn chế cố hữu của JWT
stateless: khi user logout, access token được lưu vào bảng
InvalidatedToken và JwtStrategy.validate() kiểm tra blacklist trước mỗi
request, đảm bảo token bị vô hiệu hóa tức thì. Custom decorators
\@Public() và \@CurrentUser() giúp code controller sạch sẽ, biểu đạt rõ
ý định mà không cần truy cập trực tiếp vào object request của Express.
Mật khẩu được mã hóa bằng bcrypt với salt rounds = 10, đảm bảo không bao
giờ lưu plaintext password trong database.

### 10.2.6. Nhóm kỹ thuật WebSocket và Giao tiếp thời gian thực (Chương 10)

Module Events sử dụng \@WebSocketGateway() từ \@nestjs/websockets kết
hợp Socket.IO để thiết lập kênh giao tiếp real-time giữa server và
client. EventsGateway đăng ký các namespace cho từng loại sự kiện (task
updated, comment added, notification new), cho phép client nhận cập nhật
tức thì mà không cần polling. EventsService đóng vai trò trung gian ---
các module nghiệp vụ (Task, Comment, Notification) inject EventsService
và gọi các method như emitToProject(), emitToTask(), emitToUser() để
phát sự kiện tới đúng phòng (room) tương ứng.

Module Comment cho phép người dùng bình luận trực tiếp trên task và trả
lời bình luận (reply). Khi một comment mới được tạo, CommentService đồng
thời gọi EventsService.emitToTask() để thông báo real-time và
NotificationService.create() để tạo thông báo cho người sở hữu task.

Module Notification quản lý thông báo cho người dùng. Mỗi khi có sự kiện
quan trọng (comment mới, task được giao, thay đổi trạng thái), hệ thống
tự động tạo notification và đẩy qua WebSocket tới client bằng
EventsService.emitToUser().

### 10.2.7. Nhóm kỹ thuật Gửi email giao dịch

MailService trong shared/mail/ sử dụng Brevo API (trước đây là
Sendinblue) để gửi email giao dịch. Hệ thống hỗ trợ ba loại email: đặt
lại mật khẩu (password reset), xác nhận email (email verification), và
chào mừng thành viên mới (welcome). Mỗi email được thiết kế với HTML
template responsive, chứa nút call-to-action và thông tin hết hạn. Khi
phát triển local, biến MAIL_DRIVER=mock chuyển sang chế độ in email ra
console thay vì gửi thật, giúp developer test luồng forgot password mà
không cần cấu hình SMTP.

### 10.2.8. Bảng tổng hợp tích hợp

Bảng dưới đây tổng hợp tỷ lệ tích hợp theo từng nhóm kỹ thuật, cho thấy
toàn bộ kỹ thuật đã học đều được áp dụng vào đồ án.

  -------------------- ----------------- ------------------- ------------
  **Nhóm kỹ thuật**    **Số kỹ thuật đã  **Số kỹ thuật đã    **Tỷ lệ**
                       học**             tích hợp**          

  TypeScript cơ bản    5                 5                   100%
  (Ch4)                                                      

  Kiến trúc NestJS     6                 6                   100%
  (Ch4)                                                      

  Prisma ORM (Ch5)     8                 8                   100%

  Pipes & Interceptors 5                 5                   100%
  (Ch6)                                                      

  Authentication & JWT 7                 7                   100%
  (Ch7)                                                      

  WebSocket &          3                 3                   100%
  Real-time (Ch10)                                           

  Email giao dịch      2                 2                   100%
  (Brevo)                                                    

  **Tổng cộng**        **36**            **36**              **100%**
  -------------------- ----------------- ------------------- ------------

Bên cạnh các kỹ thuật đã tích hợp, một số kỹ thuật nâng cao như
RolesGuard (phân quyền chi tiết theo vai trò), GraphQL và Microservices
chưa được đưa vào do giới hạn về phạm vi và thời gian. Các kỹ thuật này
được xác định là hướng phát triển trong tương lai, sẽ được trình bày ở
Chương 11.

## **10.3. Giao diện và kết quả vận hành**

Để kiểm chứng hệ thống hoạt động đúng như thiết kế, nhóm thực hiện demo
các luồng sử dụng chính thông qua Swagger UI --- công cụ tài liệu API
tương tác được tích hợp sẵn tại http://localhost:3333/api-docs.

### 10.3.1. Luồng demo chính (Happy Path)

Một kịch bản sử dụng hoàn chỉnh của hệ thống được mô phỏng như sau: hai
người dùng A (Owner) và B (Member) lần lượt đăng ký, tham gia cùng một
workspace, tạo project, tạo task, phân công công việc, cộng tác qua
comment và nhận thông báo real-time, sau đó đăng xuất an toàn với cơ chế
token blacklist.

Các luồng hoạt động được demo thông qua Hoppscotch -- một công cụ client
HTTP chạy trên trình duyệt, cho phép gửi request REST, quản lý
collection API và cấu hình header/body/auth mà không cần giao diện
frontend riêng.

**Bước 1:** Người dùng A đăng ký tài khoản

Người dùng A gửi request:

- Endpoint: POST /api/v1/auth/register

- Body: JSON gồm fullname, displayName, email, password

Hệ thống kiểm tra trùng email, mã hóa mật khẩu bằng bcrypt, tạo user mới
trong database. Sau đó sinh accessToken và refreshToken, lưu
refreshToken vào bảng RefreshToken và trả về thông tin user kèm bộ
token.

![](media/image259.png){width="6.267716535433071in"
height="3.6805555555555554in"}

**Bước 2:** Đăng nhập và cấu hình Bearer token

Người dùng A gửi:

- Endpoint: POST /api/v1/auth/login

- Body: email, password

Hệ thống xác thực thông tin đăng nhập, cập nhật lastLoginAt, sinh
accessToken và refreshToken mới, lưu refreshToken vào database.
AccessToken được cấu hình vào header Authorization: Bearer cho các
request tiếp theo.

(Khi accessToken hết hạn, có thể dùng POST /api/v1/auth/refresh với
refreshToken để lấy token mới.)

![](media/image260.png){width="6.267716535433071in"
height="3.7916666666666665in"}

**Bước 3:** Cập nhật hồ sơ và upload avatar

Người dùng A thao tác:

- GET /api/v1/users/me: lấy thông tin hồ sơ

- PATCH /api/v1/users/me: cập nhật name, displayName

- POST /api/v1/users/me/avatar: upload file avatar

Hệ thống lưu file bằng Multer vào thư mục uploads/avatars, kiểm tra kích
thước file, xóa avatar cũ (nếu có) và cập nhật filename mới vào
database.

![](media/image261.png){width="6.267716535433071in" height="1.625in"}Ảnh
Dán Access Token vào phần Authorization

![](media/image262.png){width="6.267716535433071in"
height="3.2777777777777777in"}

Ảnh Response Upload Avatar thành công

**Bước 4:** Tạo workspace

Người dùng A gửi:

- Endpoint: POST /api/v1/workspaces

- Body: name, description

Hệ thống tạo workspace mới và đồng thời tạo bản ghi membership, gán A là
OWNER.

![](media/image263.png){width="6.267716535433071in" height="1.625in"}

Ảnh dán Access Token vào phần Authorization

![](media/image264.png){width="6.267716535433071in"
height="3.2083333333333335in"}

Ảnh Response tạo Workspace mới thành công

![](media/image265.png){width="6.267716535433071in"
height="0.5694444444444444in"}

Ảnh Workspace Test 1 đã được lưu vào database

**Bước 5:** Mời thành viên

Người dùng A gửi:

- Endpoint: POST /api/v1/workspaces/:id/invite

- Body: email của B, role

Hệ thống kiểm tra quyền OWNER/ADMIN, tạo invite token và lưu vào
database kèm thời hạn. Token được trả về để chia sẻ cho B.

![](media/image266.png){width="6.267716535433071in" height="3.75in"}Ảnh
Response tạo user
[[khanhhuyen@gmail.com]{.underline}](mailto:khanhhuyen@gmail.com) để làm
user nhận lời mời vào Workspace

![](media/image267.png){width="6.267716535433071in"
height="2.4166666666666665in"}

Ảnh dán Access Token của user
[[tuandat@gmail.com]{.underline}](mailto:tuandat@gmail.com) vào endpoint
Invite Member

![](media/image268.png){width="6.267716535433071in"
height="3.7222222222222223in"}

Ảnh List Workspace để lấy ID của Workspace Test 1

![](media/image269.png){width="6.267716535433071in"
height="2.861111111111111in"}

Ảnh Response tạo lời mời thành viên đến user
[[khanhhuyen@gmail.com]{.underline}](mailto:khanhhuyen@gmail.com) thành
công, copy inviteToken để lát nữa paste vào endpoint chấp nhận lời mời

Bước 6: Người dùng B tham gia workspace

Người dùng B:

- Đăng ký và đăng nhập tương tự A

- Gửi: POST /api/v1/workspaces/accept-invite/:token

Hệ thống kiểm tra token, xác minh email, tạo membership cho B và cập
nhật trạng thái invitation. Đồng thời phát sự kiện realtime
member:joined.

![](media/image270.png){width="6.267716535433071in"
height="3.736111111111111in"}

Ảnh đăng nhập user
[[khanhhuyen@gmail.com]{.underline}](mailto:khanhhuyen@gmail.com) để lấy
access token để chấp nhận lời mời

![](media/image271.png){width="6.267716535433071in"
height="2.8194444444444446in"}

Ảnh user
[[khanhhuyen@gmail.com]{.underline}](mailto:khanhhuyen@gmail.com) chấp
nhận lời mời tham gia Workspace Test 1 thành công

![](media/image272.png){width="6.267716535433071in"
height="0.6388888888888888in"}

Ảnh user
[[khanhhuyen@gmail.com]{.underline}](mailto:khanhhuyen@gmail.com) đã
được lưu vào table workspace_members

**Bước 7:** Tạo project

Người dùng A gửi:

- Endpoint: POST /api/v1/workspaces/:wsId/projects

Hệ thống kiểm tra membership và tạo project mới trong workspace.

![](media/image273.png){width="6.267716535433071in"
height="3.6527777777777777in"}\
Ảnh đăng nhập user
[[tuandat@gmail.com]{.underline}](mailto:tuandat@gmail.com) để tạo
project

![](media/image274.png){width="6.267716535433071in"
height="3.6944444444444446in"}

Ảnh lấy id của Workspace Test 1

![](media/image275.png){width="6.267716535433071in"
height="3.4722222222222223in"}Ảnh Response tạo Project Test 1 thuộc
Workspace Test 1 bởi user
[[tuandat@gmail.com]{.underline}](mailto:tuandat@gmail.com) thành công

![](media/image276.png){width="6.267716535433071in"
height="0.8888888888888888in"}

Ảnh Project Test 1 đã được lưu vào database thành công

**Bước 8:** Tạo task và phân công

Người dùng A thực hiện:

1.  Tạo task

    - POST /api/v1/projects/:projectId/tasks

    - Body: title, priority, dueDate

2.  Hệ thống tạo task và phát sự kiện realtime task:created.

3.  Phân công task

    - POST /api/v1/tasks/:id/assign

    - Body: userId của B

4.  Hệ thống kiểm tra B thuộc workspace và tạo bản ghi assignment.

![](media/image277.png){width="6.267716535433071in"
height="3.9583333333333335in"}

Ảnh Response tạo task thành công

![](media/image278.png){width="6.267716535433071in" height="3.625in"}

Ảnh gán task cho user
[[khanhhuyen@gmail.com]{.underline}](mailto:khanhhuyen@gmail.com) thành
công

**Bước 9:** Cập nhật trạng thái và quản lý subtask

Người dùng B:

- GET /api/v1/tasks/:id: xem chi tiết

- PATCH /api/v1/tasks/:id/status: cập nhật trạng thái

Hệ thống cập nhật trạng thái và phát sự kiện realtime.

![](media/image279.png){width="6.267716535433071in"
height="3.7777777777777777in"}

Ảnh user [[khanhuyen@gmail.com]{.underline}](mailto:khanhuyen@gmail.com)
lấy thông tin task

![](media/image280.png){width="6.267716535433071in"
height="3.6805555555555554in"}

Ảnh user
[[khanhhuyen@gmail.com]{.underline}](mailto:khanhhuyen@gmail.com) cập
nhật trạng thái task

Quản lý subtask:

- POST /api/v1/tasks/:id/subtasks

- GET /api/v1/tasks/:id/subtasks

- PATCH /api/v1/subtasks/:id/complete

- DELETE /api/v1/subtasks/:id

![](media/image281.png){width="6.267716535433071in" height="3.125in"}\
Ảnh user
[[khanhhuyen@gmail.com]{.underline}](mailto:khanhhuyen@gmail.com) tạo
subtask "Subtask Test 1" thuộc Task test 1 thành công

![](media/image282.png){width="6.267716535433071in"
height="3.1944444444444446in"}

Ảnh user
[[khanhhuyen@gmail.com]{.underline}](mailto:khanhhuyen@gmail.com) lấy
danh sách subtask của Task Test 1

![](media/image283.png){width="6.267716535433071in"
height="3.1527777777777777in"}

Ảnh user
[[khanhhuyen@gmail.com]{.underline}](mailto:khanhhuyen@gmail.com) bật
trạng thái hoàn thành của Subtask Test 1

![](media/image284.png){width="6.267716535433071in" height="3.25in"}

Ảnh danh sách subtask của Task Test 1 với trạng thái hoàn thành đã được
cập nhật thành "true"

![](media/image285.png){width="6.267716535433071in"
height="2.8055555555555554in"}

Ảnh user
[[khanhhuyen@gmail.com]{.underline}](mailto:khanhhuyen@gmail.com) xóa
subtask thành công

**Bước 10:** Comment và notification realtime

Người dùng B gửi:

- POST /api/v1/tasks/:taskId/comments

Hệ thống tạo comment, phát sự kiện comment:created và tạo notification
cho các user liên quan. Notification được gửi qua WebSocket.

Nếu reply:

- POST /api/v1/tasks/:taskId/comments/:parentId/reply

Hệ thống tạo comment con và gửi notification cho người liên quan.

\[Gợi ý ảnh: Comment + notification realtime\]

**Bước 11:** Đăng xuất và kiểm chứng token blacklist

Người dùng gửi:

- POST /api/v1/auth/logout

Hệ thống:

- Thu hồi refreshToken

- Lưu accessToken vào blacklist

Sau đó, nếu dùng lại token cũ (ví dụ GET /users/me), hệ thống trả về 401
Unauthorized.

\[Gợi ý ảnh: Logout + request fail\]

### 10.3.2. Kiểm chứng Token Blacklist

Sau khi thực hiện bước 11 (logout), thử sử dụng lại token cũ để truy cập
GET /api/v1/users/me. Hệ thống trả về response 401 Unauthorized:

> {\
> \"success\": false,\
> \"statusCode\": 401,\
> \"message\": \"Token is invalidated\",\
> \"path\": \"/api/v1/users/me\",\
> \"timestamp\": \"2026-03-28T010:00:00.000Z\"\
> }

Đây là minh chứng trực tiếp cho cơ chế Token Blacklist đã trình bày ở
Chương 7 --- token bị vô hiệu hóa ngay lập tức sau logout mà không cần
chờ hết hạn tự nhiên (15 phút).

> \*\[Dán ảnh: Màn hình Swagger UI --- request GET /users/me với token
> đã logout, response 401 \"Token is invalidated\"\]\*

### 10.3.3. Kiểm chứng Validation

Khi gửi request đăng ký với dữ liệu sai định dạng (email không hợp lệ,
password quá ngắn, thiếu field bắt buộc), ValidationPipe tự động kiểm
tra và trả về danh sách lỗi chi tiết:

> {\
> \"success\": false,\
> \"statusCode\": 400,\
> \"message\": \[\
> \"email must be an email\",\
> \"password must be longer than or equal to 6 characters\",\
> \"fullname should not be empty\"\
> \],\
> \"path\": \"/api/v1/auth/register\",\
> \"timestamp\": \"2026-03-28T010:00:00.000Z\"\
> }

Kết quả này minh chứng cho kỹ thuật Pipes đã trình bày ở Chương 6 ---
ValidationPipe kết hợp class-validator decorators trong DTO để validate
đầu vào tự động, trả về thông báo lỗi rõ ràng giúp client biết chính xác
cần sửa gì.

> \*\[Dán ảnh: Màn hình Swagger UI --- request POST /auth/register với
> dữ liệu sai, response 400 kèm danh sách lỗi\]\*

### 10.3.4. Chuẩn hóa Response

Mọi response thành công từ hệ thống đều tuân theo format chuẩn nhờ
TransformResponseInterceptor:\
{\
\"success\": true,\
\"data\": {\
\"id\": \"550e8400-e210b-41d4-a716-446655440000\",\
\"email\": \"vana@example.com\",\
\"name\": \"Nguyễn Văn A\",\
\"displayName\": \"Van A\",\
\"avatar\": null,\
\"status\": \"ACTIVE\"\
},\
\"timestamp\": \"2026-03-28T010:00:00.000Z\"\
}

Sự nhất quán này giúp frontend luôn biết cách parse response mà không
cần xử lý từng endpoint riêng biệt --- kiểm tra success: true/false là
đủ để phân biệt thành công hay thất bại

> \*\[Dán ảnh: Màn hình Swagger UI --- response thành công với format
> chuẩn {success, data, timestamp}\]\*

## **10.4. Hướng dẫn cài đặt và sử dụng**

### 10.4.1. Yêu cầu hệ thống

Để cài đặt và vận hành dự án, hệ thống cần đáp ứng các yêu cầu phần mềm
sau: Node.js phiên bản 18 trở lên (kiểm tra bằng node \--version), npm
phiên bản 10 trở lên (npm \--version), Docker Desktop phiên bản 4 trở
lên (docker \--version), và Git phiên bản bất kỳ (git \--version).

**10.4.2. Các bước cài đặt**

**Bước 1 --- Clone repository:**\
git clone https://github.com/Ttuandatt/Todolist-CCNLTHD.git\
cd Todolist-CCNLTHD

**Bước 2 --- Cài đặt dependencies cho Backend:**\
cd backend\
npm install

**Bước 3 --- Tạo file biến môi trường:**\
cp .env.example .env

Mở file .env và điền các giá trị cần thiết:\
\# Database (PostgreSQL qua Docker)\
DATABASE_URL=\"postgresql://postgres:123@localhost:5433/CCNLTHD_postgres\"\
\
\# JWT Secrets\
JWT_SECRET=\"your-super-secret-jwt-key\"\
JWT_EXPIRES_IN=\"15m\"\
JWT_REFRESH_SECRET=\"your-super-secret-refresh-key\"\
JWT_REFRESH_EXPIRES_IN=\"15d\"\
\
\# App\
PORT=3333\
FRONTEND_URL=\"http://localhost:5173\"\
\
\# Mail (Brevo --- gửi email đặt lại mật khẩu, xác nhận, chào mừng)\
\# MAIL_DRIVER=\"mock\" → in email ra console (dùng khi phát triển
local)\
\# MAIL_DRIVER=\"brevo\" → gửi email thật qua Brevo API (dùng khi triển
khai)\
MAIL_DRIVER=\"mock\"\
BREVO_API_KEY=\"your-brevo-api-key\"\
BREVO_SENDER_EMAIL=\"noreply@yourdomain.com\"\
BREVO_SENDER_NAME=\"TodoList Collaboration\"

**Bước 4 --- Khởi động PostgreSQL bằng Docker:**\
docker compose up -d

Kiểm tra container đang chạy bằng docker ps --- cổng 5433 phải được map
đến 5432 bên trong container.

> \*\[Dán ảnh: Terminal --- kết quả docker compose up -d và docker ps
> hiển thị container đang chạy\]\*

**Bước 5 --- Chạy Database Migration:**\
npx prisma migrate deploy

Lệnh này áp dụng toàn bộ migration đã có, tạo các bảng cần thiết trong
database.

**Bước 6 --- Generate Prisma Client:**\
npx prisma generate

**Bước 7 --- Khởi động Backend:**\
npm run start:dev

Khi thành công, terminal sẽ hiển thị thông báo kết nối database thành
công và ứng dụng đã khởi động.

> \*\[Dán ảnh: Terminal --- log khởi động NestJS với dòng \"Database
> connected successfully\" và \"Nest application successfully
> started\"\]\*

### 10.4.3. Hướng dẫn sử dụng

Sau khi khởi động thành công, hệ thống cung cấp các điểm truy cập sau:

> ● **API Base URL:** http://localhost:3333/api/v1 --- endpoint gốc cho
> mọi request API.
>
> ● **Swagger UI:** http://localhost:3333/api-docs --- giao diện tương
> tác cho phép test tất cả 44 endpoints, xem request/response schema, và
> thử nghiệm luồng sử dụng hoàn chỉnh.
>
> ● **Prisma Studio:** Chạy npx prisma studio rồi truy cập
> http://localhost:5555 --- giao diện đồ họa để xem, thêm, sửa, xóa dữ
> liệu trực tiếp trong database, hữu ích cho việc debug và kiểm tra dữ
> liệu.

Để test API qua Swagger UI, trước tiên gọi POST /auth/register hoặc POST
/auth/login để nhận access token. Sau đó click nút \"Authorize\" ở góc
trên bên phải, nhập Bearer \<token\>, và tất cả request tiếp theo sẽ tự
động đính kèm token xác thực.

> \*\[Dán ảnh: Giao diện Swagger UI --- tổng quan danh sách endpoints
> theo module (Auth, User, Workspace, Project, Task)\]\*
>
> \*\[Dán ảnh: Giao diện Prisma Studio --- hiển thị danh sách bảng và dữ
> liệu mẫu trong database\]\*

## **10.5. Kết quả kiểm thử đơn vị (Unit Testing)**

### 10.5.1. Phân công kiểm thử theo module (bảng thành viên)

  ----------- -------------- --------------------------------- ------------ ----------
    **Thành      **Module          **File test cần tạo**           **Số     **Số test
    viên**        test**                                        methods**      tối
                                                                             thiểu**

    **Đạt**    Auth + User         auth.service.spec.ts,       6 + 6 + 4 +   **\~40**
                                 auth.controller.spec.ts,       4 = **20**  
                                   user.service.spec.ts,                    
                                  user.controller.spec.ts                   

    **Vy**     Workspace +      workspace.service.spec.ts,      11 + 11 +    **\~50**
                 Project       workspace.controller.spec.ts,     9 + 9 =    
                                 project.service.spec.ts,         **40**    
                                project.controller.spec.ts                  

    **Phú**        Task            task.service.spec.ts,        14 + 14 =    **\~57**
                                  task.controller.spec.ts         **28**    

   **Huyền**    Comment +        comment.service.spec.ts,      2 + 2 + 1 +   **\~12**
               Notification     comment.controller.spec.ts,     1 = **6**   
                               notification.service.spec.ts,                
                              notification.controller.spec.ts               
  ----------- -------------- --------------------------------- ------------ ----------

**Tổng cộng:** \~159 test cases, bao phủ toàn bộ backend modules.

**Quy tắc chung:**

- Mỗi người làm trên **branch riêng**: feature/\<tên\>-unit-test (ví dụ:
  feature/phu-unit-test)

- Code xong → chạy npm run test → pass hết → commit → tạo PR vào develop

- **Đạt** review tất cả PR trước khi merge

### 10.5.2. Kết quả chạy kiểm thử (screenshot npm run test)

#### 10.5.2.1. Auth + User Module

##### A1. Kết quả kiểm thử AuthService

###### 1. Mô tả đối tượng kiểm thử

AuthService là service trung tâm của module xác thực, chịu trách nhiệm
xử lý toàn bộ luồng nghiệp vụ liên quan đến tài khoản người dùng trong
hệ thống TodoList Collaboration. Service này quản lý 6 phương thức
public bao gồm đăng ký tài khoản (register), đăng nhập (login), làm mới
token (refreshToken), đăng xuất (logout), yêu cầu đặt lại mật khẩu
(forgotPassword) và thực hiện đặt lại mật khẩu (resetPassword), cùng 1
phương thức private hỗ trợ là generateTokens.

AuthService phụ thuộc vào 4 dependency được inject qua constructor theo
cơ chế Dependency Injection của NestJS:

  ------------------- ----------------- ------------------------------------
  **Dependency**      **Vai trò**       **Các method được sử dụng**

  **PrismaService**   Truy cập cơ sở dữ user.findUnique, user.create,
                      liệu thông qua    user.update,
                      Prisma ORM        refreshToken.findUnique,
                                        refreshToken.create,
                                        refreshToken.update,
                                        refreshToken.updateMany,
                                        invalidatedToken.create,
                                        passwordReset.create,
                                        passwordReset.findUnique,
                                        passwordReset.update, \$transaction

  **JwtService**      Tạo và xác thực   signAsync, verifyAsync, decode
                      JSON Web Token    

  **MailService**     Gửi email thông   sendPasswordResetEmail
                      qua Brevo API     

  **ConfigService**   Đọc biến môi      get
                      trường (.env)     
  ------------------- ----------------- ------------------------------------

Ngoài ra, AuthService còn sử dụng 2 thư viện bên ngoài: **bcrypt** (hash
và so sánh mật khẩu) và **crypto** (tạo token reset ngẫu nhiên).

###### 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng phương pháp **unit test cô lập** (isolated unit
testing) theo mô hình Testing Pyramid (Chương 8.1.3), trong đó
AuthService được kiểm thử độc lập với toàn bộ dependency được thay thế
bằng mock object. Cách tiếp cận này đảm bảo rằng khi một test case thất
bại, nguyên nhân chắc chắn nằm trong logic nghiệp vụ của AuthService chứ
không phải do lỗi từ database, JWT library hay email service.

Các kỹ thuật cụ thể được áp dụng:

**Tạo môi trường test với TestingModule (Chương 8.2.2):** Sử dụng
Test.createTestingModule() từ \@nestjs/testing để tạo một NestJS module
giả lập. Trong module này, AuthService được đăng ký là provider thật,
còn tất cả dependency được đăng ký dưới dạng mock thông qua pattern {
provide: RealService, useValue: mockObject }. Khi NestJS khởi tạo
AuthService, cơ chế DI sẽ tự động inject các mock object thay vì service
thật.

**Mock function với jest.fn() (Chương 8.4.2):** Mỗi method của
dependency được thay thế bằng jest.fn() --- một hàm giả lập cho phép
kiểm soát giá trị trả về (mockResolvedValue, mockReturnValue) và theo
dõi lịch sử gọi (toHaveBeenCalledWith, toHaveBeenCalledTimes). Đối với
bcrypt và crypto, sử dụng jest.mock() ở cấp module để thay thế toàn bộ
thư viện trước khi import.

**Cấu trúc test Arrange-Act-Assert (Chương 8.3.1):** Mỗi test case được
tổ chức theo 3 bước rõ ràng: (1) **Arrange** --- thiết lập mock behavior
và dữ liệu đầu vào, (2) **Act** --- gọi method cần test, (3) **Assert**
--- kiểm tra kết quả trả về và xác nhận các dependency được gọi đúng
cách.

**Đảm bảo tính độc lập giữa các test:** Trước mỗi test case,
jest.clearAllMocks() được gọi trong beforeEach để reset toàn bộ mock về
trạng thái ban đầu, sau đó thiết lập lại các giá trị mock mặc định. Điều
này đảm bảo test A không ảnh hưởng đến kết quả của test B.

###### 3. Danh sách test case

Tổng cộng **16 test case** được viết cho 6 nhóm phương thức, bao phủ cả
luồng thành công (happy path) và các trường hợp lỗi (error cases):

**1. register() --- Đăng ký tài khoản**

  -------- ------------------- ---------------- ------------------------------
  **\#**   **Test case**       **Mô tả**        **Kết quả mong đợi**

  1        should register a   Đăng ký với      Trả về object chứa user (id,
           new user            email chưa tồn   email, name, avatar, status)
           successfully        tại, password    và tokens (accessToken,
                               hợp lệ           refreshToken, expiresIn).
                                                Password phải được hash qua
                                                bcrypt trước khi lưu DB.

  2        should throw        Đăng ký với      Throw ConflictException (HTTP
           ConflictException   email đã có      409). Không gọi user.create,
           if email already    trong hệ thống   không tạo token.
           exists                               
  -------- ------------------- ---------------- ------------------------------

Ở test case 1, ngoài việc kiểm tra giá trị trả về, bài test còn xác nhận
rằng: user.findUnique được gọi với đúng email để kiểm tra trùng lặp,
bcrypt.hash được gọi với password gốc và salt rounds = 10, user.create
nhận đúng data (bao gồm việc map dto.fullname thành field name trong
database, và truyền dto.displayName), và signAsync được gọi đúng 2 lần
để tạo cặp access/refresh token.

**2. login() --- Đăng nhập**

  -------- ----------------------- --------------- ---------------------------
  **\#**   **Test case**           **Mô tả**       **Kết quả mong đợi**

  3        should login            Đăng nhập đúng  Trả về user + tokens.
           successfully with       email và        lastLoginAt được cập nhật.
           correct credentials     password        

  4        should throw            Đăng nhập với   Throw UnauthorizedException
           UnauthorizedException   email không tồn (HTTP 401). Không gọi
           if user not found       tại             bcrypt.compare.

  5        should throw            Đăng nhập đúng  Throw
           UnauthorizedException   email nhưng sai UnauthorizedException.
           if password is wrong    password        Không cập nhật lastLoginAt.
  -------- ----------------------- --------------- ---------------------------

Điểm đáng chú ý trong thiết kế test: cả trường hợp \"email không tồn
tại\" và \"password sai\" đều throw cùng một loại exception
UnauthorizedException với message giống nhau (\"Email or password is not
correct\"). Đây là best practice bảo mật nhằm tránh cho attacker biết
email nào đã đăng ký trong hệ thống. Test case 5 sử dụng kỹ thuật
override mock --- ghi đè bcrypt.compare trả về false thay vì giá trị mặc
định true đã thiết lập trong beforeEach.

**3. refreshToken() --- Làm mới token**

  -------- ----------------------- ----------------- --------------------------
  **\#**   **Test case**           **Mô tả**         **Kết quả mong đợi**

  6        should return new       Token hợp lệ,     Trả về cặp token mới.
           tokens when refresh     chưa revoke, chưa Token cũ bị revoke (set
           token is valid          hết hạn           revokedAt).

  7        should throw            Token không tồn   Throw
           UnauthorizedException   tại trong DB      UnauthorizedException.
           if token not found                        

  8        should throw            Token tồn tại     Throw
           UnauthorizedException   nhưng expiresAt   UnauthorizedException.
           if token is expired     \< now            

  9        should throw            Token đã bị thu   Throw
           UnauthorizedException   hồi (revokedAt    UnauthorizedException.
           if token is revoked     !== null)         
  -------- ----------------------- ----------------- --------------------------

Nhóm test này kiểm tra đầy đủ 3 điều kiện reject của refresh token:
không tồn tại, đã hết hạn, và đã bị revoke. Kỹ thuật spread operator ({
\...mockStoredToken, expiresAt: \... }) được sử dụng để tạo biến thể từ
mock data gốc mà không cần khai báo lại toàn bộ object.

**4. logout() --- Đăng xuất**

  -------- ------------------ ------------------ ---------------------------
  **\#**   **Test case**      **Mô tả**          **Kết quả mong đợi**

  10       should revoke all  Logout với userId  Trả về { message: \"Logout
           tokens and return  và accessToken hợp successfully\" }. Tất cả
           success message    lệ                 refresh token bị revoke.
                                                 Access token bị blacklist.
  -------- ------------------ ------------------ ---------------------------

Test case này xác nhận 2 hành động quan trọng của logout: (1)
refreshToken.updateMany được gọi với filter { userId, revokedAt: null }
để chỉ revoke những token chưa bị revoke, và (2) invalidatedToken.create
được gọi để thêm access token vào blacklist với reason: \"LOGOUT\" và
expiresAt tính từ trường exp trong JWT payload.

**5. forgotPassword() --- Yêu cầu đặt lại mật khẩu**

  -------- ----------------------- --------------- -------------------------
  **\#**   **Test case**           **Mô tả**       **Kết quả mong đợi**

  11       should create reset     Email tồn tại   Tạo token reset trong DB,
           token and send email    trong hệ thống  gửi email chứa link
                                                   reset.

  12       should throw            Email không tồn Throw NotFoundException.
           NotFoundException if    tại             Không tạo token, không
           user does not exist                     gửi email.
  -------- ----------------------- --------------- -------------------------

Test case 11 sử dụng expect.stringContaining(\'mock_reset_token\') để
xác nhận reset link gửi qua email có chứa token đã tạo, mà không cần
kiểm tra toàn bộ URL (vì URL phụ thuộc vào biến môi trường
FRONTEND_URL). Token \"mock_reset_token\" là giá trị cố định từ
crypto.randomBytes đã được mock ở đầu file.

**6. resetPassword() --- Thực hiện đặt lại mật khẩu**

  -------- --------------------- ----------------- --------------------------
  **\#**   **Test case**         **Mô tả**         **Kết quả mong đợi**

  13       should reset password Token hợp lệ,     Hash password mới, cập
           successfully          chưa dùng, chưa   nhật trong transaction.
                                 hết hạn           Trả về success message.

  14       should throw          Token không tồn   Throw BadRequestException.
           BadRequestException   tại               
           if token not found                      

  15       should throw          Token đã hết hạn  Throw BadRequestException.
           BadRequestException   (expiresAt \<     
           if token is expired   now)              

  16       should throw          Token đã được sử  Throw BadRequestException.
           BadRequestException   dụng (usedAt !==  
           if token already used null)             
  -------- --------------------- ----------------- --------------------------

Test case 13 đặc biệt kiểm tra tính atomic của thao tác reset password:
việc cập nhật password và đánh dấu token đã dùng phải được thực hiện
trong cùng một \$transaction của Prisma. Mock \$transaction được
implement bằng Promise.all(promises) để giả lập hành vi thực thi tất cả
query trong transaction. Bài test xác nhận cả user.update (đổi password)
và passwordReset.update (set usedAt) đều được gọi đúng tham số.

###### 4. Kết quả chạy kiểm thử

**4.1. Kết quả tổng hợp**

Kết quả terminal sau khi chạy lệnh test AuthService:

'''

npx jest src/modules/auth/auth.service.spec.ts \--coverage
\--collectCoverageFrom=\"src/modules/auth/auth.service.ts\"

'''

![](media/image286.png){width="5.898869203849519in"
height="6.026042213473316in"}

![](media/image287.png){width="6.267716535433071in"
height="3.263888888888889in"}

Toàn bộ 16 test case đều **PASSED** trong thời gian 1.674 giây. Không có
test nào bị skip hay fail.

**4.2. Code Coverage cho auth.service.ts**

  ------------------ --------------- -----------------------------------
  **Chỉ số**         **Giá trị**     **Ý nghĩa**

  **Statements**     **97.01%**      97% câu lệnh trong file đã được
                                     thực thi ít nhất 1 lần

  **Branches**       **81.81%**      81.8% nhánh điều kiện (if/else,
                                     ternary) đã được kiểm tra

  **Functions**      **100%**        Tất cả 7 hàm (6 public + 1 private)
                                     đều được gọi

  **Lines**          **96.92%**      96.9% dòng code đã được bao phủ
  ------------------ --------------- -----------------------------------

**4.3. Phân tích các dòng chưa bao phủ**

Có 2 dòng trong auth.service.ts chưa được bao phủ bởi test:

  ---------- ------------------------ -------------------------------------
  **Dòng**   **Code**                 **Lý do chưa bao phủ**

  152        } catch { (trong         Nhánh catch khi
             refreshToken)            jwtService.verifyAsync throw error.
                                      Trong các test hiện tại, mock
                                      verifyAsync luôn resolve thành công
                                      hoặc flow bị reject trước khi đến
                                      bước verify.

  290        throw new Error(\'JWT    Nhánh xử lý khi ConfigService.get()
             secrets are not          trả về undefined cho JWT_SECRET hoặc
             defined\...\') (trong    JWT_REFRESH_SECRET. Mock
             generateTokens)          ConfigService luôn trả về giá trị hợp
                                      lệ.
  ---------- ------------------------ -------------------------------------

Hai dòng này thuộc về xử lý edge case: dòng 152 là catch block khi JWT
verification thất bại ở bước signature (sau khi đã pass kiểm tra DB), và
dòng 290 là guard clause bảo vệ khi biến môi trường chưa được cấu hình.
Cả hai đều không ảnh hưởng đến logic nghiệp vụ chính và có thể bổ sung
test case nếu cần nâng coverage lên 100%.

###### 5. Kiến thức Chương 8 đã áp dụng

Bảng dưới đây tổng hợp các kiến thức lý thuyết từ Chương 8 (Unit
Testing) và cách chúng được áp dụng cụ thể trong bài kiểm thử
AuthService:

  ----------- -------------------------- -----------------------------------
  **Mục       **Nội dung lý thuyết**     **Áp dụng thực tế trong AuthService
  Chương 8**                             test**

  8.1.3       Testing Pyramid --- unit   16 test case chạy trong \~1.7s,
              test là nền tảng, chiếm số không cần DB/network. Mọi
              lượng nhiều nhất, chạy     dependency đều mock.
              nhanh nhất                 

  8.2.2       TestingModule --- tạo      Test.createTestingModule({
              module NestJS giả lập cho  providers: \[\...\] }).compile()
              test                       trong beforeEach

  8.3.1       Cấu trúc                   1 describe gốc (AuthService), 6
              describe/it/beforeEach     describe con (register,
                                         login,\...), 16 it blocks, 1
                                         beforeEach

  8.4.2       jest.fn(),                 Mock bcrypt, crypto ở cấp module;
              mockResolvedValue,         mock methods với
              jest.mock()                mockResolvedValue/mockReturnValue

  8.4.3       Mock DI --- { provide: X,  4 dependency (Prisma, Jwt, Mail,
              useValue: mockX }          Config) được inject dưới dạng mock
                                         object

  8.5         Service test pattern ---   AuthService là service layer;
              mock DB layer, test        PrismaService (DB) hoàn toàn mock
              business logic             

  8.7         Code coverage --- đo lường npm run test:cov cho kết quả 97%
              mức độ bao phủ             Stmts, 100% Funcs, 96.9% Lines
  ----------- -------------------------- -----------------------------------

###### 6. Nhận xét và đánh giá

Bài kiểm thử AuthService đạt kết quả tốt với 16/16 test case passed và
code coverage cao (97% statements, 100% functions). Các test case bao
phủ đầy đủ cả luồng thành công và các trường hợp lỗi cho tất cả 6 phương
thức public của service, bao gồm các tình huống quan trọng như trùng
email khi đăng ký, sai mật khẩu khi đăng nhập, token hết hạn hoặc bị thu
hồi, và reset token không hợp lệ.

Điểm mạnh của bài test nằm ở việc mock được thiết kế sát với thực tế ---
chỉ mock đúng những method mà AuthService thực sự gọi, sử dụng đúng tên
method (ví dụ sendPasswordResetEmail thay vì sendVerificationEmail), và
assert đúng loại exception mà source code throw (ví dụ ConflictException
cho duplicate email thay vì BadRequestException). Việc mock bcrypt và
crypto ở cấp module giúp test chạy nhanh và deterministic mà không phụ
thuộc vào thuật toán hash thật.

Branch coverage đạt 81.81% --- thấp hơn so với các chỉ số khác --- do 2
nhánh edge case chưa được test: catch block khi JWT verify thất bại ở
bước signature và guard clause khi thiếu biến môi trường JWT. Đây là
những tình huống hiếm gặp trong thực tế nhưng có thể bổ sung thêm test
case để đạt coverage toàn diện hơn nếu cần.

##### A2. AuthController Test

###### 1. Mô tả đối tượng kiểm thử

AuthController là controller của module xác thực, đóng vai trò tiếp nhận
HTTP request từ client và chuyển tiếp (delegate) xuống AuthService để xử
lý. Controller này khai báo 6 endpoint tương ứng với 6 phương thức:

  ----------------------- ------------------ ----------------- ---------------------------------
  **Endpoint**            **Method**         **Decorator đặc   **Phương thức controller**
                                             biệt**            

  POST /auth/register     register()         \@Public() ---    Gọi authService.register(dto)
                                             không cần JWT     

  POST /auth/login        login()            \@Public(),       Gọi authService.login(dto)
                                             \@HttpCode(200)   

  POST /auth/refresh      refreshToken()     \@Public(),       Gọi authService.refreshToken(dto)
                                             \@HttpCode(200)   

  POST /auth/logout       logout()           \@HttpCode(200)   Gọi authService.logout(userId,
                                             --- cần JWT       accessToken)

  POST                    forgotPassword()   \@Public(),       Gọi
  /auth/forgot-password                      \@HttpCode(200)   authService.forgotPassword(dto)

  POST                    resetPassword()    \@Public(),       Gọi
  /auth/reset-password                       \@HttpCode(200)   authService.resetPassword(dto)
  ----------------------- ------------------ ----------------- ---------------------------------

AuthController chỉ phụ thuộc vào 1 dependency duy nhất là
**AuthService**, được inject qua constructor. Đa phần các method chỉ
nhận DTO từ \@Body() rồi delegate trực tiếp xuống service mà không có
thêm logic xử lý. Ngoại lệ duy nhất là method logout() --- ngoài việc
nhận userId từ \@CurrentUser(\'id\'), nó còn nhận authorization header
từ \@Headers(\'authorization\') và thực hiện strip prefix \"Bearer \" để
lấy raw JWT token trước khi truyền cho service.

###### 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng **Controller test pattern** (Chương 8.6.1) --- khác
biệt cơ bản so với Service test (A1):

  ---------------- ---------------------------- ------------------------
  **Tiêu chí**     **Service test (A1)**        **Controller test (A2)**

  Đối tượng test   AuthService (business logic) AuthController (HTTP
                                                layer)

  Mock gì          PrismaService, JwtService,   AuthService
                   MailService, ConfigService   

  Kiểm tra gì      Logic nghiệp vụ, exception   Delegation đúng method +
                   handling, data               đúng tham số
                   transformation               

  Số lượng mock    4 dependencies + 2 external  1 dependency
                   modules                      
  ---------------- ---------------------------- ------------------------

Controller được thiết kế theo nguyên tắc \"thin controller\" --- không
chứa business logic, chỉ đóng vai trò cầu nối giữa HTTP layer và service
layer. Do đó, mục tiêu của controller test là xác nhận rằng mỗi endpoint
gọi đúng method của service, truyền đúng tham số, và trả về đúng kết quả
mà service trả về.

Mock AuthService được tạo với jest.fn() cho tất cả 6 method, được inject
vào TestingModule thông qua pattern { provide: AuthService, useValue:
mockAuthService } (Chương 8.4.3). Mỗi test case sử dụng
mockResolvedValue để thiết lập giá trị trả về mong muốn, sau đó assert
rằng controller trả về đúng giá trị đó và service được gọi đúng cách.

###### 3. Danh sách test case

Tổng cộng **7 test case** bao phủ toàn bộ 6 method của controller:

**3.1. register()**

  -------- ---------------------- ---------------- ----------------------------
  **\#**   **Test case**          **Mô tả**        **Kết quả mong đợi**

  1        should call            Truyền           Controller trả về kết quả từ
           authService.register   RegisterDto,     service.
           and return result      kiểm tra         authService.register được
                                  delegation       gọi 1 lần với đúng DTO.
  -------- ---------------------- ---------------- ----------------------------

**3.2. login()**

  -------- -------------------- ---------------- ----------------------------
  **\#**   **Test case**        **Mô tả**        **Kết quả mong đợi**

  2        should call          Truyền LoginDto, Controller trả về kết quả từ
           authService.login    kiểm tra         service. authService.login
           and return result    delegation       được gọi 1 lần với đúng DTO.
  -------- -------------------- ---------------- ----------------------------

**3.3. refreshToken()**

  -------- -------------------------- ------------------ --------------------
  **\#**   **Test case**              **Mô tả**          **Kết quả mong đợi**

  3        should call                Truyền             Controller trả về
           authService.refreshToken   RefreshTokenDto    tokens mới từ
           and return result                             service.
  -------- -------------------------- ------------------ --------------------

**3.4. logout() --- Method duy nhất có logic**

  -------- ---------------------- ------------------ ----------------------
  **\#**   **Test case**          **Mô tả**          **Kết quả mong đợi**

  4        should strip Bearer    Authorization      Service nhận raw token
           prefix and call        header = \"Bearer  (không có \"Bearer \"
           authService.logout     eyJ\...\"          prefix).

  5        should handle          Header undefined   Service nhận undefined
           undefined              (edge case)        làm accessToken. Không
           authorization header                      throw error.
  -------- ---------------------- ------------------ ----------------------

Đây là nhóm test quan trọng nhất vì logout() là method duy nhất trong
controller có chứa logic xử lý: auth?.replace(\'Bearer \', \'\'). Test
case 4 xác nhận prefix \"Bearer \" được strip đúng cách. Test case 5
kiểm tra edge case khi không có authorization header --- toán tử
optional chaining auth?.replace() trả về undefined thay vì throw
TypeError, đảm bảo controller không crash trong tình huống bất thường.

**3.5. forgotPassword()**

  -------- ---------------------------- ------------------- -----------------
  **\#**   **Test case**                **Mô tả**           **Kết quả mong
                                                            đợi**

  6        should call                  Truyền              Controller trả về
           authService.forgotPassword   ForgotPasswordDto   success message
           and return result                                từ service.
  -------- ---------------------------- ------------------- -----------------

**3.6. resetPassword()**

  -------- --------------------------- ------------------ --------------------
  **\#**   **Test case**               **Mô tả**          **Kết quả mong đợi**

  7        should call                 Truyền             Controller trả về
           authService.resetPassword   ResetPasswordDto   success message từ
           and return result                              service.
  -------- --------------------------- ------------------ --------------------

**4. Kết quả chạy kiểm thử**

**4.1. Kết quả tổng hợp**

Kết quả terminal sau khi chạy lệnh test AuthController:

'''

npx jest src/modules/auth/auth.controller.spec.ts \--coverage
\--collectCoverageFrom=\"src/modules/auth/auth.controller.ts\"

'''

![](media/image288.png){width="6.267716535433071in"
height="3.4166666666666665in"}

Toàn bộ 7 test case đều **PASSED**.

**4.2. Code Coverage cho auth.controller.ts**

  ------------------- --------------- ----------------------------------
  **Chỉ số**          **Giá trị**     **Ý nghĩa**

  **Statements**      **100%**        Tất cả câu lệnh đã được thực thi

  **Branches**        **75%**         3/4 nhánh điều kiện đã được kiểm
                                      tra

  **Functions**       **100%**        Tất cả 6 method + constructor đều
                                      được gọi

  **Lines**           **100%**        Tất cả dòng code đã được bao phủ
  ------------------- --------------- ----------------------------------

**4.3. Phân tích nhánh chưa bao phủ**

Branch coverage đạt 75% do 1 nhánh chưa được kiểm tra trong biểu thức
auth?.replace(\'Bearer \', \'\') tại method logout(). Cụ thể, toán tử
optional chaining (?.) tạo ra 2 nhánh: (1) auth có giá trị → gọi
.replace(), và (2) auth là null/undefined → trả undefined. Bài test đã
kiểm tra cả trường hợp auth = \"Bearer xxx\" (test 4) và auth =
undefined (test 5), tuy nhiên coverage tool ghi nhận nhánh ngầm của
optional chaining khi auth là null riêng biệt. Đây là hạn chế kỹ thuật
của coverage tool với cú pháp optional chaining, không ảnh hưởng đến
chất lượng kiểm thử thực tế.

**5. Kiến thức Chương 8 đã áp dụng**

  --------------------------- ------------------------------------------
  **Mục Chương 8**            **Áp dụng trong AuthController test**

  8.2.2 --- TestingModule     Test.createTestingModule({ controllers:
                              \[AuthController\], providers: \[\...\] })

  8.3.1 ---                   1 describe gốc, 6 describe con, 7 it
  describe/it/beforeEach      blocks

  8.4.2 --- jest.fn()         Mock 6 methods của AuthService

  8.4.3 --- Mock DI           { provide: AuthService, useValue:
                              mockAuthService }

  8.6.1 --- Controller test   Mock service layer, verify delegation
  pattern                     (khác service test ở A1 mock DB layer)
  --------------------------- ------------------------------------------

**6. Nhận xét và đánh giá**

Bài kiểm thử AuthController đạt kết quả tối ưu với 7/7 test case passed
và coverage gần như tuyệt đối (100% statements, 100% functions, 100%
lines). Số lượng test case ít hơn so với AuthService (7 so với 16) là
hợp lý vì controller chỉ đóng vai trò delegation --- không chứa business
logic, nên không cần test nhiều error case.

Điểm đáng chú ý nhất của bài test là phần kiểm tra method logout() với 2
test case riêng. Đây là method duy nhất có logic ngoài việc delegate, và
bài test đã xác nhận đúng hành vi strip \"Bearer \" prefix cũng như xử
lý edge case khi authorization header không tồn tại. Điều này thể hiện
nguyên tắc quan trọng trong controller testing: tập trung test vào những
chỗ có logic thực sự, còn những method thuần delegation chỉ cần 1 test
case xác nhận delegation là đúng.

So sánh với A1 (AuthService test), bài test A2 minh họa rõ sự khác biệt
giữa 2 tầng trong kiến trúc NestJS: service test kiểm tra business logic
với nhiều mock phức tạp, trong khi controller test kiểm tra HTTP layer
với mock đơn giản hơn. Cả hai cùng sử dụng TestingModule và mock DI
nhưng ở mức độ trừu tượng khác nhau --- đúng theo nguyên tắc Testing
Pyramid.

##### A3. UserService Test

###### 1. Mô tả đối tượng kiểm thử

UserService là service quản lý hồ sơ người dùng trong hệ thống TodoList
Collaboration, cung cấp 4 phương thức xử lý các thao tác liên quan đến
thông tin cá nhân:

  -------------------------- -------------- ----------------------------
  **Phương thức**            **Chức năng**  **Nghiệp vụ chính**

  getProfile(userId)         Lấy thông tin  Tìm user theo ID, trả về các
                             hồ sơ          field đã chọn qua
                                            profileSelect

  updateProfile(userId, dto) Cập nhật hồ sơ Validate có ít nhất 1 field,
                                            update displayName và/hoặc
                                            bio

  changePassword(userId,     Đổi mật khẩu   Xác minh password cũ, kiểm
  dto)                                      tra password mới khác cũ,
                                            hash + update trong
                                            transaction

  uploadAvatar(userId, file) Upload ảnh đại Xóa avatar cũ (nếu có), lưu
                             diện           file mới, cập nhật DB
  -------------------------- -------------- ----------------------------

UserService chỉ phụ thuộc vào **PrismaService** để truy cập database.
Ngoài ra, nó sử dụng 2 thư viện bên ngoài: **bcrypt** (hash và so sánh
mật khẩu trong changePassword) và **fs.promises** (thao tác file hệ
thống trong uploadAvatar).

So với AuthService (A1), UserService có đặc thù riêng là tương tác với
file system (upload avatar) và có logic validation phức tạp trong
changePassword --- method này gọi bcrypt.compare hai lần với mục đích
khác nhau: lần 1 để xác minh password hiện tại, lần 2 để đảm bảo
password mới khác password cũ.

###### 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng **Service test pattern** (Chương 8.5) tương tự A1,
mock toàn bộ tầng database (PrismaService) và các thư viện bên ngoài
(bcrypt, fs) để cô lập business logic của UserService.

Điểm khác biệt so với A1 là việc mock thêm module fs --- thư viện
Node.js gốc dùng để thao tác file system. Mock fs.promises.unlink và
fs.promises.writeFile giúp test uploadAvatar mà không cần tạo/xóa file
thật trên đĩa, giữ cho test nhanh và không có side effect.

Trong test changePassword, kỹ thuật mockResolvedValueOnce được sử dụng
đặc biệt hiệu quả: bcrypt.compare được mock trả giá trị khác nhau cho 2
lần gọi liên tiếp --- lần 1 trả true (password hiện tại đúng), lần 2 trả
false (password mới khác password cũ). Kỹ thuật này cho phép kiểm tra
logic phân nhánh phức tạp trong cùng một method call.

###### 3. Danh sách test case

Tổng cộng **14 test case** bao phủ 4 phương thức:

**3.1. getProfile() --- Lấy hồ sơ người dùng**

  -------- ---------------------------- ----------------------------------
  **\#**   **Test case**                **Kết quả mong đợi**

  1        should return user profile   Trả về profile object với đúng các
           when user exists             field từ profileSelect

  2        should throw                 Throw NotFoundException (HTTP 404)
           NotFoundException if user    
           not found                    
  -------- ---------------------------- ----------------------------------

**3.2. updateProfile() --- Cập nhật hồ sơ**

  -------- ----------------------------- ---------------------------------
  **\#**   **Test case**                 **Kết quả mong đợi**

  3        should update displayName and Gọi user.update với data: {
           return updated profile        displayName }, trả profile mới

  4        should update bio and return  Gọi user.update với data: { bio
           updated profile               }, trả profile mới

  5        should throw                  Throw BadRequestException khi DTO
           BadRequestException if no     rỗng. Không gọi user.update.
           fields provided               
  -------- ----------------------------- ---------------------------------

Test case 3 và 4 kiểm tra riêng từng field để xác nhận logic spread
operator \...(dto.displayName ? {\...} : {}) hoạt động đúng --- chỉ
field được cung cấp mới xuất hiện trong data. Test case 5 kiểm tra guard
clause đầu method: nếu cả displayName và bio đều không có, service
reject ngay mà không truy cập database.

**3.3. changePassword() --- Đổi mật khẩu**

  -------- ------------------------------ ---------------------------------
  **\#**   **Test case**                  **Kết quả mong đợi**

  6        should change password         Hash password mới, update trong
           successfully                   \$transaction, revoke tất cả
                                          refresh tokens

  7        should throw                   Throw lỗi ngay, không query DB
           BadRequestException if confirm 
           password does not match        

  8        should throw NotFoundException Throw NotFoundException
           if user not found              

  9        should throw                   bcrypt.compare trả false → throw
           BadRequestException if current lỗi
           password is wrong              

  10       should throw                   bcrypt.compare trả true cả 2 lần
           BadRequestException if new     → throw lỗi
           password same as current       
  -------- ------------------------------ ---------------------------------

Đây là nhóm test phức tạp nhất với 5 test case cho 5 nhánh khác nhau.
Method changePassword có 4 điểm validation trước khi thực hiện đổi
password: (1) confirmPassword khớp newPassword, (2) user tồn tại, (3)
currentPassword đúng, (4) newPassword khác currentPassword. Mỗi điểm
validation tương ứng với 1 test case lỗi. Test case 6 (thành công) xác
nhận cả việc hash password mới lẫn revoke tất cả refresh tokens trong
transaction --- logic bảo mật quan trọng buộc user phải đăng nhập lại
sau khi đổi password.

**3.4. uploadAvatar() --- Upload ảnh đại diện**

  -------- ------------------------------ --------------------------------
  **\#**   **Test case**                  **Kết quả mong đợi**

  11       should upload avatar           Ghi file mới, update DB, trả
           successfully (no previous      profile có avatar
           avatar)                        

  12       should delete old avatar       Gọi fs.unlink với path avatar cũ
           before uploading new one       trước khi ghi file mới

  13       should throw                   Throw lỗi khi file là null
           BadRequestException if no file 
           provided                       

  14       should throw NotFoundException Throw NotFoundException
           if user not found              
  -------- ------------------------------ --------------------------------

Test case 12 đặc biệt quan trọng --- nó xác nhận rằng khi user đã có
avatar cũ, file cũ phải bị xóa bằng fs.promises.unlink trước khi lưu
file mới. Đây là logic ngăn chặn file rác tích lũy trên server.

###### 4. Kết quả chạy kiểm thử

**4.1. Kết quả tổng hợp**

Kết quả terminal sau khi chạy lệnh test UserService:

'''

npx jest src/modules/user/user.service.spec.ts \--coverage
\--collectCoverageFrom=\"src/modules/user/user.service.ts\"

'''

![](media/image289.png){width="6.267716535433071in" height="3.875in"}

Toàn bộ 14 test case đều **PASSED** trong thời gian dưới 1 giây.

**4.2. Code Coverage cho user.service.ts**

  ------------------------------------- --------------------------------
  **Chỉ số**                            **Giá trị**

  **Statements**                        **100%**

  **Branches**                          **96.42%**

  **Functions**                         **100%**

  **Lines**                             **100%**
  ------------------------------------- --------------------------------

**4.3. Phân tích nhánh chưa bao phủ**

Branch coverage đạt 96.42% --- dòng 17 (constructor) được coverage tool
ghi nhận là chưa bao phủ 1 nhánh ngầm. Đây là nhánh tự động sinh ra bởi
TypeScript cho constructor injection pattern constructor(private prisma:
PrismaService) khi compile sang JavaScript. Nhánh này không ảnh hưởng
đến logic nghiệp vụ và không thể test trực tiếp.

###### 5. Kiến thức Chương 8 đã áp dụng

  --------------------------- ------------------------------------------
  **Mục Chương 8**            **Áp dụng trong UserService test**

  8.2.2 --- TestingModule     Tạo module test với 1 dependency mock
                              (PrismaService)

  8.3.1 ---                   4 describe con (getProfile, updateProfile,
  describe/it/beforeEach      changePassword, uploadAvatar)

  8.4.2 --- jest.mock()       Mock bcrypt (hash/compare) và fs
                              (unlink/writeFile) ở cấp module

  8.4.2 ---                   Mock bcrypt.compare trả giá trị khác nhau
  mockResolvedValueOnce       cho 2 lần gọi liên tiếp trong
                              changePassword

  8.4.3 --- Mock DI           { provide: PrismaService, useValue:
                              mockPrismaService }

  8.5 --- Service test        Mock toàn bộ DB layer + file system, test
                              business logic thuần
  --------------------------- ------------------------------------------

###### 6. Nhận xét và đánh giá

Bài kiểm thử UserService đạt kết quả xuất sắc với 14/14 test case passed
và code coverage gần tuyệt đối (100% statements, 100% functions, 100%
lines, 96.42% branches). Thời gian chạy cực nhanh (dưới 1 giây) nhờ mock
toàn bộ I/O (database và file system).

Điểm mạnh nổi bật của bài test là việc xử lý method changePassword ---
một method có 4 điểm validation liên tiếp, mỗi điểm đều được kiểm tra
bằng test case riêng. Đặc biệt, kỹ thuật mockResolvedValueOnce cho
bcrypt.compare minh họa rõ cách mock cùng một hàm nhưng trả giá trị khác
nhau cho mỗi lần gọi --- một kỹ thuật cần thiết khi method under test
gọi cùng dependency nhiều lần với mục đích khác nhau.

Nhóm test uploadAvatar cũng đáng chú ý vì đây là trường hợp duy nhất
trong project cần mock file system (module fs). Việc mock
fs.promises.unlink và fs.promises.writeFile cho phép kiểm thử logic
upload mà không tạo file thật, giữ cho test suite không có side effect
và có thể chạy trên bất kỳ môi trường nào.

So với AuthService test (A1 --- 16 test case), UserService test có số
lượng tương đương (14 test case) nhưng coverage cao hơn (100% vs 97%
statements). Điều này phản ánh đúng thực tế: UserService có ít edge case
\"không thể trigger\" hơn (không có catch block ẩn hay guard clause cho
config thiếu như AuthService).

##### A4. UserController Test

###### 1. Mô tả đối tượng kiểm thử

UserController là controller quản lý hồ sơ người dùng, tiếp nhận HTTP
request và delegate xuống UserService. Tất cả endpoint đều yêu cầu JWT
authentication thông qua \@UseGuards(JwtAuthGuard) đặt ở cấp controller.

  --------------------------- ---------- ------------------ --------------------------------------
  **Endpoint**                **HTTP     **Phương thức      **Đặc biệt**
                              Method**   controller**       

  GET /users/me               GET        getProfile()       Lấy userId từ \@CurrentUser(\'id\')

  PATCH /users/me             PATCH      updateProfile()    Nhận DTO từ \@Body()

  PATCH                       PATCH      changePassword()   Nhận DTO từ \@Body()
  /users/me/change-password                                 

  POST /users/me/avatar       POST       uploadAvatar()     \@UseInterceptors(FileInterceptor) +
                                                            \@UploadedFile(ParseFilePipe)
  --------------------------- ---------- ------------------ --------------------------------------

UserController chỉ phụ thuộc vào **UserService** duy nhất. Tương tự
AuthController (A2), đây là thin controller --- tất cả 4 method đều chỉ
delegate xuống service mà không có logic xử lý thêm. Điểm khác biệt là
method uploadAvatar sử dụng FileInterceptor và ParseFilePipe với
MaxFileSizeValidator --- tuy nhiên đây là các thành phần framework chạy
ở tầng middleware/pipe, không nằm trong scope unit test của controller.

###### 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng **Controller test pattern** (Chương 8.6.1) giống
A2: mock UserService, kiểm tra delegation.

Một lưu ý kỹ thuật quan trọng trong quá trình viết test: UserController
sử dụng **absolute import** (src/modules/auth/guards/jwt-auth.guard thay
vì relative path ../../auth/guards/\...). Jest mặc định không resolve
được absolute import. Để giải quyết, cần thêm moduleNameMapper vào cấu
hình Jest trong package.json:

> \"moduleNameMapper\": {\
> \"\^src/(.\*)\$\": \"\<rootDir\>/\$1\"\
> }

Cấu hình này map path src/xxx thành \<rootDir\>/xxx (với rootDir là
src/), cho phép Jest resolve absolute import giống cách TypeScript
compiler xử lý.

###### 3. Danh sách test case

Tổng cộng **4 test case** bao phủ toàn bộ 4 method:

  -------- ---------------- ---------------------------- ------------------------
  **\#**   **Method**       **Test case**                **Kết quả mong đợi**

  1        getProfile       should call                  Service nhận đúng
                            userService.getProfile and   userId, controller trả
                            return result                đúng profile

  2        updateProfile    should call                  Service nhận đúng
                            userService.updateProfile    userId + DTO, controller
                            and return result            trả đúng profile cập
                                                         nhật

  3        changePassword   should call                  Service nhận đúng
                            userService.changePassword   userId + DTO, controller
                            and return result            trả success message

  4        uploadAvatar     should call                  Service nhận đúng
                            userService.uploadAvatar and userId + file object,
                            return result                controller trả profile
                                                         có avatar mới
  -------- ---------------- ---------------------------- ------------------------

Vì controller không chứa logic xử lý (khác với logout trong
AuthController có strip \"Bearer \"), mỗi method chỉ cần 1 test case để
xác nhận delegation. Các trường hợp lỗi (user not found, password sai,
file thiếu\...) đã được kiểm tra kỹ ở tầng service (A3 --- 14 test
case).

###### 4. Kết quả chạy kiểm thử

**4.1. Kết quả tổng hợp**

Kết quả terminal sau khi chạy lệnh test UserService:

'''

npx jest src/modules/user/user.controller.spec.ts \--coverage
\--collectCoverageFrom=\"src/modules/user/user.controller.ts\"

'''

![](media/image290.png){width="5.6336975065616794in"
height="2.590538057742782in"}

Toàn bộ 4 test case đều **PASSED**.

**4.2. Code Coverage cho user.controller.ts**

  -------------------------------------- -------------------------------
  **Chỉ số**                             **Giá trị**

  Statements                             100%

  Branches                               64.7%

  Functions                              100%

  Lines                                  100%
  -------------------------------------- -------------------------------

**4.3. Phân tích nhánh chưa bao phủ**

Branch coverage đạt 64.7% --- thấp hơn so với các file khác nhưng 100%
statements và lines đều đạt. Nguyên nhân là do coverage tool đếm các
nhánh ngầm (implicit branches) được sinh ra bởi các decorator của
NestJS: \@UseGuards(JwtAuthGuard), \@UseInterceptors(FileInterceptor),
\@ParseFilePipe, \@MaxFileSizeValidator. Những decorator này tạo ra
metadata và conditional logic ở tầng framework --- chúng được thực thi
bởi NestJS runtime chứ không phải bởi controller code trực tiếp, do đó
không thể và không cần bao phủ trong unit test.

Đây là hạn chế chung khi đo coverage cho NestJS controller có nhiều
decorator. Trong thực tế, 100% statements + 100% functions + 100% lines
cho thấy toàn bộ logic do developer viết đã được kiểm thử.

###### 5. Kiến thức Chương 8 đã áp dụng

  ----------------------------- ----------------------------------------
  **Mục Chương 8**              **Áp dụng trong UserController test**

  8.2.2 --- TestingModule       Test.createTestingModule({ controllers:
                                \[\...\], providers: \[\...\] })

  8.3.1 ---                     4 describe con, 4 it blocks
  describe/it/beforeEach        

  8.4.3 --- Mock DI             { provide: UserService, useValue:
                                mockUserService }

  8.6.1 --- Controller test     Mock service layer, verify delegation
  pattern                       (không test HTTP decorators)
  ----------------------------- ----------------------------------------

###### 6. Nhận xét và đánh giá

Bài kiểm thử UserController hoàn thành tốt vai trò với 4/4 test case
passed và coverage tối đa cho các chỉ số quan trọng (100% statements,
functions, lines). Số lượng test case ít (4 test case) là phù hợp với
nguyên tắc thin controller --- không có business logic cần test nhiều
nhánh.

Bài test này cũng phát hiện và giải quyết một vấn đề cấu hình quan
trọng: Jest không resolve được absolute import src/\... mà
UserController sử dụng. Việc thêm moduleNameMapper vào Jest config không
chỉ giải quyết cho file test này mà còn cho tất cả test file trong tương
lai có import từ absolute path --- một thiết lập cần thiết cho toàn bộ
dự án.

So sánh với AuthController test (A2 --- 7 test case), UserController
test có ít test case hơn vì không có method nào chứa logic ngoài
delegation. Branch coverage thấp hơn (64.7% vs 75%) nhưng hoàn toàn do
decorator framework, không phải do thiếu test cho logic nghiệp vụ.

#### 10.5.2.2. Workspace + Project Module (Mai Vy)

##### B1. Kết quả kiểm thử WorkspaceService

###### 1. Mô tả đối tượng kiểm thử

WorkspaceService là service trung tâm của module quản lý không gian làm
việc (workspace), đảm nhận toàn bộ nghiệp vụ liên quan đến vòng đời của
một workspace trong hệ thống TodoList Collaboration. Service này triển
khai 11 phương thức public: tạo workspace (create), lấy danh sách
workspace của user (findAllForUser), xem chi tiết (findOne), cập nhật
thông tin (update), xóa workspace (remove), tạo lời mời thành viên
(createInvite), chấp nhận lời mời (acceptInvite), lấy danh sách thành
viên (getMembers), đổi quyền thành viên (changeMemberRole), xóa thành
viên (removeMember), và tự rời workspace (leaveWorkspace).

WorkspaceService phụ thuộc vào 2 dependency được inject qua constructor
theo cơ chế Dependency Injection của NestJS: PrismaService để truy cập
cơ sở dữ liệu và EventsService để phát sự kiện real-time đến các client
đang kết nối. Trong số các method trên, create và acceptInvite sử dụng
\$transaction của Prisma để đảm bảo tính toàn vẹn dữ liệu khi thao tác
trên nhiều bảng cùng lúc --- đây là đặc điểm kỹ thuật đặc biệt cần xử lý
riêng trong quá trình mock.

  ---------------- ------------------------------ ---------------------------
  **Dependency**   **Vai trò**                    **Prisma delegate được sử
                                                  dụng**

  PrismaService    Truy cập cơ sở dữ liệu qua     workspace (create,
                   Prisma ORM                     findMany, findUnique,
                                                  update, delete),
                                                  workspaceMember
                                                  (findUnique, findMany,
                                                  create, update, delete,
                                                  deleteMany),
                                                  workspaceInvite (create,
                                                  findUnique, update,
                                                  delete), user (findUnique),
                                                  task (groupBy),
                                                  \$transaction

  EventsService    Phát sự kiện WebSocket         emitToWorkspace, emitToUser
                   real-time                      
  ---------------- ------------------------------ ---------------------------

###### 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng phương pháp unit test cô lập theo mô hình Testing
Pyramid (Chương 8.1.3), toàn bộ WorkspaceService được kiểm thử hoàn toàn
độc lập với database thật và WebSocket server. Thay vì xây dựng
TestingModule như pattern thông thường, WorkspaceService được khởi tạo
trực tiếp bằng new WorkspaceService(prismaService, eventsService) trong
beforeEach --- một cách tiếp cận nhanh và hiệu quả khi service không có
logic khởi tạo phức tạp, đồng thời vẫn đảm bảo mock được inject hoàn
toàn.

Một điểm kỹ thuật nổi bật trong bài test này là cách mock \$transaction
của Prisma. Phương thức này có 2 signature: nhận callback function (dành
cho create) hoặc nhận mảng Promise (dành cho acceptInvite). Mock được
implement để xử lý cả hai trường hợp:

+:----------------------------------------------------------------------+
| \$transaction: jest.fn((cbOrArray) =\> {                              |
|                                                                       |
| if (Array.isArray(cbOrArray)) return Promise.all(cbOrArray);          |
|                                                                       |
| return cbOrArray(mockPrismaService);                                  |
|                                                                       |
| }),                                                                   |
+-----------------------------------------------------------------------+

Kỹ thuật này cho phép test create --- nơi callback nhận tx (Prisma
transaction client) làm tham số và gọi tx.workspace.create,
tx.workspaceMember.create --- hoạt động chính xác vì mock \$transaction
tự truyền chính mockPrismaService làm tx. Đối với acceptInvite,
Promise.all được dùng để giải quyết mảng Promise từ các lệnh Prisma
riêng lẻ.

Kỹ thuật mockResolvedValueOnce được sử dụng rộng rãi trong các method có
logic kiểm tra quyền nhiều bước như changeMemberRole và removeMember ---
những method gọi workspaceMember.findUnique hai lần liên tiếp với mục
đích khác nhau (lần 1 kiểm tra quyền của người thực hiện, lần 2 tìm
thành viên đích). Nhờ mockResolvedValueOnce, mỗi lần gọi trả về giá trị
khác nhau mà không cần phải khai báo lại mock.

###### 3. Danh sách test case

Tổng cộng 35 test case được viết cho 11 nhóm phương thức, bao phủ cả
happy path lẫn error cases, đặc biệt tập trung vào các trường hợp kiểm
tra phân quyền (OWNER/ADMIN/MEMBER):

**a) create() --- Tạo workspace**

  -------- --------------------------- ------------------------------------
  **\#**   **Test case**               **Kết quả mong đợi**

  1        should create a new         Trả về workspace. workspace.create
           workspace                   và workspaceMember.create được gọi
                                       trong transaction với đúng data
                                       (role: \'OWNER\').

  2        should throw an error if    Khi database throw lỗi, error
           transaction fails           propagate ra ngoài.
           (rollback)                  
  -------- --------------------------- ------------------------------------

Test case 1 xác nhận đồng thời 3 điều: workspace được tạo với đúng
ownerId, record workspaceMember được tạo tự động với role OWNER, và toàn
bộ thao tác diễn ra trong một \$transaction duy nhất đảm bảo atomicity.

**b) findAllForUser() --- Lấy danh sách workspace**

  -------- ------------------------------- ---------------------------------
  **\#**   **Test case**                   **Kết quả mong đợi**

  3        should find all workspaces for  workspace.findMany được gọi với
           a user                          where: { members: { some: {
                                           userId } } } và include: { owner:
                                           \... }. Trả về mảng workspaces.

  4        should return empty array when  Trả về \[\] khi user chưa join
           user has no workspaces          workspace nào.
  -------- ------------------------------- ---------------------------------

**c) findOne() --- Xem chi tiết workspace**

  -------- ------------------------------------ ----------------------------
  **\#**   **Test case**                        **Kết quả mong đợi**

  5        should find a workspace by id        Trả về workspace kèm members
                                                và owner.

  6        should throw NotFoundException when  Throw NotFoundException.
           workspace is not found               

  7        should throw ForbiddenException when Workspace tồn tại nhưng user
           user is not a member                 không trong danh sách
                                                members → Throw
                                                ForbiddenException.
  -------- ------------------------------------ ----------------------------

**d) update() --- Cập nhật workspace**

  -------- ------------------------------------ ----------------------------
  **\#**   **Test case**                        **Kết quả mong đợi**

  8        should update a workspace            Trả về workspace sau khi cập
                                                nhật.

  9        should throw NotFoundException when  Throw NotFoundException.
           workspace is not found               

  10       should throw ForbiddenException when Throw ForbiddenException.
           user is not a member                 

  11       should throw ForbiddenException when role: \'MEMBER\' không đủ
           user is not an owner                 quyền → Throw
                                                ForbiddenException.
  -------- ------------------------------------ ----------------------------

Test case 11 kiểm tra logic phân quyền của update: chỉ OWNER hoặc ADMIN
mới được sửa workspace. Test dùng member với role: \'MEMBER\' để xác
nhận hệ thống từ chối đúng loại exception.

**e) remove() --- Xóa workspace**

  -------- ------------------------------------ ----------------------------
  **\#**   **Test case**                        **Kết quả mong đợi**

  12       should remove a workspace            Trả về { message: \'Xóa
                                                workspace thành công\' }.

  13       should throw NotFoundException when  Throw NotFoundException.
           workspace is not found               

  14       should throw ForbiddenException when Chỉ OWNER mới xóa được →
           user is not an owner                 Throw ForbiddenException.
  -------- ------------------------------------ ----------------------------

Điểm khác biệt so với update: remove chỉ cho phép OWNER xóa (không có
ADMIN), test case 14 kiểm tra điều này bằng cách set ownerId của
workspace khác với userId đang thực hiện.

**f) createInvite() --- Tạo lời mời thành viên**

  -------- ------------------------------------ ----------------------------
  **\#**   **Test case**                        **Kết quả mong đợi**

  15       should invite a member to a          Trả về { message,
           workspace                            inviteToken }.
                                                workspaceInvite.create được
                                                gọi với đúng data. Token
                                                được generate ngẫu nhiên.

  16       should throw NotFoundException when  Throw NotFoundException.
           workspace is not found               

  17       should throw ForbiddenException when Throw ForbiddenException.
           user is not a member                 

  18       should throw ForbiddenException when role: \'MEMBER\' không được
           user is not an owner                 phép mời → Throw
                                                ForbiddenException.
  -------- ------------------------------------ ----------------------------

Test case 15 sử dụng expect(result.inviteToken).toBeDefined() thay vì so
sánh giá trị cụ thể, vì token được tạo bởi crypto.randomBytes bên trong
service --- một cách kiểm tra linh hoạt, đúng tinh thần của unit test
(không test implementation detail của crypto).

**g) acceptInvite() --- Chấp nhận lời mời**

  -------- --------------------------- -------------------------------------
  **\#**   **Test case**               **Kết quả mong đợi**

  19       should accept an invitation Tạo member mới và đánh dấu invite
                                       ACCEPTED trong transaction.
                                       eventsService.emitToWorkspace được
                                       gọi với event member:joined.

  20       should throw                Throw NotFoundException.
           NotFoundException when      
           invitation is not found     

  21       should throw                Email user ≠ email trong invite →
           ForbiddenException when     Throw ForbiddenException.
           invitation is not for this  
           user                        

  22       should throw                expiresAt \< now → Throw
           ForbiddenException if       ForbiddenException.
           invitation is expired       
  -------- --------------------------- -------------------------------------

Test case 19 xác nhận eventsService.emitToWorkspace được gọi đúng
payload { workspaceId, userId, role: \'MEMBER\' } --- đây là hành vi
real-time quan trọng, thông báo cho các thành viên khác biết có người
vừa gia nhập.

**h) getMembers() --- Lấy danh sách thành viên**

  -------- ---------------------------------- ------------------------------
  **\#**   **Test case**                      **Kết quả mong đợi**

  23       should get members of a workspace  workspaceMember.findMany được
                                              gọi với orderBy: { joinedAt:
                                              \'asc\' }. Trả về danh sách
                                              members.

  24       should throw ForbiddenException if workspaceMember.findUnique trả
           user is not a member               null → Throw
                                              ForbiddenException.
  -------- ---------------------------------- ------------------------------

**i) changeMemberRole() --- Đổi quyền thành viên**

  -------- ---------------------------------- ------------------------------
  **\#**   **Test case**                      **Kết quả mong đợi**

  25       should allow OWNER to change       OWNER đổi role của MEMBER →
           member role                        Trả về member với role mới.

  26       should throw ForbiddenException if ADMIN không được đổi role →
           requester is not OWNER             Throw ForbiddenException.

  27       should throw ForbiddenException if OWNER không tự đổi role của
           changing own role                  mình → Throw
                                              ForbiddenException.

  28       should throw NotFoundException if  Thành viên đích không tồn tại
           target member not found            → Throw NotFoundException.
  -------- ---------------------------------- ------------------------------

Nhóm test này là phức tạp nhất về logic phân quyền. Đặc biệt, test case
27 kiểm tra business rule quan trọng: ngay cả OWNER cũng không thể tự
thay đổi role của chính mình --- một guardrail ngăn OWNER vô tình tự
giáng cấp.

**k) leaveWorkspace() --- Rời workspace**

  -------- --------------------------------- ------------------------------
  **\#**   **Test case**                     **Kết quả mong đợi**

  29       should allow a member to leave a  workspaceMember.delete được
           workspace                         gọi. Trả về { message: \'Bạn
                                             đã rời khỏi workspace\' }.

  30       should throw NotFoundException    Member record không tồn tại →
           when workspace is not found       Throw NotFoundException.

  31       should throw ForbiddenException   OWNER không thể rời → Throw
           when user is the owner            ForbiddenException.
  -------- --------------------------------- ------------------------------

**l) removeMember() --- Xóa thành viên**

  -------- --------------------------------- ------------------------------
  **\#**   **Test case**                     **Kết quả mong đợi**

  32       should remove a member from a     OWNER xóa MEMBER thành công.
           workspace                         workspaceMember.delete được
                                             gọi đúng id.

  33       should throw ForbiddenException   MEMBER không có quyền xóa →
           when user has no right            Throw ForbiddenException.

  34       should throw NotFoundException    Thành viên cần xóa không tồn
           when target member is not found   tại → Throw NotFoundException.

  35       should throw ForbiddenException   Không thể xóa OWNER → Throw
           when trying to remove owner       ForbiddenException.
  -------- --------------------------------- ------------------------------

###### 4. Kết quả chạy kiểm thử

*4.1. Kết quả tổng hợp*

Kết quả terminal sau khi chạy lệnh test WorkspaceService:

  -----------------------------------------------------------------------
  npx jest src/modules/workspace/workspace.service.spec.ts \--coverage
  \--collectCoverageFrom=\"modules/workspace/workspace.service.ts\"

  -----------------------------------------------------------------------

![](media/image291.png){width="6.267716535433071in"
height="5.319444444444445in"}

Toàn bộ 35 test case đều PASSED. Không có test nào bị skip hay fail.

*4.2. Code Coverage cho workspace.service.ts*

  ------------ -------------- --------------------------------------------
  **Chỉ số**   **Giá trị**    **Ý nghĩa**

  Statements   96.96%         Gần như toàn bộ câu lệnh đã được thực thi

  Branches     91.04%         Phần lớn nhánh điều kiện đã được kiểm tra

  Functions    100%           Tất cả 11 phương thức public đều được gọi

  Lines        98.78%         Gần như toàn bộ dòng code đã được bao phủ
  ------------ -------------- --------------------------------------------

**Uncovered Line:** 268

*4.3. Phân tích các nhánh chưa bao phủ*

Branch coverage đạt 91.04% --- rất cao --- với statement coverage 96.96%
nhưng line coverage 98.78% cho thấy chỉ có vài dòng code hoặc một số
nhánh hiếm gặp chưa được kiểm tra. Dòng code còn lại (268) chưa được
cover là edge case hiếm xảy ra trong luồng sử dụng thông thường. Toàn bộ
luồng chính, error handling, và logic phân quyền đều đã được bao phủ kỹ
lưỡng.

###### 5. Kiến thức Chương 8 đã áp dụng

  --------------- ---------------------------------- -------------------------------------
  **Mục Chương    **Nội dung lý thuyết**             **Áp dụng thực tế trong
  8**                                                WorkspaceService test**

  8.1.3           Testing Pyramid --- unit test      35 test case chạy không cần
                  không phụ thuộc I/O bên ngoài      DB/WebSocket. Mock hoàn toàn 2
                                                     dependency.

  8.3.1           Cấu trúc                           afterEach(() =\>
                  describe/it/beforeEach/afterEach   jest.clearAllMocks()) đảm bảo state
                                                     cô lập giữa các test.

  8.4.2           jest.fn(), mockResolvedValueOnce   Mock workspaceMember.findUnique trả
                                                     giá trị khác nhau cho 2 lần gọi liên
                                                     tiếp trong changeMemberRole,
                                                     removeMember.

  8.4.3           Mock DI --- inject dependency qua  Dùng new
                  constructor                        WorkspaceService(mockPrismaService,
                                                     mockEventsService) thay vì
                                                     TestingModule.

  8.5             Service test --- mock DB layer,    PrismaService và EventsService hoàn
                  test business logic                toàn mock. Test tập trung vào logic
                                                     phân quyền.

  8.7             Code coverage                      Đạt 96.67% Statements, 100%
                                                     Functions, 98.78% Lines.

  Kỹ thuật bổ     Mock \$transaction với 2 signature Callback pattern cho create;
  sung                                               Promise.all pattern cho acceptInvite.
  --------------- ---------------------------------- -------------------------------------

###### 6. Nhận xét và đánh giá

Bài kiểm thử WorkspaceService đạt kết quả xuất sắc với 35 test case
passed và code coverage vô cùng cao (96.96% statements, 91.04% branches,
100% functions, 98.78% lines). Điểm mạnh nổi bật của bài test là độ phủ
toàn diện cho logic phân quyền --- vốn là phần nghiệp vụ cốt lõi và phức
tạp nhất của WorkspaceService. Hệ thống phân quyền OWNER/ADMIN/MEMBER
được kiểm tra đầy đủ qua 4 nhóm method liên quan đến quản lý thành viên
(changeMemberRole, removeMember, leaveWorkspace, createInvite), mỗi nhóm
có test case riêng cho từng vai trò bị từ chối.

Kỹ thuật mock \$transaction xử lý cả 2 overload (callback và mảng
Promise) là điểm kỹ thuật đáng chú ý, giải quyết được thách thức khi
cùng một method trong Prisma có behavior khác nhau tùy vào cách gọi. Nhờ
đó, create và acceptInvite --- hai method sử dụng hai dạng transaction
khác nhau --- đều được kiểm thử chính xác mà không cần thêm file config
hay setup phức tạp.

##### B2. Kết quả kiểm thử WorkspaceController

###### 1. Mô tả đối tượng kiểm thử

WorkspaceController là controller của module workspace, tiếp nhận HTTP
request và delegate toàn bộ xuống WorkspaceService. Controller này khai
báo 11 endpoint xử lý đầy đủ vòng đời của workspace và quản lý thành
viên:

  ---------------------------------------- -------------- ---------------------
  **Endpoint**                             **HTTP         **Phương thức
                                           Method**       controller**

  POST /workspaces                         POST           create()

  GET /workspaces                          GET            findAll()

  GET /workspaces/:id                      GET            findOne()

  PATCH /workspaces/:id                    PATCH          update()

  DELETE /workspaces/:id                   DELETE         remove()

  POST /workspaces/:id/invite              POST           createInvite()

  POST /workspaces/invite/:token           POST           acceptInvite()

  GET /workspaces/:id/members              GET            getMembers()

  PATCH                                    PATCH          changeMemberRole()
  /workspaces/:id/members/:memberId/role                  

  DELETE /workspaces/:id/members/:memberId DELETE         removeMember()

  DELETE /workspaces/:id/leave             DELETE         leaveWorkspace()
  ---------------------------------------- -------------- ---------------------

WorkspaceController chỉ phụ thuộc vào WorkspaceService duy nhất. Tất cả
11 method đều áp dụng mô hình thin controller --- không chứa business
logic, chỉ nhận params từ decorators (@CurrentUser, \@Param, \@Body) và
delegate thẳng xuống service tương ứng.

###### 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng Controller test pattern (Chương 8.6.1): mock
WorkspaceService với 11 jest.fn() tương ứng 11 method, inject vào
TestingModule qua pattern { provide: WorkspaceService, useValue:
mockWorkspaceService }. Mục tiêu không phải kiểm tra business logic (đã
được V1 bao phủ kỹ) mà là xác nhận controller đóng vai trò cầu nối chính
xác --- gọi đúng service method, truyền đúng tham số, và trả về đúng kết
quả.

###### 3. Danh sách test case

Tổng cộng 11 test case, mỗi endpoint một test kiểm tra delegation:

  -------- ------------------ ----------------------------------- -----------------------
  **\#**   **Method**         **Test case**                       **Kết quả mong đợi**

  1        create             should delegate to                  Service nhận (userId,
                              workspaceService.create             dto). Controller trả
                                                                  đúng kết quả.

  2        findAll            should delegate to                  Service nhận (userId).
                              workspaceService.findAllForUser     

  3        findOne            should delegate to                  Service nhận (userId,
                              workspaceService.findOne            workspaceId).

  4        update             should delegate to                  Service nhận (userId,
                              workspaceService.update             workspaceId, dto).

  5        remove             should delegate to                  Service nhận (userId,
                              workspaceService.remove             workspaceId). Trả về
                                                                  success message.

  6        createInvite       should delegate to                  Service nhận (userId,
                              workspaceService.createInvite       workspaceId, dto). Trả
                                                                  về inviteToken.

  7        acceptInvite       should delegate to                  Service nhận (userId,
                              workspaceService.acceptInvite       token).

  8        getMembers         should delegate to                  Service nhận (userId,
                              workspaceService.getMembers         workspaceId). Trả về
                                                                  danh sách.

  9        changeMemberRole   should delegate to                  Service nhận (userId,
                              workspaceService.changeMemberRole   workspaceId, memberId,
                                                                  dto).

  10       removeMember       should delegate to                  Service nhận (userId,
                              workspaceService.removeMember       workspaceId, memberId).

  11       leaveWorkspace     should delegate to                  Service nhận (userId,
                              workspaceService.leaveWorkspace     workspaceId). Trả về
                                                                  message.
  -------- ------------------ ----------------------------------- -----------------------

Mỗi test case đều verify đồng thời 3 điều: (1) giá trị trả về của
controller đúng với giá trị service trả về, (2) đúng service method được
gọi với đúng tham số (toHaveBeenCalledWith), và (3) service chỉ được gọi
đúng 1 lần (toHaveBeenCalledTimes(1)).

###### 4. Kết quả chạy kiểm thử

*4.1. Kết quả tổng hợp*

  -----------------------------------------------------------------------
  npx jest src/modules/workspace/workspace.controller.spec.ts \--coverage
  \--collectCoverageFrom=\"modules/workspace/workspace.controller.ts\"

  -----------------------------------------------------------------------

![](media/image292.png){width="6.267716535433071in" height="5.25in"}

Toàn bộ 11 test case đều PASSED.

*4.2. Code Coverage cho workspace.controller.ts*

  --------------- -----------------
  **Chỉ số**      **Giá trị**

  Statements      100%

  Branches        75%

  Functions       100%

  Lines           100%
  --------------- -----------------

WorkspaceController đạt coverage tuyệt đối 100% trên Statements,
Functions, và Lines. Branch coverage 75% là do các điều kiện trong
NestJS framework decorators không được test kỹ (không phải logic
controller). Đây là kết quả hợp lý vì controller không chứa điều kiện
phân nhánh trong các method --- toàn bộ logic là delegation thẳng xuống
service.

###### 5. Kiến thức Chương 8 đã áp dụng

  -------------------------- --------------------------------------------
  **Mục Chương 8**           **Áp dụng trong WorkspaceController test**

  8.2.2 --- TestingModule    Test.createTestingModule({ controllers:
                             \[WorkspaceController\], providers: \[\...\]
                             })

  8.3.1 ---                  11 describe con (1 per method), 11 it
  describe/it/beforeEach     blocks, jest.clearAllMocks() trong
                             beforeEach

  8.4.2 --- jest.fn()        Mock 11 methods của WorkspaceService với
                             jest.fn()

  8.4.3 --- Mock DI          { provide: WorkspaceService, useValue:
                             mockWorkspaceService }

  8.6.1 --- Controller test  Mock service layer, verify delegation (không
  pattern                    test business logic)
  -------------------------- --------------------------------------------

###### 6. Nhận xét và đánh giá

Bài kiểm thử WorkspaceController hoàn thành xuất sắc với 11/11 test case
passed và coverage rất cao (100% trên Statements/Functions/Lines). Số
lượng test case bằng đúng số lượng endpoint là phù hợp với nguyên tắc
thin controller --- mỗi endpoint chỉ cần 1 test xác nhận delegation,
không cần test nhiều error case vì business logic đã được kiểm tra kỹ ở
tầng service (B1 với 35 test case).

##### B3. Kết quả kiểm thử ProjectService

###### 1. Mô tả đối tượng kiểm thử

ProjectService quản lý nghiệp vụ liên quan đến dự án (project) trong một
workspace, cung cấp 9 phương thức public: tạo project (create), lấy danh
sách project trong workspace (findAllByWorkspace), xem chi tiết kèm
thống kê task (findOne), cập nhật thông tin (update), xóa project
(remove), lưu trữ (archive), khôi phục từ lưu trữ (unarchive), ghim
project (pin), và bỏ ghim (unpin). Ngoài ra, service còn có 3 phương
thức private dùng chung: checkWorkspaceMembership,
checkWorkspaceAdminRole, và findProjectOrThrow --- các helper này được
gọi ở đầu mỗi method public để validate quyền và đảm bảo entity tồn tại
trước khi xử lý.

ProjectService chỉ phụ thuộc vào PrismaService duy nhất. Điểm đặc biệt
của service này là phương thức findOne --- ngoài việc lấy thông tin
project, còn gọi thêm task.groupBy để tổng hợp số lượng task theo từng
status (TODO, IN_PROGRESS, REVIEW, DONE) và trả về dưới dạng object
thống kê taskCountByStatus.

  ----------------- -----------------------------------------------------
  **Dependency**    **Prisma delegate sử dụng**

  PrismaService     project (create, findMany, findUnique, update,
                    delete), workspaceMember (findUnique), task (groupBy)
  ----------------- -----------------------------------------------------

###### 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng Service test pattern (Chương 8.5): TestingModule
được tạo với ProjectService là provider thật và PrismaService được thay
thế bằng mockPrismaService. Toàn bộ mock được reset trước mỗi test bằng
jest.clearAllMocks() trong beforeEach.

Một đặc điểm trong thiết kế test là cách tổ chức nhóm test theo thứ tự
business flow thay vì theo thứ tự số. Các test case archive (case 12-13)
được đặt ngay sau create (case 1-2) trong file spec, sau đó mới đến
findAllByWorkspace (case 3-4), findOne (case 5-7). Điều này phản ánh quá
trình phát triển test case theo từng sprint --- các test được bổ sung
dần và được comment rõ số case tương ứng với kế hoạch kiểm thử.

###### 3. Danh sách test case

Tổng cộng 18 test case bao phủ đủ 9 phương thức public:

**a) create() --- Tạo project**

  -------- -------------------------------- -------------------------------
  **\#**   **Test case**                    **Kết quả mong đợi**

  1        Tạo project thành công           checkWorkspaceMembership pass.
                                            project.create được gọi với
                                            đúng data. Trả về project.

  2        User không phải thành viên       workspaceMember.findUnique trả
           Workspace → Báo lỗi Forbidden    null → Throw
                                            ForbiddenException.
                                            project.create không được gọi.
  -------- -------------------------------- -------------------------------

Test case 1 xác nhận đồng thời workspaceMember.findUnique được gọi (kiểm
tra membership) và project.create được gọi sau đó. Test case 2 xác nhận
guard clause hoạt động: khi không tìm thấy membership, service dừng ngay
và không tiếp tục tạo project.

**b) findAllByWorkspace() --- Lấy danh sách project**

  -------- ---------------------------- ------------------------------------
  **\#**   **Test case**                **Kết quả mong đợi**

  3        Lấy danh sách project thành  project.findMany được gọi với
           công                         where.workspaceId và orderBy: \[{
                                        isPinned: \'desc\' }, { createdAt:
                                        \'desc\' }\].

  4        User không phải thành viên → project.findMany không được gọi.
           Báo lỗi Forbidden            
  -------- ---------------------------- ------------------------------------

Test case 3 xác nhận thứ tự sắp xếp: project được ghim (isPinned: true)
luôn xuất hiện trên cùng, sau đó sắp xếp theo thời gian tạo mới nhất ---
đây là business rule quan trọng ảnh hưởng đến UX.

**c) findOne() --- Lấy chi tiết project**

  -------- ------------------------------- --------------------------------
  **\#**   **Test case**                   **Kết quả mong đợi**

  5        Lấy chi tiết project thành công Trả về project kèm
           (kèm taskCountByStatus)         taskCountByStatus: { TODO: 3,
                                           IN_PROGRESS: 0, REVIEW: 0, DONE:
                                           5 }.

  6        Project không tồn tại → Báo lỗi project.findUnique trả null →
           NotFound                        Throw NotFoundException.

  7        User không phải thành viên      Throw ForbiddenException.
           workspace → Báo lỗi Forbidden   
  -------- ------------------------------- --------------------------------

Test case 5 là test phức tạp nhất trong bài: mock task.groupBy trả về
\[{ status: \'TODO\', \_count: 3 }, { status: \'DONE\', \_count: 5 }\]
và xác nhận service tổng hợp đúng thành object với giá trị mặc định 0
cho các status không có task (IN_PROGRESS, REVIEW).

**d) update() --- Cập nhật project**

  -------- ------------------------------------ ---------------------------
  **\#**   **Test case**                        **Kết quả mong đợi**

  8        Cập nhật project thành công          project.update được gọi với
                                                { where: { id }, data: dto
                                                }.

  9        Project không tồn tại → Báo lỗi      Throw NotFoundException.
           NotFound                             
  -------- ------------------------------------ ---------------------------

**e) remove() --- Xóa project**

  -------- ----------------------------------- ---------------------------
  **\#**   **Test case**                       **Kết quả mong đợi**

  10       Xóa project thành công              Trả về { message: \'Xóa
           (Owner/Admin)                       project thành công\' }.
                                               project.delete được gọi.

  11       Không phải Owner/Admin → Báo lỗi    MEMBER không được xóa
           Forbidden                           project → Throw
                                               ForbiddenException.
                                               project.delete không được
                                               gọi.
  -------- ----------------------------------- ---------------------------

**f) archive() --- Lưu trữ project**

  -------- ---------------------------------- ----------------------------
  **\#**   **Test case**                      **Kết quả mong đợi**

  12       Lưu trữ thành công (Đổi status →   project.update được gọi với
           ARCHIVED)                          data: { status: \'ARCHIVED\'
                                              }. Kết quả có status:
                                              \'ARCHIVED\'.

  13       Không phải Owner/Admin → Báo lỗi   Throw ForbiddenException.
           Forbidden                          
  -------- ---------------------------------- ----------------------------

**g) unarchive() --- Khôi phục project**

  -------- ---------------------------------- ----------------------------
  **\#**   **Test case**                      **Kết quả mong đợi**

  14       Khôi phục thành công (Đổi status → project.update được gọi với
           ACTIVE)                            data: { status: \'ACTIVE\'
                                              }.

  15       Project đã ACTIVE rồi thì không    Project với status:
           cần unarchive → Báo lỗi Forbidden  \'ACTIVE\' → Throw
                                              ForbiddenException.
  -------- ---------------------------------- ----------------------------

Test case 15 kiểm tra guard clause trong unarchive: nếu project đã ở
trạng thái ACTIVE, service từ chối thao tác bằng ForbiddenException thay
vì âm thầm bỏ qua --- giúp client biết thao tác không hợp lệ.

**h) pin() --- Ghim project**

  -------- ----------------------------------- ----------------------------
  **\#**   **Test case**                       **Kết quả mong đợi**

  16       Ghim project thành công             project.update được gọi với
                                               data: { isPinned: true }.
                                               Kết quả có isPinned: true.

  17       Project đã ghim rồi → Báo lỗi       isPinned: true trong DB →
           Forbidden                           Throw ForbiddenException.
  -------- ----------------------------------- ----------------------------

**i) unpin() --- Bỏ ghim project**

  -------- ------------------------ --------------------------------------
  **\#**   **Test case**            **Kết quả mong đợi**

  18       Bỏ ghim project thành    project.update được gọi với data: {
           công                     isPinned: false }. Kết quả có
                                    isPinned: false.
  -------- ------------------------ --------------------------------------

###### 4. Kết quả chạy kiểm thử

*4.1. Kết quả tổng hợp*

  -----------------------------------------------------------------------
  npx jest src/modules/project/project.service.spec.ts \--coverage
  \--collectCoverageFrom=\"modules/project/project.service.ts\"

  -----------------------------------------------------------------------

![](media/image293.png){width="5.770833333333333in"
height="6.322916666666667in"}

Toàn bộ 18 test case đều PASSED trong thời gian dưới 1,5 giây.

*4.2. Code Coverage cho project.service.ts*

  -------------------- --------------------
  **Chỉ số**           **Giá trị**

  Statements           96.55%

  Branches             83.33%

  Functions            100%

  Lines                96.42
  -------------------- --------------------

Uncovered Lines: 153, 201

*4.3. Phân tích các nhánh chưa bao phủ*

Branch coverage đạt 83.33% --- cao và đủ --- nhưng không hoàn toàn 100%
do một số nhánh điều kiện trong hàm private checkWorkspaceAdminRole và
các guard clause chưa được kích hoạt từ tất cả đường dẫn. Cụ thể, các
dòng 153 và 201 chưa được cover là những edge case có thể xảy ra nhưng
không được test hiện tại (ví dụ: tổ hợp role + status hiếm gặp, hoặc
nhánh query filter tùy chọn). Các nhánh này không ảnh hưởng đến luồng
chính nhưng có thể bổ sung thêm test nếu cần nâng coverage lên 100%.

###### 5. Kiến thức Chương 8 đã áp dụng

  ------------------------- ---------------------------------------------
  **Mục Chương 8**          **Áp dụng trong ProjectService test**

  8.2.2 --- TestingModule   Test.createTestingModule({ providers:
                            \[ProjectService, { provide: PrismaService,
                            useValue: mock }\] })

  8.3.1 ---                 Mỗi test case có comment rõ 3 bước
  Arrange-Act-Assert        Arrange/Act/Assert, giúp dễ đọc và maintain

  8.4.2 ---                 Mock project.findUnique,
  mockResolvedValue         workspaceMember.findUnique, task.groupBy với
                            dữ liệu cụ thể

  8.4.3 --- Mock DI         { provide: PrismaService, useValue:
                            mockPrismaService }

  8.5 --- Service test      Mock DB layer, test business logic bao gồm
  pattern                   các hàm private helper

  8.7 --- Code coverage     96.55% Statements, 100% Functions, 96.42%
                            Lines
  ------------------------- ---------------------------------------------

###### 6. Nhận xét và đánh giá

Bài kiểm thử ProjectService đạt kết quả tốt với 18/18 test case passed
và code coverage cao (96.55% statements, 100% functions, 96.42% lines).
Bài test bao phủ đầy đủ 9 phương thức public, bao gồm các chức năng đặc
thù của module như archive/unarchive và pin/unpin --- những tính năng ít
gặp hơn trong các CRUD API thông thường.

Điểm mạnh của bài test là cách kiểm tra phương thức findOne với tổng hợp
taskCountByStatus. Test này mock task.groupBy với output thực tế và xác
nhận service xử lý đúng --- bao gồm việc khởi tạo tất cả status về 0
trước khi populate từ kết quả groupBy, đảm bảo các status không có task
vẫn xuất hiện trong response với giá trị 0 thay vì undefined. Đây là
business logic tinh tế có ý nghĩa thực tế với UI frontend --- nếu thiếu
test này, một refactoring vô ý có thể phá vỡ hành vi này mà không được
phát hiện.

Branch coverage 83.33% xuất sắc cho một service phức tạp. Toàn bộ luồng
nghiệp vụ chính --- tạo, đọc, cập nhật, xóa, archive, pin --- cùng với
các trường hợp lỗi phổ biến nhất đều đã được bao phủ đầy đủ.

##### B4. Kết quả kiểm thử ProjectController

###### 1. Mô tả đối tượng kiểm thử

ProjectController là controller của module project, tiếp nhận HTTP
request và delegate xuống ProjectService. Controller này khai báo 9
endpoint tương ứng 9 chức năng của module:

  -------------------------------- --------------- ------------------------
  **Endpoint**                     **HTTP Method** **Phương thức
                                                   controller**

  POST /projects/:workspaceId      POST            create()

  GET /projects/:workspaceId       GET             findAll()

  GET /projects/detail/:id         GET             findOne()

  PATCH /projects/detail/:id       PATCH           update()

  DELETE /projects/detail/:id      DELETE          remove()

  PATCH                            PATCH           archive()
  /projects/detail/:id/archive                     

  PATCH                            PATCH           unarchive()
  /projects/detail/:id/unarchive                   

  PATCH /projects/detail/:id/pin   PATCH           pin()

  PATCH /projects/detail/:id/unpin PATCH           unpin()
  -------------------------------- --------------- ------------------------

Tương tự WorkspaceController, đây là thin controller --- tất cả 9 method
đều delegate thẳng xuống service tương ứng mà không có logic xử lý bổ
sung.

###### 2. Phương pháp kiểm thử

Bài kiểm thử áp dụng Controller test pattern (Chương 8.6.1) giống B2:
mock ProjectService với 9 jest.fn(), tạo TestingModule với controllers:
\[ProjectController\] và inject mock service vào. Mỗi test case triển
khai đầy đủ 3 bước Arrange-Act-Assert với comment rõ ràng, đóng vai trò
vừa là tài liệu vừa là bản hướng dẫn cho các thành viên khác hiểu cách
viết controller test.

###### 3. Danh sách test case

Tổng cộng 9 test case, mỗi endpoint một test:

  -------- ------------ ----------------------------------- ------------------------------------
  **\#**   **Method**   **Test case**                       **Verify**

  1        create       should delegate to                  service.create(userId, workspaceId,
                        projectService.create               dto) được gọi đúng 1 lần

  2        findAll      should delegate to                  service.findAllByWorkspace(userId,
                        projectService.findAllByWorkspace   workspaceId, query)

  3        findOne      should delegate to                  service.findOne(userId, id)
                        projectService.findOne              

  4        update       should delegate to                  service.update(userId, id, dto)
                        projectService.update               

  5        remove       should delegate to                  service.remove(userId, id)
                        projectService.remove               

  6        archive      should delegate to                  service.archive(userId, id)
                        projectService.archive              

  7        unarchive    should delegate to                  service.unarchive(userId, id)
                        projectService.unarchive            

  8        pin          should delegate to                  service.pin(userId, id)
                        projectService.pin                  

  9        unpin        should delegate to                  service.unpin(userId, id)
                        projectService.unpin                
  -------- ------------ ----------------------------------- ------------------------------------

###### 4. Kết quả chạy kiểm thử

*4.1. Kết quả tổng hợp*

  -----------------------------------------------------------------------
  npx jest src/modules/project/project.controller.spec.ts \--coverage
  \--collectCoverageFrom=\"modules/project/project.controller.ts\"

  -----------------------------------------------------------------------

![](media/image294.png){width="6.267716535433071in"
height="4.791666666666667in"}

Toàn bộ 9 test case đều PASSED.

*4.2. Code Coverage cho project.controller.ts*

  ----------------------------------- -----------------------------------
  Chỉ số                              Giá trị

  Statements                          100%

  Branches                            75%

  Functions                           100%

  Lines                               100%
  ----------------------------------- -----------------------------------

ProjectController đạt coverage hoàn hảo 100% trên Statements, Functions,
và Lines. Branch coverage 75% là do các điều kiện trong NestJS framework
decorators không được test kỹ (không phải logic controller). Kết quả này
nhất quán với cấu trúc thin controller --- không có conditional logic
trong các method, mỗi dòng code đều được thực thi bởi test case tương
ứng.

###### 5. Kiến thức Chương 8 đã áp dụng

  -------------------------- --------------------------------------------
  **Mục Chương 8**           **Áp dụng trong ProjectController test**

  8.2.2 --- TestingModule    Test.createTestingModule({ controllers:
                             \[ProjectController\], providers: \[\...\]
                             })

  8.3.1 ---                  9 describe con, 9 it blocks với comment
  describe/it/beforeEach     Arrange-Act-Assert rõ ràng

  8.4.2 --- jest.fn() +      Verify controller truyền đúng params, gọi
  toHaveBeenCalledWith       đúng 1 lần

  8.4.3 --- Mock DI          { provide: ProjectService, useValue:
                             mockProjectService }

  8.6.1 --- Controller test  Mock service, verify delegation --- không
  pattern                    test HTTP decorators hay business logic
  -------------------------- --------------------------------------------

###### 6. Nhận xét và đánh giá

Bài kiểm thử ProjectController hoàn thành hoàn hảo với 9/9 test case
passed và coverage rất cao (100% trên Statements/Functions/Lines). Mỗi
test case ghi rõ 3 bước \"BƯỚC A: Arrange\", \"BƯỚC B: Act\", \"BƯỚC C:
Assert\" kèm giải thích ngắn gọn, vừa hoạt động đúng về mặt kỹ thuật vừa
có giá trị như tài liệu hóa, giúp các developer mới hiểu ngay cách áp
dụng controller test pattern mà không cần đọc thêm tài liệu.

So sánh tổng thể giữa B1-B4 với A1-A4, nhóm Workspace + Project (73 test
case tổng) có quy mô lớn hơn nhóm Auth + User (41 test case) --- phản
ánh đúng sự phức tạp nghiệp vụ hơn của module workspace với hệ thống
phân quyền OWNER/ADMIN/MEMBER và các chức năng quản lý thành viên đa
dạng. Việc phân kỳ test cases theo mô hình service test (nhiều test
case, nhiều error scenarios) và controller test (ít test case, chỉ
verify delegation) áp dụng nhất quán xuyên suốt toàn bộ phần kiểm thử,
đúng theo nguyên tắc Testing Pyramid đã trình bày ở Chương 8.

#### 10.5.2.3. Task Module (Văn Phú)

#### 10.5.2.4. Comment + Notification Module (Khánh Huyền)

##### D1. Kết quả kiểm thử CommentService

###### Mô tả đối tượng kiểm thử

###### Phương pháp kiểm thử

###### Danh sách test case

###### Kết quả chạy kiểm thử

###### Kiến thức chương 8 đã áp dụng

###### Nhận xét và đánh giá 

##### D2. Kết quả kiểm thử CommentController

###### Mô tả đối tượng kiểm thử

###### Phương pháp kiểm thử

###### Danh sách test case

###### Kết quả chạy kiểm thử

###### Kiến thức chương 8 đã áp dụng

###### Nhận xét và đánh giá 

##### D3. Kết quả kiểm thử NotificationService

###### Mô tả đối tượng kiểm thử

###### Phương pháp kiểm thử

###### Danh sách test case

###### Kết quả chạy kiểm thử

###### Kiến thức chương 8 đã áp dụng

###### Nhận xét và đánh giá 

##### D4. Kết quả kiểm thử NotificationController

###### Mô tả đối tượng kiểm thử

###### Phương pháp kiểm thử

###### Danh sách test case

###### Kết quả chạy kiểm thử

###### Kiến thức chương 8 đã áp dụng

###### Nhận xét và đánh giá 

### 10.5.3. Báo cáo Code Coverage (screenshot npm run test:cov)

### 10.5.4. Phân tích kết quả (nhận xét, đánh giá)

## **10.6. Tổng kết**

Chương này đã trình bày sản phẩm tổng hợp TodoList Collaboration dưới
bốn góc nhìn. Về cấu trúc mã nguồn, dự án được tổ chức theo mô hình
Infrastructure-separated Architecture với 8 feature modules (Auth, User,
Workspace, Project, Task, Comment, Notification, Events) và 3 shared
services dùng chung (Prisma, Mail, Common). Về tích hợp kỹ thuật, toàn
bộ 36 kỹ thuật đã học đều được áp dụng vào đồ án, đạt tỷ lệ tích hợp
100% trên 7 nhóm kiến thức --- bao gồm cả WebSocket real-time và gửi
email giao dịch qua Brevo. Về kết quả vận hành, hệ thống chạy được luồng
chính end-to-end với đầy đủ endpoints, có minh chứng cụ thể cho Token
Blacklist, Validation và chuẩn hóa Response. Về khả năng triển khai,
hướng dẫn cài đặt 7 bước cho phép bất kỳ ai có đủ công cụ đều có thể
chạy thử hệ thống trên máy local.

# **Phần 5: Tổng kết**

## **Chương 11: Đánh giá và tổng kết**

**11.1. So sánh với mục tiêu ban đầu: Đã làm được bao nhiêu % so với dự
định?**

Dựa trên phạm vi ban đầu (ứng dụng TodoList Collaboration dùng NestJS,
đầy đủ phân tích -- báo cáo -- backend các module chính -- testing),
nhóm tự đánh giá:

- Phần tài liệu & phân tích yêu cầu, kiến trúc, báo cáo: hoàn thành
  khoảng 90--95%. Các tài liệu chính (PRD, phân tích yêu cầu, kiến trúc,
  báo cáo các chương 1--10, hướng phát triển, tài liệu testing...) đều
  đã có; một số sơ đồ nâng cao theo chuẩn (DFD, BFD, WBS, Gantt...)
  không làm đúng form nên đã chủ động lược bỏ/giản lược, không tính vào
  phần trăm hoàn thành.

- Phần hiện thực backend & kỹ thuật NestJS: hoàn thành khoảng 75--80%.
  Các module cốt lõi (Auth, User, Workspace, Task, Comment,
  Notification) đã chạy end-to-end và đủ để demo; tuy nhiên một số mục
  tiêu nâng cao ban đầu như Activity Log hiển thị đầy đủ,
  Dashboard/Search riêng, OAuth login hoàn chỉnh, attachments với
  storage S3, caching nâng cao, analytics/reporting... mới dừng ở mức
  thiết kế/outline, chưa triển khai trọn vẹn.

- Phần kiểm thử & triển khai: hoàn thành khoảng 60--70%. Nhóm đã viết
  unit test cho một số phần (ví dụ AuthController, các test liên quan
  User/Workspace/Task) và có bộ test thủ công chi tiết cho các luồng
  chính; tuy vậy, bộ e2e test tự động mới dừng lại ở mức thiết kế kịch
  bản, chưa xây dựng đầy đủ suite và pipeline CI/CD như kế hoạch ban
  đầu.

Tổng hợp ba mảng trên, nhóm ước lượng mức độ hoàn thành toàn bộ mục tiêu
ban đầu khoảng 80%: các chức năng và tài liệu cốt lõi đã đạt, đủ để demo
và đánh giá công nghệ NestJS, còn các tính năng nâng cao và hệ thống
kiểm thử/triển khai chuyên nghiệp được ghi rõ lại ở Chương 12 như hướng
phát triển trong tương lai.

**11.2. Phân tích lỗi (Bug Reports -- Quan trọng):**

Trong giai đoạn test API (dùng Swagger và Hoppscotch), nhóm không chỉ
kiểm tra "chạy được hay không" mà còn kiểm tra hành vi có đúng với kỳ
vọng bảo mật ban đầu hay không. Một số luồng Auth/Forgot Password cho
kết quả "chạy được" nhưng khi soi kỹ thì chưa hợp lý. Dưới đây là các
lỗi tiêu biểu và cách nhóm phát hiện.

**- Liệt kê 1-2 lỗi khó khăn/thú vị nhất**

**- Minh chứng: Ảnh chụp lỗi (Log đỏ, giao diện vỡ,...) và đoạn code đã
sửa**

## **Chương 12: Hướng phát triển trong tương lai**

> 1\. **Hướng phát triển cho đồ án:**
>
> Trong phạm vi thời gian đồ án, nhóm ưu tiên hoàn thành các module cốt
> lõi; nhiều ý tưởng nâng cao mới dừng lại ở mức thiết kế/thử nghiệm.
> Trong tương lai, nhóm mong muốn phát triển thêm:

- Hoàn thiện Activity Log và Dashboard

  - Xây dựng đầy đủ Activity Log (backend + API + UI) để theo dõi lịch
    sử thao tác trên workspace/project/task.

  - Phát triển Dashboard/Analytics: biểu đồ khối lượng công việc, năng
    suất theo thành viên, tỷ lệ hoàn thành task, lead time,...

<!-- -->

- Mở rộng tính năng quản lý công việc

  - Hỗ trợ file attachments (tài liệu, hình ảnh) với storage
    S3-compatible hoặc dịch vụ cloud, kèm cơ chế phân quyền tải
    xuống/xem.

  - Bổ sung các thao tác nâng cao trên task: drag--drop reorder,
    duplicate/move task giữa project, template task, recurring task.

<!-- -->

- Cải thiện trải nghiệm người dùng và tìm kiếm

  - Nâng cấp hệ thống search/filter: full-text search theo tiêu đề/nội
    dung, filter theo nhiều tiêu chí kết hợp, gợi ý (suggestion) theo
    thói quen sử dụng.

  - Mở rộng realtime: hiển thị trạng thái online/offline, "đang gõ",
    cảnh báo xung đột khi nhiều người chỉnh sửa cùng lúc.

<!-- -->

- Tăng cường bảo mật và phân quyền

  - Hoàn thiện OAuth/SSO (Google/GitHub) cho đăng nhập một lần, quản lý
    token an toàn hơn.

  - Chi tiết hóa RBAC: quyền theo vai trò, theo project, theo nhãn; bổ
    sung logging bảo mật, rate limit, captcha ở các điểm nhạy cảm.

<!-- -->

- Nâng cấp kiểm thử và triển khai

  - Xây dựng đầy đủ bộ e2e test tự động bao phủ các luồng chính, tích
    hợp vào pipeline CI/CD.

  - Bổ sung monitoring, alerting, logging tập trung để sẵn sàng cho môi
    trường production.

> 2\. **Định hướng phát triển của bản thân:**
>
> Thông qua đồ án này, mỗi thành viên nhận ra nhiều "lỗ hổng" kiến thức
> và kỹ năng cần bù đắp. Trong thời gian tới, nhóm định hướng phát triển
> bản thân theo các hướng chính:

- Đào sâu backend với NestJS và hệ sinh thái
  [[Node.js]{.underline}](http://node.js)

  - Nắm vững hơn các pattern nâng cao: module hóa lớn, CQRS,
    event-driven, microservices, caching, queue, transaction với Prisma.

  - Luyện tập viết unit test/service test/e2e test bài bản, biết đo
    coverage và refactor code theo kết quả test.

<!-- -->

- Mở rộng sang frontend và trải nghiệm người dùng

  - Học một framework frontend (React/Next.js hoặc tương đương) để tự
    xây dựng giao diện cho backend hiện có.

  - Tìm hiểu UI/UX cơ bản để thiết kế màn hình trực quan hơn cho các
    luồng workspace/task/collaboration.

<!-- -->

- Nâng cao kiến thức DevOps và cloud

  - Thành thạo hơn Docker, docker-compose, từng bước tiếp cận CI/CD
    (GitHub Actions/GitLab CI), cách deploy ứng dụng NestJS lên cloud.

  - Học sử dụng các dịch vụ cloud liên quan như object storage (S3),
    managed database, logging/monitoring.

<!-- -->

- Củng cố nền tảng kỹ thuật chung

  - Tiếp tục rèn luyện TypeScript, JavaScript, thiết kế cơ sở dữ liệu,
    tối ưu truy vấn, tư duy thiết kế API.

  - Đọc thêm tài liệu chính thức, best practices, source code
    open-source để nâng cao tư duy thiết kế hệ thống và chất lượng code.

> Nhờ những định hướng này, nhóm kỳ vọng sau đồ án không chỉ dừng lại ở
> mức "làm xong một bài tập lớn", mà còn có nền tảng để tham gia các dự
> án thực tế lớn hơn, sử dụng NestJS và các công nghệ liên quan một cách
> chuyên nghiệp.

##  

## **Tài liệu tham khảo**

\[1\] D. Vanderkam, *Effective TypeScript: 62 Specific Ways to Improve
Your TypeScript*. Sebastopol, CA, USA: O\'Reilly Media, Inc., 2020.

\[2\] GeeksforGeeks, \"Dependency Injection in NestJS,\" GeeksforGeeks,
Jul. 19, 2024. \[Online\]. Available:
[[https://www.geeksforgeeks.org/dependency-injection-in-nestjs/]{.underline}](https://www.geeksforgeeks.org/dependency-injection-in-nestjs/)

\[3\] NestJS, \"Documentation \| NestJS - A progressive Node.js
framework,\" NestJS. \[Online\]. Available:
[[https://docs.nestjs.com/]{.underline}](https://docs.nestjs.com/)

\[4\] I. Alasmar, \"Evaluating the performance of the Node.js frameworks
Express, Fastify, and NestJS in modern cloud environments,\" B.S.
thesis, KTH Royal Institute of Technology, Stockholm, Sweden, 2025.

\[5\] Hazedawn, \"Exploring the Latest Features of TypeScript 5.0: A
Deep Dive into New Improvements,\" DEV Community, Dec. 30, 2024.
\[Online\]. Available: [[https://dev.to/]{.underline}](https://dev.to/)

\[6\] Hayerhans, \"Fundamentals of NEST.js,\" DEV Community, Oct. 02,
2021. \[Online\]. Available:
[[https://dev.to/]{.underline}](https://dev.to/)

\[7\] NestJS, \"GraphQL + TypeScript \| NestJS - A progressive Node.js
framework,\" NestJS. \[Online\]. Available:
[[https://docs.nestjs.com/graphql/quick-start]{.underline}](https://docs.nestjs.com/graphql/quick-start)

\[8\] N. Dhandala, \"How to Use NestJS for Enterprise Applications,\"
OneUptime, Jan. 26, 2026. \[Online\]. Available:
[[https://oneuptime.com/blog/]{.underline}](https://oneuptime.com/blog/)

\[9\] A. Mittal and M. Ali, \"How to set up TypeScript with Node.js and
Express,\" LogRocket Blog, Mar. 28, 2025. \[Online\]. Available:
[[https://blog.logrocket.com/]{.underline}](https://blog.logrocket.com/)

\[10\] H. Khan, \"NestJS vs. Express: Why Structure Beats Speed in the
Long Run,\" DEV Community, Aug. 18, 2025. \[Online\]. Available:
[[https://dev.to/]{.underline}](https://dev.to/)

\[11\] R. Fauzan, \"NestJS with TypeORM and PostgreSQL,\" DEV Community,
Mar. 22, 2025. \[Online\]. Available:
[[https://dev.to/]{.underline}](https://dev.to/)

\[12\] D. Rosenwasser, \"Performance,\" microsoft/TypeScript Wiki,
GitHub, Feb. 20. \[Online\]. Available:
[[https://github.com/microsoft/TypeScript/wiki/Performance]{.underline}](https://github.com/microsoft/TypeScript/wiki/Performance)

\[13\] E. Mdodana, \"Real-time Applications with NestJS and
WebSockets,\" DEV Community, Jun. 10, 2024. \[Online\]. Available:
[[https://dev.to/]{.underline}](https://dev.to/)

\[14\] NestJS, \"Request lifecycle - FAQ,\" NestJS. \[Online\].
Available:
[[https://docs.nestjs.com/faq/request-lifecycle]{.underline}](https://docs.nestjs.com/faq/request-lifecycle)

\[15\] Microsoft, \"The TypeScript Handbook,\" Oct. 11, 2021.
\[Online\]. Available:
[[https://www.typescriptlang.org/docs/handbook/intro.html]{.underline}](https://www.typescriptlang.org/docs/handbook/intro.html)

\[16\] M. Pocock, \"Type vs Interface: Which Should You Use?,\" Total
TypeScript. \[Online\]. Available:
[[https://www.totaltypescript.com/type-vs-interface]{.underline}](https://www.google.com/search?q=https://www.totaltypescript.com/type-vs-interface)

\[17\] Microsoft, \"TypeScript Documentation,\" Apr. 06, 2026.
\[Online\]. Available:
[[https://www.typescriptlang.org/docs/]{.underline}](https://www.typescriptlang.org/docs/)

\[18\] K. Adeniyi, \"TypeScript vs. JavaScript: Differences and use
cases for each,\" LogRocket Blog, Mar. 04, 2025. \[Online\]. Available:
[[https://blog.logrocket.com/]{.underline}](https://blog.logrocket.com/)

\[19\] Meta Platforms, Inc., \"Using TypeScript -- React,\" React
Documentation. \[Online\]. Available:
[[https://react.dev/learn/typescript]{.underline}](https://react.dev/learn/typescript)

\[20\] T. Shehzadi, \"Serverless Computing Architectures and
Applications in AWS,\" ResearchGate Preprint, Feb. 2025.

##  

## **Phụ lục**

Link Repo Github:
[[https://github.com/Ttuandatt/Todolist-CCNLTHD.git]{.underline}](https://github.com/Ttuandatt/Todolist-CCNLTHD.git)
