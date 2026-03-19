# README — Git Workflow & Quy Trình Phát Triển

Tài liệu này đóng vai trò hướng dẫn chung cho toàn đội khi làm việc trên nhánh `main`. Mục tiêu là giữ lịch sử git gọn gàng, tránh conflict lớn và đảm bảo mỗi tính năng đi đúng quy trình: **Spec → Plan → Thực thi → Review → Merge**.

---

## 1. Mục tiêu
- Đồng bộ cách đặt nhánh, commit, rebase và tạo Pull Request.
- Chuẩn hóa pipeline làm việc từ lúc nhận task cho tới khi merge lên `develop`/`main`.
- Giảm thời gian review nhờ mô tả rõ cách kiểm thử và checklist hoàn thành.

---

## 2. Git Workflow

### 2.1 Cấu trúc nhánh
```
main
 └── develop
      ├── feature/vy-workspace-module
      ├── feature/vy-project-module
      ├── feature/phu-task-module
      ├── feature/phu-comments
      ├── feature/huyen-websocket
      └── feature/dat-dashboard-search
```
- `main`: chỉ chứa mã production, Đạt chịu trách nhiệm merge từ `develop` sau khi QA pass.
- `develop`: nơi hợp nhất tất cả tính năng đã được review, luôn ở trạng thái chạy được.
- `feature/*`: mỗi người tạo một nhánh cho từng task, đặt tên `<tên>/<mô-tả-ngắn>`.

### 2.2 Lần đầu clone
```bash
git clone <repo-url>
cd CCNLTHD
git checkout develop      # tuyệt đối không làm việc trên main
git branch                # kiểm tra đang ở * develop
```

### 2.3 Bắt đầu một tính năng
```bash
# Luôn cập nhật develop trước
git checkout develop
git pull origin develop

# Tạo nhánh mới từ develop
git checkout -b feature/<ten-branch>
# ví dụ: feature/vy-workspace-module, feature/phu-task-module
```

### 2.4 Trong quá trình làm việc
- Dùng `git status` để xem thay đổi, stage chọn lọc (`git add path/to/file`), tránh `git add .`.
- Commit message theo convention: `feat: ...`, `fix: ...`, `docs: ...`, `chore: ...`.
- Push lần đầu: `git push -u origin feature/<ten-branch>`, các lần sau chỉ `git push`.

### 2.5 Đồng bộ develop hằng ngày
```bash
# Đang ở nhánh feature của mình
git fetch origin
git rebase origin/develop

# Nếu conflict: chỉnh tay, git add <file>, git rebase --continue
# Sau rebase phải push bằng --force-with-lease
git push --force-with-lease
```

### 2.6 Tạo Pull Request
1. Đảm bảo build/test chạy sạch (`npm run lint`, `npm run test`, v.v.).
2. Rebase với develop mới nhất (theo 2.5) và push.
3. Trên GitHub: Base = `develop`, Compare = `feature/...`.
4. Title súc tích (vd: `feat: Workspace Module CRUD`), mô tả rõ phạm vi + cách test.
5. Assign reviewer: Đạt (hoặc người được phân công).

### 2.7 Sau khi PR được merge
```bash
git checkout develop
git pull origin develop

# Xóa nhánh local đã merge
git branch -d feature/<ten-branch>

# Tạo nhánh mới cho task tiếp theo
git checkout -b feature/<ten-moi>
```

---

## 3. Quy trình phát triển

| Bước | Người chịu trách nhiệm | Mô tả | Deliverable |
|------|------------------------|-------|-------------|
| 1. Nhận task & đọc spec | Tất cả | Kiểm tra `docs/superpowers/specs` + Trello/Trello Board | Xác nhận phạm vi, câu hỏi ban đầu |
| 2. Brainstorm & bổ sung yêu cầu | Người thực hiện | Ghi chú assumption, hỏi rõ luồng edge-case | Bình luận/ghi chú trong task |
| 3. Viết design doc (nếu task lớn) | Chủ task + reviewer | Mô tả API, schema, flow theo template | File `docs/superpowers/specs/YYYY-MM-DD-<topic>.md` |
| 4. Lập implementation plan | Chủ task | Chia step nhỏ, xác định file/chức năng ảnh hưởng | Checklist/Gist trong description |
| 5. Coding & tự test | Chủ task | Code theo plan, update migrate/test data nếu cần | Commit + log test cục bộ |
| 6. Code review & QA | Reviewer + QA | Kiểm tra logic, standard, chạy test E2E nếu có | Comment/Approve trên PR |
| 7. Merge & release note | Đạt + Team | Merge vào `develop`, sau sprint merge `main` + ghi lại changelog | PR merged + cập nhật CHANGELOG/Worklog |

### Checklist “Ready for Review”
- [ ] `npm run lint` và unit test liên quan pass.
- [ ] PR mô tả rõ endpoints/dto/schema được thêm hoặc sửa.
- [ ] Có migration thì ghi rõ ID + hướng dẫn rollback.
- [ ] Screenshot/Postman/Hoppscotch collection nếu là API mới.
- [ ] Update tài liệu (code guide, README, spec) nếu cần.

### Checklist “Ready to Merge”
- [ ] Reviewer approve + không còn comment pending.
- [ ] Resolve conflict (rebase mới nhất).
- [ ] Kiểm thử thủ công (nếu task ảnh hưởng UX).
- [ ] QA ký nhận (nếu task thuộc sprint hiện hành).

---

## 4. Liên hệ & hỗ trợ
- **Reviewer chính:** Đạt (`develop` owner, merge lên `main`).
- **Lead backend:** Vy (Workspace/Project modules).
- **Lead frontend:** Phú (Task/Subtask UI).
- **DevOps:** Huyền (WebSocket, Notification, deploy scripts).
- Ping qua Discord `#workspace-suite` trước khi đẩy breaking change hoặc cần trợ giúp rebase.

Giữ tài liệu này cập nhật khi quy trình thay đổi để toàn đội nắm cùng một nguồn sự thật.
