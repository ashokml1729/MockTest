# 📝 MockTest — Government Exam Preparation Platform

A full-stack web application for practising government competitive exams. Covers **17 exams** across SSC, Railway, and Banking categories with **33 CBTs** and **660 mock tests** (20 per CBT — Test 1 free, Tests 2–20 at ₹10 each). Features OTP-based authentication, Google OAuth, Razorpay payments, performance analytics, leaderboards, and a real-time test interface with question palette.

---

## 🚀 Features

### 🔐 Authentication

- **OTP-based login & registration** — 6-digit OTP sent to email (2-step flow)
- **Google OAuth** via Passport.js — links to existing account if email matches
- **JWT tokens** (7-day expiry) stored in `localStorage`, auto-attached to every request via Axios interceptor
- **Global 401 handling** — auto-redirects to `/login` on token expiry
- Two middleware types: `authMiddleware` (blocks unauthenticated) and `optionalAuth` (attaches user if present, doesn't block)

### 📚 Exam & Test System

- **17 exams** across SSC 🏛️, Railway 🚂, and Banking 🏦 categories
- **33 CBTs** with subject-wise question/mark breakdown
- **20 mock tests per CBT** — Test 1 is free, Tests 2–20 cost ₹10 each
- Accordion-style CBT listing with subjects table on the exam page
- `isPurchased` flag attached to each test card based on user's payment history

### 💳 Payments (Razorpay)

- Server creates a Razorpay order → client opens Razorpay popup → server verifies HMAC signature
- Already-purchased tests detected server-side and re-accessed directly
- Payment status: `created` → `paid` / `failed`
- `loadRazorpay.js` utility (in `client/src/utils/`) dynamically injects the Razorpay SDK script at runtime

### 🧪 Test Interface

- Full-screen test UI with live countdown timer (auto-submit on expiry)
- **Question palette** (sidebar) with colour-coded status: current / answered / marked for review / not visited
- Mobile-friendly — palette opens as an overlay on small screens
- Mark for Review toggle, Previous / Next navigation
- **Per-question time tracking** using `useRef` timestamps
- Confirmation dialog before manual submission showing answered vs unanswered count
- Redirects back to exam page (not dashboard) if payment is required

### 📊 Results & Analytics

- Score, correct / incorrect / skipped count, rank among all attempts, time taken
- **Topic-wise performance** breakdown table with accuracy %
- **Score trend bar chart** and **topic-wise doughnut chart** via `Chart.js`
- Exam selector to switch analytics between exams
- Scores capped at 0 (no negative total), calculated with per-CBT negative marking

### 🏆 Leaderboard

- Per-test leaderboard (top 50) sorted by score desc, then time taken asc
- Rank badges: 🥇 Gold / 🥈 Silver / 🥉 Bronze
- Current user's row highlighted

### 📋 History

- Full table of all past attempts with score, correct/incorrect/skipped, time, rank, date
- Direct link to result page for each attempt

### 👤 Profile

- View and edit username (uniqueness enforced)
- Total tests taken, average score
- Google vs email account indicator, join date

### 💬 Feedback

- Form pre-filled with logged-in user's name and email
- Stored in DB + email notification sent to admin via Nodemailer

### 🌙 Theme

- Dark / light toggle persisted in `localStorage` via `data-theme` on `<html>`

---

## 🛠️ Tech Stack

| Layer       | Technology                                           |
| ----------- | ---------------------------------------------------- |
| Frontend    | React 18, Vite                                       |
| Routing     | React Router v6                                      |
| HTTP Client | Axios (with request/response interceptors)           |
| Charts      | Chart.js (`react-chartjs-2`)                         |
| Icons       | `react-icons` (Feather, Google)                      |
| Backend     | Node.js, Express.js                                  |
| Database    | PostgreSQL + Sequelize ORM                           |
| Auth        | JWT (`jsonwebtoken`), Passport.js (Google OAuth 2.0) |
| Payments    | Razorpay                                             |
| Email / OTP | Nodemailer (Gmail)                                   |
| Security    | Helmet, CORS, HMAC signature verification            |
| Environment | dotenv                                               |

---

## 📁 Project Structure

```
mockTest/
├── client/                               # React + Vite frontend
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── components/
│   │   │   ├── ConfirmDialog.jsx          # Modal with title, message, confirm/cancel
│   │   │   ├── Footer.jsx                 # Footer with dashboard/feedback/profile links
│   │   │   ├── LoadingSpinner.jsx         # Full-page centered spinner
│   │   │   ├── Navbar.jsx                 # Top nav, theme toggle, user avatar dropdown
│   │   │   └── ProtectedRoute.jsx         # Redirects to /login if not authenticated
│   │   ├── context/
│   │   │   ├── AuthContext.jsx            # user, token, login(), logout(), fetchUser()
│   │   │   └── ThemeContext.jsx           # theme, toggleTheme(), persisted to localStorage
│   │   ├── pages/
│   │   │   ├── AnalyticsPage.jsx          # Score trend + topic doughnut chart + table
│   │   │   ├── AuthCallbackPage.jsx       # Google OAuth redirect — exchanges token, navigates
│   │   │   ├── DashboardPage.jsx          # SSC/Railway/Banking tabs + exam grid
│   │   │   ├── FeedbackPage.jsx           # Feedback form with success state
│   │   │   ├── HistoryPage.jsx            # Paginated attempts table
│   │   │   ├── LandingPage.jsx            # Hero section, stats (17 exams, 33 CBTs, 660 tests)
│   │   │   ├── LeaderboardPage.jsx        # Per-test top-50 leaderboard with rank badges
│   │   │   ├── LoginPage.jsx              # 2-step OTP login + Google button
│   │   │   ├── MockTestListPage.jsx       # CBT accordion, subjects table, test cards, payment
│   │   │   ├── ProfilePage.jsx            # Avatar, username edit, stats
│   │   │   ├── RegisterPage.jsx           # 2-step OTP registration + Google button
│   │   │   ├── ResultPage.jsx             # Score hero, correct/incorrect/skipped/rank cards
│   │   │   ├── SolutionPage.jsx           # Per-question solution review with filter tabs
│   │   │   └── TestPage.jsx               # Full test interface — timer, palette, navigation
│   │   ├── services/
│   │   │   └── api.js                     # Axios instance — baseURL, auth interceptor, 401 handler
│   │   ├── utils/
│   │   │   └── loadRazorpay.js            # Dynamically injects Razorpay SDK script, returns Promise<boolean>
│   │   ├── App.jsx                        # Router, ThemeProvider, AuthProvider, all routes
│   │   ├── index.css                      # Global styles, CSS variables (--accent, --border, etc.)
│   │   └── main.jsx                       # React entry point (StrictMode)
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                               # Node.js + Express backend
│   ├── config/
│   │   ├── database.js                   # Sequelize PostgreSQL connection with pool config
│   │   └── passport.js                   # Google OAuth strategy — create/link user
│   ├── controllers/
│   │   ├── authController.js             # register, verifyOTP, login, loginVerify, googleCallback, getMe
│   │   ├── examController.js             # getExams (grouped), getExamBySlug, getTestInfo
│   │   ├── feedbackController.js         # submitFeedback — saves to DB + sends email
│   │   ├── paymentController.js          # createOrder, verifyPayment (HMAC)
│   │   ├── testController.js             # startTest, submitTest, getResults, getSolutions, getLeaderboard
│   │   └── userController.js             # getHistory, getAnalytics, getProfile, updateProfile
│   ├── middleware/
│   │   └── auth.js                       # authMiddleware (required) + optionalAuth (passive)
│   ├── models/
│   │   ├── index.js                      # Sequelize init + all associations
│   │   ├── User.js                       # id, username, email, passwordHash, isVerified, authProvider, googleId, avatar
│   │   ├── Exam.js                       # id, name, category (SSC/Railway/Banking), slug, description, icon
│   │   ├── CBT.js                        # id, examId, name, slug, totalQuestions, totalMarks, duration, negativeMarking, subjects (JSONB)
│   │   ├── MockTest.js                   # id, cbtId, testNumber, title, isFree
│   │   ├── Question.js                   # id, mockTestId, questionNumber, questionText, optionA-D, correctOption, solutionText, topic, difficulty
│   │   ├── TestAttempt.js                # id, userId, mockTestId, score, totalCorrect/Incorrect/Skipped, timeTaken, rank
│   │   ├── UserAnswer.js                 # id, attemptId, questionId, selectedOption, isCorrect, isMarkedForReview, timeSpent
│   │   ├── Payment.js                    # id, userId, mockTestId, razorpayOrderId, razorpayPaymentId, amount, status
│   │   └── Feedback.js                   # id, userId, name, email, message
│   ├── routes/
│   │   ├── authRoutes.js                 # POST /register, /verify-otp, /login, /login-verify | GET /me, /google, /google/callback
│   │   ├── examRoutes.js                 # GET / (all exams), /:slug (exam detail), /:slug/tests/:testId
│   │   ├── feedbackRoutes.js             # POST / (optionalAuth)
│   │   ├── paymentRoutes.js              # POST /create-order, /verify (authMiddleware)
│   │   ├── testRoutes.js                 # GET /:testId/start, /results/:id, /solutions/:id, /leaderboard | POST /:testId/submit
│   │   └── userRoutes.js                 # GET /history, /analytics/:examSlug, /profile | PUT /profile
│   ├── seeds/
│   │   ├── questions/
│   │   │   ├── englishBank.js            # Synonyms, antonyms, sentence correction, idioms, one-word subs, fill-blanks, spelling, voice/narration
│   │   │   ├── financeBank.js            # Banking/finance/economy static question bank
│   │   │   ├── gkBank.js                 # General knowledge & current affairs bank
│   │   │   ├── mathTemplates.js          # 45+ parametric templates: arithmetic, %, profit/loss, SI/CI, geometry, trains, etc.
│   │   │   ├── reasoningTemplates.js     # Parametric reasoning templates
│   │   │   └── scienceBank.js            # Physics, chemistry, engineering static bank
│   │   └── generateQuestions.js          # Seed script: 17 exams → 33 CBTs → 20 tests each → questions per subject
│   ├── utils/
│   │   └── otp.js                        # generateOTP(), storeOTP(), verifyOTP(), sendOTPEmail() via Nodemailer
│   ├── .env                              # Environment variables (never commit)
│   ├── package.json
│   └── server.js                         # Express app — middleware, routes, DB sync, server start
│
├── .gitignore                            # Root-level gitignore
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js v18+
- PostgreSQL running locally or on a remote host
- Razorpay account ([razorpay.com](https://razorpay.com))
- Google Cloud Console project with OAuth 2.0 credentials ([console.cloud.google.com](https://console.cloud.google.com))
- Gmail account with an App Password for sending OTP emails

---

### 1. Clone the repository

```bash
git clone https://github.com/ashokml1729/MockTest.git
cd MockTest
```

---

### 2. Setup the backend

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
# Server
PORT=5000
CLIENT_URL=http://localhost:5173

# PostgreSQL
DB_NAME=mocktest_db
DB_USER=postgres
DB_PASSWORD=your_pg_password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET=your_jwt_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email (OTP & Feedback notifications)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend:

```bash
node server.js
```

> On first run, Sequelize auto-syncs all models to your PostgreSQL database using `{ alter: true }`.

---

### 3. Seed the database

Run the seed script to populate all 17 exams, 33 CBTs, 660 mock tests, and their questions:

```bash
cd server
node seeds/generateQuestions.js
```

Expected output:

```
✅ Connected to PostgreSQL
✅ Database synced
📝 Creating 17 exams...
✅ Created 17 exams
  ✅ SSC CGL Tier 1: 20 tests, 2000 questions
  ...
🎉 Seeding complete!
   Total exams     : 17
   Total CBTs      : 33
   Total mock tests: 660
   Total questions : ~66,000+
```

> ⚠️ The seed script uses `force: true` — it drops and recreates all tables. Only run it on a fresh database.

---

### 4. Setup the frontend

```bash
cd ../client
npm install
```

Create a `.env` file inside `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

App opens at `http://localhost:5173`.

---

## 🌐 API Routes

### Auth — `/api/auth`

| Method | Endpoint           | Auth     | Description                               |
| ------ | ------------------ | -------- | ----------------------------------------- |
| POST   | `/register`        | None     | Register with email + username, sends OTP |
| POST   | `/verify-otp`      | None     | Verify registration OTP, returns JWT      |
| POST   | `/login`           | None     | Login with email, sends OTP               |
| POST   | `/login-verify`    | None     | Verify login OTP, returns JWT             |
| GET    | `/me`              | Required | Get current user details                  |
| GET    | `/google`          | None     | Initiate Google OAuth                     |
| GET    | `/google/callback` | None     | Google OAuth callback                     |

### Exams — `/api/exams`

| Method | Endpoint               | Auth     | Description                                               |
| ------ | ---------------------- | -------- | --------------------------------------------------------- |
| GET    | `/`                    | None     | All exams grouped by SSC / Railway / Banking              |
| GET    | `/:slug`               | Optional | Exam detail with CBTs, mock tests, `isAttempted` per test |
| GET    | `/:slug/tests/:testId` | None     | Basic test info (no questions)                            |

### Tests — `/api/tests`

| Method | Endpoint                        | Auth     | Description                                             |
| ------ | ------------------------------- | -------- | ------------------------------------------------------- |
| GET    | `/:testId/start`                | Required | Load questions (checks payment for paid tests)          |
| POST   | `/:testId/submit`               | Required | Submit answers, calculate score & rank (DB transaction) |
| GET    | `/:testId/results/:attemptId`   | Required | Result details with flattened CBT data                  |
| GET    | `/:testId/solutions/:attemptId` | Required | Questions + user answers + correct answers              |
| GET    | `/:testId/leaderboard`          | Optional | Top 50 attempts with `isCurrentUser` flag               |

### User — `/api/user`

| Method | Endpoint               | Auth     | Description                                      |
| ------ | ---------------------- | -------- | ------------------------------------------------ |
| GET    | `/history`             | Required | All past attempts with flattened exam/CBT data   |
| GET    | `/analytics/:examSlug` | Required | Score trend + topic-wise performance for an exam |
| GET    | `/profile`             | Required | User profile with totalAttempts and avgScore     |
| PUT    | `/profile`             | Required | Update username (uniqueness enforced)            |

### Payment — `/api/payment`

| Method | Endpoint        | Auth     | Description                                           |
| ------ | --------------- | -------- | ----------------------------------------------------- |
| POST   | `/create-order` | Required | Create Razorpay order (checks for duplicate purchase) |
| POST   | `/verify`       | Required | Verify HMAC signature, update payment to `paid`       |

### Feedback — `/api/feedback`

| Method | Endpoint | Auth     | Description                                         |
| ------ | -------- | -------- | --------------------------------------------------- |
| POST   | `/`      | Optional | Submit feedback, stores in DB, sends email to admin |

---

## 🗺️ Frontend Routes

| Path                                 | Page                  | Protected |
| ------------------------------------ | --------------------- | --------- |
| `/`                                  | Landing Page          | No        |
| `/register`                          | Register (OTP 2-step) | No        |
| `/login`                             | Login (OTP 2-step)    | No        |
| `/auth/callback`                     | Google OAuth Callback | No        |
| `/dashboard`                         | Exam Dashboard        | No        |
| `/exams/:slug`                       | CBT & Mock Test List  | No        |
| `/test/:testId`                      | Test Interface        | ✅ Yes    |
| `/test/:testId/results/:attemptId`   | Result Page           | ✅ Yes    |
| `/test/:testId/solutions/:attemptId` | Solution Review       | ✅ Yes    |
| `/test/:testId/leaderboard`          | Leaderboard           | No        |
| `/history`                           | Test History          | ✅ Yes    |
| `/analytics`                         | Performance Analytics | ✅ Yes    |
| `/profile`                           | User Profile          | ✅ Yes    |
| `/feedback`                          | Feedback Form         | No        |

---

## 🗄️ Database Schema

| Table           | Key Fields                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| `users`         | id, username, email, isVerified, authProvider, googleId, avatar                                         |
| `exams`         | id, name, category, slug, description, icon                                                             |
| `cbts`          | id, examId, name, slug, totalQuestions, totalMarks, duration, negativeMarking, subjects (JSONB)         |
| `mock_tests`    | id, cbtId, testNumber, title, isFree                                                                    |
| `questions`     | id, mockTestId, questionNumber, questionText, optionA-D, correctOption, solutionText, topic, difficulty |
| `test_attempts` | id, userId, mockTestId, score, totalCorrect, totalIncorrect, totalSkipped, timeTaken, rank              |
| `user_answers`  | id, attemptId, questionId, selectedOption, isCorrect, isMarkedForReview, timeSpent                      |
| `payments`      | id, userId, mockTestId, razorpayOrderId, razorpayPaymentId, amount, status                              |
| `feedbacks`     | id, userId, name, email, message                                                                        |

---

## 🔑 Environment Variables Reference

| Variable               | File        | Description                                  |
| ---------------------- | ----------- | -------------------------------------------- |
| `PORT`                 | server/.env | Express port (default: 5000)                 |
| `CLIENT_URL`           | server/.env | Frontend URL for CORS and OAuth redirect     |
| `DB_NAME`              | server/.env | PostgreSQL database name                     |
| `DB_USER`              | server/.env | PostgreSQL username                          |
| `DB_PASSWORD`          | server/.env | PostgreSQL password                          |
| `DB_HOST`              | server/.env | PostgreSQL host (default: localhost)         |
| `DB_PORT`              | server/.env | PostgreSQL port (default: 5432)              |
| `JWT_SECRET`           | server/.env | Secret for signing JWTs                      |
| `GOOGLE_CLIENT_ID`     | server/.env | Google OAuth client ID                       |
| `GOOGLE_CLIENT_SECRET` | server/.env | Google OAuth client secret                   |
| `GOOGLE_CALLBACK_URL`  | server/.env | Google OAuth callback URI                    |
| `EMAIL_USER`           | server/.env | Gmail address for OTP & feedback emails      |
| `EMAIL_PASS`           | server/.env | Gmail App Password                           |
| `RAZORPAY_KEY_ID`      | server/.env | Razorpay public key                          |
| `RAZORPAY_KEY_SECRET`  | server/.env | Razorpay secret (used for HMAC verification) |
| `VITE_API_URL`         | client/.env | Backend API base URL                         |

---

## 📦 Dependencies

### Client

```
react, react-dom, react-router-dom
axios
react-chartjs-2, chart.js
react-icons
vite, @vitejs/plugin-react
eslint, eslint-plugin-react-hooks, eslint-plugin-react-refresh
```

### Server

```
express, cors, helmet
sequelize, pg, pg-hstore
passport, passport-google-oauth20
jsonwebtoken, bcryptjs
nodemailer
razorpay
dotenv
```

---

## 🛡️ Security Notes

- Never commit `.env` files — both `client/.env` and `server/.env` are in `.gitignore`
- JWT tokens are verified on every protected route via `authMiddleware`
- Razorpay payments are verified server-side using HMAC-SHA256 before unlocking any test
- Helmet sets secure HTTP response headers on all responses
- CORS is restricted to `CLIENT_URL` only

---

## 📝 License

This project is open-source and free to use for learning and personal projects.
