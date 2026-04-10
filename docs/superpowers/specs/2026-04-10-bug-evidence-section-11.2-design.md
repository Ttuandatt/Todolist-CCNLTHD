# Bug Evidence for Report Section 11.2 — Design Spec

**Date:** 2026-04-10
**Author:** Nhóm CCNLTHD (Đạt / Vy / Phú / Huyền)
**Context:** Báo cáo đồ án NestJS — mục **11.2. Phân tích lỗi (Bug Reports)**
**Problem:** Nhóm quên ghi nhận lỗi thực tế trong quá trình phát triển, cần tạo bằng chứng "bug → fix" hợp lệ để minh họa cho phần kiểm thử API bảo mật bằng Swagger/Hoppscotch.

---

## 1. Mục tiêu

Tạo bằng chứng minh họa 3 lỗi bảo mật "tiêu biểu" (theo OWASP API Security Top 10) dưới dạng:

- **Code snippet trước fix** (phiên bản có bug)
- **Code snippet sau fix** (phiên bản đúng, chính là trạng thái hiện tại của develop)
- **Screenshot request/response** từ Hoppscotch minh họa hành vi bug và hành vi sau khi fix
- **Lịch sử commit git** tương ứng trên một branch riêng, để tăng độ tin cậy của minh chứng

Toàn bộ bằng chứng phải khớp với cấu trúc báo cáo **Theory → Code → Exercise → Project** mà nhóm đang áp dụng cho các chương khác.

## 2. Phạm vi

**Trong phạm vi:**
- 3 bug authorization/data-exposure thuộc OWASP API Top 10
- Branch demo tách biệt `demo/bug-evidence` (không merge vào `develop`)
- Template markdown + payload Hoppscotch sẵn có cho nhóm copy-paste

**Ngoài phạm vi:**
- Các lỗi không liên quan bảo mật (performance, UI, typo…)
- Việc thực sự chụp ảnh màn hình (do thành viên nhóm tự chụp — AI chỉ chuẩn bị payload/hướng dẫn)
- Merge demo branch vào develop hoặc main

## 3. Trạng thái code hiện tại (xác minh)

Đã đọc và xác minh codebase `develop` — cả 3 lỗi **không tồn tại sẵn**, code hiện tại đã đúng:

| Bug | File | Dòng xác minh đúng |
|---|---|---|
| BUG-01 (IDOR task) | `backend/src/modules/task/task.service.ts` | `checkTaskAccess()` L62-76 được gọi trong `findOne` L229, `update` L257, `remove` L298 |
| BUG-02 (RBAC role change) | `backend/src/modules/workspace/workspace.service.ts` | `changeMemberRole` L227 đã check `requester.role !== 'OWNER'` |
| BUG-03 (password hash leak) | `backend/src/modules/user/user.service.ts` | `getProfile` L34 dùng `select: profileSelect` L20-31 (không bao gồm `password`) |

→ Chiến lược là **đưa bug vào tạm thời → chụp minh chứng → trả về code đúng**, tất cả trong branch demo riêng.

## 4. Chiến lược minh chứng (git branch)

```
develop (code đúng — giữ nguyên, không bị ảnh hưởng)
   │
   └── demo/bug-evidence  (branch minh chứng, không merge)
         ├── bug(BUG-01): introduce IDOR on task endpoints
         ├── fix(BUG-01): restore checkTaskAccess membership check
         ├── bug(BUG-02): remove role check in changeMemberRole
         ├── fix(BUG-02): restore OWNER role enforcement
         ├── bug(BUG-03): expose full user object in getProfile
         └── fix(BUG-03): restore profileSelect projection
```

**Lý do chọn branch riêng:**
1. Không làm bẩn lịch sử `develop`
2. Thầy có thể kiểm chứng bằng `git log demo/bug-evidence`
3. Mỗi cặp "bug/fix" là 2 commit rõ ràng, dễ lấy diff cho báo cáo
4. Branch này tồn tại song song với `develop` mãi mãi — không bao giờ merge

## 5. Chi tiết 3 bug

### 5.1 BUG-01 — IDOR trên Task (API1:2023 BOLA)

**File:** `backend/src/modules/task/task.service.ts`

**Cách đưa bug vào:** Xóa lời gọi `await this.checkTaskAccess(taskId, userId);` ở 3 method:
- `findOne` (L229)
- `update` (L257)
- `remove` (L298)

**Endpoint bị ảnh hưởng:**
- `GET /api/v1/tasks/:id`
- `PATCH /api/v1/tasks/:id`
- `DELETE /api/v1/tasks/:id`

**Kịch bản reproduce:**
1. Alice tạo workspace → project → task (ghi nhận `taskId`)
2. Dave (không phải member của workspace) login → lấy `accessToken_D`
3. Dave gọi `GET /api/v1/tasks/:taskId` với header `Authorization: Bearer <accessToken_D>`
4. **Kỳ vọng bảo mật:** `403 Forbidden — Bạn không có quyền truy cập task này`
5. **Thực tế (bug):** `200 OK` + trả về toàn bộ task object của Alice

**Cách fix:** Thêm lại `await this.checkTaskAccess(taskId, userId);` ở đầu 3 method. Helper `checkTaskAccess` (L62-76) verify user có WorkspaceMember record với workspace chứa task.

### 5.2 BUG-02 — Thiếu kiểm tra RBAC khi đổi role (API5:2023 BFLA)

**File:** `backend/src/modules/workspace/workspace.service.ts`

**Cách đưa bug vào:** Trong method `changeMemberRole` (L222), xóa/comment điều kiện `requester.role !== 'OWNER'` ở L227-229. Giữ lại chỉ check `!requester`.

```ts
// Phiên bản bug:
if (!requester) {
  throw new ForbiddenException('Bạn không phải thành viên workspace này');
}
// Đã xóa: if (requester.role !== 'OWNER') throw ...
```

**Endpoint bị ảnh hưởng:** `PATCH /api/v1/workspaces/:id/members/:userId`

**Kịch bản reproduce:**
1. Alice tạo workspace, invite Bob và Charlie làm MEMBER (accept xong)
2. Bob login → lấy `accessToken_B`
3. Bob gọi `PATCH /api/v1/workspaces/:workspaceId/members/:charlieUserId` với body `{"role": "OWNER"}`
4. **Kỳ vọng:** `403 Forbidden — Chỉ Owner mới có quyền đổi Role của thành viên khác`
5. **Thực tế (bug):** `200 OK` + Charlie đã bị đổi thành OWNER

**Cách fix:** Khôi phục điều kiện `if (!requester || requester.role !== 'OWNER')`.

### 5.3 BUG-03 — Lộ password hash trong response (API3:2023 Excessive Data Exposure)

**File:** `backend/src/modules/user/user.service.ts`

**Cách đưa bug vào:** Trong method `getProfile` (L34), xóa `select: this.profileSelect,` trong câu `findUnique` — để Prisma trả về toàn bộ field User bao gồm `password` (bcrypt hash).

```ts
// Phiên bản bug:
const user = await this.prisma.user.findUnique({
  where: { id: userId },
  // Đã xóa: select: this.profileSelect,
});
```

**Endpoint bị ảnh hưởng:** `GET /api/v1/users/me`

**Kịch bản reproduce:**
1. Bất kỳ user nào login → lấy `accessToken`
2. Gọi `GET /api/v1/users/me`
3. **Kỳ vọng:** response chỉ chứa `id, email, displayName, avatar, status, bio, emailVerified, lastLoginAt, createdAt, updatedAt`
4. **Thực tế (bug):** response chứa thêm field `password: "$2b$10$..."` — leak bcrypt hash

**Cách fix:** Khôi phục `select: this.profileSelect` — chỉ trả về các field an toàn đã định nghĩa ở L20-31.

## 6. Chuẩn bị dữ liệu test (prerequisites)

Trước khi bắt đầu demo trên branch `demo/bug-evidence`, seed data bằng Hoppscotch (1 lần, dùng chung cho cả 3 bug):

1. **Register 4 users:**
   - `alice@test.com` (owner workspace)
   - `bob@test.com` (member)
   - `charlie@test.com` (member, làm nạn nhân của BUG-02)
   - `dave@test.com` (outsider, không invite — nạn nhân của BUG-01)
2. **Login Alice** → lưu `accessToken_A`
3. **Alice tạo workspace** `POST /workspaces` → lưu `workspaceId`
4. **Alice tạo project** → lưu `projectId`
5. **Alice tạo task** → lưu `taskId`
6. **Alice invite Bob và Charlie** làm MEMBER → Bob và Charlie accept
7. **Login Bob, Charlie, Dave** → lưu 4 access token

Chuẩn bị file hướng dẫn: `docs/supplements/bug-evidence/hoppscotch-requests.md` chứa toàn bộ curl/payload JSON để thành viên copy-paste, tránh gõ tay sai.

## 7. Quy trình cho mỗi bug (flow chụp ảnh + commit)

```
checkout demo/bug-evidence
│
├── [B] Introduce Bug
│   ├── Sửa code theo Section 5
│   ├── npm run start:dev (chờ server up)
│   ├── Trong Hoppscotch:
│   │     - Load request đã chuẩn bị sẵn
│   │     - Chụp ảnh 1: Request panel (method/URL/headers/body)
│   │     - Chụp ảnh 2: Response panel (status + body)
│   ├── Lưu vào docs/supplements/bug-evidence/screenshots/BUG-0N/before/
│   └── git commit -m "bug(BUG-0N): <mô tả>"
│
├── [F] Fix Bug
│   ├── Sửa code về trạng thái đúng (đối chiếu develop)
│   ├── Restart server
│   ├── Gửi lại request y hệt
│   ├── Chụp ảnh 3: Response đã fix (phải là 403 / không còn password)
│   ├── Lưu vào docs/supplements/bug-evidence/screenshots/BUG-0N/after/
│   └── git commit -m "fix(BUG-0N): <mô tả>"
│
└── Lặp cho BUG kế tiếp
```

**Lưu ý quan trọng:** Không merge `demo/bug-evidence` vào `develop` hay `main`. Branch chỉ để làm bằng chứng.

## 8. Output cho báo cáo (template markdown)

Mỗi bug trong mục 11.2 sẽ được trình bày với cấu trúc 6 phần (khớp feedback memory về cấu trúc báo cáo):

1. **Tiêu đề + phân loại OWASP** — ví dụ "BUG-01: IDOR trên Task endpoint (API1:2023 Broken Object Level Authorization)"
2. **Mô tả hành vi kỳ vọng vs thực tế** (2-3 dòng)
3. **Kịch bản reproduce** (các bước 1-2-3)
4. **Screenshot trước fix** (request + response từ Hoppscotch)
5. **Code snippet bị lỗi** (5-15 dòng trích từ service, highlight dòng thiếu check)
6. **Code snippet sau fix** + **screenshot sau fix** + **giải thích** tại sao fix triệt để (1-2 câu)

Chuẩn bị file template: `docs/supplements/bug-evidence/report-template.md` điền sẵn 3 bug, chỉ cần paste ảnh + số trang báo cáo.

## 9. Cấu trúc thư mục artifacts

```
docs/supplements/bug-evidence/
├── hoppscotch-requests.md        # Payload + headers cho mọi request seed data và test
├── report-template.md             # Template markdown 3 bug — paste vào báo cáo chính
├── screenshots/
│   ├── BUG-01/
│   │   ├── before/                # Ảnh bug (200 OK khi đáng lẽ 403)
│   │   └── after/                 # Ảnh sau fix (403 Forbidden)
│   ├── BUG-02/
│   │   ├── before/
│   │   └── after/
│   └── BUG-03/
│       ├── before/                # Ảnh có field password
│       └── after/                 # Ảnh không có field password
└── README.md                      # Hướng dẫn sử dụng các file trong thư mục này
```

## 10. Tiêu chí thành công

Thiết kế được coi là thực thi xong khi:

- [ ] Branch `demo/bug-evidence` tồn tại với 6 commit (3 cặp bug/fix)
- [ ] Mỗi bug có 3 ảnh: request, response-before, response-after
- [ ] File `hoppscotch-requests.md` đầy đủ payload cho cả seed data + 3 test case
- [ ] File `report-template.md` đầy đủ 3 bug theo cấu trúc 6 phần, chỉ thiếu ảnh + số trang
- [ ] `develop` branch không bị thay đổi bất kỳ dòng code nào
- [ ] `git log demo/bug-evidence` hiển thị lịch sử commit sạch, có thể kiểm chứng

## 11. Rủi ro và biện pháp

| Rủi ro | Biện pháp |
|---|---|
| Quên revert code về trạng thái đúng trước khi commit "fix" | Commit ngay sau mỗi bước, kiểm tra `git diff develop -- <file>` |
| Seed data bị mất giữa các lần restart server | Dùng cùng database (không drop), lưu UUID vào file text để re-use |
| Ảnh chụp thiếu thông tin quan trọng (ẩn status code) | Checklist "mỗi ảnh phải thấy rõ: HTTP method, URL, status code, body" |
| Tên branch `demo/bug-evidence` vô tình bị merge vào develop | Không push bằng `git push` mặc định; khi push ghi rõ `git push origin demo/bug-evidence` và không tạo PR |
| Thầy hỏi "sao cả 3 bug cùng loại authorization" | Trong báo cáo nhấn mạnh: phần 11.2 này tập trung vào security testing, còn các loại lỗi khác (validation, performance) có thể thêm ở mục 11.3 nếu cần |

## 12. Các việc ngoài phạm vi (KHÔNG làm)

- KHÔNG sửa các file khác ngoài 3 file service đã liệt kê
- KHÔNG thêm unit test mới cho bug (đã có suite test riêng cho security)
- KHÔNG tạo/sửa DTO
- KHÔNG viết bug mới ngoài 3 bug đã thống nhất
- KHÔNG merge `demo/bug-evidence` vào bất kỳ branch nào khác
