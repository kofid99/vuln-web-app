# Web Application Vulnerability Assessment

A full black-box security assessment conducted against a deliberately vulnerable Next.js web application deployed on Vercel. The application was designed with intentional security misconfigurations to simulate real-world vulnerabilities found in production environments.

![Assessment Status](https://img.shields.io/badge/Assessment-Complete-red)
![Findings](https://img.shields.io/badge/Findings-12%2B%20Vulnerabilities-critical)
![Tools](https://img.shields.io/badge/Tools-Burp%20Suite%20%7C%20OWASP%20ZAP%20%7C%20Nuclei%20%7C%20Nmap-blue)

---

## Target Application

**URL:** https://vuln-web-app-rust.vercel.app  
**Stack:** Next.js 15 · Vercel · JavaScript  
**Assessment Type:** Black-box penetration test  
**Date:** October 2026  
**Assessor:** Kofi Darbo  

---

## What Was Built

A Next.js web application intentionally engineered with 12 security vulnerabilities across authentication, access control, sensitive data exposure, and security misconfiguration categories:

- Login page with hardcoded admin credentials and no rate limiting
- Admin dashboard accessible without authentication
- API endpoints returning password hashes and PII with no auth check
- Permissive CORS policy (`Access-Control-Allow-Origin: *`)
- Missing HTTP security headers (CSP, X-Frame-Options, Permissions-Policy)
- Sensitive credentials exposed via `NEXT_PUBLIC_` environment variables visible in JavaScript bundle

---

## Assessment Methodology

### Phase 1 — Reconnaissance
- **Nmap** — network scan identified open ports 80/443, server header disclosure (`Server: Vercel`), TLS certificate details, and underlying Golang net/http server
- **Browser Dev Tools** — Network tab confirmed missing security headers and CORS wildcard. Sources tab confirmed OAuth client ID, Supabase URL, and anon key visible in compiled JavaScript bundle

### Phase 2 — Automated Scanning
- **Nuclei** — targeted template scan confirmed 10 missing security headers including CSP, X-Frame-Options, Permissions-Policy, and X-Content-Type-Options
- **OWASP ZAP** — automated spider found 9 alerts including Cross-Domain Misconfiguration, missing anti-clickjacking header, and information disclosure via suspicious comments in JavaScript bundle

### Phase 3 — Manual Testing
- **curl** — confirmed unauthenticated access to `/api/admin` returning password hashes, `/api/users` returning PII, and hardcoded credential auth bypass
- **Burp Suite Repeater** — confirmed user enumeration via different error messages, CORS wildcard accepting requests from `evil-attacker.com`, rate limiting absence (15+ requests with no 429 or lockout), and auth bypass with modified requests

---

## Findings Summary

| # | Vulnerability | Severity | OWASP | Tool |
|---|---|---|---|---|
| 1 | Broken Access Control — Admin Endpoint | Critical | A01 | curl |
| 2 | Password Hashes Exposed in API Response | Critical | A02 | curl |
| 3 | PII Exposure — Unauthenticated Users Endpoint | High | A02 | curl |
| 4 | Hardcoded Admin Credentials | Critical | A07 | Burp Suite |
| 5 | User Enumeration via Error Messages | Medium | A07 | Burp Suite |
| 6 | No Rate Limiting on Login Endpoint | High | A07 | Burp Suite |
| 7 | Missing HTTP Security Headers | High | A05 | Nuclei · ZAP |
| 8 | Permissive CORS Policy (wildcard) | High | A05 | Burp Suite · ZAP |
| 9 | Server Technology Disclosure | Low | A05 | Nmap |
| 10 | No Server-Side Auth on Dashboard | Critical | A01 | Browser |
| 11 | Credentials Exposed via NEXT_PUBLIC Env Vars | High | A02 | Browser Dev Tools |
| 12 | Information Disclosure via HTTP Headers | Low | A05 | Nmap |
| 13 | Suspicious Comments in JavaScript Bundle | Low | A05 | ZAP |

---

## Key Findings Detail

### Critical — Authentication Bypass
The login API hardcodes admin credentials (`admin@company.com` / `admin123`). Confirmed via Burp Suite Repeater — POST to `/api/login` returns `{"message":"Login successful","role":"admin"}`.

### Critical — Broken Access Control
`/api/admin` returns all user emails, password hashes, roles, and server information with zero authentication. Accessible via a single unauthenticated curl request.

### High — Credentials in JavaScript Bundle
`NEXT_PUBLIC_` prefixed environment variables (OAuth client ID, Supabase URL, anon key) are compiled directly into client-side JavaScript and visible to anyone who opens browser Dev Tools → Sources tab.

### High — CORS Wildcard
`Access-Control-Allow-Origin: *` allows any origin to make cross-origin requests. Confirmed via Burp Suite — request with `Origin: https://evil-attacker.com` received full 200 response including successful admin login.

---

## Tools Used

| Tool | Purpose |
|---|---|
| Nmap | Network reconnaissance — ports, services, technology fingerprinting |
| Nuclei | Automated template-based vulnerability scanning |
| OWASP ZAP | Automated spider and active scanning |
| Burp Suite Community | Manual HTTP interception, request manipulation, rate limit testing |
| curl | Direct API endpoint testing |
| Browser Dev Tools | Header inspection, JavaScript bundle analysis |

---

## Real-World Context

During the assessment, Vercel's CDN bot protection blocked automated scanning tools (Nuclei full scan returned 0 results, curl returned Security Checkpoint HTML). This demonstrates that WAF/CDN protection masks application-level vulnerabilities from automated scanners — a common real-world scenario where pentesters must adapt by using targeted templates and manual testing techniques. Bot protection was temporarily disabled to complete the ZAP and Burp Suite phases, which mirrors standard engagement practice where clients whitelist the pentester's IP.

---

## Full Report

See `findings/report.md` for the complete assessment report with proof screenshots, detailed descriptions, and remediation recommendations for all 13 findings.

---

## Tech Stack

Next.js · Vercel · JavaScript · Nmap · Nuclei · OWASP ZAP · Burp Suite · curl · OWASP Top 10