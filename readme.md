# CampX: Campus Exchange Marketplace [cite: 1]

**Reference File:** CampX.pdf

## Team Members
* Aniruddha Udekar [cite: 1]
* Chandrashekhar Patil [cite: 1]
* Danish Khatik [cite: 1]
* Manish [cite: 1]

## Project Description (CampusXchange)
We are building CampusXchange to solve the chaotic cycle of students wasting money on new semester essentials while graduating peers throw away perfectly good items. [cite: 1] By creating a trusted, verified student-only marketplace, we eliminate the safety risks and friction of generic online classifieds—making it seamless for students to buy and sell affordable textbooks, electronics, and dorm gear right on campus. [cite: 1]

## Objectives
* Develop a closed-loop online marketplace that enables students and teachers to buy and sell products within the university community. [cite: 1]
* To implement PRN-based user verification by using the university roll number as a unique identifier for account verification and trust scoring. [cite: 1]
* To provide a web-based marketplace interface using React.js for product browsing, seller management, cart functionality, and checkout. [cite: 1]
* To develop a native Android application using Java and CameraX, including a "Snap & Sell" feature that allows sellers to upload product images directly through the device camera. [cite: 1]

## Technology Stack [cite: 1]
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Web Frontend** | React.js | Dashboard, product grid, cart state, seller UI |
| **Android App** | Java (Native) + CameraX API | Native performance; camera integration for "Snap & Sell" |
| **Backend API** | Node.js (Express) or Python (FastAPI) | Business logic, auth, payment webhooks, REST endpoints |
| **Database** | MongoDB (NoSQL) | Flexible schemas for users, products, orders |
| **Image Storage** | Cloudinary (or AWS S3) | Hosting product photos uploaded by sellers |
| **Payments** | Razorpay API | Order creation, checkout, webhook-verified transactions |

## Tools, Libraries & Algorithms [cite: 1]
* **Authentication:** JWT (JSON Web Tokens) issued at login, verified on every request stateless, no server-side sessions. [cite: 1]
* **Payments:** Razorpay Orders API (backend) + Checkout SDK (frontend); HMAC signature verification on incoming webhooks before confirming an order. [cite: 1]
* **File uploads:** Multer (Node.js) middleware to handle multipart/form-data from the camera/file picker before forwarding to Cloudinary. [cite: 1]
* **QR generation:** qrcode library (Node.js/Python) encoding seller PRN + trust tag as JSON, embedded in the receipt. [cite: 1]
* **PDF receipts:** server-side PDF generation library combining transaction details with the QR image. [cite: 1]
* **Email delivery:** Nodemailer (Node.js) or SendGrid/SMTP (Python) to send the receipt to the buyer's registered email. [cite: 1]
* **UI animation:** LottieFiles lightweight JSON animations for the post-payment success screen (Web + Android). [cite: 1]
* **Cart state:** Redux (React) on web; Room/ViewModel (Java) on Android. [cite: 1]

## Development Approach & Key Techniques [cite: 1]
* **Methodology:** Iterative/Agile, built in four phases rather than all at once. [cite: 1]
* **RESTful API design:** clean endpoints (e.g. GET/api/products, POST/api/orders) shared by both React and Java clients. [cite: 1]
* **Backend-verified payments:** the frontend never confirms a sale; Razorpay's webhook (signature-checked) is the only source of truth for payment success. [cite: 1]
* **PRN-based identity:** university roll number used as a unique index for account verification and trust scoring. [cite: 1]
* **Post-payment automation pipeline:** verify webhook → generate QR → generate PDF receipt → email buyer → trigger frontend success animation. [cite: 1]

## Data Collections (MongoDB Schema) [cite: 1]
| Collection | Key Fields |
| :--- | :--- |
| **Users** | fullName, prn (unique), branch, year, mobile, email, trustScore |
| **Products** | sellerId (ref), title, description, price, imageUrl, status (Available/In Cart/Sold) |
| **Transactions** | buyerId, productId (refs), razorpayOrderld, razorpayPaymentId, status, receiptUrl |

## Timeline & Team Roles (3 Students, 6-8 Weeks) [cite: 1]
| Student | Role | Primary Focus |
| :--- | :--- | :--- |
| **Danish** | Web Frontend | React.js dashboard, cart, checkout UI |
| **Manish** | Android App | Java + CameraX "Snap & Sell", native UI |
| **Aniruddha** | Backend & Payments | Node/Python API, JWT auth, Razorpay webhooks |
| **Chandrashekar** | Database & Deployment | MongoDB schemas, Cloudinary pipeline, hosting |

| Weeks | Milestone | Details |
| :--- | :--- | :--- |
| **1-2** | Foundation & Auth | Repo + boards set up; MongoDB schemas designed; JWT auth built; login/dashboard UIs started |
| **3-4** | Listings & Camera | CameraX (Android) + file picker (Web) for "Snap & Sell"; Cloudinary upload pipeline; Product CRUD |
| **5-6** | Cart & Checkout | Cart state management; Razorpay SDK integration; secure webhook verification |
| **7-8** | Automation & Polish | QR + PDF receipt generation, email delivery, Lottie success animation, deployment (Vercel/Render) |git 