# Architecture.md
## Campus Marketplace — System Architecture & Project Structure

---

## 1. High-Level Architecture

The system follows a **client-server architecture** with two independent frontend clients (Web + Android) sharing a single backend REST API and database.

```
┌─────────────────┐     ┌─────────────────┐
│   Web Client     │     │  Android Client  │
│   (React.js)     │     │  (Java, CameraX) │
└────────┬─────────┘     └────────┬─────────┘
         │                        │
         │        HTTPS / REST (JSON)         
         │         + JWT in headers            
         └───────────┬────────────┘
                      │
              ┌───────▼────────┐
              │   Backend API   │
              │ Node.js/Express │
              │  (or FastAPI)   │
              └───────┬────────┘
                      │
     ┌────────────────┼────────────────────┐
     │                │                     │
┌────▼─────┐   ┌──────▼───────┐   ┌─────────▼────────┐
│ MongoDB  │   │  Cloudinary   │   │  Razorpay API     │
│ (data)   │   │ (image store) │   │ (payments)        │
└──────────┘   └──────────────┘   └─────────┬─────────┘
                                             │ webhook
                                   ┌─────────▼─────────┐
                                   │  Backend Webhook   │
                                   │  Handler (verify   │
                                   │  signature)         │
                                   └─────────┬─────────┘
                                             │
                        ┌────────────────────┼────────────────────┐
                        │                    │                    │
                 ┌──────▼─────┐     ┌────────▼────────┐   ┌───────▼──────┐
                 │  QR Code    │     │  PDF Receipt    │   │  Email       │
                 │  Generator  │     │  Generator       │   │  (Nodemailer)│
                 └────────────┘     └─────────────────┘   └──────────────┘
```

---

## 2. App Flow

### 2.1 Authentication Flow
1. User signs up/logs in with **PRN + institutional email**.
2. Backend validates the PRN, creates/looks up the user record.
3. Backend issues a **JWT** on successful login.
4. Client stores the JWT and attaches it as a `Bearer` token on every subsequent API request.
5. Backend middleware verifies the JWT on protected routes before processing.

### 2.2 Listing Flow ("Snap & Sell")
1. Seller opens the "Add Product" screen.
2. Photo is captured (Android: CameraX) or uploaded (Web: file picker), sent as `multipart/form-data`.
3. Backend (via Multer or equivalent) receives the file and forwards it to **Cloudinary**.
4. Cloudinary returns an `imageUrl`, which is saved with the new **Product** document in MongoDB (status: `Available`).
5. Listing appears on the dashboard for all verified users.

### 2.3 Browse → Cart → Checkout Flow
1. Buyer browses the dashboard (grid of products), opens a product detail page.
2. Product is added to cart — cart state held client-side (Redux on Web, Room/ViewModel on Android); product status optionally flips to `In Cart`.
3. On checkout, client calls `POST /api/orders`.
4. Backend creates a **Razorpay Order** and returns the `order_id`.
5. Client opens the Razorpay Checkout modal using that `order_id`.
6. User completes payment; Razorpay returns a `payment_id` to the client (informational only — not trusted for confirmation).

### 2.4 Payment Verification & Post-Payment Automation
1. Razorpay sends a **webhook** to the backend's public webhook endpoint.
2. Backend verifies the **HMAC signature** of the webhook payload.
3. On valid, successful payment:
   - Transaction status is set to `Success` in MongoDB.
   - Product status is set to `Sold`.
   - A **QR code** is generated (encodes seller PRN + trust tag).
   - A **PDF receipt** is generated, embedding the QR code and transaction details.
   - The receipt is **emailed** to the buyer (Nodemailer/SendGrid).
4. Backend notifies the client of success (polling or response to a status-check call).
5. Client displays the **Lottie success animation** and a receipt preview.

---

## 3. Technical Stack

| Layer | Technology | Notes |
| --- | --- | --- |
| Web Frontend | React.js | Component-based UI, Redux for cart state |
| Android App | Java (Native) + CameraX | Native performance, camera integration |
| Backend API | Node.js (Express) — primary; FastAPI (Python) as alternative | REST API, JWT middleware, webhook handling |
| Database | MongoDB | Document store for Users, Products, Transactions |
| Image Storage | Cloudinary (or AWS S3) | Hosts product photos |
| Payments | Razorpay API | Orders API + Checkout SDK + Webhooks |
| Auth | JWT (jsonwebtoken) | Stateless auth across Web + Android |
| Email | Nodemailer / SendGrid | Receipt delivery |
| QR Codes | `qrcode` (npm/pip) | Embedded in receipts |
| PDF Generation | `pdfkit` / `reportlab` (or equivalent) | Server-side receipt generation |
| Animations | LottieFiles | Post-payment success UI |
| Deployment | Vercel (Web), Render/Railway (Backend), MongoDB Atlas (DB) | |

---

## 4. Folder & File Structure

### 4.1 Repository Layout (Monorepo)

```
campus-marketplace/
├── web/                     # React web frontend
├── android/                 # Java Android app
├── backend/                 # Node.js/Express API
├── docs/                    # PRD, Architecture.md, diagrams
└── README.md
```

### 4.2 `backend/` (Node.js + Express)

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   ├── cloudinary.js      # Cloudinary config
│   │   └── razorpay.js        # Razorpay client config
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Transaction.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── webhookController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   └── webhookRoutes.js
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── upload.js          # Multer config
│   ├── services/
│   │   ├── qrService.js       # QR code generation
│   │   ├── pdfService.js      # PDF receipt generation
│   │   └── emailService.js    # Email sending
│   ├── utils/
│   │   └── verifySignature.js # Razorpay webhook signature check
│   └── app.js                 # Express app entry
├── .env
├── package.json
└── server.js
```

### 4.3 `web/` (React)

```
web/
├── src/
│   ├── components/
│   │   ├── ProductCard.jsx
│   │   ├── Navbar.jsx
│   │   └── LottieSuccess.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Login.jsx
│   │   └── SellItem.jsx
│   ├── store/
│   │   ├── cartSlice.js       # Redux cart state
│   │   └── store.js
│   ├── services/
│   │   └── api.js             # Axios instance + JWT header
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
```

### 4.4 `android/` (Java)

```
android/
├── app/src/main/java/com/campusmarketplace/
│   ├── activities/
│   │   ├── LoginActivity.java
│   │   ├── DashboardActivity.java
│   │   ├── ProductDetailActivity.java
│   │   ├── SellItemActivity.java       # CameraX capture
│   │   ├── CartActivity.java
│   │   └── CheckoutActivity.java
│   ├── viewmodel/
│   │   └── CartViewModel.java
│   ├── network/
│   │   ├── ApiClient.java              # Retrofit setup
│   │   └── ApiService.java
│   ├── models/
│   │   ├── User.java
│   │   ├── Product.java
│   │   └── Transaction.java
│   ├── camera/
│   │   └── CameraXHelper.java
│   └── utils/
│       └── JwtManager.java             # Token storage
├── app/src/main/res/
│   ├── layout/
│   └── drawable/
└── build.gradle
```

---

## 5. Key Architectural Principles

- **Single source of truth for payments:** the frontend never marks a transaction as successful — only the signature-verified Razorpay webhook does.
- **Shared REST contract:** both Web and Android consume the same versioned API (`/api/v1/...`), avoiding client-specific backend logic.
- **Stateless auth:** JWT means the backend can scale horizontally with no shared session store.
- **Separation of concerns:** controllers handle HTTP, services handle business logic (QR/PDF/email), models define schema — keeping the webhook handler thin and testable.
