# Bảng Phân Công Hoàn Thiện & Mở Rộng Các Module
**Ngày lập:** 27/03/2026 | **Tuần:** 9 (30/03 - 05/04) | **Giai đoạn:** Mở rộng Phase 3-5

---

## 📋 Tóm Tắt Trạng Thái Hiện Tại

| Module | Người | Giai đoạn | % Hoàn thành | Status |
|--------|--------|-----------|-------------|--------|
| **Auth** | Đạt | Phase 1 | 90% | ✅ Hoàn thành, chờ test email |
| **User** | Đạt | Phase 2 | 100% | ✅ Done |
| **Workspace** | Vy | Phase 3 | 70% | 🔄 Core CRUD done, chờ features |
| **Project** | Phú | Skeleton | 10% | ⏳ Chưa bắt đầu riêng |
| **Task** | Phú | Phase 4-5 | 75% | 🔄 Core CRUD done, chờ advanced |

---

## 👤 PHÂN CÔNG CHI TIẾT

### 1️⃣ ĐẠT — Auth Module Hoàn Thiện + Support

#### **Phạm vi:** Auth, Config, Email Service, Review/Merge

| # | Nhiệm vụ | Định nghĩa | Priority | Est. |
|---|----------|-----------|----------|------|
| A1 | Email Service Setup (Mock/SendGrid) | Tạo `EmailService`, config SendGrid hoặc mock cho dev | 🔴 High | 3h |
| A2 | Forgot-Password Flow | DTOs, endpoint `POST /auth/forgot-password`, token generation | 🔴 High | 2h |
| A3 | Reset-Password Flow | Endpoint `POST /auth/reset-password/<token>`, validate token TTL | 🔴 High | 2h |
| A4 | Email Verification (Optional) | Verify email khi signup, resend OTP flow | 🟡 Medium | 2h |
| A5 | Test Email Flows | Hoppscotch test: forgot → reset, resend, expired token | 🟡 Medium | 1.5h |
| A6 | Review & Merge Workspace/Task PRs | Code review Vy (Phase 3), Phú (Phase 4), hỗ trợ conflict | 🔴 High | 2-3h/ngày |
| A7 | Chuẩn hóa Response Format | Đảm bảo Auth, User endpoints follow TransformInterceptor | 🟡 Medium | 1h |
| A8 | Ch2 TypeScript Draft | Viết phần "Kiến thức nền tảng TypeScript" cho báo cáo | 🟡 Medium | 2-3h |

**Checklist Ready for Review:**
- [ ] Forgot-password + Reset-password endpoint test thành công trên Hoppscotch
- [ ] Email mock/SendGrid working
- [ ] No breaking changes so far

---

### 2️⃣ VY — Workspace Module + Project Module Lead

#### **Phạm vi:** Workspace complete, Project scaffold

| # | Nhiệm vụ | Định nghĩa | Priority | Est. |
|---|----------|-----------|----------|------|
| W1 | Transfer Ownership | Endpoint `PATCH /workspaces/:id/transfer-owner`, chỉ Owner được phép | 🔴 High | 1.5h |
| W2 | Viewer Role + Permissions | Add `VIEWER` role vào `WorkspaceMember`, audit RBAC guards | 🔴 High | 1.5h |
| W3 | Activity Log | Endpoint `GET /workspaces/:id/activity`, schema `WorkspaceActivityLog`, log create/update/delete/role-change events | 🔴 High | 3h |
| W4 | Invite Quota Per Member | Add `inviteQuota` field to `WorkspaceMember`, validate trước khi invite | 🟡 Medium | 1.5h |
| W5 | Finish Hoppscotch Collection | Cập nhật tất cả Workspace endpoints, test suite hoàn chỉnh | 🟡 Medium | 1.5h |
| W6 | Update API Spec Doc | Cập nhật `docs/API_SPECIFICATION.md` cho Workspace endpoints | 🟡 Medium | 1h |
| W7 | Prepare PR + Merge | Rebase, resolve conflicts, tạo PR với mô tả chi tiết + merge | 🔴 High | 1-2h |
| **Phase 3 wrap-up** | — | — | — | — |
| P1 | Project Module Skeleton | Tạo `src/modules/project/`, scaffold ProjectController/Service/Module | 🟡 Medium | 1.5h |
| P2 | Project DTO & Schema | CreateProjectDto, UpdateProjectDto, QueryProjectDto, Prisma model review | 🔴 High | 2h |
| P3 | Project CRUD Endpoints | `GET /projects`, `GET /projects/:id`, `POST /projects`, `PATCH /projects/:id`, `DELETE /projects/:id` | 🔴 High | 3h |
| P4 | Project-Workspace Relation | Validate `workspaceId`, enforce RBAC (only OWNER/ADMIN create) | 🔴 High | 1.5h |
| P5 | Draft PR for Project Module | Prepare branch, test, create PR description | 🟡 Medium | 1-2h |

**Checklist Ready for Review:**
- [ ] Workspace Activity Log tested (create/update/delete/role)
- [ ] Transfer Owner + Viewer role working
- [ ] All Workspace endpoints in Hoppscotch tested
- [ ] Project skeleton complete + 5 base endpoints

---

### 3️⃣ PHÚ — Task Module Mở Rộng + Complete

#### **Phạm vi:** Task advanced features, Project integration

| # | Nhiệm vụ | Định nghĩa | Priority | Est. |
|---|----------|-----------|----------|------|
| T1 | Attachments System | DTOs, schema `TaskAttachment`, upload endpoint `POST /tasks/:id/attachments`, delete, list | 🔴 High | 3h |
| T2 | Storage Service (S3-compatible) | Setup Minio/S3SDK, abstract storage interface (prepare để Huyền deploy) | 🟡 Medium | 2h |
| T3 | Drag-Drop Reorder (`order` field) | Add `order: Int` to Task schema, endpoint `PATCH /tasks/:id/reorder` | 🔴 High | 1.5h |
| T4 | Duplicate Task | Endpoint `POST /tasks/:id/duplicate` (copy title, description, labels, assignment) | 🟡 Medium | 2h |
| T5 | Move Task (between projects) | Endpoint `PATCH /tasks/:id/move` (validate destination project in same workspace) | 🔴 High | 1.5h |
| T6 | Time Tracking | Add `timeSpent: Int (minutes)` to Task, endpoint `PATCH /tasks/:id/time-spent` | 🟡 Medium | 1.5h |
| T7 | Multi-Status Caching | Optimize `GET /tasks?status=TODO,IN_PROGRESS` with Redis cache layer | 🟡 Medium | 2h |
| T8 | FilterTaskDto Enhancement | Support multi-filter (status[], priority[], label[], project[]) + pagination | 🟡 Medium | 1.5h |
| T9 | Hoppscotch Test Suite | Test: attachment upload/delete, reorder, duplicate, move, time-tracking | 🟡 Medium | 2h |
| T10 | Update API Spec + PR | Cập nhật endpoints doc, create PR, test integration với Project Module | 🔴 High | 1-2h |

**Checklist Ready for Review:**
- [ ] Attachment upload/delete working on local (S3-compatible mock)
- [ ] Drag-drop reorder + duplicate task tested
- [ ] Move task validates project ownership
- [ ] All endpoints in Hoppscotch

---

## 📅 Timeline & Milestone

### **Tuần 9 (30/03 - 05/04) — "MVP Workspace + Task Ready"**

| Ngày | Milestone | Owner | Status |
|------|-----------|-------|--------|
| **Thứ 2 (31/3)** | Vy merge PR Phase 3, Phú complete Phase 4 core | Vy + Phú | ⏳ |
| **Thứ 3 (01/4)** | Đạt review + merge Task PR, start Email Service | Đạt | ⏳ |
| **Thứ 4 (02/4)** | Phú start advanced Task features (attachments, duplicate) | Phú | ⏳ |
| **Thứ 5 (03/4)** | Vy complete Activity Log + Viewer Role | Vy | ⏳ |
| **Thứ 6 (04/4)** | Đạt test Email flows, start Ch2 draft | Đạt | ⏳ |
| **Chủ Nhật (05/4)** | Hợp nhóm: review status, plan Phase 6+ | All | 📞 |

### **Tuần 10 (06/04 - 12/04) — "Comment + Label Modules"**
- Phú: Finish Task attachments + storage service
- Vy: Project Module complete + merge
- Đạt: Email service deploy, Review Ch6-8 in report

---

## 🔗 Dependency Map

```
Auth (Đạt) ✅
    ├─ Email Service ← Forgot-Password (A1-A3)
    └─ Integration: User module ✅

User (Đạt) ✅
    ├─ Workspace (Vy, Phase 3)
    │   ├─ RBAC Guards ← Project (Vy, Phase 3.5)
    │   └─ Activity Log (W3)
    │
    ├─ Project (Vy, Phase 3.5)
    │   ├─ CRUD (P1-P5)
    │   └─ Task (Phú, Phase 4-5)
    │       ├─ Attachments (T1-T2)
    │       ├─ Drag-drop (T3)
    │       ├─ Duplicate/Move (T4-T5)
    │       ├─ Time Tracking (T6)
    │       └─ Caching (T7)
    │
    └─ Comment/Label/Notification (Tuần 10+)
```

---

## 📊 Effort & Allocation

| Người | Tổng Est. (h) | Công việc Chính | Công việc Phụ |
|-------|---------------|-----------------|---------------|
| **Đạt** | ~18h | Auth (Email, A1-A5, 12h) | Review/Merge (2-3h/ngày), Ch2 (2-3h) |
| **Vy** | ~20h | Workspace complete (W1-W7, 12h), Project skeleton (P1-P5, 8h) | — |
| **Phú** | ~21h | Task advanced (T1-T10, 20h), Project integration (1h) | — |

**Total:** ~59h công việc chính cho 3 người

---

## ✅ Success Criteria (Tuần 9)

- [ ] **Auth Module:** Forgot-password + Reset-password flow 100% test pass
- [ ] **Workspace Module:** Phase 3 merge done, Activity Log + Viewer Role working
- [ ] **Project Module:** Scaffold + 5 base CRUD endpoints ready for testing
- [ ] **Task Module:** Core CRUD done, advanced features (T1-T9) ≥80% complete
- [ ] **API Spec:** All endpoints documented + Hoppscotch collection updated
- [ ] **Report:** Ch2 draft ready for review

---

## 🚀 Next Steps (Tuần 10+)

1. **Huyền** starts Comment Module (chờ Phú finish attachments service)
2. **Huyền** starts Label Catalog (workspace-level, linked to Task module)
3. **Huyền** starts Dashboard/Search (queries across all modules)
4. **Đạt** merge tất cả PRs, prepare `develop` stable para Chapter 6-9 wrapping

---

## 📝 Notes & Risks

### **Risks:**
- **Email Service:** SendGrid integration may delay if API key issues → fallback to mock immediately
- **Storage:** S3-compatible service needs Docker setup → Huyền support required
- **RBAC Guards:** Any mistake in permission logic affects all modules → careful review

### **Assumptions:**
- Prisma migrations chạy smooth (no schema conflicts)
- No breaking changes to existing modules
- Hoppscotch collection update doesn't block PRs

---

**Last Updated:** 27/03/2026
