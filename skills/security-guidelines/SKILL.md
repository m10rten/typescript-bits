---
name: security-guidelines
description: Security guidelines for TypeScript and Node.js — input validation, injection prevention, authentication hardening, secrets management, HTTP security headers, and common vulnerability patterns
---

# Security Guidelines

Practical security rules for TypeScript/Node.js applications. Applied at the boundary, enforced at every layer.

---

## Quick Reference: Common Mistakes & Fixes

| Mistake                                                   | Fix                                                                    | Applies to       |
| --------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------- |
| Casting `req.body as T` instead of parsing                | Validate with a parse function or schema library at every boundary     | API, CLI         |
| String-interpolating user input into SQL                  | Always use parameterized queries or an ORM                             | API, worker      |
| Passing user input to `exec` with `shell: true`           | Use `execFile` with an explicit argument array                         | API, worker, CLI |
| Not verifying JWT signature — just calling `decode()`     | Use a JOSE library's `verify` function; check signature and `exp`      | API              |
| Returning raw errors or stack traces to clients           | Map to generic messages; log details internally with correlation ID    | API, frontend    |
| Wildcard CORS (`*`) on credentialed endpoints             | Maintain an explicit origin allowlist                                  | API              |
| Secrets hardcoded or committed to git                     | Use environment variables; validate at startup; `.env` in `.gitignore` | all              |
| Logging full request/response objects with secrets        | Redact sensitive fields before logging                                 | all              |
| No rate limiting on auth endpoints                        | Apply a strict limiter with account lockout                            | API              |
| Authorization checked once at route group level           | Check authorization explicitly in each handler                         | API              |
| Resolving user file paths without verification            | `path.resolve` + startsWith check against allowed root                 | API, CLI         |
| Using `Math.random()` for security tokens                 | Use `crypto.getRandomValues()` or `crypto.randomUUID()`                | all              |
| Password hashing with low cost factors                    | argon2id: `memoryCost=65536, timeCost=3`; PBKDF2 ≥ 310,000 iterations  | all              |
| Trusting `X-Forwarded-For` blindly                        | Configure trusted proxies; validate IP source before reading           | API              |
| Storing tokens in `localStorage`                          | Use `httpOnly; Secure; SameSite=Strict` cookies                        | frontend         |
| `target="_blank"` links without rel                       | Always add `rel="noopener noreferrer"`                                 | frontend         |
| Using eval, Function constructor, or unsafe deserializers | Use JSON with schema validation (Zod, Valibot)                         | all              |

---

## Input Validation & Sanitization

_Applies to: all_

**Never trust user input.** Validate at every entry point — HTTP handlers, queue consumers, CLI args, WebSocket messages.

### Parse, don't cast

Validate shape and types at entry points using a schema validation library (Zod, Valibot, ArkType). Casting with `as` bypasses runtime safety entirely.

```ts
// ❌ Cast — no runtime check
app.post("/users", (req, res) => {
  const body = req.body as CreateUserInput;
  createUser(body);
});

// ✅ Parse with Zod — validated at the boundary
const createUserSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  role: z.enum(["user", "admin"]),
});

app.post("/users", (req, res) => {
  try {
    const body = createUserSchema.parse(req.body);
    createUser(body);
  } catch (err) {
    res.status(400).json({ error: "Invalid input" });
  }
});
```

### Allowlist over denylist

Accept known-good values, not block known-bad. Denylists are always incomplete.

```ts
// ❌ Denylist — easy to bypass with encoding tricks
const BLOCKED = ["<script>", "javascript:", "onerror="];
if (BLOCKED.some((b) => input.includes(b))) throw new Error("Invalid");

// ✅ Allowlist — only permit what you expect
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
if (!ALLOWED_MIME_TYPES.has(file.mimetype)) throw new Error("Unsupported file type");
```

### Sanitize HTML output

_Applies to: API, frontend_

Never insert user-controlled strings into the DOM or HTML templates without escaping.

```ts
// ❌ Raw insertion
element.innerHTML = userContent;

// ✅ Client: Use DOMPurify before setting innerHTML
// element.innerHTML = DOMPurify.sanitize(userContent, { ALLOWED_TAGS: ["b", "i", "em"] });

// ✅ Server: Escape for plain text contexts (your framework usually auto-escapes)
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
```

### Normalize before comparison

Unicode homoglyphs and whitespace tricks defeat naive checks.

```ts
// ❌ Raw comparison — vulnerable to homoglyphs and padding
if (username === "admin") grant();

// ✅ Normalize first
function normalize(s: string): string {
  return s.normalize("NFC").trim().toLowerCase();
}
if (normalize(username) === "admin") grant();
```

---

## Injection Prevention

_Applies to: API, worker_

### SQL injection — parameterized queries only

Never interpolate user input into SQL strings.

```ts
// ❌ String interpolation — SQL injection
const rows = await db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Parameterized query
const rows = await db.query("SELECT * FROM users WHERE email = $1", [email]);

// ✅ ORM (uses parameterized queries internally)
const user = await prisma.user.findUnique({ where: { email } });
```

### NoSQL injection — validate before querying

MongoDB operators (`$where`, `$gt`, etc.) can be injected via object input if you pass `req.body` directly.

```ts
// ❌ Direct pass — attacker can send { "password": { "$gt": "" } }
await db.collection("users").findOne({ email: req.body.email, password: req.body.password });

// ✅ Validate to strings first
function assertString(value: unknown, name: string): string {
  if (typeof value !== "string" || value.length === 0) throw new Error(`${name} must be a non-empty string`);
  return value;
}
const email = assertString(req.body.email, "email");
const password = assertString(req.body.password, "password");
await db.collection("users").findOne({ email, password });
```

### Command injection — never use shell expansion with user input

```ts
// ❌ Shell expansion — user controls the shell
import { exec } from "node:child_process";
exec(`convert ${userFilename} output.png`); // userFilename = "a.jpg; rm -rf /"

// ✅ execFile with argument array — no shell, no expansion
import { execFile } from "node:child_process";
await execFile("convert", [userFilename, "output.png"]);
```

### Path traversal — resolve and verify

```ts
import path from "node:path";

const ALLOWED_ROOT = "/var/app/uploads";

function safeResolvePath(userInput: string): string {
  const resolved = path.resolve(ALLOWED_ROOT, userInput);
  if (!resolved.startsWith(ALLOWED_ROOT + path.sep) && resolved !== ALLOWED_ROOT) {
    throw new Error("Path traversal detected");
  }
  return resolved;
}

// ❌ Direct join — "../../../etc/passwd" escapes the root
const filePath = path.join(ALLOWED_ROOT, req.params.filename);

// ✅ Resolve + prefix check
const filePath = safeResolvePath(req.params.filename);
```

### SSRF — validate URLs before fetching

_Applies to: API, worker_

Validate URL scheme, block private/link-local CIDRs (RFC 1918 + loopback), and never follow redirects to internal hosts.

```ts
// ✅ Validate before fetch
function isSafeUrl(urlString: string): boolean {
  const url = new URL(urlString); // throws if invalid
  if (url.protocol !== "https:") throw new Error("Only HTTPS allowed");

  const hostname = url.hostname;
  // Block private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8
  const isPrivate = /^(10\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[01]\.|192\.168\.|127\.|169\.254\.)/.test(hostname);
  if (isPrivate) throw new Error("Private IP addresses not allowed");

  return true;
}

const url = req.query.url as string;
if (isSafeUrl(url)) {
  const response = await fetch(url, { redirect: "error" }); // error on redirects
}
```

### ReDoS — avoid catastrophic backtracking

_Applies to: all_

Don't run user-controlled input against regexes with catastrophic backtracking. Bound input length; prefer `re2` for untrusted patterns.

```ts
// ❌ Regex with nested quantifiers — can hang on adversarial input
const pattern = /(a+)+$/;
const result = pattern.test(userInput); // hangs if userInput is "aaaaaaaaa..."

// ✅ Bound input length; use simple patterns for untrusted input
const MAX_LENGTH = 100;
if (userInput.length > MAX_LENGTH) throw new Error("Input too long");
const pattern = /^[a-z]+$/; // simple, no backtracking
```

### Prototype pollution

_Applies to: all_

Reject `__proto__`, `constructor`, `prototype` as JSON/object keys. Use `Object.create(null)` or `Map` for dynamic key storage.

```ts
// ❌ Object accepts any key — prototype pollution risk
const obj = {};
Object.assign(obj, userInput); // userInput = { "__proto__": { admin: true } }

// ✅ Reject dangerous keys
function isSafeKey(key: string): boolean {
  return !["__proto__", "constructor", "prototype"].includes(key);
}

const obj = Object.create(null);
for (const [k, v] of Object.entries(userInput)) {
  if (!isSafeKey(k)) throw new Error("Invalid key");
  obj[k] = v;
}
```

---

## Authentication & Authorization

### Never roll your own crypto

Use the platform's built-in cryptographic APIs (`globalThis.crypto.subtle`, `node:crypto`) for well-defined primitives.

| Concern           | Approach                                           | Notes                                  |
| ----------------- | -------------------------------------------------- | -------------------------------------- |
| Password hashing  | argon2 (preferred), bcrypt                         | argon2id is the current recommendation |
| JWT sign/verify   | `crypto.subtle.sign` / a JOSE library              | Always verify signature and `exp`      |
| Random tokens     | `crypto.getRandomValues()` / `crypto.randomUUID()` | Never `Math.random()`                  |
| Symmetric encrypt | `crypto.subtle` AES-GCM                            | Or a well-audited wrapper              |
| Key derivation    | `crypto.subtle.deriveBits` (PBKDF2 / HKDF)         | For deriving keys from passwords       |

### Password hashing

Use argon2 or bcrypt via their npm packages — do not implement your own. Minimum recommended: argon2id with `memoryCost=65536`, `timeCost=3`, `parallelism=4`.

```ts
// Hash on registration — using argon2 (npm: argon2)
const hash = await argon2.hash(plainPassword, {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
});

// Verify on login
const isValid = await argon2.verify(storedHash, plainPassword);
if (!isValid) throw new UnauthorizedError("Invalid credentials");
```

For edge runtimes without native addon support, PBKDF2 via Web Crypto is an acceptable fallback (310,000+ iterations):

```ts
async function verifyPasswordPbkdf2(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
  const salt = Buffer.from(storedSalt, "hex");
  const keyMaterial = await globalThis.crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await globalThis.crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations: 310_000 },
    keyMaterial,
    256,
  );
  const candidate = Buffer.from(bits).toString("hex");
  // Timing-safe comparison — reduces timing leakage (pad buffers for strict safety)
  return timingSafeEqual(Buffer.from(candidate), Buffer.from(storedHash));
}

import { timingSafeEqual } from "node:crypto";
```

### JWT — verify signature and expiry

Use a JOSE library (jose, jsonwebtoken) rather than implementing JWT verification yourself. Always verify the signature and the `exp` claim — never call `decode()` alone.

```ts
// ❌ Decode without verification — trusts payload blindly
const payload = someJwtLibrary.decode(token); // does NOT verify

// ✅ Always verify using jose
async function verifyToken(token: string): Promise<JwtPayload> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(token, secret, {
    algorithms: ["HS256"],
    clockTolerance: 0,
  });
  return payload as JwtPayload;
}
```

**Refresh tokens:** store server-side with a revocation flag. Stolen JWTs cannot be revoked — keep access tokens short-lived (15 minutes).

### Explicit authorization at every handler

Do not rely on middleware that might be skipped. Check authorization explicitly in each handler.

```ts
// ❌ Implicit — assumes middleware ran upstream
app.delete("/posts/:id", async (req, res) => {
  await deletePost(req.params.id); // who authorized this?
});

// ✅ Explicit — check in the handler
app.delete("/posts/:id", requireAuth, async (req: AuthenticatedRequest, res) => {
  const post = await getPost(req.params.id);
  if (post.authorId !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  await deletePost(post.id);
  res.status(204).end();
});
```

### Principle of least privilege

Issue tokens with the minimum required scopes. Never grant broad permissions as a convenience.

```ts
// ❌ Broad scope — read-only client gets write access
const token = issueToken(userId, ["read", "write", "admin"]);

// ✅ Minimal scope — only what this client needs
const token = issueToken(userId, ["reports:read"]);
```

### Timing-safe comparisons

_Applies to: all_

Use `crypto.timingSafeEqual` for ALL secret/token comparisons — API keys, HMAC signatures, CSRF tokens, not just passwords.

```ts
import { timingSafeEqual } from "node:crypto";

// ✅ Use timingSafeEqual for all token/secret comparisons
const isValid = timingSafeEqual(Buffer.from(userToken), Buffer.from(storedToken));
```

---

## Secrets Management

### Never commit secrets

`.env` files belong in `.gitignore`. Use environment variables in production. Use a secrets manager (AWS Secrets Manager, Vault, Doppler) for anything sensitive.

```bash
# .gitignore
.env
.env.local
.env.*.local
```

### Validate required secrets at startup

Fail fast at boot, not at runtime.

```ts
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

const config = {
  jwtSecret: requireEnv("JWT_SECRET"),
  databaseUrl: requireEnv("DATABASE_URL"),
};
```

### Never log secrets

Redact sensitive fields before passing to the logger. Use a logging library like `pino` with redaction paths configured.

```ts
// ❌ Secret in log output
console.log("Connecting with key:", apiKey);

// ✅ Redact before logging
logger.info({ dbHost: config.dbHost, region: config.region });

// ✅ pino redaction paths (production approach)
import pino from "pino";
const logger = pino({
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "password", "apiKey", "token"],
  },
});
```

### Treat secrets as ephemeral

Rotate credentials on a schedule and immediately after any suspected exposure. Never include secrets in error messages returned to clients.

---

## HTTP Security Headers

_Applies to: API, frontend_

Set security headers explicitly on every response.

```ts
function applySecurityHeaders(res: { setHeader(name: string, value: string): void }): void {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'", // TODO: replace with nonces or hashes
      "img-src 'self' data: https:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  );
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
}
```

### Header reference

| Header                      | Purpose                           | Value                                 |
| --------------------------- | --------------------------------- | ------------------------------------- |
| `Content-Security-Policy`   | Restrict script/style/img sources | Strict allowlist; no `'unsafe-eval'`  |
| `Strict-Transport-Security` | Force HTTPS                       | `max-age=31536000; includeSubDomains` |
| `X-Content-Type-Options`    | Prevent MIME sniffing             | `nosniff`                             |
| `X-Frame-Options`           | Prevent clickjacking              | `DENY`                                |
| `Referrer-Policy`           | Control referrer leakage          | `strict-origin-when-cross-origin`     |
| `Permissions-Policy`        | Disable unused features           | `camera=(), microphone=()`            |

### CORS — explicit allowlist only

```ts
const ALLOWED_ORIGINS = new Set(["https://app.example.com", "https://admin.example.com"]);

function handleCors(req: Request, res: Response): boolean {
  const origin = req.headers.get("origin") ?? "";

  // ❌ Wildcard with credentials — never
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Credentials", "true");

  // ✅ Explicit allowlist
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Vary", "Origin");
    return true;
  }
  return false;
}
```

### CSRF protection

SameSite=Strict cookies resist CSRF for most cases. For APIs that need cross-site POST, use the double-submit cookie pattern.

```ts
// ✅ Strict cookies — resistant to CSRF
res.cookie("session", token, {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
  path: "/",
});
```

### Open redirect

_Applies to: API, frontend_

Validate redirect targets against an allowlist of known-safe hosts. Never pass `req.query.next` directly to `res.redirect()`.

```ts
// ❌ User controls redirect
res.redirect(req.query.next);

// ✅ Allowlist of safe targets
const SAFE_REDIRECTS = new Set(["/", "/dashboard", "/login"]);
const target = SAFE_REDIRECTS.has(req.query.next) ? req.query.next : "/";
res.redirect(target);
```

---

## Request & Response Security

### Content-Type validation

_Applies to: API_

Reject unexpected types before parsing.

```ts
function assertContentType(req: Request, expected: string): void {
  const ct = req.headers.get("content-type") ?? "";
  const mediaType = ct.split(";")[0].trim().toLowerCase();
  if (mediaType !== expected) {
    throw new Error(`Expected Content-Type: ${expected}, got: ${mediaType}`);
  }
}

app.post("/api/users", (req, res) => {
  assertContentType(req, "application/json");
  // Safe to parse JSON now
});
```

### Trusted proxy IP extraction

_Applies to: API_

Only read `X-Forwarded-For` and `X-Real-IP` when the request came from a trusted proxy. Key on BOTH email AND IP for account lockout (email-only lockout allows victim enumeration).

```ts
const TRUSTED_PROXY_CIDRS = ["10.0.0.0/8", "172.16.0.0/12", "192.168.0.0/16"];

function getClientIp(req: IncomingMessage): string {
  const remoteIp = req.socket.remoteAddress ?? "";

  // ❌ Blind trust — client can spoof any IP
  // return req.headers["x-forwarded-for"] as string;

  // ✅ Only read forwarded headers from trusted proxies
  // For production, use a library like ip-range-check or ipaddr.js
  const isTrusted = TRUSTED_PROXY_CIDRS.some(cidr => /* check if remoteIp in cidr */);
  if (isTrusted) {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  }

  return remoteIp;
}

// Account lockout — key on BOTH email and IP
async function checkLoginAttempts(email: string, ip: string): Promise<void> {
  const key = `login_attempts:${email}:${ip}`;
  const attempts = await redis.incr(key);
  if (attempts === 1) await redis.expire(key, 15 * 60); // 15 minutes
  if (attempts > 5) throw new Error("Too many attempts");
}
```

### Body size limits

_Applies to: API_

Enforce size limits before parsing.

```ts
const MAX_BODY_BYTES = 100 * 1024; // 100 KiB

async function readBody(req: IncomingMessage, maxBytes = MAX_BODY_BYTES): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;

    req.on("data", (chunk: Buffer) => {
      total += chunk.byteLength;
      if (total > maxBytes) {
        req.destroy();
        reject(new Error("Payload too large"));
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
```

### Response sanitization

_Applies to: API_

Strip internal fields before sending to clients.

```ts
const INTERNAL_FIELDS = new Set(["password", "passwordHash", "secret", "token", "apiKey"]);

function sanitize<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => !INTERNAL_FIELDS.has(key))) as Partial<T>;
}

// ❌ Leaks internal fields
res.json(userRow); // { id, email, passwordHash, createdAt }

// ✅ Strip sensitive fields
res.json(sanitize(userRow)); // { id, email, createdAt }
```

### Set Content-Type explicitly

_Applies to: API_

Never let the framework guess.

```ts
// ✅ Explicit on every response
res.setHeader("Content-Type", "application/json; charset=utf-8");
res.end(JSON.stringify(data));
```

---

## Frontend Security

_Applies to: frontend_

### Token storage

Don't store tokens in `localStorage` — use `httpOnly; Secure; SameSite=Strict` cookies.

```ts
// ❌ Vulnerable to XSS
localStorage.setItem("token", token);

// ✅ Browser protects httpOnly cookies from JavaScript
// Set on server: res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" })
```

### postMessage origin checks

Always validate `event.origin` against an allowlist.

```ts
const TRUSTED_ORIGINS = new Set(["https://app.example.com"]);

window.addEventListener("message", (event) => {
  if (!TRUSTED_ORIGINS.has(event.origin)) {
    console.warn("Untrusted origin:", event.origin);
    return;
  }
  // Safe to process event.data
});
```

### target="\_blank" links

Always add `rel="noopener noreferrer"`.

```html
<!-- ❌ Opener can change window.location -->
<a href="https://external.com" target="_blank">Visit</a>

<!-- ✅ Protect opener window -->
<a href="https://external.com" target="_blank" rel="noopener noreferrer">Visit</a>
```

### Sanitize HTML content

Treat `dangerouslySetInnerHTML` / `v-html` as `innerHTML`. Sanitize first.

```ts
// ❌ XSS if userHtml is untrusted
element.innerHTML = userHtml;

// ✅ Sanitize with DOMPurify
element.innerHTML = DOMPurify.sanitize(userHtml, { ALLOWED_TAGS: ["b", "i", "em"] });
```

---

## CLI Security

_Applies to: CLI_

### Validate all args and env vars

Treat them as untrusted input.

```ts
const schema = z.object({
  filename: z.string().min(1),
  format: z.enum(["json", "csv"]),
});

const args = schema.parse({ filename: process.argv[2], format: process.env.FORMAT });
```

### Never echo secrets to stdout

Use env vars or stdin prompts; never pass secrets as command-line arguments.

```ts
// ❌ Secret visible in process list
exec("deploy --api-key=$API_KEY");

// ✅ Use env var
process.env.API_KEY = secret;
exec("deploy"); // reads from env
```

### Restrict file permissions on sensitive output

Set mode `0o600` for files containing secrets.

```ts
import fs from "node:fs";

fs.writeFileSync(secretFile, content, { mode: 0o600 });
```

---

## Background Workers & Queues

_Applies to: worker_

### Validate every message at the consumer boundary

Apply the same rules as HTTP bodies — schema validation, type checking, size limits.

```ts
const messageSchema = z.object({
  userId: z.string(),
  action: z.enum(["send_email", "generate_report"]),
});

consumer.on("message", (message) => {
  try {
    const payload = messageSchema.parse(JSON.parse(message.body));
    handleMessage(payload);
  } catch (err) {
    deadLetterQueue.push(message); // handle poison messages
  }
});
```

### Handle poison messages — dead-letter after N retries

Never infinite-loop on malformed input.

```ts
const MAX_RETRIES = 3;

function handleMessage(message: Message, retryCount = 0) {
  try {
    processMessage(message);
  } catch (err) {
    if (retryCount < MAX_RETRIES) {
      queue.redeliver(message, retryCount + 1);
    } else {
      deadLetterQueue.push(message); // give up; log for investigation
    }
  }
}
```

### Avoid unsafe deserialization

Use JSON with schema validation; never `eval`-based deserializers.

```ts
// ❌ Unsafe
const data = eval(message.body); // arbitrary code execution

// ✅ Safe
const data = z
  .object({
    /* ... */
  })
  .parse(JSON.parse(message.body));
```

---

## Error Handling

_Applies to: API_

### Never expose internals to clients

Return generic messages; log detailed errors server-side with a correlation ID.

```ts
// ❌ Leaks internals
res.status(500).json({ error: err.message, stack: err.stack });

// ✅ Generic to client, detailed internal log
app.use((err: unknown, req: Request, res: Response) => {
  const correlationId = crypto.randomUUID();
  logger.error({ correlationId, err, path: req.path, method: req.method });
  res.status(500).json({
    error: "An unexpected error occurred",
    correlationId, // client can report this for support
  });
});
```

---

## File Upload Handling

_Applies to: API_

### Verify by magic bytes, not extension

Enforce size caps, store outside webroot, randomize filenames, and limit decompression depth.

```ts
// Verify magic bytes (e.g., PNG: 89 50 4E 47)
function isPng(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
}

// ✅ Safe upload
app.post("/upload", (req, res) => {
  const file = req.file;
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MiB

  if (file.size > MAX_SIZE) throw new Error("File too large");
  if (!isPng(file.buffer)) throw new Error("Invalid file type");

  // Randomize filename; store outside webroot
  const filename = crypto.randomUUID() + ".png";
  fs.writeFileSync(`/var/uploads/${filename}`, file.buffer); // never /public/

  res.json({ url: `/files/${filename}` }); // serve with Content-Disposition: attachment
});
```

---

## WebSocket Security

_Applies to: API_

### Check Origin header on upgrade

Authenticate per-connection. Cap message size and rate-limit.

```ts
const ALLOWED_ORIGINS = new Set(["https://app.example.com"]);

server.on("upgrade", (req, socket, head) => {
  const origin = req.headers.origin ?? "";
  if (!ALLOWED_ORIGINS.has(origin)) {
    socket.destroy();
    return;
  }

  // Authenticate the user (don't rely on session alone)
  const token = extractToken(req);
  const user = verifyToken(token);

  ws.on("message", (data) => {
    if (data.length > 10 * 1024) {
      // cap message size
      ws.close();
      return;
    }
    // ... rate-limit here too
  });
});
```

---

## Rate Limiting & Abuse Prevention

_Applies to: API_

Apply rate limiting at auth endpoints and any expensive operation.

```ts
const MAX_ATTEMPTS = 10;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

async function checkRateLimit(store: RateLimitStore, key: string): Promise<void> {
  const count = await store.increment(key);
  if (count === 1) await store.expire(key, WINDOW_MS / 1000);
  if (count > MAX_ATTEMPTS) throw new Error("Too many attempts");
}

app.post("/auth/login", async (req, res) => {
  const ip = getClientIp(req);
  const email = req.body.email;

  // Rate limit by IP and email
  await checkRateLimit(store, `login:${ip}`);
  await checkRateLimit(store, `login:${email}`);

  // ... handle login
});
```

| Algorithm      | Properties                | Use case                   |
| -------------- | ------------------------- | -------------------------- |
| Fixed window   | Simple; burst at boundary | Internal APIs, low-stakes  |
| Sliding window | Smooth; no burst          | Public APIs                |
| Token bucket   | Allows controlled bursts  | Legitimate burst endpoints |
| Leaky bucket   | Strict constant rate      | Strict throughput          |

---

## Security Event Logging

_Applies to: all_

Log auth failures, authorization denials, rate-limit hits, and suspicious patterns. Never log the credential itself.

```ts
// ✅ Structured security events
logger.warn({
  event: "auth_failure",
  timestamp: new Date(),
  ip: getClientIp(req),
  userId: userId || null,
  correlationId: crypto.randomUUID(),
});

// ❌ Never log the token
logger.info({ token }); // WRONG

// ✅ Log only safe identifiers
logger.info({ tokenHash: crypto.createHash("sha256").update(token).digest("hex") });
```

---

## Dependency Security

### Audit regularly

```bash
# Check for known vulnerabilities
pnpm audit

# Review what changed before upgrading
pnpm outdated
```

### Decision matrix for dependency updates

| Severity | Action                                         |
| -------- | ---------------------------------------------- |
| Critical | Patch within 24h; block deploys if exploitable |
| High     | Patch within the sprint; assess first          |
| Moderate | Schedule for next release                      |
| Low      | Batch with routine maintenance                 |

### Best practices

- **Pin major versions** in `package.json` — avoid `*` or overly broad ranges
- **Lock files are mandatory** — commit `pnpm-lock.yaml` / `package-lock.json`; regenerating from scratch is a security event
- **Review changelogs** before upgrading — check for breaking changes
- **Avoid packages with unpatched CVEs** — check [snyk.io](https://snyk.io) or npm advisories
- **Minimize the dependency surface** — every dependency is attack surface; prefer native APIs where adequate

```ts
// ❌ Pulling in a library for one utility
import _ from "lodash";
const id = _.uniqueId();

// ✅ Native alternative — no dependency needed
const id = globalThis.crypto.randomUUID();
```

---

_These guidelines are a living reference. Apply them at the boundary, enforce them in code review._
