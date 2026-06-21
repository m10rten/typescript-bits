---
name: http-rest-guidelines
description: Guidelines for designing and implementing HTTP REST APIs — resource naming, HTTP semantics, status codes, error responses, pagination, and versioning
---

# REST Guidelines

Practical rules for designing and implementing REST APIs. These are protocol-level conventions — they apply regardless of framework, language, or runtime.

## Resource Design

Model resources as nouns, not verbs. The URL identifies the resource; the HTTP method expresses the action.

```
✅ GET    /orders       — list orders
✅ POST   /orders       — create an order
✅ GET    /orders/42    — get order 42
✅ PUT    /orders/42    — replace order 42
✅ PATCH  /orders/42    — partial-update order 42
✅ DELETE /orders/42    — delete order 42

❌ GET  /getOrders
❌ POST /createOrder
❌ GET  /orders/delete/42
```

### URL Rules

- Use **plural nouns** for collections: `/users`, `/orders`, `/products`
- Use **kebab-case**: `/order-items`, not `/orderItems` or `/order_items`
- Nest to express **ownership or scope**, not arbitrary hierarchy:
  ```
  ✅ /users/42/addresses           — addresses owned by user 42
  ❌ /users/42/orders/7/items/2/tags  — too deep; flatten beyond two levels
  ```
- Maximum nesting depth: **two levels**. Flatten deeper relationships via query params or dedicated top-level resources.
- IDs belong in the path, not the query string: `/orders/42`, not `/orders?id=42`

### Actions That Don't Map to CRUD

Use a sub-resource noun or a command endpoint for actions with no clear CRUD fit:

```
POST /orders/42/cancellation   — cancel order 42
POST /sessions                  — log in (create a session)
POST /password-resets           — initiate a password reset
```

Never use verbs in the path for standard CRUD. Reserve POST sub-resources for state transitions or commands.

## HTTP Methods

| Method  | Safe | Idempotent | Typical use              |
| ------- | ---- | ---------- | ------------------------ |
| GET     | ✅   | ✅         | Read a resource          |
| HEAD    | ✅   | ✅         | Read headers only        |
| OPTIONS | ✅   | ✅         | Discover allowed methods |
| POST    | ❌   | ❌         | Create / trigger action  |
| PUT     | ❌   | ✅         | Replace full resource    |
| PATCH   | ❌   | ❌         | Partial update           |
| DELETE  | ❌   | ✅         | Delete a resource        |

- **Safe**: no observable side effects. GET must never mutate state.
- **Idempotent**: calling N times produces the same result as calling once. Clients may safely retry idempotent methods on network failure.
- Use **PUT** only when the client sends the complete replacement document.
- Use **PATCH** for partial updates — never send the full document for a partial change.
- Use **DELETE** for hard deletes. For soft deletes (archive), use PATCH or a sub-resource.

## Status Codes

Return the most specific code that accurately describes the outcome.

### 2xx — Success

| Code | Name       | When to use                                      |
| ---- | ---------- | ------------------------------------------------ |
| 200  | OK         | Successful GET, PATCH, DELETE with response body |
| 201  | Created    | Successful POST that created a resource          |
| 202  | Accepted   | Request accepted; processing is async            |
| 204  | No Content | Successful DELETE or PUT/PATCH with no body      |

- Always include `Location: /resources/{id}` in `201` responses.
- Use `202` with a polling URL when processing may take time.

### 4xx — Client Errors

| Code | Name               | When to use                                       |
| ---- | ------------------ | ------------------------------------------------- |
| 400  | Bad Request        | Malformed syntax, invalid body                    |
| 401  | Unauthorized       | Missing or invalid credentials                    |
| 403  | Forbidden          | Authenticated but not authorized                  |
| 404  | Not Found          | Resource does not exist (or must not be revealed) |
| 405  | Method Not Allowed | Verb not supported on this endpoint               |
| 409  | Conflict           | State conflict (duplicate, stale update)          |
| 410  | Gone               | Resource permanently deleted                      |
| 422  | Unprocessable      | Syntactically valid but semantically invalid      |
| 429  | Too Many Requests  | Rate limit hit — include `Retry-After` header     |

### 5xx — Server Errors

| Code | Name                  | When to use                                      |
| ---- | --------------------- | ------------------------------------------------ |
| 500  | Internal Server Error | Unexpected failure — log details, never expose   |
| 502  | Bad Gateway           | Upstream service is down                         |
| 503  | Service Unavailable   | Circuit open, overloaded — include `Retry-After` |

## Request Design

- Set `Content-Type: application/json` on all requests with a body.
- Accept `application/json` by default. Support content negotiation via `Accept` header when multiple formats are needed.
- Validate inputs at the API boundary — reject early with `400` or `422`.
- Never silently ignore unknown fields. Either reject them (`400`) or strip them — document which behavior applies.

### Query Parameters

Use query parameters for filtering, sorting, pagination, and projection — never for identity:

```
GET /products?category=shoes&sort=price:asc&fields=id,name,price
GET /orders?status=pending&created_after=2024-01-01
```

- Use `snake_case` for query parameter names.
- Boolean flags as strings: `?include_archived=true`, not `?include_archived=1`.

## Response Design

Every endpoint returns a consistent shape. Consumers should never need to special-case the structure per endpoint.

```json
// Single resource
{ "data": { ... } }

// Collection
{ "data": [ ... ], "pagination": { ... } }
```

Rules:

- Never return a naked array at the top level — wrap in `data`. This allows adding `pagination`, `meta`, or `links` later without breaking callers.
- `null` is acceptable for optional fields on a resource, but never return `null` where a collection is expected — return `[]`.
- Use `camelCase` for all JSON field names.
- Dates as ISO 8601 strings: `"2024-03-15T14:30:00Z"`. Never use Unix timestamps in REST responses.
- IDs as strings, not numbers — JavaScript loses precision on integers > 2^53.

## Error Responses

Follow [RFC 9457 (Problem Details)](https://www.rfc-editor.org/rfc/rfc9457) for error responses. Use `Content-Type: application/problem+json`.

```json
{
  "type": "https://api.example.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "The request body contains invalid fields.",
  "instance": "/orders",
  "errors": [
    { "field": "email", "message": "Must be a valid email address" },
    { "field": "quantity", "message": "Must be greater than 0" }
  ]
}
```

- `type`: a URI identifying the error class — stable and documentable.
- `title`: human-readable summary, stable per `type`.
- `status`: mirrors the HTTP status code.
- `detail`: instance-specific explanation for this request.
- `instance`: the request path that triggered the error.
- `errors`: optional — include for field-level validation details.

Never expose stack traces, internal IDs, or database error messages in API responses.

## Pagination

Default to **cursor-based pagination** for large or real-time datasets. Offset pagination is acceptable for small, stable datasets.

### Cursor Pagination

```json
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6MTAwfQ==",
    "prevCursor": "eyJpZCI6ODF9",
    "hasNext": true,
    "hasPrev": true
  }
}
```

```
GET /orders?cursor=eyJpZCI6MTAwfQ==&limit=25
```

- Cursors are opaque strings — clients must not parse or construct them.
- Always include `hasNext`/`hasPrev` to avoid an extra round-trip.
- Document the default and maximum `limit` values.

### Offset Pagination

```json
{
  "data": [...],
  "pagination": {
    "total": 340,
    "limit": 25,
    "offset": 50
  }
}
```

- Suitable for paginated admin UIs where jumping to a specific page is needed.
- Not suited for real-time data — items shift between pages as the dataset changes.

## Versioning

Version the API whenever a breaking change is required.

### URL Versioning (recommended)

```
/v1/orders
/v2/orders
```

Simple, visible, and cache-friendly. Clients migrate at their own pace while versions run in parallel.

### Header Versioning (alternative)

```
Accept: application/vnd.example.v2+json
API-Version: 2024-03-01
```

Cleaner URLs but harder to test in a browser or via `curl`.

### Rules

- Breaking changes always require a new version: removing fields, changing types, altering semantics.
- Additive changes (new optional fields, new endpoints) are non-breaking — no version bump required.
- Deprecate old versions explicitly via response headers:
  ```
  Deprecation: true
  Sunset: Sat, 01 Jun 2025 00:00:00 GMT
  Link: <https://api.example.com/v2/orders>; rel="successor-version"
  ```
- Support deprecated versions for at least one full migration cycle before removal.

## Authentication

- Use **Bearer tokens** via `Authorization: Bearer <token>` — never pass credentials in query strings.
- Use HTTPS everywhere. Never accept credentials over plain HTTP.
- Return `401` when credentials are missing or invalid.
- Return `403` when credentials are valid but the action is not permitted.
- Never distinguish between "user does not exist" and "wrong password" in error messages — both are `401`.

## Common Mistakes

| Mistake                                            | Fix                                                               |
| -------------------------------------------------- | ----------------------------------------------------------------- |
| Verbs in URLs (`/getUser`, `/createOrder`)         | Use nouns + HTTP method to express intent                         |
| Returning `200` for failed operations              | Return the correct 4xx or 5xx code                                |
| Returning naked arrays at the top level            | Wrap in `{ "data": [] }` to allow future envelope additions       |
| Using POST for all mutations                       | Use PUT, PATCH, DELETE per their defined semantics                |
| Leaking internal errors in 500 responses           | Log internally; return a generic message to the client            |
| Deep URL nesting beyond two levels                 | Flatten to max two levels; use query params for further filtering |
| Inconsistent field naming (camelCase / snake_case) | `camelCase` in JSON bodies; `snake_case` in query parameters      |
| Integer IDs in JSON                                | Use string IDs to avoid JavaScript precision loss                 |
| Unix timestamps                                    | Use ISO 8601 — human-readable and timezone-explicit               |
| No `Location` header on 201 responses              | Always point to the newly created resource                        |
| Cursor pagination without `hasNext`/`hasPrev`      | Include them to save a round-trip                                 |
| Silently removing fields in a non-breaking release | Deprecate first; remove only in a new major version               |
