# Project Requirement Document (PRD)
## Campus Marketplace — Web & Android Application

---

## 1. Project Overview

A closed-loop, campus-exclusive buy/sell marketplace for **students and teachers**, verified by their university roll number (PRN). The closed ecosystem builds trust — the biggest barrier for second-hand marketplaces — by restricting access to verified members of the same institution only.

Available on **Web (React)** and **Android (Java, native)**, sharing a common backend API.

---

## 2. Targeted Users

| User Type | Description | Key Needs |
| --- | --- | --- |
| **Students** | Primary buyers and sellers of used books, gadgets, furniture, etc. | Quick listing ("Snap & Sell"), trustworthy buyers/sellers, secure payment |
| **Teachers/Faculty** | Secondary user base; can buy/sell academic material and equipment | Same core flow as students, verified identity |
| **Campus Admin (implicit)** | Oversight of verified users and disputes (optional future role) | Manage flagged users/listings, verify PRNs |

**Access control:** Only users with a valid institutional PRN (roll number) can register and log in — no public/open signups.

---

## 3. Problem Statement

Existing second-hand marketplaces (OLX, Facebook Marketplace, etc.) lack trust for a campus audience — buyers and sellers are strangers with no shared accountability. This product solves that by tying every account to a verified campus identity (PRN), so trades happen within a known, trusted community.

---

## 4. Core Features

### 4.1 User Authentication & Profile
- Sign-up/login restricted to valid PRN + institutional email
- Profile stores: full name, PRN, branch, year, mobile, email
- JWT-based session management (stateless, token sent with every API request)
- Optional **trust score** per user, built up over successful transactions

### 4.2 Product Listings ("Snap & Sell")
- Sellers create a listing with a photo (camera capture on Android via CameraX, or file upload on Web)
- Listing fields: title, description, price, category, image, seller reference
- Listing status: **Available / In Cart / Sold**
- Product detail view shows seller's PRN and general location/branch for trust context

### 4.3 Browsing & Dashboard
- Grid/card-based dashboard of available listings
- Filter/search by category, price, keyword
- Product detail page per listing

### 4.4 Cart & Checkout
- Add-to-cart flow with temporary cart state (Redux on Web, Room/ViewModel on Android)
- Checkout initiates a payment session

### 4.5 Payments
- Integrated via **Razorpay**
- Backend creates a Razorpay `Order`; frontend opens Razorpay checkout with that order ID
- Payment is only confirmed via a **backend-verified webhook** (signature-checked) — never trusted from the frontend directly
- Transaction record stored with buyer, product, amount, and payment IDs

### 4.6 Post-Payment Automation
- On verified payment:
  1. Generate a **QR code** encoding seller PRN + trust tag
  2. Generate a **PDF receipt** combining transaction details and the QR code
  3. **Email the receipt** to the buyer's registered address
  4. Trigger a **Lottie success animation** in the app/web UI
  5. Mark the product as **Sold**

### 4.7 Notifications (Email)
- Transaction receipts
- (Optional/future) listing status updates, new message alerts

---

## 5. Non-Functional Requirements

| Requirement | Detail |
| --- | --- |
| **Security** | JWT auth, HMAC webhook signature verification, PRN-based access control, no plaintext payment data stored |
| **Scalability** | Stateless REST API so backend instances can scale horizontally |
| **Cross-platform consistency** | Shared REST API consumed identically by React (Web) and Java (Android) |
| **Performance** | Image uploads handled asynchronously via Cloudinary; dashboard paginated for large listing counts |
| **Reliability** | Payment status determined only by verified webhook, avoiding false "success" states |

---

## 6. Technology Stack

| Layer | Technology |
| --- | --- |
| Web Frontend | React.js |
| Android App | Java (Native) + CameraX API |
| Backend API | Node.js (Express) or Python (FastAPI) |
| Database | MongoDB (NoSQL) |
| Image Storage | Cloudinary (or AWS S3) |
| Payments | Razorpay API |
| Email | Nodemailer / SendGrid |
| Animations | LottieFiles |
| QR Codes | `qrcode` library (Node.js/Python) |

---

## 7. Data Model (MongoDB Collections)

**Users**
- `_id`, `fullName`, `prn` (unique), `branch`, `year`, `mobile`, `email`, `trustScore`

**Products**
- `_id`, `sellerId` (ref → Users), `title`, `description`, `price`, `imageUrl`, `status` (Available / In Cart / Sold)

**Transactions**
- `_id`, `buyerId`, `productId` (refs), `razorpayOrderId`, `razorpayPaymentId`, `status` (Pending / Success / Failed), `receiptUrl`

---

## 8. Out of Scope (for initial version)

- In-app chat/messaging between buyer and seller
- Delivery/logistics integration
- Multi-campus support (single institution only, initially)
- Dispute resolution / admin moderation panel

---

## 9. Success Criteria

- Verified PRN required for every account — zero non-campus signups
- End-to-end flow works: list → browse → cart → pay → receipt emailed → item marked sold
- Payment status always reflects backend-verified webhook state, never frontend-reported state
