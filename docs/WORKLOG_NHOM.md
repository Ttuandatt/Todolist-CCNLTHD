# NHẬT KÝ LÀM VIỆC
**Tên đề tài:** Tìm hiểu công nghệ Nest.js
**Các thành viên:**
- Phan Cảnh Tuấn Đạt
- Nguyễn Hoàng Mai Vy
- Huỳnh Văn Phú
- Trần Khánh Huyền

---

> **31.01.2026 — Yêu cầu của thầy**
> - Thể hiện kỹ thuật đặc thù của công nghệ
> - Liệt kê các kỹ thuật trong báo cáo
> - Thế mạnh, khác biệt, đặc trưng của framework → showcase ra các ví dụ trong codebase
> - Mỗi lựa chọn được đưa ra nên có so sánh với các lựa chọn khác và lý do tại sao chọn cái này thay vì cái kia

---

## Tuần 1: 12/01 - 18/01

**Công việc đã làm ở tuần này:**
- Lập nhóm với đủ các thành viên
- Chọn công nghệ sẽ tìm hiểu và ứng dụng sẽ sử dụng công nghệ

**Buổi họp nhóm 1:**
- Thời gian: 20h 17/01/2026
- Nội dung: Thảo luận và thống nhất dự án đề tài. Tìm hiểu các nguồn học, tham khảo công nghệ

**Các công việc đang vướng mắc:**
- /

---

## Tuần 2: 19/01 - 25/01

**Công việc đã làm ở tuần trước:**
- Lập nhóm với đủ các thành viên
- Chọn công nghệ sẽ tìm hiểu và ứng dụng sẽ sử dụng công nghệ

**Công việc sẽ làm ở tuần này:**
- Phân chia tìm hiểu về Nest.js
- Viết các phần đầu của báo cáo: Lời mở đầu, giới thiệu (Lý do chọn đề tài, Phạm vi,...)

**Buổi họp nhóm 1:**
- Thời gian: 21h 24/01/2026
- Nội dung:
  - Thảo luận và phân chia nội dung tìm hiểu về công nghệ NestJS
  - Setup codebase cho project
  - Cập nhật worklog nhóm & worklog cá nhân

**Các công việc đang vướng mắc:**
- /

---

## Tuần 3: 26/01 - 01/02

**Công việc đã làm ở tuần trước:**
- Phân chia tìm hiểu về Nest.js
- Viết các phần đầu của báo cáo: Lời mở đầu, giới thiệu

**Công việc sẽ làm ở tuần này:**
- Tìm hiểu TypeScript cơ bản & nâng cao
- Phân tích thiết kế hệ thống: phân tích yêu cầu hệ thống, vẽ ERD, Usecase,...
- Viết báo cáo

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Viết tài liệu thu thập yêu cầu (145 câu hỏi), User Stories (40+ stories), đặc tả Use Cases (60 use cases) |
| Vy | Tìm hiểu TypeScript nâng cao (generics, decorators, interfaces). Hỗ trợ viết Features List |
| Phú | Tìm hiểu JWT, bcrypt, authentication flow. Hỗ trợ viết yêu cầu phi chức năng (NFR) |
| Huyền | Tìm hiểu Docker, PostgreSQL, cài đặt môi trường. Hỗ trợ viết phân loại MoSCoW |

**Buổi họp nhóm 1:**
- Thời gian: 21h 31/01/2026
- Nội dung:
  - Thảo luận phân chia các công việc ở phần phân tích thiết kế hệ thống
  - Review tài liệu yêu cầu: 72 chức năng (48 Must, 20 Should, 4 Could)
  - Cập nhật worklog nhóm & cá nhân

**Các công việc đang vướng mắc:**
- Phần phân tích yêu cầu khá lớn (145 câu hỏi, 60 use cases) → cần phân chia review cho cả nhóm
- Chưa xác định rõ phạm vi MVP so với full features

---

## Tuần 4: 02/02 - 08/02

**Công việc đã làm ở tuần trước:**
- Hoàn thành tài liệu phân tích yêu cầu (Requirements, User Stories, Use Cases, Features List, NFR)
- Tìm hiểu TypeScript, JWT, Docker

**Công việc sẽ làm ở tuần này:**
- Thiết kế ERD và Data Dictionary
- Vẽ các sơ đồ phân tích (Class Diagram, Sequence Diagram, Activity Diagram)
- Tạo Prisma schema
- Viết API Specification

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Thiết kế ERD (13 entities), Data Dictionary, Prisma schema, API Specification (53 endpoints) |
| Vy | Vẽ Class Diagram: mapping ERD → NestJS modules. Review Data Dictionary |
| Phú | Vẽ Sequence Diagram: các luồng chính (Register, Login, Create Task, Assign Task) |
| Huyền | Vẽ Activity Diagram: workflow Task lifecycle, Authentication flow |

**Buổi họp nhóm 1:**
- Thời gian: 21h 07/02/2026
- Nội dung:
  - Review ERD (13 entities, 5 enums, indexes, relations, cascade delete)
  - Review API Specification: 53 endpoints cho 10 modules
  - Phân chia viết nội dung báo cáo các chương
  - Thống nhất phân công: Ch3&6 → Huyền, Ch4&5 → Đạt+Vy, Ch7 → Phú

**Các công việc đang vướng mắc:**
- ERD khá phức tạp (13 entities, nhiều quan hệ many-to-many) → cần review kỹ trước khi tạo Prisma schema
- Chưa thống nhất format viết báo cáo (style code blocks, giải thích inline hay paragraph)

---

## Tuần 5: 09/02 - 15/02

**Công việc đã làm ở tuần trước:**
- Hoàn thành ERD, Data Dictionary, Class/Sequence/Activity Diagram
- Tạo Prisma schema (13 models, 5 enums)
- Viết API Specification (53 endpoints)
- Phân công viết báo cáo theo chương

**Công việc sẽ làm ở tuần này:**
- Vẽ DFD, BFD, hoàn thiện sơ đồ còn lại
- Tạo WBS, Gantt Chart
- Bắt đầu viết nội dung các chương báo cáo

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Vẽ DFD, BFD. Tạo WBS, Gantt Chart. Bắt đầu viết Ch1 (Giới thiệu NestJS) & Ch5 (Database/Prisma) |
| Vy | Bắt đầu viết Ch4 (Kiến trúc NestJS — phần Controllers). Nghiên cứu thêm về Dependency Injection |
| Phú | Nghiên cứu sâu JWT flow, Passport.js Strategy pattern. Bắt đầu viết Ch7 (Authentication) |
| Huyền | Nghiên cứu Docker setup, Nest CLI. Bắt đầu viết Ch3 (Cài đặt môi trường) |

**Buổi họp nhóm 1:**
- Thời gian: 21h 10/02/2026 (Thứ 2)
- Nội dung:
  - Review DFD, BFD đã vẽ
  - Thống nhất format viết báo cáo: dùng code blocks kèm giải thích diễn giải (không dùng inline comment)
  - Phân chia chi tiết nội dung từng chương
  - Cập nhật worklog

**Các công việc đang vướng mắc:**
- Chương 1 cần tìm nguồn chính thức về lịch sử NestJS (năm ra đời, tác giả Kamil Myśliwiec)
- Format viết báo cáo chưa thống nhất giữa các thành viên → cần template chuẩn

---

## Tuần 6: 16/02 - 22/02

**Công việc đã làm ở tuần trước:**
- Hoàn thành DFD, BFD, WBS, Gantt Chart
- Bắt đầu viết nội dung Ch1, Ch3, Ch4, Ch5, Ch7

**Công việc sẽ làm ở tuần này:**
- Tiếp tục viết và hoàn thiện các chương báo cáo
- Fact-check nội dung kỹ thuật theo tài liệu chính thức NestJS
- Thay thế code comments bằng đoạn văn giải thích diễn giải

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Viết Ch4 (Providers/DI, Modules — phần so sánh tight/loose coupling). Review & fact-check Ch6, Ch7 |
| Vy | Viết Ch4 (Controllers — decorators, routing). Review Ch5 (Prisma CRUD, migrations) |
| Phú | Viết Ch7 (JWT flow, bcrypt hash, AuthService register/login, JwtStrategy, Guards) |
| Huyền | Viết Ch3 (Node.js, Nest CLI, Docker PostgreSQL, cấu trúc thư mục). Bắt đầu viết Ch6 (Request Lifecycle, Pipes) |

**Buổi họp nhóm 1:**
- Thời gian: 21h 17/02/2026 (Thứ 2)
- Nội dung:
  - Review nội dung báo cáo lần 1: đọc chéo giữa các thành viên
  - Đạt review Ch3 (Huyền) và Ch7 (Phú)
  - Vy review Ch6 (Huyền)
  - Thống nhất phong cách viết: diễn giải thay vì inline comments trong code blocks
  - Fact-check nội dung theo tài liệu chính thức NestJS

**Các công việc đang vướng mắc:**
- Ch4 khá dài (Controllers + Providers + Modules) → chia nhỏ phần viết giữa Đạt và Vy
- Phong cách viết code blocks khác nhau giữa các thành viên → cần rewrite thống nhất
- Ch7 cần xác nhận flow logout có blacklist token hay không → chờ thiết kế chi tiết

---

## Tuần 7: 23/02 - 01/03

**Công việc đã làm ở tuần trước:**
- Hoàn thiện nội dung Ch3, Ch4, Ch5, Ch6, Ch7
- Fact-check nội dung kỹ thuật
- Thống nhất phong cách viết diễn giải

**Công việc sẽ làm ở tuần này:**
- Tối ưu thứ tự chương cho logic sư phạm
- Review tổng thể báo cáo trên Google Docs
- Refactor cấu trúc folder tài liệu
- Bắt đầu code backend (Phase 0 — Shared Infrastructure)

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Tối ưu thứ tự chương (Ch6 trước Ch7). Refactor folder docs/. Review PRD (15 tài liệu). Bổ sung 3 entities mới (Invitation, RefreshToken, PasswordReset). Fix Prisma 7. Code Phase 0: Interceptors, Filters, main.ts |
| Vy | Review báo cáo trên Google Docs (69 trang): kiểm tra nội dung Ch4, Ch5. Cập nhật cross-references sau khi đổi thứ tự chương |
| Phú | Review Ch7 sau khi đổi thứ tự (thành Ch7 sau Ch6). Cập nhật nội dung authentication flow cho phù hợp thứ tự mới |
| Huyền | Review Ch3, Ch6 trên Google Docs. Cập nhật section numbers sau khi đổi thứ tự chương |

**Buổi họp nhóm 1:**
- Thời gian: 21h 24/02/2026 (Thứ 2)
- Nội dung:
  - Thông báo đổi thứ tự chương: Kỹ thuật nâng cao (Ch6) trước Authentication (Ch7) — giải thích Guards/Decorators lý thuyết trước khi áp dụng thực tế
  - Review tổng thể báo cáo: 69 trang, xác định phần còn thiếu (Ch2, Ch8-11)
  - Review PRD readiness: phát hiện thiếu 3 bảng hỗ trợ auth flow
  - Demo Phase 0: Swagger UI, response format chuẩn, logging
  - Lên kế hoạch implementation: 7 phases, 10 modules, 53 endpoints

**Các công việc đang vướng mắc:**
- Thay đổi thứ tự chương ảnh hưởng cross-references ở nhiều chỗ → cần rà soát toàn bộ
- Prisma 7 thay đổi config format (xóa `url = env()`) → cần test lại kết nối DB
- Ch2 (TypeScript cơ bản) chưa ai viết → cần phân công bổ sung

---

## Tuần 8: 02/03 - 08/03

**Công việc đã làm ở tuần trước:**
- Tối ưu thứ tự chương, cập nhật cross-references
- Review tổng thể báo cáo (69 trang)
- Bổ sung 3 entities mới vào Prisma schema (13 → 16 entities)
- Hoàn thành Phase 0 — Shared Infrastructure

**Công việc sẽ làm ở tuần này:**
- Code Phase 1 — Auth Module (JWT, bcrypt, refresh token, token blacklist)
- Bổ sung kiến thức nền tảng TypeScript vào báo cáo
- Tạo API testing collection
- Test API endpoints

**Phân công cụ thể:**
| Thành viên | Công việc |
|:---|:---|
| Đạt | Thiết kế Token Blacklist. Cập nhật PRD (Data Dictionary, API Spec, Prisma schema). Code Phase 1 Auth Module (Bước 1-9): DTOs, JwtStrategy, JwtAuthGuard, decorators, AuthService, AuthController, AuthModule, AppModule, Migration. Fix ConfigModule + expiresIn type. Sync guide. Tạo Hoppscotch collection |
| Vy | Test API endpoints trên Hoppscotch/Swagger (register, login, refresh, logout). Review code AuthService & AuthController |
| Phú | Review authentication flow: kiểm tra Token Blacklist logic, JwtStrategy validate, bcrypt usage. Đối chiếu với nội dung Ch7 |
| Huyền | Bổ sung section "Kiến thức nền tảng TypeScript" vào Ch6 (const/let, async/await, Prisma query syntax). Review Ch3 lần cuối |

**Buổi họp nhóm 1:**
- Thời gian: 21h 03/03/2026 (Thứ 2)
- Nội dung:
  - Demo Phase 0 hoàn chỉnh: Swagger UI, TransformResponseInterceptor, HttpExceptionFilter, LoggingInterceptor
  - Trình bày thiết kế Token Blacklist: cơ chế, database schema, flow logout
  - Planning Phase 1: review code guide, phân chia review/test
  - Demo server startup: 6 routes mapped, database connected
  - Cập nhật worklog nhóm & cá nhân

**Các công việc đang vướng mắc:**
- `@nestjs/jwt` v11+ thay đổi type `expiresIn` → cần cast `as any` (workaround)
- `ConfigModule` chưa có trong guide ban đầu → đã sửa, cần đồng bộ lại tài liệu
- Ch2 (TypeScript cơ bản) vẫn chưa viết → cần ưu tiên ở tuần tới
- Chưa test forgot-password và reset-password flow (cần email service mock)
