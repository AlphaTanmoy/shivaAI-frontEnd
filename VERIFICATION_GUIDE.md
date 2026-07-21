# Verification & Testing Guide

## ✅ Verify Installation

### Step 1: Check All Files Created
Run in your terminal:
```bash
cd d:\shivaAi\frontend

# Check key files exist
ls app/lib/device-utils.ts
ls app/lib/storage-utils.ts
ls app/lib/uuid-utils.ts
ls app/hooks/useDeviceTracking.ts
ls app/components/DeviceTrackingProvider.tsx
ls app/api/check-uuid/route.ts
```

All should exist without errors.

### Step 2: Start Development Server
```bash
npm run dev
```

Should show:
```
> frontend@0.1.0 dev
> next dev

  ▲ Next.js 16.2.7
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 500ms
```

### Step 3: Open App in Browser
Go to: http://localhost:3000

Look at the browser console (F12):
- Should see: `Device Tracking Initialized: { uuid: '...', ip: '...' }`
- Or: `Device Tracking Error: ...` (if IP detection service is blocked)

---

## 🧪 Test the System

### Test 1: Check localStorage

#### In Browser Console (F12):
```javascript
// View session data
const session = JSON.parse(localStorage.getItem('shiva_session_data'));
console.log(session);
```

Should show:
```javascript
{
  uuid: "550e8400-e29b-41d4-a716-446655440000",
  ip: "203.0.113.42",
  deviceInfo: {
    userAgent: "Mozilla/5.0...",
    platform: "Win32",
    language: "en-US",
    screenResolution: "1920x1080",
    timezone: "America/New_York",
    deviceFingerprint: "a1b2c3d4"
  },
  createdAt: "2024-01-01T10:00:00.000Z",
  lastUpdatedAt: "2024-01-01T10:00:00.000Z"
}
```

### Test 2: Create New UUID

#### In Browser Console:
```javascript
// Clear session
localStorage.removeItem('shiva_session_data');

// Check it's gone
console.log(localStorage.getItem('shiva_session_data')); // Should be null

// Refresh page
location.reload();
```

After refresh:
- New UUID should be generated
- `createdAt` will be new timestamp
- Console should show: `Device Tracking Initialized`

### Test 3: UUID Persistence

#### In Browser Console:
```javascript
// Store current UUID
const session1 = JSON.parse(localStorage.getItem('shiva_session_data'));
const uuid1 = session1.uuid;

// Refresh page
location.reload();

// Check if UUID is same
const session2 = JSON.parse(localStorage.getItem('shiva_session_data'));
const uuid2 = session2.uuid;

console.log("Same UUID?", uuid1 === uuid2); // Should be true
console.log("Previous:", uuid1);
console.log("Current:", uuid2);
```

Should show: `true` (UUID stays the same on refresh)

### Test 4: Test API Endpoint

#### Using cURL:
```bash
curl -X POST http://localhost:3000/api/check-uuid \
  -H "Content-Type: application/json" \
  -d '{
    "currentIP": "203.0.113.42",
    "deviceInfo": {
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "platform": "Win32",
      "language": "en-US",
      "screenResolution": "1920x1080",
      "timezone": "America/New_York",
      "deviceFingerprint": "a1b2c3d4"
    }
  }'
```

Should respond with:
```json
{
  "needsNewUUID": true,
  "message": "No existing session found. Creating new UUID.",
  "reason": "first_visit"
}
```

#### Or in Browser Console:
```javascript
fetch('/api/check-uuid', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    currentIP: "203.0.113.42",
    deviceInfo: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      deviceFingerprint: "test123"
    }
  })
})
.then(r => r.json())
.then(data => console.log(data));
```

### Test 5: Using the Hook

Create a test component:

```typescript
// app/components/TestTracking.tsx
"use client";

import { useDeviceTracking } from "@/app/hooks/useDeviceTracking";

export function TestTracking() {
  const { isInitialized, uuid, ip, error } = useDeviceTracking();

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      background: "#222",
      color: "#0f0",
      padding: "20px",
      fontFamily: "monospace",
      fontSize: "12px",
      maxWidth: "300px",
      zIndex: 9999
    }}>
      <h3>Tracking Status</h3>
      <p>Initialized: {String(isInitialized)}</p>
      <p>UUID: {uuid || "loading..."}</p>
      <p>IP: {ip || "loading..."}</p>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
}
```

Add to layout:
```typescript
import { TestTracking } from "./components/TestTracking";

export default function RootLayout(...) {
  return (
    <html lang="en">
      <body>
        <DeviceTrackingProvider>
          {/* ... */}
          <TestTracking /> {/* ← Add this */}
        </DeviceTrackingProvider>
      </body>
    </html>
  );
}
```

Should show a box with UUID, IP, and status in bottom-right corner.

### Test 6: Get Storage Data in Component

Create a test component:

```typescript
// app/components/SessionDisplay.tsx
"use client";

import { getStoredSessionData } from "@/app/lib/storage-utils";
import { useEffect, useState } from "react";

export function SessionDisplay() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const data = getStoredSessionData();
    setSession(data);
  }, []);

  if (!session) return <p>No session</p>;

  return (
    <div>
      <h2>Session Data</h2>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
```

---

## 🔍 Network Inspection

### Check IP Detection Calls

1. Open DevTools → Network tab
2. Reload page
3. Look for requests to:
   - `api.ipify.org`
   - `ifconfig.me`
   - Or `/api/check-uuid` (your local API)

If these show 404 or CORS errors, that's normal (might be blocked). The system has fallback logic.

### Check API Calls

1. Network tab → Filter: XHR/Fetch
2. Look for `check-uuid` POST request
3. Click on it
4. Check:
   - **Headers**: Should show POST with JSON content-type
   - **Request**: Should show device info
   - **Response**: Should show { needsNewUUID: boolean, ... }

---

## 🐛 Common Issues & Solutions

### Issue: UUID is "unknown"
**Cause**: IP detection services are blocked  
**Solution**: This is normal. The system still works, just won't have IP.  
**Check**: `console.log(session?.ip)` in browser console

### Issue: API returns 500 error
**Cause**: Error in route handler  
**Solution**:
1. Check Next.js console for error message
2. Verify route file exists: `app/api/check-uuid/route.ts`
3. Try restarting dev server: `npm run dev`

### Issue: localStorage not storing data
**Cause**: Browser privacy mode or disabled localStorage  
**Solution**:
1. Try in regular browsing mode (not private/incognito)
2. Check: `typeof localStorage !== 'undefined'` in console
3. Check if `localStorage.setItem('test', '1')` works

### Issue: Error "DeviceTrackingProvider is not defined"
**Cause**: Import issue in layout.tsx  
**Solution**:
1. Check import path: `import { DeviceTrackingProvider } from "./components/DeviceTrackingProvider";`
2. Verify file exists: `app/components/DeviceTrackingProvider.tsx`
3. Check for typos in component name

### Issue: Hook error "Can't use hook outside client component"
**Cause**: Using `useDeviceTracking()` in a server component  
**Solution**: Add `"use client";` at top of component

---

## ✨ Success Checklist

- [ ] All files created without errors
- [ ] Dev server starts: `npm run dev`
- [ ] Console shows "Device Tracking Initialized"
- [ ] localStorage has `shiva_session_data` key
- [ ] UUID is visible in localStorage
- [ ] UUID persists after page refresh
- [ ] IP is detected (or "unknown" on localhost)
- [ ] `/api/check-uuid` endpoint responds
- [ ] Can get session data in components
- [ ] Hook works in client components

---

## 📊 Test Scenarios

### Scenario 1: First Time Visit
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. ✅ Should create new UUID
4. ✅ `reason` should be "first_visit"

### Scenario 2: Same Device/IP
1. Refresh page
2. ✅ UUID should stay the same
3. ✅ `reason` should be "same_device"
4. ✅ `lastUpdatedAt` should be new

### Scenario 3: Different Device Simulation
```javascript
// Simulate device change in console
localStorage.removeItem('shiva_session_data');
location.reload();
```
✅ Should create new UUID

### Scenario 4: Concurrent Sessions
1. Open http://localhost:3000 in Tab A
2. Open http://localhost:3000 in Tab B
3. Check both tabs' console
4. ✅ Both should have same UUID (same device/IP)
5. ✅ Both should show "Tracking Initialized"

---

## 🎯 Performance Check

In browser console, measure init time:
```javascript
// Add to useDeviceTracking.ts
const startTime = performance.now();
// ... initialization code ...
const endTime = performance.now();
console.log(`Tracking initialized in ${endTime - startTime}ms`);
```

Should be < 1000ms (usually ~100-300ms)

---

## 📈 Data Validation

Check if stored data has all fields:
```javascript
const session = JSON.parse(localStorage.getItem('shiva_session_data'));

// Verify all fields exist
console.assert(session.uuid, "Missing uuid");
console.assert(session.ip, "Missing ip");
console.assert(session.deviceInfo, "Missing deviceInfo");
console.assert(session.createdAt, "Missing createdAt");
console.assert(session.lastUpdatedAt, "Missing lastUpdatedAt");

// Verify device info fields
console.assert(session.deviceInfo.userAgent, "Missing userAgent");
console.assert(session.deviceInfo.platform, "Missing platform");
console.assert(session.deviceInfo.deviceFingerprint, "Missing fingerprint");
```

All should pass without assertion errors.

---

## 🎓 Next Steps After Verification

1. ✅ Confirm system works
2. 📤 Integrate UUID/IP into your backend
3. 🔐 Validate UUID on server
4. 📊 Add analytics
5. 🛡️ Implement security checks

Congrats! Your device tracking system is ready! 🚀
