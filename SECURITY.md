# TechVibe — Security Changelog

## Patch 3 — Hardened (this release)

### Critical
- **FIX-1 — Session creation DoS**: `POST /api/session` was completely unrate-limited.
  A bot could create millions of sessions and exhaust server memory.
  Now limited to 20 req/min per IP with concurrent cap of 5.

- **FIX-2 — Session Hijacking**: Sessions had no ownership binding.
  Any client who guessed or brute-forced a UUID could read or delete another user's history.
  Sessions are now IP-bound (`ownerIP` field). `getSession`, `appendToSession`,
  and `clearSession` all reject requests from non-owner IPs.
  `DELETE /api/session/:id` returns 200 regardless (enumeration defense).

- **FIX-3 — Slowloris / slow-body attack**: Node HTTP server had no socket-level timeouts.
  Attackers could hold connections open indefinitely, exhausting file descriptors.
  Fixed: `server.setTimeout(90s)`, `keepAliveTimeout(65s)`, `headersTimeout(15s)`.

### Medium
- **FIX-5 — No client-side message length cap**: Frontend sent unlimited text to the API.
  Body limit (8KB) was the only guard. Now the UI enforces 2000-char limit before fetch.
  Session-not-ready and session-failed states shown clearly with localized messages.

- **FIX-6 — History injection bypass**: `containsInjection()` only filtered incoming messages.
  Stored history could contain previously-bypassed injection attempts that got sent to Groq.
  Fixed: `historyClean()` filters all session messages before building the Groq payload.

### Low
- **FIX-7 — Error info leakage**: Error responses were generic on the server,
  but client re-surfaced `err?.message` which could include internal detail.
  Contact log now masks full email (domain only). Health endpoint returns no stack info.

- **FIX-8 — Missing CORP/COOP/COEP headers**: Added `Cross-Origin-Opener-Policy`,
  `Cross-Origin-Resource-Policy`, `Cross-Origin-Embedder-Policy` (helmet equivalents).

- **FIX-9 — CSP broke Vite dev**: `nonce-${nonce}` CSP was applied in both dev and prod.
  Vite injects inline scripts without nonces, causing CSP violations in dev.
  CSP and HSTS are now production-only.

- **FIX-4 — Session creation retry**: Frontend silently swallowed session errors.
  Now retries up to 3x with exponential backoff. Sets `sessionFailed` state
  so the user sees a clear "refresh the page" message.

---

## Patch 2 — Previous fixes

- TVS-008: Server-side session storage (history no longer sent by client)
- YENİ-001: Health endpoint stack disclosure removed
- YENİ-002: Rate-limit entry returned directly (no race-condition crash)
- YENİ-003: Trust proxy configurable via TRUST_PROXY env var
- YENİ-004: Unicode injection bypass defense (NFKC normalization)
- YENİ-005: IP_HMAC_SECRET ephemeral warning

---

## Patch 1 — Earlier fixes

- Prompt injection filter, contact rate limit (3/min)
- CSP nonce (style-src), HMAC-SHA256 IP hashing, HSTS
- PII masking, JSX fix, timeout UX + retry button

---

## Remaining recommendations (infrastructure level)

- **Nginx reverse proxy + TLS termination**: HTTPS is mandatory for production.
  Use Let's Encrypt + Nginx. Enable HTTP/2.
- **Redis for rate limiting**: In-memory RL resets on restart and doesn't share
  state across multiple instances. Migrate to Redis for clusters.
- **Structured logger**: Replace console.log with winston/pino + log rotation + alerting.
- **Contact form delivery**: Currently logs to console only.
  Add nodemailer / webhook / CRM integration.
- **WAF + DDoS protection**: Cloudflare or AWS Shield for volumetric DDoS.
  These cannot be solved at the application layer alone.
