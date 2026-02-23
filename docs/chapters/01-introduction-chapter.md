# Chương 1: Giới thiệu chung

> **Mục tiêu chương học:** Sau khi hoàn thành chương này, người đọc sẽ hiểu được bối cảnh phát triển Backend với Node.js, nắm vững khái niệm và đặc điểm của NestJS framework, cùng với lịch sử phát triển và hệ sinh thái của nó.

---

## 1.1. Bối cảnh phát triển Backend với Node.js

### 1.1.1. Sự phát triển của Node.js

Để hiểu được giá trị mà NestJS mang lại, trước hết cần nhìn lại bối cảnh phát triển Backend trong hệ sinh thái JavaScript và Node.js.

Node.js ra đời vào năm 2009, được tạo ra bởi Ryan Dahl với mục tiêu cho phép JavaScript - vốn chỉ chạy được trên trình duyệt - có thể thực thi trên phía server. Sự kiện này đánh dấu một bước ngoặt quan trọng trong lịch sử phát triển web, vì lần đầu tiên các lập trình viên có thể sử dụng cùng một ngôn ngữ cho cả Frontend và Backend.

Node.js được xây dựng trên V8 JavaScript Engine của Google Chrome, sử dụng mô hình event-driven và non-blocking I/O. Kiến trúc này cho phép Node.js xử lý hàng nghìn kết nối đồng thời một cách hiệu quả, đặc biệt phù hợp với các ứng dụng real-time như chat, streaming, và các hệ thống cần xử lý nhiều I/O operations.

Với những ưu điểm về hiệu năng và sự tiện lợi của việc sử dụng một ngôn ngữ duy nhất, Node.js nhanh chóng được các công ty công nghệ lớn như Netflix, LinkedIn, Uber, và PayPal áp dụng cho các hệ thống backend của họ. Tính đến năm 2026, Node.js đã trở thành một trong những runtime phổ biến nhất cho việc phát triển ứng dụng web server-side.

### 1.1.2. Hạn chế của các framework tối giản

Trong những năm đầu phát triển của Node.js, hệ sinh thái backend bị thống trị bởi các framework tối giản (minimalist) như Express.js và Koa.js. Express.js ra đời năm 2010 và nhanh chóng trở thành framework phổ biến nhất, được mệnh danh là "standard server framework" của Node.js.

Express.js mang lại sự linh hoạt tuyệt đối cho lập trình viên. Nó cung cấp các tính năng cơ bản như routing, middleware, và xử lý request/response, nhưng không đưa ra bất kỳ quy ước nào về cách tổ chức code. Điều này được xem là ưu điểm vì cho phép lập trình viên tự do thiết kế kiến trúc theo ý muốn.

Tuy nhiên, chính sự tự do này lại trở thành con dao hai lưỡi khi dự án phát triển lớn hơn. Mỗi dự án, mỗi nhóm phát triển lại tổ chức code theo một cách khác nhau. Không có chuẩn mực chung về cách đặt tên thư mục, cách phân chia modules, hay cách triển khai các patterns như dependency injection. Khi một lập trình viên mới tham gia dự án, họ phải mất nhiều thời gian để hiểu được cấu trúc code đặc thù của dự án đó.

Vấn đề trở nên nghiêm trọng hơn khi ứng dụng cần mở rộng (scaling). Code dần trở nên lộn xộn, khó bảo trì, và thiếu tính nhất quán - hiện tượng mà cộng đồng developer thường gọi là "Spaghetti Code". Nhiều đội ngũ phát triển phải tự xây dựng kiến trúc riêng, dẫn đến hiện tượng "Architecture Fatigue" - mệt mỏi vì phải liên tục đưa ra các quyết định kiến trúc thay vì tập trung vào business logic.

### 1.1.3. Nhu cầu về một framework có kiến trúc

Trong khi thế giới Node.js đang loay hoay với vấn đề kiến trúc, các hệ sinh thái khác đã có sẵn những framework với cấu trúc chuẩn mực. Java có Spring Boot - một framework mạnh mẽ với dependency injection, modular architecture, và các conventions rõ ràng. Python có Django với triết lý "batteries included" và cấu trúc project nhất quán. Ruby có Ruby on Rails với quy ước "convention over configuration".

Cộng đồng Node.js bắt đầu nhận ra rằng họ cần một framework tương tự - một framework cung cấp sẵn kiến trúc, bắt buộc lập trình viên viết code có tổ chức, nhưng vẫn giữ được tính linh hoạt của JavaScript. Framework này cần có hệ thống module rõ ràng, dependency injection container, và các patterns đã được chứng minh hiệu quả trong enterprise development.

Đây chính là bối cảnh mà NestJS ra đời, với mục tiêu mang lại cho Node.js một framework có kiến trúc enterprise-grade, được lấy cảm hứng từ những best practices của Angular và Spring Boot.

---

## 1.2. NestJS - Giải pháp cho Backend có tổ chức

### 1.2.1. Định nghĩa và Đặc điểm

NestJS (thường được gọi tắt là Nest) là một framework mã nguồn mở dành cho việc xây dựng các ứng dụng phía máy chủ (server-side applications) với Node.js. Framework này được thiết kế với mục tiêu tạo ra các ứng dụng backend hiệu quả, đáng tin cậy, và có khả năng mở rộng (scalable) cao.

Một trong những đặc điểm nổi bật nhất của NestJS là sự hỗ trợ trọn vẹn cho TypeScript. Mặc dù vẫn cho phép lập trình viên sử dụng JavaScript thuần, NestJS được xây dựng hoàn toàn bằng TypeScript và khuyến khích việc sử dụng ngôn ngữ này. TypeScript mang lại nhiều lợi ích như static typing, interfaces, decorators, và khả năng phát hiện lỗi tại thời điểm compile, giúp code an toàn và dễ bảo trì hơn.

NestJS không phát minh lại bánh xe mà xây dựng trên nền tảng của các HTTP server framework đã có sẵn. Theo mặc định, NestJS sử dụng Express.js làm underlying HTTP framework, nhưng cũng hỗ trợ Fastify - một alternative nhanh hơn. Điều quan trọng là NestJS cung cấp một lớp trừu tượng (abstraction layer) phía trên các framework này, giúp lập trình viên có thể chuyển đổi giữa Express và Fastify mà không cần thay đổi code business logic.

### 1.2.2. Triết lý thiết kế

Điều làm nên sự đặc biệt của NestJS là cách nó kết hợp hài hòa các nguyên lý từ ba mô hình lập trình lớn.

Đầu tiên là Lập trình hướng đối tượng (OOP - Object Oriented Programming). NestJS sử dụng classes, interfaces, và inheritance một cách rộng rãi. Các thành phần như Controllers, Services, và Modules đều được định nghĩa dưới dạng classes với decorators. Cách tiếp cận này giúp code có tính đóng gói (encapsulation) cao và dễ dàng tổ chức theo các responsibility riêng biệt.

Thứ hai là Lập trình hàm (FP - Functional Programming). NestJS khuyến khích việc sử dụng pure functions, higher-order functions, và immutability khi phù hợp. Middleware, Pipes, Guards, và Interceptors đều có thể được implement theo functional style. Điều này mang lại sự linh hoạt và khả năng compose các chức năng một cách elegant.

Thứ ba là Lập trình phản ứng hàm (FRP - Functional Reactive Programming). NestJS tích hợp sẵn với RxJS - một thư viện mạnh mẽ cho reactive programming. Điều này đặc biệt hữu ích khi xử lý các luồng dữ liệu bất đồng bộ, event streams, hoặc khi cần implement các patterns như backpressure handling. Việc tích hợp RxJS cũng giúp NestJS xử lý tốt các use cases như WebSockets và Server-Sent Events.

### 1.2.3. Nguồn cảm hứng từ Angular và Spring Boot

Kiến trúc của NestJS được lấy cảm hứng mạnh mẽ từ Angular - framework frontend phổ biến của Google. Điều này thể hiện rõ qua nhiều khía cạnh trong cách NestJS được thiết kế.

Trước hết là việc sử dụng Decorators. Trong NestJS, hầu hết mọi thứ đều được định nghĩa thông qua decorators như @Controller(), @Injectable(), @Module(), @Get(), @Post(). Cách tiếp cận này rất quen thuộc với những người đã làm việc với Angular, nơi mà @Component(), @Injectable(), @NgModule() được sử dụng phổ biến.

Tiếp theo là hệ thống Module. NestJS tổ chức ứng dụng thành các modules, mỗi module đóng gói một feature hoặc domain cụ thể. Cấu trúc này tương tự như cách Angular tổ chức các NgModules, giúp code có tính modular và dễ dàng tái sử dụng.

Cuối cùng và quan trọng nhất là Dependency Injection (DI). NestJS có một IoC (Inversion of Control) container mạnh mẽ, tự động quản lý vòng đời của các dependencies và inject chúng vào nơi cần thiết. Concept này được lấy trực tiếp từ Angular và cũng rất giống với cách Spring Boot hoạt động trong Java ecosystem.

Bên cạnh Angular, NestJS cũng chịu ảnh hưởng lớn từ Spring Boot của Java. Cách tổ chức code theo layers (Controller → Service → Repository), việc sử dụng annotations (decorators), và triết lý convention over configuration đều mang đậm dấu ấn của Spring Boot. Điều này giúp những lập trình viên có background Java có thể nhanh chóng làm quen với NestJS.

---

## 1.3. Lịch sử hình thành và phát triển

### 1.3.1. Tác giả và Quá trình ra đời

NestJS được sáng tạo bởi Kamil Myśliwiec, một kỹ sư phần mềm người Ba Lan. Kamil là một Google Developer Expert trong lĩnh vực Angular, điều này giải thích rõ tại sao kiến trúc của NestJS lại mang đậm ảnh hưởng từ Angular.

Phiên bản đầu tiên của NestJS được công bố vào năm 2017. Kamil bắt đầu dự án này xuất phát từ trải nghiệm cá nhân khi làm việc với Node.js và nhận thấy sự thiếu hụt của một framework có kiến trúc chuẩn mực. Mục tiêu ban đầu của ông là tạo ra một framework cho phép lập trình viên Node.js viết code có tổ chức giống như cách họ viết code Angular ở frontend hoặc Spring Boot ở Java.

Hiện tại, NestJS được phát triển và duy trì bởi một cộng đồng mã nguồn mở đông đảo, cùng với sự hỗ trợ từ Trilon - một công ty tư vấn công nghệ chuyên về NestJS do chính Kamil sáng lập. Trilon cung cấp các dịch vụ consulting, training, và enterprise support cho những tổ chức sử dụng NestJS trong production.

### 1.3.2. Các mốc phiên bản quan trọng

Kể từ khi ra mắt năm 2017, NestJS đã trải qua nhiều phiên bản nâng cấp lớn, mỗi phiên bản mang đến những cải tiến đáng kể về tính năng và hiệu năng.

| Phiên bản | Thời gian | Các thay đổi và cải tiến quan trọng |
|-----------|-----------|-------------------------------------|
| v1 - v4 | 2017 - 2018 | Giai đoạn sơ khai với việc xây dựng core framework, Dependency Injection container và module system. Các decorators cơ bản được ổn định trong giai đoạn này. |
| v5 | 2018 | Cải thiện đáng kể khả năng xử lý bất đồng bộ (Asynchronous context) và tối ưu hóa thời gian khởi động ứng dụng. |
| v6 | 2019 | Giới thiệu Injection Scopes (Transient, Request, Singleton) cho phép kiểm soát vòng đời của providers. Cải thiện module GraphQL và hỗ trợ tốt hơn cho Microservices. |
| v7 | 2020 | Nâng cấp kiến trúc Microservices, cải thiện việc xử lý Dynamic Modules, và hỗ trợ GraphQL code-first approach tốt hơn. |
| v8 | 2021 | Hỗ trợ API Versioning (đánh phiên bản API qua URI, Header, hoặc Media Type), Lazy-loading modules để tăng tốc khởi động, và nâng cấp lên RxJS v7. |
| v9 | 2022 | Giới thiệu REPL (Read-Eval-Print Loop) cho việc debug nhanh, Durable Providers tối ưu cho serverless và multi-tenant, và Module Builder API mới. |
| v10 | 2023 - Nay | Đột phá về hiệu năng với việc tích hợp SWC (Speedy Web Compiler) giúp build nhanh gấp 20 lần so với trình biên dịch TypeScript truyền thống. Cải thiện testing với khả năng override Modules dễ dàng hơn. |

Qua bảng trên có thể thấy NestJS liên tục được cập nhật và cải tiến để đáp ứng nhu cầu của cộng đồng developer. Mỗi phiên bản đều mang đến những tính năng mới giúp việc phát triển ứng dụng trở nên hiệu quả và thuận tiện hơn.

---

## 1.4. Hệ sinh thái NestJS

### 1.4.1. Công cụ và Thư viện chính thức

Một trong những điểm mạnh của NestJS là hệ sinh thái phong phú với nhiều official packages được phát triển và bảo trì bởi core team. Hệ sinh thái này được ví như một "Spring Boot thu nhỏ" của thế giới JavaScript/TypeScript.

**Nest CLI** là công cụ dòng lệnh mạnh mẽ đi kèm với NestJS. CLI cho phép khởi tạo dự án mới với cấu trúc chuẩn, tự động generate các thành phần như modules, controllers, services (được gọi là scaffolding), và chạy các lệnh build, test, deploy. Việc sử dụng CLI giúp tiết kiệm đáng kể thời gian viết boilerplate code và đảm bảo tính nhất quán trong cấu trúc project.

**Tích hợp Database** là một điểm mạnh khác của NestJS. Framework cung cấp official packages cho các ORM phổ biến nhất. TypeORM - một ORM mạnh mẽ với style rất giống Hibernate của Java - được hỗ trợ thông qua @nestjs/typeorm. Prisma - ORM thế hệ mới với type-safety tuyệt vời - có thể tích hợp dễ dàng. Mongoose cho MongoDB cũng được hỗ trợ qua @nestjs/mongoose. Trong báo cáo này, chúng ta sẽ sử dụng Prisma vì những ưu điểm về type safety và developer experience.

**Validation và Transformation** được xử lý elegant thông qua class-validator và class-transformer. Hai thư viện này cho phép định nghĩa validation rules trực tiếp trên DTO (Data Transfer Object) classes bằng decorators. Khi kết hợp với ValidationPipe của NestJS, dữ liệu đầu vào sẽ được tự động validate và transform trước khi đến business logic.

**API Documentation** được tự động generate thông qua @nestjs/swagger. Package này phân tích các decorators trên controllers và DTOs để tạo ra tài liệu OpenAPI (Swagger UI) hoàn chỉnh. Điều này không chỉ tiết kiệm thời gian viết documentation mà còn đảm bảo tài liệu luôn đồng bộ với code thực tế.

**Microservices và Message Queues** là một lĩnh vực mà NestJS hỗ trợ rất mạnh mẽ. Framework cung cấp native support cho các giao thức và message brokers phổ biến như gRPC, RabbitMQ, Kafka, MQTT, Redis, và NATS. Việc chuyển đổi từ monolithic sang microservices architecture trở nên đơn giản hơn nhiều với NestJS.

**Authentication và Authorization** được hỗ trợ thông qua @nestjs/passport và @nestjs/jwt. Passport.js - thư viện authentication phổ biến nhất cho Node.js - được tích hợp seamlessly với NestJS. Việc implement các strategies như JWT, OAuth2, hoặc Local authentication trở nên đơn giản và có cấu trúc rõ ràng.

### 1.4.2. Cộng đồng và Mức độ phổ biến

NestJS đã nhanh chóng trở thành một trong những framework Node.js phổ biến nhất và có tốc độ tăng trưởng nhanh nhất. Tính đến đầu năm 2026, repository chính của NestJS trên GitHub đã vượt qua mốc 60.000 stars, đứng trong top các framework backend được yêu thích nhất.

Cộng đồng NestJS rất sôi nổi và hỗ trợ tốt cho newcomers. Server Discord chính thức của NestJS là nơi các developers có thể đặt câu hỏi và nhận được support từ cả community members lẫn core team. StackOverflow cũng có hàng nghìn câu hỏi và câu trả lời liên quan đến NestJS, cho thấy mức độ phổ biến của framework này.

Điều đáng chú ý là NestJS không chỉ được sử dụng bởi các startup hay side projects, mà đã được nhiều doanh nghiệp lớn tin tưởng áp dụng cho các hệ thống production critical. Trong số đó có thể kể đến những tên tuổi như Adidas, Decathlon, Roche, Autodesk, Capgemini, và nhiều tập đoàn công nghệ khác. Sự tin tưởng của các doanh nghiệp này là minh chứng cho độ ổn định và khả năng mở rộng của NestJS trong môi trường enterprise.

---

## 1.5. Tổng kết

Chương này đã giới thiệu tổng quan về NestJS - một framework Node.js hiện đại được thiết kế để giải quyết vấn đề thiếu kiến trúc chuẩn mực trong hệ sinh thái JavaScript backend. Ra đời vào năm 2017 bởi Kamil Myśliwiec, NestJS nhanh chóng trở thành lựa chọn hàng đầu cho việc phát triển enterprise applications nhờ vào kiến trúc module-based, hệ thống dependency injection mạnh mẽ, và sự hỗ trợ trọn vẹn cho TypeScript.

Với triết lý kết hợp OOP, FP, và FRP, cùng với nguồn cảm hứng từ Angular và Spring Boot, NestJS mang đến một cách tiếp cận có tổ chức cho việc xây dựng server-side applications. Hệ sinh thái phong phú với nhiều official packages cho database, authentication, validation, và microservices giúp developers có thể nhanh chóng xây dựng các ứng dụng production-ready.

Trong các chương tiếp theo, chúng ta sẽ đi sâu vào kiến trúc và các thành phần cốt lõi của NestJS, từ đó áp dụng vào việc xây dựng dự án TodoList Collaboration - một ứng dụng quản lý công việc cộng tác hoàn chỉnh.
