# Chapter 8 Database Design Refresh Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update section 8.3 of the system analysis chapter so it documents the full 17-entity Prisma schema with up-to-date descriptions and property tables.

**Architecture:** Expand the existing 8.3 structure by enhancing the overview paragraphs, then add grouped subsections that describe each entity with Markdown tables derived from `backend/prisma/schema.prisma`. Keep current numbering (8.3.x) while appending new subsections for collaboration, task execution, and communication entities.

**Tech Stack:** Markdown (docs/chapters/08-system-analysis-design-chapter.md), Prisma schema as reference, VS Code Markdown preview.

---

### Task 1: Refresh 8.3 overview text and ERD narrative

**Files:**
- Modify: `docs/chapters/08-system-analysis-design-chapter.md` (section 8.3.1–8.3.2)

- [x] **Step 1:** Open `docs/chapters/08-system-analysis-design-chapter.md` and locate subsection headings `### 8.3.1. Tổng quan schema` and `### 8.3.2. Biểu đồ quan hệ thực thể (ERD)`.
- [x] **Step 2:** Update the descriptive paragraphs under 8.3.1 to mention that the schema now contains 17 entities, grouped by Identity, Workspace, Task Execution, Communication, and Security domains.
- [x] **Step 3:** Expand the ERD narrative (8.3.2) to explain how the diagram covers all new entities and highlight key relationship chains (User → Workspace → Project → Task, Notification/Activity flows, etc.).
- [x] **Step 4:** Run `git diff docs/chapters/08-system-analysis-design-chapter.md` to verify only the intended sections changed.

### Task 2: Document Identity & Security entities (8.3.3–8.3.4)

**Files:**
- Modify: `docs/chapters/08-system-analysis-design-chapter.md` (existing subsections 8.3.3 and 8.3.4)
- Reference: `backend/prisma/schema.prisma`

- [x] **Step 1:** Under 8.3.3, rewrite the intro paragraph so it frames `User` as the central identity entity and mentions related enums (`UserStatus`).
- [x] **Step 2:** Insert a Markdown table with columns `Trường | Kiểu | Ghi chú` enumerating the main fields of `User` (id, email, password, status, timestamps, relations summary).
- [x] **Step 3:** For 8.3.4, rename the heading to “Các model hỗ trợ Authentication & Security” and add short subheadings plus property tables for `RefreshToken`, `PasswordReset`, and `InvalidatedToken`, pulling field data from `schema.prisma`.
- [x] **Step 4:** Conclude 8.3.4 with a paragraph summarizing how these tables implement refresh rotation and token blacklisting.
- [x] **Step 5:** Run `git diff docs/chapters/08-system-analysis-design-chapter.md` to confirm the tables render as expected (no other sections touched).

### Task 3: Add Workspace & Collaboration entity section (new 8.3.5)

**Files:**
- Modify: `docs/chapters/08-system-analysis-design-chapter.md` (insert new subsection after 8.3.4)
- Reference: `backend/prisma/schema.prisma`

- [x] **Step 1:** Insert a new heading `### 8.3.5. Nhóm Workspace & Collaboration` right after 8.3.4.
- [x] **Step 2:** Write a bridging paragraph explaining Workspace lifecycle and how `Workspace`, `WorkspaceMember`, `WorkspaceInvite`, and `Label` interact.
- [x] **Step 3:** For each entity, add a bolded subheading (e.g., `**Workspace**`) followed by a property table (fields, types, notes). Include key relations (ownerId, role enum, invite status) in the notes column.
- [x] **Step 4:** Highlight any critical constraints (e.g., `@@unique([workspaceId, userId])`, invite token expiry) directly below the tables in bullet form.
- [x] **Step 5:** Preview with `git diff` to ensure numbering and formatting remain consistent.

### Task 4: Add Project & Task Execution entity section (new 8.3.6)

**Files:**
- Modify: `docs/chapters/08-system-analysis-design-chapter.md`
- Reference: `backend/prisma/schema.prisma`

- [x] **Step 1:** Insert heading `### 8.3.6. Nhóm Project & Task Execution` after the new 8.3.5 section.
- [x] **Step 2:** Add an overview paragraph connecting `Project`, `Task`, `Subtask`, `TaskAssignment`, and `TaskLabel`.
- [x] **Step 3:** Create property tables for each entity, ensuring `Task` highlights enums (`TaskStatus`, `TaskPriority`), ordering fields (`position`), and estimate fields (`estimatedHours`).
- [x] **Step 4:** Add a short note on indexing/pagination strategy (e.g., indexes on `projectId`, `status`, `dueDate`).
- [x] **Step 5:** Verify table alignment via `git diff` or Markdown preview.

### Task 5: Add Communication & Activity entity section (new 8.3.7)

**Files:**
- Modify: `docs/chapters/08-system-analysis-design-chapter.md`
- Reference: `backend/prisma/schema.prisma`

- [x] **Step 1:** Insert heading `### 8.3.7. Nhóm Communication, Notification & Activity` following 8.3.6.
- [x] **Step 2:** Describe how `Comment`, `Attachment`, `Notification`, and `ActivityLog` support collaboration and auditing.
- [x] **Step 3:** Add property tables for each entity, emphasizing relations (`parentId` for threaded comments, `actorId`, `referenceType`, `workspaceId`).
- [x] **Step 4:** Add a closing paragraph covering how enums (`NotificationType`, `ActivityLogAction`) standardize event tracking.
- [x] **Step 5:** Review the entire Section 8.3 with `git diff` to ensure numbering, headings, and tables flow correctly.

### Task 6: Final verification and clean-up

**Files:**
- `docs/chapters/08-system-analysis-design-chapter.md`

- [x] **Step 1:** Run `git status` to confirm only the chapter and plan files changed.
- [x] **Step 2:** Re-open Section 8.3 in Markdown preview to visually confirm tables render and anchors are correct.
- [x] **Step 3:** Stage changes (`git add docs/chapters/08-system-analysis-design-chapter.md docs/superpowers/plans/2026-03-26-ch08-db-design-plan.md`).
- [x] **Step 4:** Prepare for code review or commit following repository guidelines.
