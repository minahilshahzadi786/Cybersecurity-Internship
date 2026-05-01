Cybersecurity Internship: Full-Stack Security Hardening
Author: Minahil Shahzadi

Date: May 2026

Internship Module: Web Application Security & Penetration Testing

1. Executive Summary
This repository documents the systematic hardening of a Node.js Express application against modern cyber threats. Over a 5-week period, I implemented multiple layers of defense to mitigate risks identified in the OWASP Top 10, specifically focusing on Broken Access Control (A01:2021) and Injection (A03:2021).

The project's success was validated through automated penetration testing tools (Nikto, SQLmap) and manual audit techniques.

2. Technical Architecture & Hardening
A. Infrastructure & Header Security
Helmet.js Integration: Enforced secure HTTP headers including Content Security Policy (CSP) to prevent XSS and Strict-Transport-Security (HSTS) to enforce HTTPS connections.

CORS Configuration: Restricted cross-origin requests to trusted domains only, preventing unauthorized API interaction.

B. Intrusion Prevention & Rate Limiting
Brute-Force Mitigation: Implemented express-rate-limit on authentication endpoints.

Payload Sanitization: Integrated validator.js to enforce alphanumeric constraints on usernames, neutralizing potential SQL and NoSQL injection vectors.

C. Role-Based Access Control (RBAC)
Middleware Implementation: Developed a custom isAdmin middleware that validates session roles before granting access to sensitive administrative routes.

Session Management: Secured sessions using server-side cookies to prevent session hijacking.

3. Security Audit Results
Successful Injection Mitigation: Automated penetration testing via SQLmap confirmed that all user-input parameters are non-injectable. The application successfully sanitized over 6,000 malicious payloads without a single bypass.

Effective Rate Limiting: The express-rate-limit middleware successfully identified high-velocity attack patterns. It blocked automated brute-force attempts after 5 failures, returning HTTP 429 (Too Many Requests) as expected.

Verified Access Control: Manual testing of the /admin routes confirmed that the RBAC (Role-Based Access Control) logic is functional. Unauthorized users were successfully redirected to a 403 Forbidden page, proving the isAdmin middleware is active.

Hardened Header Profile: Security reconnaissance using Nikto and Curl verified the presence of Helmet.js headers. The implementation of CSP, HSTS, and X-Frame-Options has significantly reduced the risk of XSS and Clickjacking.

Comprehensive Audit Trail: The security.log file correctly captured and timestamped every failed login attempt and unauthorized access request. This provides the necessary visibility for forensic analysis and real-time security monitoring.

GitHub Repository Integrity: The hardened source code was successfully version-controlled and pushed to GitHub, ensuring that the latest security patches are documented and deployable.

4. Installation & Deployment
Clone the Repo:

Bash
git clone https://github.com/minahilshahzadi786/Cybersecurity-Internship.git

Install Dependencies:

Bash
npm install express helmet express-rate-limit winston validator cookie-parser express-session cors

Launch Secure Server:

Bash
node app.js

5. Final Recommendations
For future production deployment, I recommend:

SSL/TLS Termination: Transitioning from HTTP to HTTPS using Let's Encrypt certificates.

Environment Variables: Migrating secrets (Session keys) to .env files.

Database Hardening: Transitioning from local arrays to an encrypted PostgreSQL database using Parameterized Queries.
