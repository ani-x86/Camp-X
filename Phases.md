# Phases.md
## Campus Marketplace — Build Phases

The project is broken into sequential phases so the AI (and the team) build and verify one working slice at a time, instead of attempting the whole app at once. **Each phase should be fully working and testable before moving to the next.** Do not start a phase until the previous one's checklist is complete.

Reference: see `PRD.md` for feature scope, `Architecture.md` for structure, and `Rules.md` for coding boundaries — all phases must follow those.

---

## Phase 0 — Project Setup
**Goal:** Empty-but-running skeleton for all three parts of the stack.

- Initialize monorepo folders: `web/`, `android/`, `backend/`, `docs/`
- Backend: Express app boots, connects to MongoDB, `.env` + `.gitignore` in place
- Web: React app boots with a blank routed page
- Android: Java project builds and runs a blank activity
- Health-check route: `GET /api/v1/health` returns `{ status: "ok" }`

**Done when:** all three apps run locally with no errors, backend connects to MongoDB Atlas/local instance.

---

## Phase 1 — Authentication (Login/Signup)
**Goal:** Verified users can create an account and log in with a JWT session.

- `User` model (fullName, prn [unique], branch, year, mobile, email, trustScore)
- `POST /api/v1/auth/signup` — validates PRN, creates user
- `POST /api/v1/auth/login` — validates credentials, issues JWT
- JWT auth middleware protecting all future routes
- Web: Login/Signup pages, JWT stored and attached to requests
- Android: Login/Signup activities, JWT stored via `JwtManager`

**Done when:** a user can sign up with a PRN, log in, and receive/store a valid JWT; protected test route rejects requests without a token.

---

## Phase 2 — Product Listings ("Snap & Sell")
**Goal:** Authenticated users can create, view, and browse product listings.

- `Product` model (sellerId, title, description, price, imageUrl, status)
- Cloudinary integration for image upload (Multer middleware on backend)
- `POST /api/v1/products` — create listing (auth required)
- `GET /api/v1/products` — list all available products
- `GET /api/v1/products/:id` — product detail
- Web: Dashboard (grid of products), "Sell Item" form with image upload, Product Detail page
- Android: Dashboard activity, "Sell Item" activity with CameraX capture, Product Detail activity

**Done when:** a logged-in user can list a product with a photo, and it appears on the dashboard for other users to view.

---

## Phase 3 — Cart & Checkout (Pre-Payment)
**Goal:** Users can add products to a cart and reach a checkout screen — no real payment yet.

- Web: Redux cart slice — add/remove items, cart page
- Android: Room/ViewModel-based cart — add/remove items, cart activity
- `POST /api/v1/orders` — creates a pending `Transaction` record (status: `Pending`) but does **not** yet touch Razorpay
- Checkout page/activity shows order summary before payment

**Done when:** a user can add a product to cart, proceed to checkout, and a `Pending` transaction is created in MongoDB.

---

## Phase 4 — Razorpay Payment Integration
**Goal:** Real, secure payments — backend-verified only.

- Backend: Razorpay config, `orderController` creates a Razorpay `Order` and returns `order_id`
- Web: Razorpay Checkout SDK triggered with `order_id`
- Android: Razorpay Android SDK triggered with `order_id`
- Webhook endpoint: `POST /api/v1/webhooks/razorpay`
- HMAC signature verification on every incoming webhook (per `Rules.md` — this is the **only** place a transaction may be marked `Success`)
- Transaction status updates: `Pending` → `Success`/`Failed`; Product status updates to `Sold` on success

**Done when:** a real (test-mode) Razorpay payment completes, the webhook fires, signature is verified, and the transaction/product statuses update correctly — and **only** via the webhook, never the frontend.

---

## Phase 5 — Post-Payment Automation
**Goal:** Successful payments trigger the full receipt pipeline automatically.

- QR service: generate QR code (seller PRN + trust tag) on successful transaction
- PDF service: generate receipt PDF embedding transaction details + QR
- Email service: send the receipt PDF to the buyer's registered email (Nodemailer/SendGrid)
- Store `receiptUrl` on the Transaction record
- Web + Android: Lottie success animation shown after confirmed payment, with receipt preview/download

**Done when:** completing a test payment results in an emailed PDF receipt with an embedded QR code, and the UI shows a success animation.

---

## Phase 6 — Polish, Trust Features & Edge Cases
**Goal:** Round out the experience and harden it.

- Trust score logic (increment on successful transactions)
- Search/filter on the dashboard (by category, price, keyword)
- Error states across Web/Android (failed payment, network errors, expired session)
- Basic profile page (view own listings, past purchases)
- Input validation/sanitization pass across all forms
- Loading states and empty states (no listings, empty cart)

**Done when:** the app handles failure paths gracefully and feels complete for daily use, not just the happy path.

---

## Phase 7 — Deployment
**Goal:** Publicly accessible, production-ready deployment.

- Backend deployed (Render/Railway), environment variables configured on host
- MongoDB Atlas production cluster connected
- Web deployed (Vercel), pointed at production API
- Android: signed release build (APK/AAB) for distribution/testing
- Razorpay switched from test mode to live mode (after test-mode QA passes)
- Basic monitoring/logging on the backend (e.g., request logs, error alerts)

**Done when:** the full flow — signup → list → buy → receipt — works end-to-end on the deployed, production stack.

---

## Phase Dependency Summary

```
Phase 0 (Setup)
   └─▶ Phase 1 (Auth)
          └─▶ Phase 2 (Listings)
                 └─▶ Phase 3 (Cart/Checkout - no payment)
                        └─▶ Phase 4 (Razorpay payment)
                               └─▶ Phase 5 (QR/PDF/Email automation)
                                      └─▶ Phase 6 (Polish & edge cases)
                                             └─▶ Phase 7 (Deployment)
```

**Rule for the AI:** never jump ahead to a later phase's feature while an earlier phase's checklist is incomplete, and never mark a phase "done" until its own done-condition is verifiably met.
