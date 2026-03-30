# Cybersecurity-Internship
# DevelopersHub Cybersecurity Internship

## Project Overview
This project demonstrates the security hardening of a Node.js web application over a 3-week lifecycle.

## Implemented Security Controls:
- **Input Validation:** Blocked XSS/SQLi using `validator.js`.
- **Header Security:** Implemented `Helmet.js` to prevent Clickjacking and Sniffing.
- **Audit Logging:** Integrated `Winston` to record malicious attempts in `security.log`.
- **Information Masking:** Custom error handlers to prevent server path leakage.

## Verification:
- **Nmap:** Verified open ports and active service headers.
- **OWASP ZAP:** Initial scan and post-remediation validation.
