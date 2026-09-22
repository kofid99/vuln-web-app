# Web Application Vulnerability Assessment Report

**Target:** https://vuln-web-app-rust.vercel.app  
**Date:** September 22, 2026  
**Assessor:** Kofi Darbo  
**Methodology:** Black-box assessment using Nmap, Burp Suite, OWASP ZAP, Nuclei, and manual testing

---

## Executive Summary

A security assessment was conducted against a deliberately vulnerable Next.js web application deployed on Vercel. The assessment identified 12 vulnerabilities across authentication, access control, sensitive data exposure, and security misconfiguration categories. Critical findings include unauthenticated access to admin endpoints returning password hashes and PII, and hardcoded admin credentials enabling full authentication bypass.

---

## Findings

### Finding 1 — Broken Access Control on Admin Endpoint
**Severity:** Critical  
**OWASP:** A01 — Broken Access Control  
**Endpoint:** /api/admin  
**Description:** The /api/admin endpoint returns sensitive user data including password hashes, emails, roles, and server information with no authentication required. Any unauthenticated user can access this endpoint directly.  
**Proof:** `curl https://vuln-web-app-rust.vercel.app/api/admin`  
**Remediation:** Implement server-side session verification on all admin endpoints. Return 401 Unauthorized for unauthenticated requests.

---

### Finding 2 — Password Hashes Exposed in API Response
**Severity:** Critical  
**OWASP:** A02 — Cryptographic Failures  
**Endpoint:** /api/admin  
**Description:** The /api/admin endpoint returns bcrypt password hashes for all users. An attacker can retrieve these hashes and attempt offline cracking using tools like Hashcat or John the Ripper.  
**Proof:** Response includes `"password_hash":"$2b$10$fakehashedpassword123"`  
**Remediation:** Never return password hashes in API responses regardless of authentication status.

---

### Finding 3 — PII Exposure on Unauthenticated Endpoint
**Severity:** High  
**OWASP:** A02 — Cryptographic Failures  
**Endpoint:** /api/users  
**Description:** The /api/users endpoint returns all user emails, roles, and last login timestamps with no authentication required.  
**Proof:** `curl https://vuln-web-app-rust.vercel.app/api/users`  
**Remediation:** Require authentication on all endpoints returning user data.

---

### Finding 4 — Hardcoded Admin Credentials
**Severity:** Critical  
**OWASP:** A07 — Identification and Authentication Failures  
**Endpoint:** /api/login  
**Description:** Admin credentials are hardcoded in the login API route. Email `admin@company.com` and password `admin123` grant full admin access.  
**Proof:** `curl -X POST https://vuln-web-app-rust.vercel.app/api/login -H "Content-Type: application/json" -d '{"email":"admin@company.com","password":"admin123"}'`  
**Remediation:** Never hardcode credentials. Use environment variables and a proper authentication system with hashed passwords stored in a database.

---

### Finding 5 — User Enumeration via Error Messages
**Severity:** Medium  
**OWASP:** A07 — Identification and Authentication Failures  
**Endpoint:** /api/login  
**Description:** The login endpoint returns different error messages for invalid email vs invalid password, allowing attackers to enumerate valid accounts.  
**Proof:** Wrong email returns "User not found". Wrong password returns "Wrong password".  
**Remediation:** Return a generic "Invalid credentials" message regardless of whether the email or password is wrong.

---

### Finding 6 — No Rate Limiting on Login Endpoint
**Severity:** High  
**OWASP:** A07 — Identification and Authentication Failures  
**Endpoint:** /api/login  
**Description:** The login endpoint accepts unlimited requests with no throttling or lockout mechanism, enabling brute force attacks.  
**Remediation:** Implement rate limiting (e.g. 5 attempts per minute per IP) and account lockout after repeated failures.

---

### Finding 7 — Missing HTTP Security Headers
**Severity:** High  
**OWASP:** A05 — Security Misconfiguration  
**Description:** The application is missing critical security headers: Content-Security-Policy, X-Frame-Options, Permissions-Policy, and X-Content-Type-Options.  
**Impact:** Missing CSP enables XSS attacks. Missing X-Frame-Options enables clickjacking.  
**Remediation:** Add all missing security headers in next.config.mjs.

---

### Finding 8 — Permissive CORS Policy
**Severity:** High  
**OWASP:** A05 — Security Misconfiguration  
**Description:** Access-Control-Allow-Origin is set to wildcard (*), allowing any origin to make cross-origin requests to the API.  
**Remediation:** Restrict CORS to trusted origins only.

---

### Finding 9 — Server Technology Disclosure
**Severity:** Low  
**OWASP:** A05 — Security Misconfiguration  
**Description:** HTTP response headers expose server technology including `server: Vercel` and underlying Golang net/http server, revealed via Nmap scan.  
**Remediation:** Remove or obscure server identification headers.

---

### Finding 10 — No Server-Side Authentication on Dashboard
**Severity:** Critical  
**OWASP:** A01 — Broken Access Control  
**Description:** The /dashboard route performs no server-side session verification. Any user can navigate directly to the dashboard URL without logging in.  
**Remediation:** Implement server-side session checks on all protected routes using middleware.

---

### Finding 11 — Sensitive Credentials in Environment Configuration
**Severity:** High  
**OWASP:** A02 — Cryptographic Failures  
**Description:** OAuth client ID, client secret, Supabase URL, anon key, and admin credentials are stored in .env.local. If this file were accidentally committed to version control it would expose all credentials.  
**Remediation:** Use a secrets manager (AWS Secrets Manager, HashiCorp Vault) and ensure .env files are always in .gitignore.

---

### Finding 12 — Information Disclosure via Nmap
**Severity:** Low  
**OWASP:** A05 — Security Misconfiguration  
**Description:** Nmap scan revealed open ports 80 and 443, server: Vercel header, and underlying Golang net/http server technology.  
**Remediation:** Configure server headers to minimize technology disclosure.

---

## Summary Table

| # | Finding | Severity | OWASP |
|---|---------|----------|-------|
| 1 | Broken Access Control on Admin Endpoint | Critical | A01 |
| 2 | Password Hashes Exposed | Critical | A02 |
| 3 | PII Exposure on Unauthenticated Endpoint | High | A02 |
| 4 | Hardcoded Admin Credentials | Critical | A07 |
| 5 | User Enumeration via Error Messages | Medium | A07 |
| 6 | No Rate Limiting on Login | High | A07 |
| 7 | Missing HTTP Security Headers | High | A05 |
| 8 | Permissive CORS Policy | High | A05 |
| 9 | Server Technology Disclosure | Low | A05 |
| 10 | No Server-Side Auth on Dashboard | Critical | A01 |
| 11 | Sensitive Credentials in Env Config | High | A02 |
| 12 | Information Disclosure via Nmap | Low | A05 |