# 🚨 CRITICAL SECURITY FIXES REQUIRED

## 1. Fix .gitignore to protect sensitive data

```bash
# Add to .gitignore
.env
.env.local
.env.production
.env.staging
*.env
.env.*
!.env.example
```

## 2. Enable Rate Limiting

```javascript
// backend/src/index.js
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
```

## 3. Remove Hardcoded Secrets

```javascript
// Replace all instances of:
process.env.JWT_SECRET || "your-secret-key";

// With:
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}
```

## 4. Secure CORS Configuration

```javascript
// backend/src/index.js
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  process.env.PRODUCTION_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

## 5. Add Security Headers

```javascript
// backend/src/index.js
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

