# SecureNation  Full-Stack MERN Authentication System

A production-grade, security-first authentication system built with the MERN stack. SecureNation provides robust user authentication flows including JWT-based sessions, email OTP verification, secure password reset, multi-device session management, and comprehensive rate limiting.

**Live Demo:** [https://securenation.vercel.app](https://securenation.vercel.app)

---

##  Features

- **JWT Authentication** - Short-lived access tokens (15 min) + long-lived refresh tokens (7 days) stored in `httpOnly` cookies
- **Email OTP Verification** - Time-limited 6-digit OTPs via Brevo (Sendinblue) API for account activation
- **Secure Password Reset** - OTP-verified reset flow with single-use JWT reset tokens
- **Multi-Device Session Management** - View, revoke individual, or revoke all active sessions
- **Silent Token Refresh** - Automatic access token renewal via refresh token rotation with token reuse detection
- **Rate Limiting** - Per-route rate limiting (login, register, OTP, password reset) + global DDoS protection
- **Security Hardening** - Helmet.js headers, MongoDB injection sanitization, disposable email blocking, MX record validation
- **Structured Logging** - Winston logger with daily rotating log files (error + combined)
- **Speed Limiting** - Progressive request slowdown via `express-slow-down`
- **Automated Session Cleanup** - Cron job removes expired sessions at 2 AM daily

---

## Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens | Access & refresh token auth |
| bcryptjs | Password & OTP hashing |
| Brevo API | Transactional email delivery |
| Helmet | HTTP security headers |
| express-rate-limit | Route-level rate limiting |
| express-slow-down | Progressive speed limiting |
| express-mongo-sanitize | NoSQL injection prevention |
| isomorphic-dompurify | Email template XSS sanitization |
| Winston + DailyRotateFile | Production logging |
| node-cron | Scheduled session cleanup |

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite 7 | Build tool |
| Tailwind CSS 4 | Utility-first styling |
| React Router v7 | Client-side routing |
| Axios | HTTP client with interceptors |
| React Toastify | Toast notifications |
| React Error Boundary | Graceful error handling |
| Lucide React | Icon set |

---

## Project Structure

```
mern-auth-system/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── nodemailer.js       # Brevo email client
│   ├── controllers/
│   │   ├── auth.controller.js  # Auth logic (register, login, OTP, sessions)
│   │   ├── email.controller.js # Email dispatch helpers
│   │   └── user.controller.js  # User data endpoints
│   ├── middlewares/
│   │   ├── auth.middleware.js        # JWT verification
│   │   ├── emailDomain.middleware.js # Disposable email + MX validation
│   │   ├── rateLimiter.middleware.js # All rate/speed limiters
│   │   └── validate*.js             # Request body validators
│   ├── models/
│   │   └── user.model.js       # User + Session schema
│   ├── routes/
│   │   ├── auth.routes.js      # Auth endpoints
│   │   └── user.routes.js      # User endpoints
│   ├── utils/
│   │   ├── ApiError.js         # Custom error class
│   │   ├── ApiResponse.js      # Consistent response wrapper
│   │   ├── auth.js             # Session & token creation
│   │   ├── emailTemplate.js    # HTML email templates
│   │   ├── generateSendOtp.js  # OTP generation + delivery
│   │   ├── logger.js           # Winston logger config
│   │   ├── sessionCleanup.js   # Cron job for expired sessions
│   │   └── tokenHash.js        # SHA-256 token hashing utilities
│   ├── constant.js
│   ├── index.js                # App entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/         # Reusable UI components
    │   ├── context/            # UserContext + Provider
    │   ├── hooks/              # useErrorHandler
    │   ├── lib/
    │   │   └── apiClient.js    # Axios instance + interceptors
    │   ├── pages/
    │   │   ├── auth/           # Login, Register, OTP, Reset Password pages
    │   │   ├── Dashboard.jsx
    │   │   ├── Home.jsx
    │   │   └── SessionPage.jsx
    │   ├── routes/
    │   │   └── guards.jsx      # RequireAuth + RedirectIfAuth guards
    │   └── utils/
    ├── vite.config.js
    └── package.json
```

---

## Security Architecture

### Token Strategy
```
Login → Access Token (15 min, httpOnly cookie)
      + Refresh Token (7 days, httpOnly cookie, SHA-256 hashed in DB)

Access Token Expires → Interceptor auto-calls /auth/refresh-token
                     → New token pair issued (rotation)
                     → Reuse detected → All sessions wiped (compromise signal)
```

### Session Model
Each login creates a **session document** embedded in the user record containing:
- Hashed refresh token
- User-Agent & IP address
- `createdAt`, `lastUsedAt`, `expiresAt` timestamps

Up to **5 concurrent sessions** per user. Oldest session is evicted when the limit is reached.

### OTP Security
- Generated with `Math.random()` → 6-digit code
- Immediately **bcrypt-hashed** before storage
- 5-minute TTL enforced server-side
- Verified via `bcrypt.compare()` (timing-safe)

### Email Validation
- Regex format check
- **Disposable domain blocklist** (fetched from GitHub, refreshed every 24h)
- **MX record DNS lookup** to confirm deliverability

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB Atlas URI or local MongoDB
- Brevo account + API key

### Backend Setup

```bash
# Clone the repo
git clone https://github.com/deepx-sh/mern-auth-system.git
cd mern-auth-system/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Configure your `.env`:

```env
# Server
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net

# JWT — Access Token
JWT_ACCESS_TOKEN_SECRET=your_access_secret_here
JWT_ACCESS_TOKEN_EXPIRE=15m

# JWT — Refresh Token
JWT_REFRESH_TOKEN_SECRET=your_refresh_secret_here
JWT_REFRESH_TOKEN_EXPIRE=7d

# JWT — Password Reset
JWT_RESET_PASSWORD_SECRET=your_reset_secret_here
JWT_RESET_PASSWORD_EXPIRE=10m

# Brevo Email API
BREVO_API_KEY=your_brevo_api_key
BREVO_FROM_EMAIL=noreply@yourdomain.com
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your_brevo_login
BREVO_SMTP_PASS=your_brevo_smtp_key

# CORS
CLIENT_URL_LOCAL=http://localhost:5173
CLIENT_URL_PROD=https://your-production-domain.com
```

```bash
# Start development server
npm run dev

# Start production server
npm start
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
echo "VITE_API_URL=http://localhost:4000/api" > .env

# Start development server
npm run dev
```

---

## API Reference

### Auth Endpoints — `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user, sends verification OTP | ❌ |
| POST | `/login` | Login, returns token cookies | ❌ |
| POST | `/logout` | Logout current session | ✅ |
| POST | `/logout-all` | Revoke all sessions | ✅ |
| POST | `/verify-otp` | Verify email with OTP | ❌ |
| POST | `/resend-verify-otp` | Resend verification OTP | ❌ |
| POST | `/is-auth` | Check authentication status | ✅ |
| POST | `/forget-password` | Request password reset OTP | ❌ |
| POST | `/verify-reset-otp` | Verify reset OTP → returns reset token | ❌ |
| POST | `/reset-password` | Reset password with reset token | ❌ |
| POST | `/refresh-token` | Rotate access + refresh tokens | ❌ |
| GET | `/sessions` | List all active sessions | ✅ |
| DELETE | `/sessions/:id` | Revoke a specific session | ✅ |

### User Endpoints — `/api/user`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user-dashboard` | Get authenticated user data | ✅ |

---

## Rate Limiting

| Route | Window | Max Requests |
|-------|--------|-------------|
| `/register` | 1 hour | 3 |
| `/login` | 15 min | 5 |
| OTP requests | 10 min | 3 |
| OTP verification | 15 min | 5 (skip success) |
| Password reset | 1 hour | 3 |
| `/refresh-token` | 15 min | 20 |
| Global (all routes) | 15 min | 1000 |

Speed limiting kicks in after **50 requests** per 15 minutes, adding progressive delays up to 5 seconds.

---

## Deployment

### Backend (Render / Railway)
1. Set all environment variables from the `.env` table above
2. Set `NODE_ENV=production`
3. Build command: _(none needed  pure Node.js)_
4. Start command: `npm start`

### Frontend (Vercel)
The `frontend/vercel.json` is pre-configured with SPA rewrites and asset caching headers.

```bash
# Deploy via Vercel CLI
vercel --prod
```

Set the environment variable:
```
VITE_API_URL=https://your-backend-url.com/api
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## Author

**Deep Prajapati**

- GitHub: [@deepx-sh](https://github.com/deepx-sh)
- LinkedIn: [linkedin.com/in/deep-prajapati-63b6491b6](https://in.linkedin.com/in/deep-prajapati-63b6491b6)
- Email: dvprajapati7212@gmail.com

---

> Built with ❤️ as a full-stack security reference implementation. Feel free to use as a starter for your own projects.