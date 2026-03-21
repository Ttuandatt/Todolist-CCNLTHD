# Branch Structure Fix Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:executing-plans (subagent mode unavailable) to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align `main → develop → feature/*` history without losing work while preserving existing commits.

**Architecture:** Work on temporary worktrees to keep the dirty workspace intact, capture safety snapshots, then rebase each branch so `develop` tracks `main` and feature branches track `develop`. Finish by force-pushing and verifying the network graph.

**Tech Stack:** Git CLI, GitHub remote `origin`.

---

## Chunk 1: Baseline & Backups

### Task 1: Capture Current State

**Files:**
- No code files; git metadata only

- [ ] **Step 1:** Ensure main workspace stays untouched: `git status -sb` (expect dirty feature branch; note paths to avoid edits).
- [ ] **Step 2:** Record current commit IDs for `main`, `develop`, `feature/dat-user-module`, `feature/(dat-vy)-workspace-module` with `git log --oneline -n 2 <branch>`.
- [ ] **Step 3:** Save output (copy into scratch buffer) for later verification.

### Task 2: Create Safety Branches

**Files:**
- No code files; backup refs only

- [ ] **Step 1:** `git branch backup/main-20260319 origin/main`
- [ ] **Step 2:** `git branch backup/develop-20260319 origin/develop`
- [ ] **Step 3:** `git branch backup/dat-user-module-20260319 origin/feature/dat-user-module`
- [ ] **Step 4:** `git branch backup/dat-vy-workspace-20260319 origin/feature/(dat-vy)-workspace-module`
- [ ] **Step 5:** Confirm backups exist: `git branch | Select-String backup`

---

## Chunk 2: Fix Shared Branches

### Task 3: Rebase `develop` onto `main`

**Files:**
- No code files; branch history only

- [ ] **Step 1:** `git worktree add ..\wt-develop develop`
- [ ] **Step 2:** In worktree: `git fetch origin`
- [ ] **Step 3:** `git checkout develop && git rebase origin/main`
- [ ] **Step 4:** Resolve conflicts if any, run `git status` to ensure clean.
- [ ] **Step 5:** `git push --force-with-lease origin develop`

### Task 4: Rebase `feature/dat-user-module` onto `develop`

**Files:**
- No code files; branch history only

- [ ] **Step 1:** `git worktree add ..\wt-dat-user feature/dat-user-module`
- [ ] **Step 2:** `git fetch origin`
- [ ] **Step 3:** `git rebase origin/develop`
- [ ] **Step 4:** Resolve conflicts, run branch-specific tests if needed (e.g., `npm run lint` if touches backend/frontend).
- [ ] **Step 5:** `git push --force-with-lease origin feature/dat-user-module`

---

## Chunk 3: Rebase Remaining Feature Branch

### Task 5: Rebase `feature/(dat-vy)-workspace-module`

**Files:**
- Working branch contains backend/frontend changes; ensure no conflicts remain

- [ ] **Step 1:** Because primary workspace already on this branch, stash or commit local changes if necessary (`git stash push -m "pre-rebase"`).
- [ ] **Step 2:** `git fetch origin`
- [ ] **Step 3:** `git rebase origin/develop`
- [ ] **Step 4:** Resolve conflicts carefully (backend auth/prisma files), run `npm run lint` & `npm run test` if feasible to ensure no breakage.
- [ ] **Step 5:** `git push --force-with-lease origin feature/(dat-vy)-workspace-module`
- [ ] **Step 6:** Re-apply stash if used (`git stash pop`).

---

## Chunk 4: Verification

### Task 6: Validate Graph

**Files:**
- Documentation only (none modified)

- [ ] **Step 1:** `git fetch origin --all`
- [ ] **Step 2:** `git log --oneline --graph --decorate --all | head -n 40` ensuring `main` at root, `develop` directly off `main`, each feature off `develop`.
- [ ] **Step 3:** Capture screenshot or copy for user confirmation.
- [ ] **Step 4:** Remove temporary worktrees (`git worktree remove ..\wt-develop`, `..\wt-dat-user`).
- [ ] **Step 5:** Delete backup branches only after user approval.

---

Plan complete and saved to `docs/superpowers/plans/2026-03-19-branch-structure-fix.md`. Ready to execute?
