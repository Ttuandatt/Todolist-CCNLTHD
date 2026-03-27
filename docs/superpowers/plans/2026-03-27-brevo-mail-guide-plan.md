# Brevo Mail Guide Update Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `docs/code_guide/phase-1-auth-module.md` so Phase 1 Auth instructions reference Brevo exclusively instead of SendGrid.

**Architecture:** Pure documentation change; edit existing sections (dependencies, environment variables, MailService, Auth narrative, checklist/testing) to match the approved Brevo spec. No runtime code changes required, but snippets must compile in NestJS context.

**Tech Stack:** Markdown, NestJS sample TypeScript, Brevo SDK docs.

---

## File Map
- Modify: `docs/code_guide/phase-1-auth-module.md`
- Reference: `docs/superpowers/specs/2026-03-27-brevo-mail-guide-design.md`

---

## Chunk 1: Replace SendGrid Setup With Brevo

**Files:**
- Modify: `docs/code_guide/phase-1-auth-module.md`

- [ ] **Step 1:** Update dependency installation instructions to use `npm install @getbrevo/brevo@3.0.0 @types/node` (tested baseline per spec Section 1) and remove SendGrid mention entirely.
- [ ] **Step 2:** Replace the `.env` snippet: remove `ENDGRID_API_KSEY`, add the Brevo block (`BREVO_API_KEY`, sender email/name, MAIL_DRIVER=brevo, FRONTEND_URL). Beneath the snippet, add a short onboarding note that sender/domain verification is required and point readers to the detailed sender verification subsection in the MailService chapter for full steps. Mention `MAIL_DRIVER=mock` as the temporary fallback during verification.
- [ ] **Step 3:** Add migration tip/summary paragraph clarifying SendGrid is deprecated and Brevo is mandatory going forward.
- [ ] **Step 4:** Proofread section for typos (e.g., ensure previous typo `ENDGRID_API_KSEY` no longer present) and ensure text matches spec wording.
- [ ] **Step 5:** Save file and review diff for only intended section changes.

## Chunk 2: Rewrite MailService Section

**Files:**
- Modify: `docs/code_guide/phase-1-auth-module.md`

- [ ] **Step 1:** Replace SendGrid MailService sample code with the Brevo snippet from spec (imports, constructor, send helper, mock output example). Ensure inline HTML instructions remain.
- [ ] **Step 2:** Add explanatory text (per spec Sections 3 & 6) about Brevo SDK usage, 5-second timeout, API key guard (`xkeysib-`), inline HTML templates, rate-limit logging, the mock log output example, and a dedicated security subsection covering `.env(.local)` storage, git exclusion, and the key rotation playbook (Brevo dashboard → generate new key → deploy → revoke old key).
- [ ] **Step 3:** Insert a sender verification subsection that mirrors spec Sections 2 & 4: detail the dashboard navigation paths (`Senders & IP → Domains → Add domain` or `Senders → Add sender email`), DNS TXT/CNAME requirements, email confirmation link (24h expiry), 5–15 minute propagation window, expected Brevo error payload `{ code: "unauthorized", message: "Sender not verified" }`, and explicit fallback to `MAIL_DRIVER=mock` until verification completes.
- [ ] **Step 4:** Verify every AuthService reference (especially the forgot-password narrative) now states "Brevo-powered MailService" and mentions the Brevo link generation/reset email flow exactly as described in spec Section 4.
- [ ] **Step 5:** Re-run Markdown preview (if available) or read file to ensure code fences render correctly and indentation follows ASCII constraint.

## Chunk 3: Update Testing & Checklist Sections

**Files:**
- Modify: `docs/code_guide/phase-1-auth-module.md`

- [ ] **Step 1:** Update testing instructions to include mock vs Brevo verification steps, Brevo dashboard checks, and rate-limit fallback per spec checklist.
- [ ] **Step 2:** Modify checklist bullet to "MailService cấu hình Brevo + mock mode" and remove SendGrid references.
- [ ] **Step 3:** Add note about Brevo free-tier limits (300 emails/day and 120/minute bursts) and quote the MailService log message shown on HTTP 429 so developers know what to expect when rate limited.
- [ ] **Step 4:** Execute the spec Section 7 search-and-replace checklist: remove `npm install @sendgrid/mail`, `import * as sgMail from '@sendgrid/mail'`, `sgMail.setApiKey(...)`, `sgMail.send(msg)`, and rename any remaining "SendGrid" headers/mentions to "Brevo". Use `rg -n "SendGrid" docs/code_guide/phase-1-auth-module.md` to confirm zero matches afterward.
- [ ] **Step 5:** Review final diff for overall consistency, then run markdown lint/preview if available.
- [ ] **Step 6:** Copy the updated MailService TypeScript snippet into a scratch `.ts` file and run `npx tsc --noEmit scratch-mail-service.ts` (or equivalent) to ensure the snippet compiles with `@getbrevo/brevo` typings.

## Completion Steps

- [ ] **Verification:** Since this is doc-only, no automated tests are required; instead, ensure Markdown renders properly and all code samples compile conceptually (TypeScript syntax highlight passes).
- [ ] **Verification:** Confirm Markdown renders properly, the MailService snippet successfully passes the `tsc --noEmit` syntax check from Chunk 3, and there are zero `SendGrid` references left in the document.
- [ ] **Commit Guidance:** After implementation, stage modified files and commit with message like `docs: switch auth guide to Brevo`.
- [ ] **Handoff:** Provide summary of changes and mention manual verification performed.
