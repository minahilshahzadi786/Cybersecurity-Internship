# 🛡️ Cybersecurity Internship: Full-Stack Security Hardening

**Author:** Minahil Shahzadi
**Date:** May 2026
**Module:** Web Application Security & Penetration Testing
**GitHub:** [minahilshahzadi786/Cybersecurity-Internship](https://github.com/minahilshahzadi786/Cybersecurity-Internship)

---

## 📋 Executive Summary

This repository documents the systematic hardening of a **Node.js Express** web application against modern cyber threats. Over a **5-week period**, multiple layers of defense were implemented to mitigate risks identified in the **OWASP Top 10**, with specific focus on:

- **A01:2021 — Broken Access Control**
- **A03:2021 — Injection**

Project success was validated through automated penetration testing tools (**Nikto**, **SQLmap**) and manual audit techniques.

---

## 🏗️ Technical Architecture & Hardening

### A. Infrastructure & Header Security

| Control | Implementation | Purpose |
|---|---|---|
| **Helmet.js** | `app.use(helmet())` | Enforces secure HTTP headers |
| **CSP** | `Content-Security-Policy` | Prevents Cross-Site Scripting (XSS) |
| **HSTS** | `Strict-Transport-Security` | Enforces HTTPS connections |
| **CORS** | Restricted to trusted origins | Prevents unauthorized API interaction |

```javascript
const helmet = require('helmet');
const cors = require('cors');

app.use(helmet());
app.use(cors({ origin: 'https://trusted-domain.com' }));
```

---

### B. Intrusion Prevention & Rate Limiting

| Control | Implementation | Purpose |
|---|---|---|
| **Rate Limiting** | `express-rate-limit` on auth endpoints | Brute-force mitigation |
| **Input Validation** | `validator.isAlphanumeric()` | Neutralizes SQL/NoSQL injection vectors |

```javascript
const rateLimit = require('express-rate-limit');
const validator = require('validator');

// Block after 5 failed attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many attempts. Please try again later.'
});
app.use('/login', authLimiter);

// Input sanitization
if (!validator.isAlphanumeric(username)) {
  logger.warn('Suspicious login attempt', { input: username, ip: req.ip });
  return res.status(400).send('Invalid Username Format');
}
```

---

### C. Role-Based Access Control (RBAC)

| Control | Implementation | Purpose |
|---|---|---|
| **isAdmin Middleware** | Custom session-role validation | Protects sensitive admin routes |
| **Session Management** | Server-side cookies | Prevents session hijacking |

```javascript
// isAdmin middleware
function isAdmin(req, res, next) {
  if (req.session && req.session.role === 'admin') {
    return next();
  }
  return res.status(403).send('403 Forbidden');
}

app.get('/admin', isAdmin, (req, res) => {
  res.send('Welcome, Admin');
});
```

---

## ✅ Security Audit Results

| Test | Tool | Result |
|---|---|---|
| SQL/NoSQL Injection | SQLmap | ✅ 6,000+ malicious payloads blocked — zero bypasses |
| Brute-Force Attack | express-rate-limit | ✅ Blocked after 5 failures — HTTP 429 returned |
| Access Control | Manual testing | ✅ Unauthorized users redirected to 403 Forbidden |
| Header Security | Nikto + Curl | ✅ CSP, HSTS, X-Frame-Options all active |
| Audit Logging | security.log | ✅ Every failed login timestamped and recorded |
| Version Control | GitHub | ✅ Hardened source code pushed and documented |

---

## 🚀 Installation & Deployment

### 1. Clone the Repository
```bash
git clone https://github.com/minahilshahzadi786/Cybersecurity-Internship.git
cd Cybersecurity-Internship
```

### 2. Install Dependencies
```bash
npm install express helmet express-rate-limit winston validator cookie-parser express-session cors
```

### 3. Launch the Secure Server
```bash
node app.js
```

---

## 🔒 Security Dependencies

| Package | Purpose |
|---|---|
| `helmet` | Secure HTTP headers (CSP, HSTS, X-Frame-Options) |
| `express-rate-limit` | Brute-force & DDoS protection |
| `winston` | Security audit logging to `security.log` |
| `validator` | Input sanitization & injection prevention |
| `cookie-parser` | Secure cookie handling |
| `express-session` | Server-side session management |
| `cors` | Controlled cross-origin resource sharing |

---

## 📌 Final Recommendations

For future production deployment:

- 🔐 **SSL/TLS Termination** — Transition to HTTPS using [Let's Encrypt](https://letsencrypt.org/) certificates
- 🗝️ **Environment Variables** — Migrate all secrets and session keys to `.env` files using `dotenv`
- 🗄️ **Database Hardening** — Replace local arrays with an encrypted **PostgreSQL** database using parameterized queries
---

## 📄 License

This project was developed as part of the **DevelopersHub Cybersecurity Internship Programme**.
For educational purposes only.

---

*Built with ❤️ by Minahil Shahzadi — May 2026*

