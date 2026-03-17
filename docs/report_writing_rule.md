# Quy tắc Viết Báo cáo Đồ án

> Áp dụng cho toàn bộ nội dung báo cáo "Các Công Nghệ Lập Trình Hiện Đại" — Đại Học Sài Gòn.
> Chuẩn quốc tế tham chiếu: IEEE, ACM, APA Style cho báo cáo kỹ thuật.

---

## 1. Nguyên tắc tổng quát

### 1.1. Văn phong

- **Diễn giải (expository)**: Mỗi khái niệm phải được giải thích rõ ràng, dẫn dắt từ "cái chung" đến "cái riêng", từ lý thuyết đến thực hành.
- **Học thuật nhưng dễ tiếp cận**: Dùng câu mạch lạc, mỗi đoạn văn phục vụ một ý duy nhất. Tránh câu quá dài (trên 40 từ) hoặc quá ngắn cộc lốc.
- **Ngôi thứ nhất số nhiều**: Sử dụng "chúng ta" khi nói về hành động trong dự án (ví dụ: "chúng ta sẽ cài đặt…", "chúng ta cần đảm bảo…"). Tránh dùng "tôi", "mình", "bạn".
- **Giọng chủ động**: Ưu tiên câu chủ động ("NestJS sử dụng Dependency Injection…") hơn câu bị động ("Dependency Injection được sử dụng bởi NestJS…"), trừ khi ngữ cảnh bắt buộc.

### 1.2. Ngôn ngữ

- **Tiếng Việt** là ngôn ngữ chính.
- **Thuật ngữ kỹ thuật tiếng Anh** giữ nguyên, không dịch gượng ép: *module, controller, service, middleware, guard, interceptor, pipe, decorator, token, hash, endpoint, payload, request, response, query, schema, migration, DTO, ORM…*
- Khi thuật ngữ xuất hiện **lần đầu**, kèm giải thích ngắn trong ngoặc hoặc sau dấu gạch ngang. Ví dụ: "Guards — cơ chế kiểm soát quyền truy cập của NestJS…"
- **Không** dùng viết tắt mà chưa giải thích. Lần đầu viết đầy đủ: "JSON Web Token (JWT)", các lần sau viết "JWT".

---

## 2. Cấu trúc chương

### 2.1. Mở đầu chương

Mỗi chương BẮT BUỘC mở đầu bằng khối trích dẫn mục tiêu:

```markdown
> **Mục tiêu chương học:** Sau khi hoàn thành chương này, bạn sẽ [liệt kê 3-5 mục tiêu cụ thể, có thể đo lường được].
```

Tiếp theo là 1-2 đoạn **giới thiệu bối cảnh** — đặt chương trong bức tranh tổng thể của dự án, giải thích tại sao nội dung chương quan trọng.

### 2.2. Phân cấp đề mục

Tuân theo hệ thống đánh số thập phân (decimal numbering):

| Cấp | Format | Ví dụ |
|-----|--------|-------|
| Chương | `# Chương X: Tên chương` | `# Chương 7: Authentication & Authorization` |
| Mục | `## X.Y. Tên mục` | `## 7.1. Khái niệm cơ bản` |
| Tiểu mục | `### X.Y.Z. Tên tiểu mục` | `### 7.1.1. Authentication vs Authorization` |
| Tiểu tiểu mục | `#### Tên` (không đánh số) | `#### Ưu điểm của JWT` |

Quy tắc:
- Mỗi cấp **tối đa 3 chữ số** (X.Y.Z). Nếu cần chi tiết hơn, dùng heading `####` không đánh số hoặc danh sách bullet.
- **Không bỏ qua cấp**: Không nhảy từ `##` xuống `####` mà bỏ qua `###`.
- Tên đề mục: **ngắn gọn, rõ nghĩa**, phản ánh nội dung bên trong.

### 2.3. Kết thúc chương

Mỗi chương kết thúc bằng mục `## X.Y. Tổng kết`:
- Tóm tắt 3-5 ý chính đã trình bày (dạng đoạn văn, không phải bullet).
- Liên kết nội dung chương hiện tại với chương tiếp theo (câu chuyển tiếp).

---

## 3. Quy tắc viết đoạn văn

### 3.1. Cấu trúc đoạn

Mỗi đoạn văn phục vụ **một ý chính duy nhất**, gồm:
1. **Câu chủ đề** (topic sentence): Nêu ý chính của đoạn ngay ở câu đầu.
2. **Câu phát triển** (supporting sentences): Giải thích, chứng minh, ví dụ minh họa.
3. **Câu kết** (concluding sentence): Tóm lại hoặc chuyển tiếp sang đoạn sau (không bắt buộc nếu đoạn ngắn).

Độ dài khuyến nghị: **4-8 câu** mỗi đoạn. Đoạn quá ngắn (1-2 câu) thiếu sâu sắc. Đoạn quá dài (trên 10 câu) gây mất tập trung.

### 3.2. Kết nối giữa các đoạn

Sử dụng từ/cụm từ chuyển tiếp tự nhiên:
- Bổ sung: "Thêm vào đó", "Bên cạnh đó", "Ngoài ra"
- Tương phản: "Tuy nhiên", "Ngược lại", "Mặt khác"
- Nhân quả: "Do đó", "Vì vậy", "Nhờ vậy", "Kết quả là"
- Trình tự: "Đầu tiên", "Tiếp theo", "Cuối cùng", "Sau khi"
- Ví dụ: "Cụ thể", "Chẳng hạn", "Để minh họa"

### 3.3. Kỹ thuật diễn giải

- **Phép ẩn dụ / so sánh (analogy)**: Dùng khi giải thích khái niệm trừu tượng. Ví dụ: so sánh Guard với nhân viên bảo vệ, Pipe với trạm kiểm soát chất lượng.
- **Từ khái niệm đến ứng dụng**: Giải thích lý thuyết trước → áp dụng vào dự án TodoList Collaboration sau.
- **Câu hỏi tu từ**: Dùng có chọn lọc để dẫn dắt suy nghĩ. Ví dụ: "Vậy điều gì xảy ra khi token hết hạn?"

---

## 4. Quy tắc trình bày Code

### 4.1. Code snippet

- **Bắt buộc kèm comment đường dẫn file** ở dòng đầu tiên của code block:
  ```typescript
  // src/auth/auth.service.ts
  ```
- Ngôn ngữ code block: luôn chỉ rõ (`typescript`, `bash`, `json`, `sql`…).
- **Chỉ trích dẫn phần code liên quan** — không copy toàn bộ file. Nếu cần ngắt bỏ phần không liên quan, dùng comment `// ...` để thể hiện.
- **Không** để code snippet đứng đơn lẻ. Trước mỗi đoạn code phải có đoạn văn giới thiệu bối cảnh. Sau mỗi đoạn code phải có đoạn văn giải thích ý nghĩa hoặc phân tích kỹ thuật.

### 4.2. Giải thích code

- Giải thích **tại sao** (why) chứ không chỉ **cái gì** (what). Ví dụ: thay vì "dòng 5 gọi hàm hash", hãy viết "mật khẩu được hash bằng bcrypt với 10 salt rounds để chống tấn công brute-force".
- Với đoạn code phức tạp, giải thích **từng bước logic** theo flow thực thi, đánh số bước rõ ràng.
- **Không** giải thích những điều hiển nhiên với developer (ví dụ: "import dùng để nhập module").
- **Đánh dấu trọng điểm**: Với những dòng code quan trọng trong snippet, dùng comment `// ← QUAN TRỌNG` hoặc giải thích riêng bên dưới.

### 4.3. Inline code

Khi đề cập tên file, class, method, decorator, variable trong đoạn văn, luôn dùng backtick:
- Đúng: `AuthService` inject `PrismaService` để truy vấn database.
- Sai: AuthService inject PrismaService để truy vấn database.

---

## 5. Bảng và hình minh họa

### 5.1. Bảng

- Dùng bảng khi so sánh hoặc liệt kê **từ 3 mục trở lên** có cùng tập thuộc tính.
- Mỗi bảng có **tiêu đề cột rõ ràng**, in đậm.
- Bảng phải được giới thiệu trong đoạn văn trước đó ("Bảng dưới đây so sánh…").

### 5.2. Sơ đồ / Biểu đồ

- Mỗi sơ đồ kèm **chú thích** bên dưới, bắt đầu bằng "Hình X.Y:".
- Sơ đồ kiến trúc dùng để minh họa luồng dữ liệu, quan hệ giữa các module, hoặc quy trình xử lý request.
- Nếu dùng ASCII art hoặc text-based diagram, đặt trong code block không chỉ định ngôn ngữ.

---

## 6. Quy tắc trích dẫn và tham chiếu

### 6.1. Tham chiếu nội bộ

- Khi nhắc lại nội dung chương trước: "Như đã trình bày ở **Chương X**" hoặc "Theo mục **X.Y.Z**".
- Khi liên kết với chương sau: "Chi tiết sẽ được trình bày ở **Chương X**".

### 6.2. Tham chiếu bên ngoài

- Dùng hyperlink Markdown khi cần: `[NestJS Documentation](https://docs.nestjs.com)`.
- Với chuẩn/RFC, ghi đầy đủ: "JWT là chuẩn mở (RFC 7519)…".
- **Không** lạm dụng link ngoài. Chỉ trích dẫn khi thực sự cần thiết cho độ tin cậy.

---

## 7. Format và Typography

### 7.1. In đậm, in nghiêng

| Mục đích | Format | Ví dụ |
|----------|--------|-------|
| Nhấn mạnh khái niệm quan trọng | **In đậm** | **Authentication** là quá trình xác thực |
| Thuật ngữ tiếng Anh lần đầu | *In nghiêng* | Mỗi request mang theo đầy đủ thông tin — tính chất *stateless* |
| Tên file, biến, method | `Backtick` | File `auth.service.ts` |
| Câu trích dẫn / nhấn mạnh mạnh | **In đậm** trong đoạn | **Không bao giờ** lưu mật khẩu dạng plain text |

### 7.2. Danh sách

- **Bullet list**: Dùng khi liệt kê **không** có thứ tự ưu tiên.
- **Numbered list**: Dùng khi liệt kê các bước tuần tự hoặc có thứ tự quan trọng.
- Mỗi item trong danh sách: viết hoa chữ đầu, kết thúc bằng dấu chấm nếu là câu hoàn chỉnh.

### 7.3. Dấu gạch ngang (—)

- Dùng em dash (—) để chèn mệnh đề bổ sung giữa câu, tạo nhịp đọc tự nhiên.
- Ví dụ: "Guards — cơ chế kiểm soát quyền truy cập — là thành phần không thể thiếu."

---

## 8. Mẫu viết chuẩn (Template)

### 8.1. Giới thiệu khái niệm mới

```
[Câu chủ đề định nghĩa khái niệm]. [1-2 câu giải thích thêm bối cảnh hoặc lý do tại sao
khái niệm này quan trọng]. [Phép ẩn dụ hoặc so sánh nếu khái niệm trừu tượng].

Trong dự án TodoList Collaboration, [áp dụng khái niệm vào bài toán cụ thể]. [Giải thích
cách khái niệm này tương tác với các thành phần khác trong hệ thống].
```

### 8.2. Trình bày đoạn code

```
[Đoạn giới thiệu: tại sao cần đoạn code này, nó giải quyết vấn đề gì]

​```typescript
// src/module/file.ts
[code snippet]
​```

[Đoạn giải thích: phân tích logic, giải thích các quyết định thiết kế, chỉ ra các điểm
đáng chú ý. Giải thích TẠI SAO chứ không chỉ CÁI GÌ.]
```

### 8.3. So sánh hai phương pháp

```
[Giới thiệu hai phương pháp cần so sánh].

| Tiêu chí | Phương pháp A | Phương pháp B |
|----------|---------------|---------------|
| ...      | ...           | ...           |

[Đoạn phân tích kết luận: chúng ta chọn phương pháp nào và tại sao].
```

---

## 9. Những điều CẦN TRÁNH

| # | Lỗi | Ví dụ sai | Cách sửa |
|---|------|-----------|----------|
| 1 | Dịch gượng thuật ngữ kỹ thuật | "bộ điều khiển" thay vì controller | Giữ nguyên "controller" |
| 2 | Code không có giải thích | Paste code block rồi chuyển mục khác | Luôn có đoạn văn phân tích sau code |
| 3 | Đoạn văn 1-2 câu rời rạc | "Tiếp theo ta tạo file. Chạy lệnh:" | Phát triển thành đoạn văn đầy đủ |
| 4 | Liệt kê bullet quá nhiều | Cả trang chỉ toàn bullet points | Viết thành đoạn văn, dùng bullet khi thật cần |
| 5 | Giải thích điều hiển nhiên | "Import dùng để nhập module vào file" | Bỏ qua, tập trung giải thích logic |
| 6 | Dùng emoji trong báo cáo | 🚀 Cài đặt packages | Emoji chỉ dùng trong code guide, KHÔNG dùng trong báo cáo |
| 7 | Văn phong quá suồng sã | "OK giờ mình làm bước này nha" | "Tiếp theo, chúng ta sẽ thực hiện…" |
| 8 | Câu quá dài, nhiều mệnh đề | Câu 50+ từ với 3-4 mệnh đề lồng nhau | Tách thành 2-3 câu ngắn hơn |
| 9 | Bỏ qua mục tiêu chương | Bắt đầu chương bằng nội dung luôn | Luôn có khối "Mục tiêu chương học" |
| 10 | Nhảy cấp heading | `##` → `####` mà không có `###` | Tuân thủ phân cấp heading |

---

## 10. Checklist trước khi hoàn thành chương

- [ ] Có khối "Mục tiêu chương học" ở đầu chương
- [ ] Đề mục đánh số đúng hệ thống thập phân (X.Y.Z)
- [ ] Không nhảy cấp heading
- [ ] Mỗi code snippet có comment đường dẫn file
- [ ] Mỗi code snippet có đoạn giới thiệu trước và giải thích sau
- [ ] Thuật ngữ tiếng Anh lần đầu có giải thích
- [ ] Viết tắt lần đầu có dạng đầy đủ
- [ ] Không có emoji trong nội dung báo cáo
- [ ] Tên file, class, method dùng backtick
- [ ] Có mục "Tổng kết" cuối chương
- [ ] Văn phong nhất quán: "chúng ta", giọng chủ động
- [ ] Đoạn văn đủ độ dài (4-8 câu), mỗi đoạn một ý
- [ ] Có tham chiếu nội bộ đến chương trước/sau khi liên quan
