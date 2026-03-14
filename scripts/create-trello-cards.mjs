// Trello API setup
const KEY = 'f9bc4dd90ad86736c21f0028f127f4bb';
const TOKEN = 'ATTAa2556b736bf5b59f10f931c3d6ca97feb8b25a41f23356ca97f1f660b4ca0bc1BB42D7D2';
const BOARD_ID = '2xpmASUC';
const BASE = 'https://api.trello.com/1';

async function api(method, path, body = null) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('key', KEY);
  url.searchParams.set('token', TOKEN);
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status}: ${await res.text()}`);
  return res.json();
}

// Create list on board
async function createList(name, pos) {
  const list = await api('POST', `/boards/${BOARD_ID}/lists`, { name, pos });
  console.log(`✅ List: ${name} (${list.id})`);
  return list.id;
}

// Create card in list
async function createCard(listId, name, desc) {
  const card = await api('POST', `/cards`, { idList: listId, name, desc });
  console.log(`   📌 Card: ${name}`);
  return card.id;
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const weeks = [
  {
    name: 'Tuần 9 (09/03 - 15/03) 🔄 HIỆN TẠI',
    cards: [
      {
        name: '[ĐẠT] Phase 2: User Module — bắt đầu code',
        desc: `## Việc cần làm\n- [ ] Tạo UserModule (module.ts, controller.ts, service.ts, dto/)\n- [ ] GET /api/v1/users/me — xem profile\n- [ ] PATCH /api/v1/users/me — cập nhật profile\n- [ ] POST /api/v1/users/me/change-password — đổi mật khẩu\n- [ ] POST /api/v1/users/me/avatar — upload ảnh đại diện (Multer)\n- [ ] Setup git workflow: tạo nhánh feature/dat-user-module\n\n## Đạt được\n- 4 endpoints hoạt động, test được trên Hoppscotch\n- Static file serve /uploads/avatars/ hoạt động`,
      },
      {
        name: '[VY] Phase 3: Bắt đầu WorkspaceModule',
        desc: `## Việc cần làm\n- [ ] Clone repo, checkout develop, tạo nhánh feature/vy-workspace-module\n- [ ] Đọc code guide Phase 3 (Đạt viết)\n- [ ] Tạo cấu trúc thư mục: backend/src/modules/workspace/\n- [ ] workspace.module.ts, workspace.controller.ts, workspace.service.ts\n- [ ] dto/create-workspace.dto.ts, dto/update-workspace.dto.ts\n- [ ] Implement CRUD cơ bản: GET/POST/PATCH/DELETE /workspaces\n\n## Điều kiện bắt đầu\n- Phase 2 (User Module) đã xong\n- Đọc code guide Phase 3 từ Đạt`,
      },
      {
        name: '[PHÚ] Chuẩn bị Phase 4: Đọc code + Task DTOs',
        desc: `## Việc cần làm\n- [ ] Clone repo, checkout develop, tạo nhánh feature/phu-task-module\n- [ ] Đọc toàn bộ code Phase 1 (Auth) và Phase 2 (User) để hiểu pattern\n- [ ] Đọc code guide Phase 4 (Đạt sẽ viết)\n- [ ] Tạo sẵn DTO files:\n  - create-task.dto.ts\n  - update-task.dto.ts\n  - filter-task.dto.ts\n- [ ] Cài dnd-kit để dùng cho Kanban sau: npm install @dnd-kit/core\n\n## Điều kiện bắt đầu\n- Chờ Vy hoàn thành WorkspaceModule + ProjectModule`,
      },
      {
        name: '[HUYỀN] Setup Redis + Bull locally',
        desc: `## Việc cần làm\n- [ ] Clone repo, checkout develop, tạo nhánh feature/huyen-websocket\n- [ ] Chạy Redis local qua Docker: docker run -d -p 6379:6379 redis:7\n- [ ] Cài packages: npm install @nestjs/websockets @nestjs/platform-socket.io socket.io\n- [ ] Cài Bull: npm install @nestjs/bull bull && npm install -D @types/bull\n- [ ] Đọc code guide Phase 6 (Đạt sẽ viết)\n- [ ] Test kết nối Redis: redis-cli ping\n\n## Điều kiện bắt đầu\n- Phú hoàn thành Task Module + Comment Module (làm sau)`,
      },
    ],
  },
  {
    name: 'Tuần 10 (16/03 - 22/03)',
    cards: [
      {
        name: '[ĐẠT] Wrap up Phase 2 + Review PR Vy + Code guide Phase 5',
        desc: `## Việc cần làm\n- [ ] Test toàn bộ 4 endpoints Phase 2 với Hoppscotch\n- [ ] Xác nhận static file serve /uploads/avatars/ hoạt động\n- [ ] Merge feature/dat-user-module → develop (tạo PR)\n- [ ] Review PR của Vy (WorkspaceModule) trước khi merge\n- [ ] Viết code guide Phase 5 (RBAC + Comments) để Phú follow\n- [ ] Pair-program với Vy ở phần invite system (tạo token, xác thực token)`,
      },
      {
        name: '[VY] WorkspaceModule (Đạt hỗ trợ) + bắt đầu ProjectModule',
        desc: `## Việc cần làm\n### WorkspaceModule (hoàn thiện)\n- [ ] POST /workspaces/:id/invite — tạo invitation token (crypto.randomBytes)\n- [ ] POST /workspaces/accept-invite/:token — join workspace\n- [ ] GET /workspaces/:id/members — danh sách thành viên\n- [ ] PATCH /workspaces/:id/members/:userId — đổi role\n- [ ] DELETE /workspaces/:id/members/:userId — kick member\n- [ ] DELETE /workspaces/:id/leave — tự rời\n- [ ] Tạo PR lên develop, assign reviewer: Đạt\n\n### ProjectModule (bắt đầu)\n- [ ] Tạo thư mục backend/src/modules/project/\n- [ ] GET/POST /workspaces/:workspaceId/projects\n\n## Logic quan trọng\n- Khi tạo workspace → tự tạo WorkspaceMember với role OWNER\n- Invitation token expire sau 7 ngày\n- Log token ra console: [INVITE] Token: abc123 → email`,
      },
      {
        name: '[PHÚ] Phase 4: Task CRUD + Subtask',
        desc: `## Việc cần làm\n### TaskModule\n- [ ] GET /projects/:projectId/tasks (với filter + sort + pagination)\n- [ ] POST /projects/:projectId/tasks\n- [ ] GET /tasks/:id (kèm subtasks, assignees, labels, _count.comments)\n- [ ] PATCH /tasks/:id\n- [ ] DELETE /tasks/:id\n- [ ] PATCH /tasks/:id/status (TODO→IN_PROGRESS→REVIEW→DONE)\n- [ ] POST /tasks/:id/assign + DELETE /tasks/:id/assign/:userId\n- [ ] POST /tasks/:id/labels + DELETE /tasks/:id/labels/:labelId\n\n### Subtasks\n- [ ] POST /tasks/:id/subtasks\n- [ ] PATCH /tasks/:subtaskId/complete\n\n## Logic quan trọng\n- position dùng float (1.0, 2.0...) để dễ reorder sau\n- Subtask: không cho phép nested quá 1 cấp\n\n## Điều kiện bắt đầu\n- Vy đã merge WorkspaceModule + ProjectModule vào develop`,
      },
      {
        name: '[HUYỀN] Phase 6: WebSocket Gateway',
        desc: `## Việc cần làm\n- [ ] Tạo backend/src/modules/events/ (module, gateway, service)\n- [ ] Setup room strategy:\n  - workspace:{workspaceId}\n  - project:{projectId}\n  - task:{taskId}\n  - user:{userId}\n- [ ] WebSocket Authentication: verify JWT khi client connect\n- [ ] Implement events: task:created, task:updated, task:deleted, comment:created, member:joined, notification:new\n- [ ] Expose emitToProject(), emitToWorkspace() để các service khác gọi\n\n## Có thể mock data để test trước khi Task Module xong`,
      },
    ],
  },
  {
    name: 'Tuần 11 (23/03 - 29/03)',
    cards: [
      {
        name: '[ĐẠT] Phase 10: Dashboard + Search + Code guide Phase 5',
        desc: `## Việc cần làm\n### Backend Dashboard/Search\n- [ ] GET /api/v1/me/tasks — tasks được assign cross-workspace\n- [ ] GET /api/v1/me/tasks?filter=today — tasks due hôm nay\n- [ ] GET /api/v1/me/tasks?filter=overdue — tasks quá hạn\n- [ ] GET /projects/:id/tasks/search?q=keyword — full-text search\n- [ ] Advanced filter: status + priority + assigneeId + labelIds + dueDate\n\n### Frontend Dashboard\n- [ ] Trang "My Tasks" — bảng tasks, group theo workspace\n- [ ] Dashboard widgets: overdue count, due today, in-progress\n- [ ] Search bar với debounce 300ms\n- [ ] Advanced filter panel\n\n## Điều kiện\n- Phú hoàn thành Task Module`,
      },
      {
        name: '[VY] ProjectModule + LabelModule + Frontend Workspace UI',
        desc: `## Việc cần làm\n### ProjectModule (hoàn thiện)\n- [ ] GET /projects/:id (kèm taskCountByStatus)\n- [ ] PATCH /projects/:id\n- [ ] DELETE /projects/:id\n- [ ] POST /projects/:id/archive + unarchive\n\n### LabelModule\n- [ ] GET /workspaces/:workspaceId/labels\n- [ ] POST /workspaces/:workspaceId/labels\n- [ ] PATCH /labels/:id\n- [ ] DELETE /labels/:id\n\n### Frontend\n- [ ] Layout: Sidebar trái (workspace list + project list), Header\n- [ ] Workspace Switcher dropdown\n- [ ] Trang Workspace Settings (members, invite, đổi role)\n- [ ] Trang Projects list\n- [ ] Label Manager modal`,
      },
      {
        name: '[PHÚ] Phase 5: RBAC + Comments + Activity Log',
        desc: `## Việc cần làm\n### RBAC Guard\n- [ ] workspace-role.guard.ts + workspace-member.guard.ts\n- [ ] require-role.decorator.ts\n- [ ] Áp dụng vào Task endpoints, báo Vy áp dụng vào Workspace/Project\n\n### Comment Module\n- [ ] GET /tasks/:taskId/comments (pagination)\n- [ ] POST /tasks/:taskId/comments\n- [ ] PATCH /comments/:id (chỉ author)\n- [ ] DELETE /comments/:id (author hoặc Admin/Owner)\n- [ ] Detect @mention trong content\n\n### Activity Log\n- [ ] activity.module.ts + activity.service.ts\n- [ ] Ghi log khi: task tạo/xóa/update status/assign, comment, member join/kick\n- [ ] GET /workspaces/:id/activities`,
      },
      {
        name: '[HUYỀN] Phase 7: Notifications + File Upload',
        desc: `## Việc cần làm\n### Notification Module\n- [ ] GET /notifications (paginated)\n- [ ] PATCH /notifications/:id/read\n- [ ] PATCH /notifications/read-all\n- [ ] GET /notifications/unread-count\n- [ ] PATCH /notifications/preferences\n- [ ] Triggers: TASK_ASSIGNED, TASK_COMMENTED, MENTIONED, DUE_DATE_REMINDER, WORKSPACE_INVITE\n\n### Due Date Reminder (Bull Queue)\n- [ ] Setup BullModule với Redis\n- [ ] ReminderProcessor chạy cron 8:00 sáng hàng ngày\n- [ ] Query tasks due tomorrow + có assignees → tạo notification\n\n### File Attachment\n- [ ] POST /tasks/:taskId/attachments (max 10MB)\n- [ ] GET /tasks/:taskId/attachments\n- [ ] DELETE /attachments/:id`,
      },
    ],
  },
  {
    name: 'Tuần 12 (30/03 - 05/04) — Integration & Polish',
    cards: [
      {
        name: '[ĐẠT] Integration test + Bug fix + Final merge',
        desc: `## Việc cần làm\n- [ ] Integration test toàn bộ luồng: Register → Login → Workspace → Project → Task → Comment\n- [ ] Test WebSocket real-time với 2 browser cùng lúc\n- [ ] Fix bugs từ team báo\n- [ ] Merge develop → main (final)\n- [ ] Cập nhật WORKLOG_NHOM.md tổng kết\n- [ ] Review Hoppscotch collection, đảm bảo đủ tất cả endpoints`,
      },
      {
        name: '[VY] Frontend: UI Polish',
        desc: `## Việc cần làm\n- [ ] Responsive design kiểm tra trên mobile\n- [ ] Loading states cho tất cả API calls\n- [ ] Error handling: toast thông báo lỗi rõ ràng\n- [ ] Empty states khi không có data\n- [ ] Workspace Switcher animation smooth\n- [ ] Label color picker hoạt động đúng`,
      },
      {
        name: '[PHÚ] Frontend: Kanban Board + Task Detail UI',
        desc: `## Việc cần làm\n- [ ] Kanban Board: 4 cột (TODO | IN_PROGRESS | REVIEW | DONE)\n- [ ] Kéo thả task giữa các cột dùng dnd-kit\n- [ ] Sau khi drop: PATCH /tasks/:id/status, cập nhật position\n- [ ] Task Detail Modal: subtasks, comments, attachments, activity log\n- [ ] Task Create/Edit Form: đầy đủ fields\n- [ ] Comment Section trong Task Detail\n- [ ] Label Selector khi tạo/sửa task`,
      },
      {
        name: '[HUYỀN] Frontend: Real-time + Notification UI + Docker',
        desc: `## Việc cần làm\n### Frontend Real-time\n- [ ] Socket.io client: connect khi login, disconnect khi logout\n- [ ] Khi nhận task:updated → update Zustand store → UI re-render\n- [ ] Notification Bell: badge số unread, dropdown list\n- [ ] Click notification → navigate đến task + mark as read\n- [ ] File Upload UI: drag & drop, progress bar, list files\n\n### Docker / DevOps\n- [ ] Dockerfile cho backend (multi-stage build)\n- [ ] Dockerfile cho frontend (build React → nginx)\n- [ ] docker-compose.yml root: backend + frontend + postgres + redis\n- [ ] .env.example đầy đủ biến môi trường\n- [ ] Test: docker-compose up --build chạy được toàn stack`,
      },
    ],
  },
];

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('🚀 Bắt đầu tạo Trello cards...\n');

  // Get existing lists to find max position
  const existingLists = await api('GET', `/boards/${BOARD_ID}/lists`);
  const maxPos = Math.max(...existingLists.map(l => l.pos));

  let pos = maxPos + 16384;

  for (const week of weeks) {
    console.log(`\n📅 Tạo list: ${week.name}`);
    const listId = await createList(week.name, pos);
    pos += 16384;

    for (const card of week.cards) {
      await createCard(listId, card.name, card.desc);
      await new Promise(r => setTimeout(r, 200)); // rate limit
    }
  }

  console.log('\n✅ Xong! Vào Trello kiểm tra board.');
}

main().catch(console.error);
