# Design Spec — Brevo-Only Mail Guidance

## Context
Phase 1 Auth Module currently documents SendGrid as the transactional email provider. The project is moving exclusively to Brevo (Sendinblue) and the written code guide must be updated to reflect the new dependency, configuration, and walkthrough while keeping the same developer experience (mock mode for dev, real provider for prod).

## Goals
- Replace all SendGrid-specific instructions in `docs/code_guide/phase-1-auth-module.md` with Brevo guidance.
- Keep the MailService patterns (HTML builders, mock driver) intact so developers understand the delta quickly.
- Ensure setup, environment variables, and testing checklist accurately describe how to work with Brevo.

## Non-Goals
- Changing runtime NestJS mail implementation or wiring outside of the documentation scope.
- Introducing additional mail drivers beyond Brevo and the existing mock option.
- Editing other code guide phases.

## Requirements
1. **Dependencies**: Document installing `@getbrevo/brevo` as the only external email SDK (plus `@types/node`) and cite the tested version (v3.x).
2. **Environment Variables**: Provide Brevo keys (`BREVO_API_KEY`, sender info) and require `MAIL_DRIVER=brevo` for production. Mention verified sender constraints and the correct API key shape (`xkeysib-...`).
3. **MailService Snippet**: Show initialization of Brevo `TransactionalEmailsApi`, shared send helper, and existing inline HTML templates (no Brevo template IDs required). Mock path must log emails exactly as before with a documented format.
4. **Sender Verification Guidance**: Include actionable steps (Brevo dashboard path, DNS/email verification requirement, expected 5–15 minute propagation) and fallback to `MAIL_DRIVER=mock` if verification is pending. Document actual Brevo error payload (`code: "unauthorized"`, message "Sender not verified").
5. **Auth Narrative**: Replace SendGrid mentions throughout the forgot/reset password explanation, MailModule import notes, and checklist.
6. **Testing & Rate Limits**: Update verification instructions to reference Brevo live sending, mock fallback, and provide rate limit expectations (e.g., 300 emails/day on free tier, 120/minute API burst). Include how to identify Brevo rate-limit errors (HTTP 429 with `code: 'transactional_email_daily_limit'`).
7. **Security & Key Rotation**: Call out that `BREVO_API_KEY` must live in `.env(.local)`, never in git, and note steps if the key needs rotation, including optional runtime guard that asserts `key.startsWith('xkeysib-')`.

## Design
### 1. Dependencies & Tooling
- Replace SendGrid install command with `npm install @getbrevo/brevo @types/node` and cite `@getbrevo/brevo@3.0.0` (or later) as the tested baseline.
- Keep `MAIL_DRIVER` toggling guidance; note that the new SDK uses HTTPS by default so no SMTP configuration is required.
- Clarify that MailModule wiring stays the same—only `MailService` internals change.
- Add optional SDK configuration snippet (`ApiClient.instance.timeout = 5000;`) so slow network calls fail fast.

### 2. Environment Variables
- Add a dedicated Brevo block:
  ```env
  BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  BREVO_SENDER_EMAIL=noreply@todolist-collab.com
  BREVO_SENDER_NAME=TodoList Collaboration
  MAIL_DRIVER=brevo
  FRONTEND_URL=http://localhost:3000
  ```
- Mention Brevo sender verification requirement and that devs can keep `MAIL_DRIVER=mock` locally.
- Document verification flow: **Brevo Dashboard → Senders & IP → Domains → Add a new domain** (or **Senders → Add a new sender email**). For domains, configure TXT + CNAME records; for single senders, click the confirmation link sent to the inbox. Verification emails expire after 24 hours; DNS propagation typically completes within 5–15 minutes. Until verified, API returns HTTP 400 with `{ code: "unauthorized", message: "Sender not verified" }`.

### 3. MailService Implementation Excerpts
- Imports: `ApiClient`, `TransactionalEmailsApi`, `SendSmtpEmail` from `@getbrevo/brevo`.
- Constructor: configure API key once when not running in mock mode.
- Send helper: create `SendSmtpEmail`, set `to`, `subject`, `htmlContent`, `sender`, then `await this.brevo.sendTransacEmail(email)`.
- Inline HTML templates remain hard-coded strings (no Brevo template IDs required); reuse existing reset/verify/welcome markup verbatim.
- Error handling: log Brevo response error (status code + body) but do not throw so password-reset UX stays non-blocking. If the response status is 429, log a dedicated warning instructing developers to toggle `MAIL_DRIVER=mock` temporarily. Mock driver logs deterministic output (see example below).

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { ApiClient, TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly isMock = process.env.MAIL_DRIVER !== 'brevo';
  private readonly brevo?: TransactionalEmailsApi;

  constructor() {
    if (!this.isMock) {
      const apiClient = ApiClient.instance;
      apiClient.authentications['apiKey'].apiKey = process.env.BREVO_API_KEY!;
      apiClient.timeout = 5000; // Fail fast on slow networks
      if (!process.env.BREVO_API_KEY?.startsWith('xkeysib-')) {
        throw new Error('Invalid Brevo API key format');
      }
      this.brevo = new TransactionalEmailsApi();
    }
  }

  private async sendBrevoEmail(to: string, name: string, subject: string, htmlContent: string) {
    if (this.isMock || !this.brevo) {
      this.logger.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
      this.logger.log(`[MOCK EMAIL] Body: ${htmlContent}`);
      return;
    }

    const email = new SendSmtpEmail();
    email.to = [{ email: to, name }];
    email.subject = subject;
    email.sender = {
      email: process.env.BREVO_SENDER_EMAIL!,
      name: process.env.BREVO_SENDER_NAME || 'TodoList Collaboration',
    };
    email.htmlContent = htmlContent;

    try {
      await this.brevo.sendTransacEmail(email);
    } catch (error: any) {
      const status = error?.response?.status || 'unknown';
      const body = typeof error?.response?.text === 'string'
        ? error.response.text
        : JSON.stringify(error?.response?.body || error.message);
      this.logger.error(`Brevo email failed (status=${status}): ${body}`);
      if (status === 429) {
        this.logger.warn('Brevo rate limit hit (300 emails/day free tier). Switch MAIL_DRIVER=mock until quota resets.');
      }
    }
  }
}
```

**Mock output example:**
```
[MOCK EMAIL] To: user@example.com | Subject: 🔐 Đặt lại mật khẩu TodoList Collaboration
[MOCK EMAIL] Body: <div style="font-family: Arial, sans-serif;">...</div>
```

### 4. Auth Module Narrative Updates
- Update MailService section title to “Brevo Transactional Email”.
- Adjust AuthService notes so forgot-password references Brevo-powered `MailService`.
- Checklist bullet becomes “MailService cấu hình Brevo + mock mode”.
- Add subsection describing sender verification steps and the fallback to mock driver while waiting.
- Include migration callouts (old SendGrid commands, env keys, and code snippets to be replaced) so writers know exactly what to edit.

### 5. Testing & Verification
- Mention verifying mock mode output locally and Brevo dashboard/inbox in staging/prod.
- Provide explicit checklist:
  - `[ ] MAIL_DRIVER=mock → console logs reset link + HTML`
  - `[ ] MAIL_DRIVER=brevo (staging) → Brevo dashboard shows Accepted, inbox receives email within 5 minutes`
  - `[ ] Email content uses correct sender name + reset link`
  - `[ ] Brevo rate limit (HTTP 429) surfaces in logs; switch back to mock to avoid blocking tests`
- Add note about swapping drivers if Brevo sandbox daily quota is hit.
- Document free-tier rate limits (300/day, 120/min bursts) and where to see quota resets in the dashboard.

### 6. Security & Key Rotation
- Remind developers to store `BREVO_API_KEY` in `.env.local`, exclude from git, and rotate via Brevo dashboard → SMTP & API → Generate a new key.
- Document rotation playbook: add new key to secrets, redeploy, then revoke old key.
- Mention that on rotation the service will throw the guard error if the key no longer starts with `xkeysib-`, providing early detection.

### 7. Migration & Update Scope
- **Files touched:** `[docs/code_guide/phase-1-auth-module.md](docs/code_guide/phase-1-auth-module.md)`
- **Search & replace checklist:**
  - Replace the SendGrid install command (`npm install @sendgrid/mail`) with the Brevo command from Section 1.
  - Update the `.env` snippet: remove `ENDGRID_API_KSEY`, add Brevo block exactly as in Section 2.
  - Swap the MailService example code: remove `import * as sgMail from '@sendgrid/mail'` + `sgMail.setApiKey` + `sgMail.send(msg)` and insert the Brevo snippet above.
  - Rename section headers from "SendGrid" to "Brevo" and adjust explanatory text (forgot-password narrative, checklist bullet, testing instructions).
- **Cutover strategy:** This is a hard replacement, no feature flag. Once documentation lands, developers are expected to use Brevo exclusively. Rollback plan is to revert the doc changes in git if absolutely necessary.

## Risks & Mitigations
- **Brevo sender verification delays**: highlight requirement in env section; fallback to mock driver during onboarding.
- **SDK Rate Limits**: log errors clearly; encourage checking Brevo dashboard if emails fail.

## Open Questions
None.
