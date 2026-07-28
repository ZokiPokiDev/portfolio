---
id: security-audit-checklist
title: Security Audit Checklist for Startups
excerpt: The minimum viable security posture for a seed-stage company.
slug: security-audit-checklist
tags: Security, Startup, DevOps
order: 6
---

## Security Audit Checklist for Startups

You do not need enterprise-grade security on day one, but you do need the basics. This checklist covers what a seed-stage startup should have in place before first customer data touches your systems.

### Access Control

- MFA on all accounts (GitHub, AWS, database, etc.)
- Principle of least privilege - no root/admin access by default
- Password manager required for all team members
- SSH keys instead of passwords where possible
- Device management - know what devices have access

### Data Protection

- Encryption at rest for all customer data
- Encryption in transit (TLS 1.2+) everywhere
- Secrets management - never in code, never in Git
- Database backups with tested restore procedure
- Data retention policy - know what you keep and why

### Application Security

- Dependency scanning in CI/CD (Snyk, Dependabot)
- Container scanning if using Docker
- Input validation on all API endpoints
- Rate limiting on auth endpoints
- CORS configured appropriately
- Security headers (CSP, HSTS, etc.)

### Monitoring and Response

- Centralized logging (can be simple - even a shared Slack channel)
- Error tracking (Sentry, Rollbar, etc.)
- Incident response plan - who to call at 2am
- Security contact published (security@company.com)
- Breach notification procedure (legal requirement in most jurisdictions)

### Compliance Basics

- Privacy policy published and accurate
- Terms of service with clear liability limits
- GDPR compliance if serving EU users
- Data processing agreement template ready

### Quick Wins (30 minutes each)

1. Enable MFA on AWS root account
2. Run dependabot on your main repo
3. Add CSP header
4. Create a security@ email address
5. Document your incident response contacts

### When to Get Help

Hire a security consultant when:
- You handle sensitive data (health, financial, PII)
- You are about to raise Series A
- You have had a security incident
- Your team lacks security expertise

Security is not a feature - it is a foundational practice.
