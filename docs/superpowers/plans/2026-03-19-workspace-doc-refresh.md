# Workspace Documentation Refresh Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align every PRD document with the approved Workspace Suite spec so business artifacts, flows, and APIs stay in sync with implementation.

**Architecture:** Update markdown sources under `docs/PRD` to describe workspace CRUD, member management, and invitation flows introduced in [workspace suite spec](../specs/2026-03-19-workspace-suite-design.md). Text-only diagrams (ERD, sequence, activity, DFD/BFD) will be refreshed using Mermaid syntax where applicable to avoid binary assets.

**Tech Stack:** Markdown, Mermaid, Markdownlint (CLI), Git.

---

## Chunk 1: Scope & Requirements Alignment

### Task 1: Update Business Requirements & Features

**Files:**
- Modify: `docs/PRD/01-REQUIREMENTS_GATHERING.md`
- Modify: `docs/PRD/04-FEATURES.md`
- Modify: `docs/PRD/05-NFR.md`
- Reference: `docs/superpowers/specs/2026-03-19-workspace-suite-design.md`

- [ ] **Step 1: Draft requirement deltas**
  - Summarize new workspace capabilities in a temporary scratchpad section at bottom of `01-REQUIREMENTS_GATHERING.md` (remove before Step 7) covering:
    - Limits: `MAX_WORKSPACES_PER_USER`, `MAX_MEMBERS_PER_WORKSPACE`, `.env` configurability
    - Roles & permissions: Owner/Admin/Member matrix per spec §4
    - Invitations: bulk (max 20/call), dedup order (`payload duplicates → skip members → skip active invites`), `{ created, skipped }` response, email simulation caveat, 7-day expiry
    - Ownership transfer workflow: invite member → optional promote to admin → transfer ownership (atomic swap, previous owner demoted to ADMIN)
    - Archived behavior: frozen member/invite mutations, accept endpoint returns `400 WORKSPACE_ARCHIVED`
    - Activity logging actions: `WORKSPACE_CREATED`, `WORKSPACE_RENAMED`, `WORKSPACE_ARCHIVED`, `MEMBER_ADDED`, `MEMBER_ROLE_CHANGED`, `INVITE_SENT`, `INVITE_ACCEPTED`, `INVITE_REVOKED`
- [ ] **Step 2: Rewrite functional requirement sections**
  - Integrate workspace concepts into functional requirement list (e.g., "System shall enforce MAX_WORKSPACES_PER_USER"), ensuring numbering stays consistent. If legacy bullets conflict, mark them as superseded instead of deleting.
- [ ] **Step 3: Update feature catalog**
  - In `04-FEATURES.md`, add subsections for:
    - Workspace CRUD: create, list, overview, update, archive/unarchive, delete (force)
    - Member Management: add/list members, promote/demote, ownership transfer (atomic swap), remove (owner guardrails)
    - Invitation Workflow: bulk create (max 20), dedup order, `{ created, skipped }` response, list pending, revoke, accept (public + JWT) and reject (shared validation), note email simulation constraint
    - Archive/Delete policy: frozen operations during archive, auto-revoke logging on delete
- [ ] **Step 4: Extend NFRs**
  - In `05-NFR.md`, add scalability/security entries for workspace limits, permission enforcement, invitation token handling (expiry, status enum), audit logging guarantees, and config-driven throttles.
- [ ] **Step 5: Proofread**
  - Read updated files end-to-end verifying consistent terminology (Owner/Admin/Member enum casing) and capitalized constants. Fix typos.
- [ ] **Step 6: Markdown lint**
  - Run `npx markdownlint docs/PRD/01-REQUIREMENTS_GATHERING.md docs/PRD/04-FEATURES.md docs/PRD/05-NFR.md`
  - Expected: No errors. Fix any reported issues and rerun.
- [ ] **Step 7: Commit**
  - Remove scratchpad content created in Step 1.
  - `git add docs/PRD/01-REQUIREMENTS_GATHERING.md docs/PRD/04-FEATURES.md docs/PRD/05-NFR.md`
  - `git commit -m "docs: align workspace requirements"`

### Task 2: Update Planning Artifact (WBS)

**Files:**
- Modify: `docs/PRD/15-WBS.md`

- [ ] **Step 1: Add workspace deliverables**
  - Insert WBS sections (following existing hierarchy, e.g., add new subsection under the backend track such as `3.4 Workspace` with child items `3.4.1 WorkspaceModule`, `3.4.2 WorkspaceMemberModule`, `3.4.3 WorkspaceInviteModule`).
  - For each module, list sub-deliverables: Controllers, Services, DTOs/validators, Guards/Interceptors, Unit tests, E2E tests, Documentation.
  - Reference spec §5 for endpoint counts and spec §8 for testing scope when estimating effort/dependencies.
- [ ] **Step 2: Cross-check numbering**
  - Ensure new sections follow existing WBS hierarchy levels (e.g., 3.2.1). Update totals if present.
- [ ] **Step 3: Markdown lint + commit**
  - `npx markdownlint docs/PRD/15-WBS.md`
  - `git add docs/PRD/15-WBS.md`
  - `git commit -m "docs: extend WBS with workspace items"`

## Chunk 2: User Stories, Use Cases, and Flows

### Task 3: Refresh User Stories & Use Cases

**Files:**
- Modify: `docs/PRD/02-USER_STORIES.md`
- Modify: `docs/PRD/03-USE_CASE.md`

- [ ] **Step 1: Map actors to roles**
  - Add Owner/Admin/Member personas to the intro of `02-USER_STORIES.md` with concise descriptions.
- [ ] **Step 2: Add workspace-specific stories**
  - Insert Gherkin-style stories for workspace creation, member management, invite acceptance, and archival guardrails.
- [ ] **Step 3: Update use-case diagrams/tables**
  - In `03-USE_CASE.md`, add new use cases (UC-WS-01 etc.) with descriptions, triggers, preconditions, success paths, alternate flows (e.g., invite expired, transfer ownership blocked).
- [ ] **Step 4: Validate traceability**
  - Ensure each new use case references corresponding requirement IDs from Task 1.
- [ ] **Step 5: Markdown lint & commit**
  - `npx markdownlint docs/PRD/02-USER_STORIES.md docs/PRD/03-USE_CASE.md`
  - `git add docs/PRD/02-USER_STORIES.md docs/PRD/03-USE_CASE.md`
  - `git commit -m "docs: add workspace user stories and use cases"`

### Task 4: Update Flow Diagrams (Sequence, Activity, DFD, BFD)

**Files:**
- Modify: `docs/PRD/09-SEQUENCE_DIAGRAM.md`
- Modify: `docs/PRD/10-ACTIVITY_DIAGRAM.md`
- Modify: `docs/PRD/11-DFD.md`
- Modify: `docs/PRD/12-BFD.md`

- [ ] **Step 1: Sketch sequence steps**
  - Outline interactions (Owner → API → Prisma → Email service) for invite acceptance and member management in plain text before converting to diagrams.
- [ ] **Step 2: Rewrite Mermaid diagrams**
  - For each file, update Mermaid blocks to include workspace flows (e.g., archiving, invite accept). Ensure diagrams render via VS Code preview.
- [ ] **Step 3: Validate consistency**
  - Cross-check that swimlanes/data flows align with use-case steps (Task 3).
- [ ] **Step 4: Markdown lint & commit**
  - `npx markdownlint docs/PRD/09-SEQUENCE_DIAGRAM.md docs/PRD/10-ACTIVITY_DIAGRAM.md docs/PRD/11-DFD.md docs/PRD/12-BFD.md`
  - `git add docs/PRD/09-SEQUENCE_DIAGRAM.md docs/PRD/10-ACTIVITY_DIAGRAM.md docs/PRD/11-DFD.md docs/PRD/12-BFD.md`
  - `git commit -m "docs: refresh workspace diagrams"`

## Chunk 3: Architecture, Data, and API Specs

### Task 5: Update ERD, Data Dictionary, and Class Diagram

**Files:**
- Modify: `docs/PRD/06-ERD.md`
- Modify: `docs/PRD/07-DATA_DICTIONARY.md`
- Modify: `docs/PRD/08-CLASS_DIAGRAM.md`

- [ ] **Step 1: Confirm schema deltas**
  - Compare current Prisma schema (workspace archived flag, Invitation status enum) against ERD; note missing fields.
- [ ] **Step 2: Update ERD Mermaid**
  - Modify relationships and fields (Workspace.archived, Invitation.status) ensuring cardinalities match.
- [ ] **Step 3: Revise data dictionary**
  - Document new columns, enums, and constraints (limits, default values) with descriptions.
- [ ] **Step 4: Update class diagram**
  - Reflect service classes (`WorkspacePermissionService`, `WorkspaceInviteService`) and their relationships.
- [ ] **Step 5: Markdown lint & commit**
  - `npx markdownlint docs/PRD/06-ERD.md docs/PRD/07-DATA_DICTIONARY.md docs/PRD/08-CLASS_DIAGRAM.md`
  - `git add docs/PRD/06-ERD.md docs/PRD/07-DATA_DICTIONARY.md docs/PRD/08-CLASS_DIAGRAM.md`
  - `git commit -m "docs: align ERD and data dictionary with workspace spec"`

### Task 6: Update Architecture Overview & API Specification

**Files:**
- Modify: `docs/PRD/13-ARCHITECTURE.md`
- Modify: `docs/PRD/14-API_SPECIFICATION.md`

- [ ] **Step 1: Refresh architecture narrative**
  - In `13-ARCHITECTURE.md`, describe the three workspace modules, shared guards, and activity logging pipeline; update diagrams as needed.
- [ ] **Step 2: Sync API endpoints**
  - In `14-API_SPECIFICATION.md`, add detailed endpoint tables for new workspace routes (request/response schemas, status codes, error codes) mirroring the engineering spec.
- [ ] **Step 3: Validate parameter consistency**
  - Ensure API doc fields align with DTO names (e.g., `transferOwnerTo`, `archived`).
- [ ] **Step 4: Markdown lint & commit**
  - `npx markdownlint docs/PRD/13-ARCHITECTURE.md docs/PRD/14-API_SPECIFICATION.md`
  - `git add docs/PRD/13-ARCHITECTURE.md docs/PRD/14-API_SPECIFICATION.md`
  - `git commit -m "docs: document workspace architecture and APIs"`

---

Implementation proceeds chunk-by-chunk with plan reviews between chunks to ensure accuracy.
