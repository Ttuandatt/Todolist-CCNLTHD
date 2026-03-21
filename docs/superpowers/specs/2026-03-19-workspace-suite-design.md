# Phase 3 Workspace Suite Design

## 1. Goal & Scope
- Build the full workspace experience that every later module depends on: workspace CRUD, membership, invitations, role policies, and baseline activity logging.
- Deliver three coordinated NestJS modules: `WorkspaceModule`, `WorkspaceMemberModule`, and `WorkspaceInviteModule`, each with clear controllers/services/DTOs plus shared permission helpers.
- Surface endpoints for owners/admins/members that let the frontend list, manage, and join workspaces while enforcing guardrails (limits, single owner, invite lifecycle).

### Out of scope
- Project/task CRUD (handled in later phases).
- Real-time socket broadcasts (HTTP endpoints only, but services should emit domain events for later gateway wiring).
- Email infrastructure: invitation emails will be simulated via logging / queue stub for now.

## 2. Data Model Updates
1. **Workspace limits**
   - Config file `src/common/config/workspace-limits.ts` exporting constants: `MAX_WORKSPACES_PER_USER = 50`, `MAX_MEMBERS_PER_WORKSPACE = 200` (values pulled from `.env` when available).
  - `WorkspaceService` checks limits before create/join, returning `BadRequestException` with actionable message. Owner counts toward member limit, so cap is evaluated on total rows in `WorkspaceMember` (including owner record).
2. **Invitation status**
   - Add enum `InvitationStatus { PENDING, ACCEPTED, EXPIRED, REVOKED }` and column `status InvitationStatus @default(PENDING)` to `Invitation` model via migration.
   - Keep `acceptedAt` for auditing, but business logic relies on `status`.
3. **Indexes**
   - Add Prisma index on `Invitation.workspaceId, status` to list pending invites quickly.
4. **ActivityLog**
   - Reuse existing table with new `action` values: `WORKSPACE_CREATED`, `WORKSPACE_RENAMED`, `WORKSPACE_ARCHIVED`, `MEMBER_ADDED`, `MEMBER_ROLE_CHANGED`, `INVITE_SENT`, `INVITE_ACCEPTED`, `INVITE_REVOKED`.
5. **Workspace archived flag**
  - Add boolean column `archived Boolean @default(false)` to `Workspace` (and Prisma DTO). All queries/selects include this field so frontend can distinguish archived entities. Soft-delete semantics rely on this flag; DELETE endpoint simply enforces `archived === true` before cascading removal.

## 3. Module Architecture
### 3.1 Shared utilities
- `WorkspaceContext` decorator + interceptor: resolves `workspaceId` from route param, loads workspace + caller membership once, attaches to `request.workspaceContext` (workspace, membership, permission flags).
- `WorkspacePermissionService`: exposes `assertOwner()`, `assertAdmin()`, `assertMember()`, and helper `canManageMembers(role)` used by guards / services.
- Guards: `WorkspaceOwnerGuard`, `WorkspaceAdminGuard`, `WorkspaceMemberGuard` (allows any member). Controllers compose them depending on capability.

### 3.2 WorkspaceModule
- **Controller** `workspace.controller.ts`
  - `POST /workspaces` (create) – requires authenticated user, checks per-user limit, auto-creates membership OWNER, logs `WORKSPACE_CREATED`.
  - `GET /workspaces` – list all workspaces where user is member, including role summary.
  - `GET /workspaces/:workspaceId` – overview with counts (projects, tasks, active invites, member summary) using aggregated Prisma queries.
  - `PATCH /workspaces/:workspaceId` – owner/admin rename/update description/icon; logs rename.
  - `PATCH /workspaces/:workspaceId/archive` – owner only, toggles archived flag (soft delete). When archived: member add/remove, role changes, and invite creation are blocked until unarchived; existing invites become frozen (cannot be accepted) but stay visible for auditing.
  - `DELETE /workspaces/:workspaceId` – owner only, requires workspace already archived and query flag `?force=true`; performs hard delete (Prisma cascade) and auto-revokes pending invites before removal, logging `INVITE_REVOKED` for each invite as part of the operation.
- **Service** responsibilities
  - Compose Prisma queries with `select` objects to avoid returning private data.
  - Call `WorkspaceMemberService.ensureOwnerMembership()` on create.
  - Use `ActivityLogService` helper to persist log entries.
  - Every mutation first calls `WorkspacePermissionService.assertWorkspaceIsActive(workspace)`; this helper throws `BadRequestException('WORKSPACE_ARCHIVED')` if `workspace.archived === true`, ensuring all member/invite routes respect archive state.

### 3.3 WorkspaceMemberModule
- **Controller** `workspace-member.controller.ts`
  - `GET /workspaces/:workspaceId/members` – admin+ sees paginated members.
  - `POST /workspaces/:workspaceId/members` – admin+ add existing user via `userId` with optional `role` (defaults MEMBER). Create flow never grants OWNER; ownership transfer only happens through the dedicated role endpoint. Enforces workspace member cap, prevents duplicates.
  - `PATCH /workspaces/:workspaceId/members/:memberId/role` –
    - Owner may promote member→admin, demote admin→member, or transfer ownership. When transferring, request body sends `{ role: 'OWNER', transferOwnerTo: '<targetMemberId>' }`; service swaps roles atomically and downgrades previous owner to ADMIN.
    - Admin may promote member→admin or demote admin→member but cannot touch owners.
  - `DELETE /workspaces/:workspaceId/members/:memberId` – admins may remove members; only owner may remove admins; nobody can remove the sole owner until ownership has been reassigned via transfer flow.
- **Service** logic
  - Methods `addMemberByUserId()`, `updateRole()`, `removeMember()`, returning sanitized DTOs.
  - Guards call `WorkspacePermissionService.assertCanManageTarget(currentRole, targetRole, action)` to centralize permission checks.
  - All methods log activity and emit domain events (future sockets).
  - Ownership transfer requires a distinct target member; newly created workspaces have only the owner, so workflow is: owner invites/adds another user → promotes to admin if needed → issues transfer request referencing that member. If no eligible target exists, service throws `400 NO_TRANSFER_TARGET`.

### 3.4 WorkspaceInviteModule
- **Controller** `workspace-invite.controller.ts`
  - `POST /workspaces/:workspaceId/invites` – admin+ create invites from email list (max 20 per call to keep request payload small and future email queue spikes predictable). Generates tokens (`uuid`), sets expiry (7 days `config.inviteExpiryDays`), enqueues email job (stub). Deduplicates existing members/invites.
  - `GET /workspaces/:workspaceId/invites` – admin+ list pending invites with pagination/filter.
  - `DELETE /workspaces/:workspaceId/invites/:inviteId` – admin+ revoke (status→REVOKED, log action).
  - `POST /workspace-invites/:token/accept` – public endpoint (bypasses workspace guard but still requires JWT). Steps: validate token + expiry + email matches current user email, ensure workspace member limit not exceeded, create membership if the user is not yet part of the workspace, otherwise just mark invite ACCEPTED so retries or multi-channel invites complete idempotently. Multiple invites for the same email can each be accepted; once membership exists, every remaining token simply flips to ACCEPTED without altering role. Logs activity in both cases.
  - `POST /workspace-invites/:token/reject` – required for Phase 3 to support UX parity; shares the same token+email validation path as accept, then marks invite REVOKED.
- **Service** responsibilities
  - Central `validateInviteToken()` returning invitation + workspace + inviter data.
  - Utility `createInviteEntries(emails, role, workspaceId, inviterId)` returning list of persisted invites for bulk operations.
  - Dedup order: (1) collapse duplicates inside payload keeping first occurrence, (2) skip emails already members, (3) skip emails with active invites (`status === PENDING` and not expired). Invites with `status IN (REVOKED, EXPIRED)` can be recreated.

## 4. Permissions Matrix
| Capability | Owner | Admin | Member | Unauthenticated |
|------------|-------|-------|--------|-----------------|
| Create workspace | ✅ (always) | ✅ (acting as individual user) | ✅ | ❌ |
| View workspace overview | ✅ | ✅ | ✅ | ❌ |
| Rename workspace | ✅ | ✅ | ❌ | ❌ |
| Archive/delete workspace | ✅ | ❌ | ❌ | ❌ |
| List/add/remove members | ✅ | ✅ (except owner role) | ❌ | ❌ |
| Promote/demote roles | ✅ | ✅ (member⇄admin only) | ❌ | ❌ |
| Create invites | ✅ | ✅ | ❌ | ❌ |
| View invites | ✅ | ✅ | ❌ | ❌ |
| Revoke invites | ✅ | ✅ | ❌ | ❌ |
| Accept invite | ✅ (self via token) | ✅ (self) | ✅ (self) | ❌ (route bypasses workspace guard but still requires JWT) |

## 5. Endpoint Details
Status conventions:
- `POST` create routes return **201** with DTO payload; bulk invite returns 207-style semantics encoded in body but still uses 201.
- `PATCH/DELETE` return **200** on success.
- Validation failures throw **400** (`WORKSPACE_LIMIT_REACHED`, `INVALID_ROLE_TRANSITION`, `WORKSPACE_ARCHIVED`). Duplicate resources raise **409** (e.g., adding existing member, transferring ownership without `transferOwnerTo`).
- Unauthorized/forbidden cases use **401/403** via guards automatically.

### 5.1 Workspace CRUD
| Method | URL | Body | Success Response | Notes |
|--------|-----|------|------------------|-------|
| POST | `/api/v1/workspaces` | `{ name, description? }` | workspace summary + membership role | Checks `MAX_WORKSPACES_PER_USER`; creates owner membership. |
| GET | `/api/v1/workspaces` | — | array of `{ workspaceId, name, role, projectsCount, archived }` | Uses Prisma `workspaceMemberships` include. |
| GET | `/api/v1/workspaces/:id` | — | overview object `{ meta, stats, permissions }` | Stats aggregated via `count` queries; permissions derived from membership. |
| PATCH | `/api/v1/workspaces/:id` | `{ name?, description? }` | updated workspace metadata | Owner/Admin guard. |
| PATCH | `/api/v1/workspaces/:id/archive` | `{ archived: boolean }` | workspace state | Owner only. When archiving, set `archived=true`, freeze member/invite mutations, and prevent future accepts until unarchived. |
| DELETE | `/api/v1/workspaces/:id?force=true` | — | `{ deleted: true }` | Owner only, workspace must already be archived and request must include `force=true`. Deletion cascades related entities and auto-revokes pending invites. |

### 5.2 Member Management
| Method | URL | Body | Response |
|--------|-----|------|----------|
| GET | `/api/v1/workspaces/:id/members` | query pagination | `{ items: MemberDto[], total }` |
| POST | `/api/v1/workspaces/:id/members` | `{ userId, role? }` | MemberDto | Validates user exists & not already member; role defaults MEMBER; owner creation blocked (only via ownership transfer). |
| PATCH | `/api/v1/workspaces/:id/members/:memberId/role` | `{ role, transferOwnerTo? }` | MemberDto | Owner transferring ownership sends `{ role: 'OWNER', transferOwnerTo: '<targetMemberId>' }`; service swaps roles and demotes previous owner to ADMIN. |
| DELETE | `/api/v1/workspaces/:id/members/:memberId` | — | `{ removed: true }` | If removing self and is owner, require `transferOwnerTo` param. |

### 5.3 Invitations
| Method | URL | Body | Response |
|--------|-----|------|----------|
| POST | `/api/v1/workspaces/:id/invites` | `{ invites: [{ email, role }] }` | `{ created: WorkspaceInviteDto[], skipped: string[] }` | Deduplicate emails; for existing members/invites the email is pushed into `skipped` array. Endpoint always returns 200 with partial success payload so FE can show per-email status. |
| GET | `/api/v1/workspaces/:id/invites` | query pagination/status filter | `{ items: InviteDto[], total }` |
| DELETE | `/api/v1/workspaces/:id/invites/:inviteId` | — | `{ revoked: true }` | Updates status, logs event. |
| POST | `/api/v1/workspace-invites/:token/accept` | — | `{ workspaceId, membershipRole }` | Route marked `@Public()` only to bypass workspace guards but still requires JWT; validates email, enforces member cap, and is idempotent if user already belongs to workspace. |
| POST | `/api/v1/workspace-invites/:token/reject` | — | `{ status: 'REVOKED' }` | Optional but keeps UX explicit. |

## 6. DTO & Validation Summary
- **CreateWorkspaceDto**: `name` required 3-80 chars, optional `description` <= 255.
- **UpdateWorkspaceDto**: both optional but require at least one field present (custom `AtLeastOneField` validator built with `class-validator` + `ValidatorConstraint`); use `TrimStringPipe` to strip whitespace.
- **AddMemberDto**: `userId` UUID, optional `role` enum default MEMBER; validator rejects `role === OWNER`.
- **UpdateMemberRoleDto**: `role` enum plus optional `transferOwnerTo` UUID. Service enforces transitions using `WorkspacePermissionService`.
- **RemoveMemberDto**: optional `transferOwnerTo` when removing self as owner (validated when required).
- **CreateInvitesDto**: array length 1-20; each entry has `email`, optional `role` (default MEMBER). Custom validator ensures emails are unique within payload and not already pending/accepted; service returns `{ created, skipped }` to reflect dedup.
- **Response DTOs** exported from `workspace.types.ts` for FE contracts:
  - `WorkspaceSummaryDto`: `{ id, name, description?, archived, createdAt, updatedAt, ownerId, role }`.
  - `WorkspaceOverviewDto`: `{ meta: WorkspaceSummaryDto, stats: { projects, activeTasks, invites, members }, permissions: { canManageMembers, canInvite, canArchive, canDelete } }`.
  - `WorkspaceMemberDto`: `{ memberId, userId, email, displayName, role, joinedAt }`.
  - `WorkspaceInviteDto`: `{ inviteId, email, role, status, expiresAt, createdAt, invitedById }`.
  - `BulkInviteResponseDto`: `{ created: WorkspaceInviteDto[], skipped: string[] }`.
  - Pagination wrapper `{ items, total, page, pageSize }` shared across listing endpoints.

Custom validators live under `src/workspace/validators/` (e.g., `at-least-one-field.validator.ts`, `unique-invite-emails.validator.ts`) and rely on `registerDecorator` so they integrate with `ValidationPipe`.

## 7. Activity Logging & Events
- `ActivityLogService.log(workspaceId, actorId, action, entityType, entityId, metadata)` called in each mutation service, e.g.

  ```ts
  await this.activityLog.log({
    workspaceId,
    actorId,
    action: 'MEMBER_ADDED',
    entityType: 'WorkspaceMember',
    entityId: member.id,
    metadata: { role: member.role }
  });
  ```

- Emit domain events (NestJS `EventEmitter2`) such as `workspace.member.added`, `workspace.invite.created`; future WebSocket gateway will subscribe.

## 8. Testing & Verification
1. Unit tests per service (workspace/member/invite) covering:
   - Limit enforcement (workspace count, member count).
   - Role transitions (owner transfer, admin demotion).
   - Invitation acceptance flows (valid token, expired token, mismatched email).
2. E2E tests (Jest + Supertest) for main flows:
   - Create workspace → list works → rename → archive/unarchive.
   - Add member by userId, promote/demote, remove.
   - Invite email flow: owner creates invite, invitee accepts via token, verify membership created and invite status updated.
3. Hoppscotch/Swagger manual script documented in code guide:
   - Sequence for workspace CRUD.
   - Member management.
   - Invitation accept/reject using bearer tokens of different users.

   Test suites live in `backend/test/workspace/*.e2e-spec.ts` (E2E) and `src/workspace/**/__tests__/*.spec.ts` (unit). Update `backend/test/jest-e2e.json` `testMatch` array to include `"<rootDir>/test/workspace/**/*.e2e-spec.ts"` so `npm run test:e2e` executes workspace flows.

## 9. Implementation Notes
- Use NestJS modules with `imports/exports` so `WorkspacePermissionService` can be consumed by future modules (Project/Task).
- All controllers guarded by `JwtAuthGuard`; invitation acceptance uses `@Public()` but still requires JWT (user must be logged in)—set route as public to bypass workspace guard yet manually check `req.user`.
- File structure under `src/workspace/`:
  - `workspace.module.ts`
  - `workspace.controller.ts`, `workspace.service.ts`
  - `member/workspace-member.module.ts`, controller/service/dtos
  - `invite/workspace-invite.module.ts`, controller/service/dtos
  - `decorators/workspace-context.decorator.ts`
  - `guards/workspace-owner.guard.ts`, `workspace-admin.guard.ts`
  - `interceptors/workspace-context.interceptor.ts`
  - `dto/*.dto.ts`

---
This design has been reviewed interactively and is ready for implementation planning.
