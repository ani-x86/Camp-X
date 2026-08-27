# Rules.md
## AI Coding Assistant — Project Rules & Boundaries

This file defines what an AI coding assistant (e.g. Claude Code, Copilot, Cursor) **should and shouldn't do** while working on the Campus Marketplace codebase. It governs library choices, error handling, security behavior, and general conduct. Treat this as binding project convention, not a suggestion.

---

## 1. Approved Tech Stack — Stick to This

| Layer | Use | Do NOT introduce |
| --- | --- | --- |
| Web | React.js, Redux | Vue, Angular, Svelte, or any other frontend framework |
| Android | Java, CameraX, Room/ViewModel | Kotlin (unless explicitly asked), other camera libraries |
| Backend | Node.js + Express (or FastAPI if the Python path is chosen) | Do not mix both backends in the same repo; do not switch frameworks mid-project without being asked |
| Database | MongoDB (via Mongoose in Node) | Do not add a second database (SQL, Redis, etc.) unless explicitly requested |
| Auth | `jsonwebtoken` (JWT) | Do not implement session-cookie auth or roll a custom token scheme |
| Payments | Razorpay official SDK/API only | Never hand-roll payment/signature logic; never swap in another payment gateway without approval |
| Image storage | Cloudinary SDK | Do not store images directly on the app server's filesystem |
| Email | Nodemailer or SendGrid | Do not introduce a third email library without reason |
| QR codes | `qrcode` npm/pip package | Do not hand-write QR encoding |
| PDF generation | `pdfkit` (Node) or `reportlab` (Python) | Avoid heavyweight/unmaintained PDF libraries |
| Animation | LottieFiles | Do not substitute a custom animation engine |

**Rule:** If a task seems to need a library outside this list, propose it and explain why — don't add it silently.

---

## 2. Security Rules (Non-Negotiable)

- **Never trust the frontend for payment confirmation.** A transaction is only ever marked `Success` after the backend verifies the Razorpay webhook signature (HMAC). No code path should set `Success` from a client-supplied `payment_id` alone.
- **Never log or store secrets in code.** API keys (Razorpay, Cloudinary, SMTP, JWT secret) live only in `.env` files, which must be in `.gitignore`. Never hardcode a key, even temporarily "to test."
- **Never store raw payment details** (card numbers, CVENs, etc.) — Razorpay handles that; only store `razorpayOrderId`, `razorpayPaymentId`, and status.
- **Always validate PRN uniqueness** at the database level (unique index) — not just in application logic.
- **Always verify JWT on protected routes** via middleware — never assume a route is "probably fine" without the auth check.
- **Sanitize all user input** (product titles, descriptions, PRN, email) before writing to MongoDB to prevent injection/XSS.
- **Never expose internal MongoDB `_id` structure or stack traces** in API error responses sent to the client.

---

## 3. Error Handling Rules

- Every controller/route handler must wrap logic in try/catch (Node) or equivalent, and forward errors to a **central error-handling middleware** — no ad-hoc `res.send(error)` scattered across files.
- API errors return a consistent shape:
  ```json
  { "success": false, "message": "Human-readable message", "code": "OPTIONAL_ERROR_CODE" }
  ```
- Never swallow errors silently (empty `catch {}` blocks are forbidden). At minimum, log them server-side.
- Webhook handler must return a `200` to Razorpay only after successful signature verification and processing; on failure, log the reason and return an appropriate non-200 status — do not blindly ack every webhook call.
- On the frontend (Web/Android), every API call must handle both the network-failure case and the API's `success: false` case — never assume a call succeeded.
- Payment failures must be shown to the user with a clear retry path, not a silent failure or generic crash.

---

## 4. Code Style & Structure Rules

- Follow the folder structure defined in `Architecture.md` — don't introduce new top-level folders or reorganize structure without discussion.
- Keep **controllers thin**: HTTP request/response handling only. Business logic (QR generation, PDF building, email sending) belongs in `services/`.
- One model = one file (`User.js`, `Product.js`, `Transaction.js`) — don't merge schemas.
- Use `async/await`, not raw `.then()` chains, for all asynchronous backend code.
- Use environment variables (`process.env.X`) for all config — no magic strings/URLs hardcoded in source.
- Keep API routes versioned under `/api/v1/...` if versioning is introduced — don't silently change existing route paths that the frontend already depends on.

---

## 5. What the AI Should Do

- Ask for clarification when a requirement is ambiguous (e.g., "should Sold items remain visible in search?") rather than guessing silently.
- Write code that matches the existing patterns in the file/module being edited, even if the AI would personally prefer a different style.
- Flag security or data-integrity risks proactively, even if not explicitly asked to review for them (e.g., "this endpoint isn't behind the auth middleware — is that intentional?").
- Keep changes scoped to what was asked. If a fix requires touching an unrelated file, say so before doing it.
- Add comments only where logic is non-obvious (e.g., webhook signature verification) — not to restate simple code.

## 6. What the AI Should NOT Do

- Do not introduce new dependencies without listing them and the reason.
- Do not modify the MongoDB schema shape (adding/removing fields) without flagging the change, since it affects both Web and Android clients.
- Do not disable or bypass JWT auth "to make testing easier" and leave it that way.
- Do not commit `.env` values, API keys, or sample secrets into any file.
- Do not mark a payment/transaction as successful anywhere except the verified webhook handler.
- Do not rewrite large parts of the codebase in a "cleanup" pass unless explicitly asked — prefer minimal, targeted diffs.
- Do not silently change the API contract (route paths, request/response shape) that Web and Android both depend on.
- Do not fabricate library APIs or Razorpay/Cloudinary endpoints — if unsure of an exact API signature, say so rather than guessing.

---

## 7. Review Checklist (before considering a task done)

- [ ] No secrets hardcoded or logged
- [ ] Auth middleware applied to protected routes
- [ ] Errors caught and returned in the standard error shape
- [ ] Payment status logic untouched outside the webhook handler
- [ ] New dependencies (if any) called out explicitly
- [ ] Code placed in the correct folder per `Architecture.md`
- [ ] Frontend handles both success and failure API responses
