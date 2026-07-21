# Device Tracking System - Quick Start Guide

## ✅ Already Implemented

The device tracking system is **fully implemented and automatically running** in your app. No additional setup is needed!

Here's what's active:

### ✨ What Happens Automatically on App Load

1. **DeviceTrackingProvider** wraps your app in `layout.tsx`
2. **useDeviceTracking** hook initializes and:
   - Collects device information (browser, OS, screen resolution, timezone)
   - Detects your IP address
   - Checks localStorage for existing session
   - Calls `/api/check-uuid` to decide if new UUID is needed
   - Stores/updates data in localStorage
3. **localStorage stores**:
   - Unique UUID
   - Your IP address
   - Device fingerprint
   - Creation and update timestamps

---

## 🔍 Test It

### 1. Check Browser Console
Open DevTools (F12) and look for:
```
Device Tracking Initialized: { uuid: '...', ip: '...' }
```

### 2. View localStorage Data
In DevTools → Application → Storage → Local Storage → Your Domain
```
Key: shiva_session_data
Value: { uuid, ip, deviceInfo, createdAt, lastUpdatedAt }
```

### 3. Clear and Test
```javascript
// In browser console:
localStorage.removeItem('shiva_session_data');
location.reload();
```
A new UUID will be generated!

---

## 📊 Using Session Data in Your Components

### Get UUID and IP
```typescript
import { getStoredSessionData } from "@/app/lib/storage-utils";

export function MyComponent() {
  const session = getStoredSessionData();
  
  return (
    <div>
      <p>UUID: {session?.uuid}</p>
      <p>IP: {session?.ip}</p>
    </div>
  );
}
```

### Use the Hook (in Client Components)
```typescript
"use client";

import { useDeviceTracking } from "@/app/hooks/useDeviceTracking";

export function MyComponent() {
  const { uuid, ip, isInitialized, error } = useDeviceTracking();
  
  if (!isInitialized) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div>
      <p>Your Session UUID: {uuid}</p>
      <p>Your IP: {ip}</p>
    </div>
  );
}
```

---

## 📤 Send to Backend

### Example: Login with Device Tracking
```typescript
import axios from "axios";
import { getStoredSessionData } from "@/app/lib/storage-utils";

async function login(email: string, password: string) {
  const session = getStoredSessionData();

  const response = await axios.post(
    "http://localhost:8080/api/auth/login",
    {
      email,
      password,
      deviceUUID: session?.uuid,      // ← Send UUID
      ipAddress: session?.ip,          // ← Send IP
      deviceInfo: session?.deviceInfo,
    }
  );

  return response.data;
}
```

### Example: API Request with Headers
```typescript
const session = getStoredSessionData();

const response = await axios.get(
  "http://localhost:8080/api/user/profile",
  {
    headers: {
      "X-Device-UUID": session?.uuid,
      "X-Client-IP": session?.ip,
    },
  }
);
```

---

## 🔌 API Endpoint

Your app now has a built-in API endpoint:

### `POST /api/check-uuid`

Check if a new UUID should be created:

```bash
curl -X POST http://localhost:3000/api/check-uuid \
  -H "Content-Type: application/json" \
  -d '{
    "currentIP": "203.0.113.42",
    "deviceInfo": {
      "userAgent": "Mozilla/5.0...",
      "platform": "Win32",
      "language": "en-US",
      "screenResolution": "1920x1080",
      "timezone": "America/New_York",
      "deviceFingerprint": "a1b2c3d4"
    }
  }'
```

Response:
```json
{
  "needsNewUUID": false,
  "message": "IP and device info match. Keeping existing UUID.",
  "reason": "same_device"
}
```

---

## 📋 Decision Logic

**New UUID is created when:**
- ✅ First visit (no existing data)
- ✅ IP address changed
- ✅ Device characteristics changed (browser, OS, screen, timezone)

**UUID is kept when:**
- ✅ IP address is the same
- ✅ Device characteristics are the same
- ✅ Timestamp is just updated

---

## 🎯 Common Use Cases

### 1. Prevent Duplicate Signups from Same Device
```typescript
const session = getStoredSessionData();

// Check if this UUID already has an account
const existingUser = await checkUserByDeviceUUID(session?.uuid);

if (existingUser) {
  console.log("User already registered on this device");
  // Redirect to login instead of signup
}
```

### 2. Track User Devices
```typescript
// Backend: Store UUID+IP mapping with user account
async function linkDeviceToUser(userId: string) {
  const session = getStoredSessionData();
  
  await axios.post(`/api/users/${userId}/devices`, {
    uuid: session?.uuid,
    ip: session?.ip,
    deviceInfo: session?.deviceInfo,
  });
}
```

### 3. Multi-Device Sessions
```typescript
// Get all devices user logged in from
const userDevices = await axios.get(`/api/users/${userId}/devices`);

// Show "This device" vs "Other devices"
userDevices.forEach(device => {
  const isCurrentDevice = device.uuid === getStoredSessionData()?.uuid;
  console.log(`${device.ip} - ${isCurrentDevice ? "Current" : "Other"}`);
});
```

### 4. Detect Account Compromised
```typescript
// Backend: If UUID suddenly changes on account
const previousSession = getPreviousSession(userId);
const currentSession = getStoredSessionData();

if (previousSession.uuid !== currentSession.uuid) {
  // Alert user - possible compromise
  await sendSecurityAlert(userId);
}
```

---

## 🛠️ Configuration

### Change IP Detection Service

Edit `app/hooks/useDeviceTracking.ts`:

```typescript
async function getClientIP(): Promise<string> {
  try {
    // Replace with your preferred service
    const response = await axios.get("https://YOUR_IP_SERVICE.com", {
      timeout: 5000,
    });
    return response.data;
  } catch (error) {
    return "unknown";
  }
}
```

### Use Custom Backend IP Detection

If you have your own backend:

```typescript
async function getClientIP(): Promise<string> {
  try {
    const response = await axios.get("/api/client-ip");
    return response.data.ip;
  } catch (error) {
    return "unknown";
  }
}
```

And add to your Next.js API:
```typescript
// app/api/client-ip/route.ts
export async function GET(request: NextRequest) {
  const ip = request.ip || request.headers.get("x-forwarded-for");
  return NextResponse.json({ ip });
}
```

---

## 📁 File Structure

```
app/
├── api/check-uuid/route.ts          ← API endpoint
├── components/DeviceTrackingProvider.tsx  ← Auto-runs
├── hooks/useDeviceTracking.ts       ← Hook to access data
├── lib/
│   ├── device-utils.ts              ← Device info
│   ├── storage-utils.ts             ← localStorage
│   └── uuid-utils.ts                ← UUID generation
└── layout.tsx                       ← Already updated
```

---

## 🐛 Debugging

### See What's Stored
```javascript
// Browser console
const session = JSON.parse(localStorage.getItem('shiva_session_data'));
console.table(session);
```

### Test New UUID Creation
```javascript
// Browser console
localStorage.removeItem('shiva_session_data');
location.reload();
```

### Monitor State Changes
```typescript
"use client";
import { useDeviceTracking } from "@/app/hooks/useDeviceTracking";

export function DebugTracker() {
  const state = useDeviceTracking();
  
  console.log("Tracking State:", state);
  
  return (
    <pre>{JSON.stringify(state, null, 2)}</pre>
  );
}
```

---

## 🚀 Next Steps

1. **Test locally** - Refresh page and check console
2. **Implement login** - Send UUID/IP to your backend
3. **Device management** - Store UUID+IP per user
4. **Security checks** - Validate UUID on backend
5. **Analytics** - Track UUID changes for insights

---

## 📞 Need Help?

- **Full docs**: See `DEVICE_TRACKING.md`
- **Implementation guide**: See `IMPLEMENTATION_GUIDE.md`
- **Code examples**: See `app/lib/device-tracking-examples.ts`
- **Types**: See `app/lib/device-tracking.types.ts`

---

## ✨ You're All Set!

The system is already working. Just start using `getStoredSessionData()` or the `useDeviceTracking()` hook in your components to access the UUID and IP data!
