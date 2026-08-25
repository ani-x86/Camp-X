# CampX: Campus Exchange Marketplace 

**Reference File:** CampX.pdf

## Team Members
* Aniruddha Udekar 
* Chandrashekhar Patil
* Danish Khatik 
* Manish 

## Project Description (CampusXchange)
We are building CampusXchange to solve the chaotic cycle of students wasting money on new semester essentials while graduating peers throw away perfectly good items. [cite: 1] By creating a trusted, verified student-only marketplace, we eliminate the safety risks and friction of generic online classifieds—making it seamless for students to buy and sell affordable textbooks, electronics, and dorm gear right on campus.

## Objectives
* Develop a closed-loop online marketplace that enables students and teachers to buy and sell products within the university community. 
* To implement PRN-based user verification by using the university roll number as a unique identifier for account verification and trust scoring. 
* To provide a web-based marketplace interface using React.js for product browsing, seller management, cart functionality, and checkout. 
* To develop a native Android application using Java and CameraX, including a "Snap & Sell" feature that allows sellers to upload product images directly through the device camera.

## Technology Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Web Frontend** | React.js | Dashboard, product grid, cart state, seller UI |
| **Android App** | Java (Native) + CameraX API | Native performance; camera integration for "Snap & Sell" |
| **Backend API** | Node.js (Express) or Python (FastAPI) | Business logic, auth, payment webhooks, REST endpoints |
| **Database** | MongoDB (NoSQL) | Flexible schemas for users, products, orders |
| **Image Storage** | Cloudinary (or AWS S3) | Hosting product photos uploaded by sellers |
| **Payments** | Razorpay API | Order creation, checkout, webhook-verified transactions |

## Tools, Libraries & Algorithms
* **Authentication:** JWT (JSON Web Tokens) issued at login, verified on every request stateless, no server-side sessions.
* **Payments:** Razorpay Orders API (backend) + Checkout SDK (frontend); HMAC signature verification on incoming webhooks before confirming an order. 
* **File uploads:** Multer (Node.js) middleware to handle multipart/form-data from the camera/file picker before forwarding to Cloudinary. 
* **QR generation:** qrcode library (Node.js/Python) encoding seller PRN + trust tag as JSON, embedded in the receipt.
* **PDF receipts:** server-side PDF generation library combining transaction details with the QR image. 
* **Email delivery:** Nodemailer (Node.js) or SendGrid/SMTP (Python) to send the receipt to the buyer's registered email. 
* **UI animation:** LottieFiles lightweight JSON animations for the post-payment success screen (Web + Android). 
* **Cart state:** Redux (React) on web; Room/ViewModel (Java) on Android. 

## Development Approach & Key Techniques 
* **Methodology:** Iterative/Agile, built in four phases rather than all at once. 
* **RESTful API design:** clean endpoints (e.g. GET/api/products, POST/api/orders) shared by both React and Java clients. 
* **Backend-verified payments:** the frontend never confirms a sale; Razorpay's webhook (signature-checked) is the only source of truth for payment success. 
* **PRN-based identity:** university roll number used as a unique index for account verification and trust scoring. 
* **Post-payment automation pipeline:** verify webhook → generate QR → generate PDF receipt → email buyer → trigger frontend success animation. 

## Data Collections (MongoDB Schema) 
| Collection | Key Fields |
| :--- | :--- |
| **Users** | fullName, prn (unique), branch, year, mobile, email, trustScore |
| **Products** | sellerId (ref), title, description, price, imageUrl, status (Available/In Cart/Sold) |
| **Transactions** | buyerId, productId (refs), razorpayOrderld, razorpayPaymentId, status, receiptUrl |

## Timeline & Team Roles (3 Students, 6-8 Weeks)
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