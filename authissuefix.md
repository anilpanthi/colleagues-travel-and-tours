# Payload CMS Production Authentication Fixes

This document summarizes the steps and technical rationale used to resolve the production authentication issues (logout failure and data entry blocks) on `https://demo.colleaguestravel.com.np`.

## 1. Issues Identified
- **Logout Loop**: Clicking logout redirected to the login page but immediately back to the admin dashboard.
- **Data Entry Block**: Users could view data but could not create, update, or delete records.
- **Root Cause**: These were classic **CSRF (Cross-Site Request Forgery)** mismatch symptoms. The browser's origin did not match the whitelisted origins in the Payload configuration, causing all "mutations" (POST/PATCH/DELETE) to fail.

## 2. Technical Fixes

### Step 1: Robust Origin Whitelisting (CSRF/CORS)
We updated `src/payload.config.ts` to ensure the server explicitly trusts the production domain.
- **Action**: Added `csrf` and `cors` arrays to the `buildConfig`.
- **Sanitization**: Implemented an automatic cleanup for `NEXT_PUBLIC_SERVER_URL` to remove any trailing slashes. Browsers send the `Origin` header without a trailing slash; if your environment variable included one, CSRF would fail.

```typescript
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const sanitizedServerURL = serverURL.replace(/\/$/, '')

export default buildConfig({
  serverURL: sanitizedServerURL,
  cors: [sanitizedServerURL],
  csrf: [sanitizedServerURL],
  // ...
})
```

### Step 2: Proxy Trust & Cookie Security
Since the site runs behind a reverse proxy (Nginx or Load Balancer), Payload needed to be certain it was operating over HTTPS.
- **Action**: Configured explicit cookie attributes in the `Users` collection (`src/collections/Users.ts`).
- **Rationale**: Setting `secure: true` and `sameSite: 'Lax'` in production ensures the browser correctly handles the session cookie and respects the deletion instruction during logout.

```typescript
// src/collections/Users.ts
auth: {
  cookies: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  },
},
```

### Step 3: Browser Cache Reset
- **Action**: Cleared "Site Data/Cookies" in the browser.
- **Rationale**: When cookie attributes (like `Secure` or `SameSite`) change, existing cookies in the browser can become "orphaned" or inconsistent. A one-time manual clear is required to start a fresh session with the new attributes.

## 3. Key Takeaways for Future Deployment
- Always ensure `NEXT_PUBLIC_SERVER_URL` matches your actual browser URL exactly.
- Avoid trailing slashes in environment variables for URLs.
- In Payload 3.0, proxy trust is handled at the infrastructure level, but cookie attributes should be explicitly managed for reliable production behavior.
