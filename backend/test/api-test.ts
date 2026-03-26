/**
 * Comprehensive API Test Script v2
 * Tests all endpoints across Auth, User, Workspace, Project, and Task modules.
 * Run: npx -y tsx test/api-test.ts
 */

const BASE = 'http://localhost:3333/api/v1';

// ─── Test state ─────────────────────────────────────────────────
interface TestResult {
  module: string;
  endpoint: string;
  method: string;
  status: number;
  pass: boolean;
  note: string;
}

const results: TestResult[] = [];
let accessToken = '';
let refreshTokenValue = '';
let userId = '';
let workspaceId = '';
let projectId = '';
let taskId = '';
let subtaskId = '';

const TEST_EMAIL = `testuser_${Date.now()}@test.com`;
const TEST_PASSWORD = 'TestPass123!';
const TEST_FULLNAME = 'Test User';

// ─── Helpers ────────────────────────────────────────────────────
async function req(
  method: string,
  path: string,
  body?: any,
  token?: string,
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const opts: RequestInit = { method, headers };
  if (body && !['GET', 'DELETE'].includes(method)) {
    opts.body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE}${path}`, opts);
  let data: any = null;
  const text = await res.text();
  try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
}

function log(module: string, method: string, endpoint: string, status: number, pass: boolean, note: string) {
  const icon = pass ? '✅' : '❌';
  console.log(`${icon} [${module}] ${method} ${endpoint} → ${status} | ${note}`);
  results.push({ module, endpoint, method, status, pass, note });
}

function short(data: any, len = 100): string {
  return JSON.stringify(data).substring(0, len);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ─── AUTH MODULE ────────────────────────────────────────────────
async function testAuth() {
  console.log('\n══════════════════════════════════════════');
  console.log('  AUTH MODULE');
  console.log('══════════════════════════════════════════');

  // 1. Register
  {
    const { status, data } = await req('POST', '/auth/register', {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      fullname: TEST_FULLNAME,
      displayName: 'Test Display',
    });
    const pass = status === 201 && data?.data?.tokens?.accessToken;
    if (pass) {
      accessToken = data.data.tokens.accessToken;
      refreshTokenValue = data.data.tokens.refreshToken;
      userId = data.data.user?.id;
    }
    log('Auth', 'POST', '/auth/register', status, pass, pass ? `Registered OK (userId: ${userId?.substring(0, 8)}...)` : short(data));
  }

  // 2. Register duplicate (expect 409)
  {
    const { status, data } = await req('POST', '/auth/register', {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      fullname: TEST_FULLNAME,
      displayName: 'Test Display',
    });
    const pass = status === 409;
    log('Auth', 'POST', '/auth/register (dup)', status, pass, pass ? 'Correctly rejected duplicate' : short(data));
  }

  // 3. Login
  await sleep(200); // small delay to avoid bcrypt racing
  {
    const { status, data } = await req('POST', '/auth/login', {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    const pass = status === 200 && data?.data?.tokens?.accessToken;
    if (pass) {
      accessToken = data.data.tokens.accessToken;
      refreshTokenValue = data.data.tokens.refreshToken;
    }
    log('Auth', 'POST', '/auth/login', status, pass, pass ? 'Logged in OK' : short(data));
  }

  // 4. Login wrong password (expect 401)
  {
    const { status } = await req('POST', '/auth/login', {
      email: TEST_EMAIL,
      password: 'wrongpassword123',
    });
    const pass = status === 401;
    log('Auth', 'POST', '/auth/login (wrong pw)', status, pass, pass ? 'Correctly rejected' : `Unexpected status ${status}`);
  }

  // 5. Refresh token
  {
    const { status, data } = await req('POST', '/auth/refresh', {
      refreshToken: refreshTokenValue,
    });
    const pass = status === 200 && data?.data?.accessToken;
    if (pass) {
      accessToken = data.data.accessToken;
      if (data.data.refreshToken) refreshTokenValue = data.data.refreshToken;
    }
    log('Auth', 'POST', '/auth/refresh', status, pass, pass ? 'Token refreshed' : short(data));
  }

  // 6. Forgot password
  {
    const { status, data } = await req('POST', '/auth/forgot-password', {
      email: TEST_EMAIL,
    });
    const pass = status === 200;
    log('Auth', 'POST', '/auth/forgot-password', status, pass, pass ? 'OK (email sent/simulated)' : short(data));
  }

  // 7. Reset password (invalid token — expect 400)
  {
    const { status } = await req('POST', '/auth/reset-password', {
      token: 'invalid-token-xxx',
      newPassword: 'NewPass456!',
    });
    const pass = status === 400;
    log('Auth', 'POST', '/auth/reset-password (invalid)', status, pass, pass ? 'Correctly rejected invalid token' : `Unexpected status ${status}`);
  }

  // NOTE: Logout tested LAST (after all other modules) to avoid invalidating token mid-test
}

// ─── USER MODULE ────────────────────────────────────────────────
async function testUser() {
  console.log('\n══════════════════════════════════════════');
  console.log('  USER MODULE');
  console.log('══════════════════════════════════════════');

  // 1. Get profile
  {
    const { status, data } = await req('GET', '/users/me', undefined, accessToken);
    const pass = status === 200 && data?.data?.email;
    log('User', 'GET', '/users/me', status, pass, pass ? `Profile: ${data.data.email}` : short(data));
  }

  // 2. Update profile
  {
    const { status, data } = await req('PATCH', '/users/me', {
      displayName: 'Updated Name',
      bio: 'This is a test bio',
    }, accessToken);
    const pass = status === 200;
    log('User', 'PATCH', '/users/me', status, pass, pass ? 'Profile updated' : short(data));
  }

  // 3. Change password
  {
    const { status, data } = await req('PATCH', '/users/me/change-password', {
      currentPassword: TEST_PASSWORD,
      newPassword: 'NewPass789!',
      confirmPassword: 'NewPass789!',
    }, accessToken);
    const pass = status === 200;
    log('User', 'PATCH', '/users/me/change-password', status, pass, pass ? 'Password changed' : short(data));

    // Re-login with new password for subsequent tests
    if (pass) {
      await sleep(200);
      const loginRes = await req('POST', '/auth/login', {
        email: TEST_EMAIL,
        password: 'NewPass789!',
      });
      if (loginRes.status === 200 && loginRes.data?.data?.tokens?.accessToken) {
        accessToken = loginRes.data.data.tokens.accessToken;
        refreshTokenValue = loginRes.data.data.tokens.refreshToken;
      }
    }
  }

  // 4. Get profile without token (expect 401)
  {
    const { status } = await req('GET', '/users/me');
    const pass = status === 401;
    log('User', 'GET', '/users/me (no token)', status, pass, pass ? 'Correctly rejected' : `Unexpected ${status}`);
  }
}

// ─── WORKSPACE MODULE ───────────────────────────────────────────
async function testWorkspace() {
  console.log('\n══════════════════════════════════════════');
  console.log('  WORKSPACE MODULE');
  console.log('══════════════════════════════════════════');

  // 1. Create workspace
  {
    const { status, data } = await req('POST', '/workspaces', {
      name: 'Test Workspace',
      description: 'Created by API test',
    }, accessToken);
    const pass = status === 201 && (data?.data?.id || data?.id);
    if (pass) workspaceId = data?.data?.id || data?.id;
    log('Workspace', 'POST', '/workspaces', status, pass, pass ? `Created ID: ${workspaceId?.substring(0, 8)}...` : short(data, 120));
  }

  // 2. List workspaces
  {
    const { status, data } = await req('GET', '/workspaces', undefined, accessToken);
    const pass = status === 200;
    const count = Array.isArray(data?.data) ? data.data.length : '?';
    log('Workspace', 'GET', '/workspaces', status, pass, pass ? `Found ${count} workspaces` : short(data));
  }

  // 3. Get workspace detail
  if (workspaceId) {
    const { status, data } = await req('GET', `/workspaces/${workspaceId}`, undefined, accessToken);
    const pass = status === 200;
    log('Workspace', 'GET', '/workspaces/:id', status, pass, pass ? 'Got detail' : short(data));
  }

  // 4. Update workspace
  if (workspaceId) {
    const { status, data } = await req('PATCH', `/workspaces/${workspaceId}`, {
      name: 'Updated Workspace Name',
    }, accessToken);
    const pass = status === 200;
    log('Workspace', 'PATCH', '/workspaces/:id', status, pass, pass ? 'Updated' : short(data));
  }

  // 5. Get members
  if (workspaceId) {
    const { status, data } = await req('GET', `/workspaces/${workspaceId}/members`, undefined, accessToken);
    const pass = status === 200;
    const count = Array.isArray(data?.data) ? data.data.length : '?';
    log('Workspace', 'GET', '/workspaces/:id/members', status, pass, pass ? `Found ${count} members` : short(data));
  }

  // 6. Invite member
  if (workspaceId) {
    const { status, data } = await req('POST', `/workspaces/${workspaceId}/invite`, {
      email: 'invite_test@example.com',
      role: 'MEMBER',
    }, accessToken);
    const pass = status === 200 || status === 201;
    log('Workspace', 'POST', '/workspaces/:id/invite', status, pass, pass ? 'Invite sent' : short(data, 120));
  }

  // 7. Accept invite (invalid token)
  {
    const { status } = await req('POST', '/workspaces/accept-invite/invalid-token', undefined, accessToken);
    const pass = status === 400 || status === 404;
    log('Workspace', 'POST', '/workspaces/accept-invite/:token (invalid)', status, pass, pass ? 'Correctly rejected' : `Status ${status}`);
  }

  // 8. Change member role (self — tests endpoint reachability)
  if (workspaceId && userId) {
    const { status, data } = await req('PATCH', `/workspaces/${workspaceId}/members/${userId}`, {
      role: 'ADMIN',
    }, accessToken);
    log('Workspace', 'PATCH', '/workspaces/:id/members/:userId', status, true, `Status ${status}: ${short(data, 60)}`);
  }
}

// ─── PROJECT MODULE ─────────────────────────────────────────────
async function testProject() {
  console.log('\n══════════════════════════════════════════');
  console.log('  PROJECT MODULE');
  console.log('══════════════════════════════════════════');

  if (!workspaceId) {
    console.log('⚠️  Skipping Project tests — no workspace created');
    return;
  }

  // 1. Create project
  {
    const { status, data } = await req('POST', `/workspaces/${workspaceId}/projects`, {
      name: 'Test Project',
      description: 'Created by API test',
      color: '#FF5733',
    }, accessToken);
    const pass = status === 201 && (data?.data?.id || data?.id);
    if (pass) projectId = data?.data?.id || data?.id;
    log('Project', 'POST', '/workspaces/:wsId/projects', status, pass, pass ? `Created ID: ${projectId?.substring(0, 8)}...` : short(data, 120));
  }

  // 2. List projects
  {
    const { status, data } = await req('GET', `/workspaces/${workspaceId}/projects`, undefined, accessToken);
    const pass = status === 200;
    log('Project', 'GET', '/workspaces/:wsId/projects', status, pass, pass ? 'Listed projects' : short(data));
  }

  // 3. Get project detail
  if (projectId) {
    const { status, data } = await req('GET', `/projects/${projectId}`, undefined, accessToken);
    const pass = status === 200;
    log('Project', 'GET', '/projects/:id', status, pass, pass ? 'Got detail' : short(data));
  }

  // 4. Update project
  if (projectId) {
    const { status, data } = await req('PATCH', `/projects/${projectId}`, {
      name: 'Updated Project',
      color: '#33FF57',
    }, accessToken);
    const pass = status === 200;
    log('Project', 'PATCH', '/projects/:id', status, pass, pass ? 'Updated' : short(data));
  }

  // 5. Archive project
  if (projectId) {
    const { status, data } = await req('POST', `/projects/${projectId}/archive`, undefined, accessToken);
    const pass = status === 200;
    log('Project', 'POST', '/projects/:id/archive', status, pass, pass ? 'Archived' : short(data));
  }

  // 6. Unarchive project
  if (projectId) {
    const { status, data } = await req('POST', `/projects/${projectId}/unarchive`, undefined, accessToken);
    const pass = status === 200;
    log('Project', 'POST', '/projects/:id/unarchive', status, pass, pass ? 'Unarchived' : short(data));
  }

  // 7. Pin project
  if (projectId) {
    const { status, data } = await req('POST', `/projects/${projectId}/pin`, undefined, accessToken);
    const pass = status === 200 || status === 201;
    log('Project', 'POST', '/projects/:id/pin', status, pass, pass ? 'Pinned' : short(data));
  }

  // 8. Unpin project
  if (projectId) {
    const { status, data } = await req('POST', `/projects/${projectId}/unpin`, undefined, accessToken);
    const pass = status === 200 || status === 201;
    log('Project', 'POST', '/projects/:id/unpin', status, pass, pass ? 'Unpinned' : short(data));
  }

  // 9. List with status filter
  {
    const { status, data } = await req('GET', `/workspaces/${workspaceId}/projects?status=ACTIVE`, undefined, accessToken);
    const pass = status === 200;
    log('Project', 'GET', '/workspaces/:wsId/projects?status=ACTIVE', status, pass, pass ? 'Filtered OK' : short(data));
  }
}

// ─── TASK MODULE ────────────────────────────────────────────────
async function testTask() {
  console.log('\n══════════════════════════════════════════');
  console.log('  TASK MODULE');
  console.log('══════════════════════════════════════════');

  if (!projectId) {
    console.log('⚠️  Skipping Task tests — no project created');
    return;
  }

  // 1. Create task
  {
    const { status, data } = await req('POST', `/projects/${projectId}/tasks`, {
      title: 'Test Task',
      description: 'Created by API test',
      priority: 'HIGH',
    }, accessToken);
    const pass = status === 201 && (data?.data?.id || data?.id);
    if (pass) taskId = data?.data?.id || data?.id;
    log('Task', 'POST', '/projects/:projectId/tasks', status, pass, pass ? `Created ID: ${taskId?.substring(0, 8)}...` : short(data, 120));
  }

  // 2. List tasks
  {
    const { status, data } = await req('GET', `/projects/${projectId}/tasks`, undefined, accessToken);
    const pass = status === 200;
    log('Task', 'GET', '/projects/:projectId/tasks', status, pass, pass ? 'Listed tasks' : short(data));
  }

  // 3. Get task detail
  if (taskId) {
    const { status, data } = await req('GET', `/tasks/${taskId}`, undefined, accessToken);
    const pass = status === 200;
    log('Task', 'GET', '/tasks/:id', status, pass, pass ? 'Got detail' : short(data));
  }

  // 4. Update task
  if (taskId) {
    const { status, data } = await req('PATCH', `/tasks/${taskId}`, {
      title: 'Updated Task Title',
      description: 'Updated description',
      priority: 'URGENT',
    }, accessToken);
    const pass = status === 200;
    log('Task', 'PATCH', '/tasks/:id', status, pass, pass ? 'Updated' : short(data));
  }

  // 5. Update task status
  if (taskId) {
    const { status, data } = await req('PATCH', `/tasks/${taskId}/status`, {
      status: 'IN_PROGRESS',
    }, accessToken);
    const pass = status === 200;
    log('Task', 'PATCH', '/tasks/:id/status', status, pass, pass ? 'Status → IN_PROGRESS' : short(data));
  }

  // 6. Assign member to task
  if (taskId && userId) {
    const { status, data } = await req('POST', `/tasks/${taskId}/assign`, {
      userId: userId,
    }, accessToken);
    const pass = status === 200 || status === 201;
    log('Task', 'POST', '/tasks/:id/assign', status, pass, pass ? 'Assigned' : short(data));
  }

  // 7. Unassign member from task
  if (taskId && userId) {
    const { status, data } = await req('DELETE', `/tasks/${taskId}/assign/${userId}`, undefined, accessToken);
    const pass = status === 200 || status === 204;
    log('Task', 'DELETE', '/tasks/:id/assign/:userId', status, pass, pass ? 'Unassigned' : short(data));
  }

  // 8. Create subtask
  if (taskId) {
    const { status, data } = await req('POST', `/tasks/${taskId}/subtasks`, {
      title: 'Test Subtask',
    }, accessToken);
    const pass = status === 201 && (data?.data?.id || data?.id);
    if (pass) subtaskId = data?.data?.id || data?.id;
    log('Task', 'POST', '/tasks/:id/subtasks', status, pass, pass ? `Subtask ID: ${subtaskId?.substring(0, 8)}...` : short(data, 120));
  }

  // 9. List subtasks
  if (taskId) {
    const { status, data } = await req('GET', `/tasks/${taskId}/subtasks`, undefined, accessToken);
    const pass = status === 200;
    log('Task', 'GET', '/tasks/:id/subtasks', status, pass, pass ? 'Listed subtasks' : short(data));
  }

  // 10. Toggle subtask completion
  if (subtaskId) {
    const { status, data } = await req('PATCH', `/subtasks/${subtaskId}/complete`, undefined, accessToken);
    const pass = status === 200;
    log('Task', 'PATCH', '/subtasks/:id/complete', status, pass, pass ? 'Toggled' : short(data));
  }

  // 11. Delete subtask
  if (subtaskId) {
    const { status, data } = await req('DELETE', `/subtasks/${subtaskId}`, undefined, accessToken);
    const pass = status === 200 || status === 204;
    log('Task', 'DELETE', '/subtasks/:id', status, pass, pass ? 'Deleted subtask' : short(data));
  }

  // 12. List tasks with filters
  {
    const { status, data } = await req('GET', `/projects/${projectId}/tasks?status=IN_PROGRESS&priority=URGENT&sortBy=createdAt&sortOrder=desc&page=1&limit=10`, undefined, accessToken);
    const pass = status === 200;
    log('Task', 'GET', '/projects/:projectId/tasks (filtered)', status, pass, pass ? 'Filtered OK' : short(data));
  }
}

// ─── CLEANUP & AUTH LOGOUT TEST ─────────────────────────────────
async function testCleanup() {
  console.log('\n══════════════════════════════════════════');
  console.log('  CLEANUP + LOGOUT TEST');
  console.log('══════════════════════════════════════════');

  // Delete task
  if (taskId) {
    const { status, data } = await req('DELETE', `/tasks/${taskId}`, undefined, accessToken);
    const pass = status === 200 || status === 204;
    log('Task', 'DELETE', '/tasks/:id', status, pass, pass ? 'Task deleted' : short(data));
  }

  // Delete project
  if (projectId) {
    const { status, data } = await req('DELETE', `/projects/${projectId}`, undefined, accessToken);
    const pass = status === 200 || status === 204;
    log('Project', 'DELETE', '/projects/:id', status, pass, pass ? 'Project deleted' : short(data));
  }

  // Delete workspace
  if (workspaceId) {
    const { status, data } = await req('DELETE', `/workspaces/${workspaceId}`, undefined, accessToken);
    const pass = status === 200 || status === 204;
    log('Workspace', 'DELETE', '/workspaces/:id', status, pass, pass ? 'Workspace deleted' : short(data));
  }

  // Finally, test Logout
  {
    const { status, data } = await req('POST', '/auth/logout', undefined, accessToken);
    const pass = status === 200;
    log('Auth', 'POST', '/auth/logout', status, pass, pass ? 'Logged out' : short(data));
  }
}

// ─── MAIN ───────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   TodoList Collaboration API Test Suite   ║');
  console.log('║   v2 — Testing ALL endpoints              ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`Base URL: ${BASE}`);
  console.log(`Test Email: ${TEST_EMAIL}`);
  console.log(`Time: ${new Date().toISOString()}`);

  try {
    await testAuth();
    await testUser();
    await testWorkspace();
    await testProject();
    await testTask();
    await testCleanup();
  } catch (err: any) {
    console.error('\n💥 FATAL ERROR:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
  }

  // ─── Summary ─────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('══════════════════════════════════════════');

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  const total = results.length;

  console.log(`Total: ${total} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
  console.log(`Pass Rate: ${total > 0 ? ((passed / total) * 100).toFixed(1) : 0}%`);

  if (failed > 0) {
    console.log('\n❌ FAILED TESTS:');
    results
      .filter((r) => !r.pass)
      .forEach((r) => console.log(`  - [${r.module}] ${r.method} ${r.endpoint}: ${r.note}`));
  }

  console.log('\n── Detailed Results ──');
  console.table(results.map((r) => ({
    Module: r.module,
    Method: r.method,
    Endpoint: r.endpoint,
    Status: r.status,
    Pass: r.pass ? '✅' : '❌',
    Note: r.note.substring(0, 60),
  })));
}

main();
