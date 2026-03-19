# Workspace Phase 3 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align Prisma schema/migrations and developer documentation with the approved Workspace Phase 3 spec.

**Architecture:** Update the Prisma models/enums to reflect workspace archiving, invitation lifecycle, and ownership constraints, then regenerate the client and run migrations. Refresh the Phase 3 code guide with Phase-2-style explanations so engineers can follow copy-ready snippets.

**Tech Stack:** Prisma ORM, PostgreSQL, NestJS backend, Markdown docs.

---

## File Map

| Area | Files |
| --- | --- |
| Prisma schema | `backend/prisma/schema.prisma` |
| Migration output | `backend/prisma/migrations/<timestamp>_workspace-suite-sync/migration.sql` |
| Seeds/config (if needed) | `backend/prisma/seed.ts` (verify ownership insert logic) |
| Docs | `docs/code_guide/phase-3-workspace-module.md` |

---

## Chunk 1: Prisma Schema + Migration

### Task 1: Add archived flag & owner constraints to Workspace

**Files:**
- Modify: `backend/prisma/schema.prisma`
- (Optional) Modify: `backend/prisma/seed.ts` if it seeds workspaces

- [ ] **Step 1:** Update `Workspace` model to include `archived Boolean @default(false)` and optional `deletedAt DateTime?` if soft-delete is needed; remove or document `ownerId` consistency per spec.
- [ ] **Step 2:** Ensure `WorkspaceMember` enforces a single owner via unique index: `@@unique([workspaceId], map: "workspace_owner_unique", name: "workspace_owner_unique", filter: role = OWNER)` (Prisma `@@unique([workspaceId, role])` with `@map`).

### Task 2: Invitation model overhaul

**Files:**
- Modify: `backend/prisma/schema.prisma`

- [ ] **Step 1:** Rename `Invitation` model to `WorkspaceInvite` (or create new model + map) with fields `status InvitationStatus @default(PENDING)`, `revokedAt DateTime?`, `acceptedAt DateTime?`, `token @unique`, and relation `invitedById` pointing to `WorkspaceMember`.
- [ ] **Step 2:** Declare `enum InvitationStatus { PENDING ACCEPTED EXPIRED REVOKED }` near other enums; add `@@index([workspaceId, status])` and `@@index([workspaceId, email, status])` for dedup queries.

### Task 3: Activity log enum hygiene

**Files:**
- Modify: `backend/prisma/schema.prisma`

- [ ] **Step 1:** Replace `action String` with `action ActivityLogAction` enum containing the spec’s actions (`WORKSPACE_CREATED`, ... `INVITE_REVOKED`).
- [ ] **Step 2:** Run-through for existing rows (if needed) to map text -> enum; update seed/fixtures accordingly.

### Task 4: Generate migration + client

**Files/Commands:**
- New: `backend/prisma/migrations/<timestamp>_workspace-suite-sync/migration.sql`

- [ ] **Step 1:** Run `cd backend && npx prisma migrate dev --name workspace-suite-sync`.
- [ ] **Step 2:** Inspect generated `migration.sql` to ensure expected ALTER TABLE statements (archived column, enum creation, invite rename, etc.).
- [ ] **Step 3:** Run `npx prisma generate` to refresh Prisma Client types.
- [ ] **Step 4:** Execute targeted tests to ensure Prisma compiles: `npm run lint && npm run test -- user` (as smoke check).
- [ ] **Step 5:** Commit schema + migration + generated artifacts:
  ```bash
  git add backend/prisma/schema.prisma backend/prisma/migrations
  git commit -m "feat(prisma): align workspace schema with phase 3 spec"
  ```

## Chunk 2: Phase 3 Code Guide Enhancements

### Task 1: Add Phase-2-style commentary to config + schema section

**Files:**
- Modify: `docs/code_guide/phase-3-workspace-module.md`

- [ ] **Step 1:** For each code block in sections 3.1 and 3.2, prepend short “Tại sao” paragraphs and inline comments (//) explaining imports, helper functions, environment motivations (mirroring Phase 2 style).

### Task 2: Annotate shared layer + module sections

**Files:**
- Modify: `docs/code_guide/phase-3-workspace-module.md`

- [ ] **Step 1:** Under sections 3.3 – 3.6, add narrative before each snippet plus inline comments in the code blocks (e.g., explain why `WorkspaceContextInterceptor` queries Prisma once, why guards call permission service, etc.).
- [ ] **Step 2:** Ensure DTO/Service samples include callouts like “// Vì sao không set role = OWNER ở đây”.

### Task 3: Testing appendix expansion

**Files:**
- Modify: `docs/code_guide/phase-3-workspace-module.md`

- [ ] **Step 1:** Add a small checklist describing how to run migrations before tests (bridge from Chunk 1), plus extra bullet on monitoring `_prisma_migrations` table.

### Task 4: Commit documentation updates

- [ ] **Step 1:** `git add docs/code_guide/phase-3-workspace-module.md`
- [ ] **Step 2:** `git commit -m "docs: annotate workspace phase 3 guide"`

---

Plan complete and saved to `docs/superpowers/plans/2026-03-19-workspace-impl-update.md`. Ready to execute?
