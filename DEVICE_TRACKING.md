# Device Tracking System Documentation

## Overview

This system automatically tracks new browser instances and creates unique UUIDs for each new device/IP combination. The data is stored in `localStorage` for persistent tracking across sessions.

## How It Works

### 1. **Initial Setup**
When the app loads, the `DeviceTrackingProvider` initializes the tracking system:
- Collects device information (user agent, platform, screen resolution, timezone)
- Fetches the client's IP address
- Checks if a UUID already exists for this device/IP combination

### 2. **UUID Decision Logic**
- **New UUID Created If:**
  - No existing session data is found (first visit)
  - IP address changed
  - Device characteristics changed (browser, OS, screen resolution, timezone)

- **Existing UUID Kept If:**
  - Both IP and device information match the stored data
  - Only the `lastUpdatedAt` timestamp is updated

### 3. **Data Storage**
Session data is stored in `localStorage` under the key `shiva_session_data`:

```json
{
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "ip": "192.168.1.1",
  "deviceInfo": {
    "userAgent": "Mozilla/5.0...",
    "platform": "Win32",
    "language": "en-US",
    "screenResolution": "1920x1080",
    "timezone": "America/New_York",
    "deviceFingerprint": "a1b2c3d4"
  },
  "createdAt": "2024-01-01T10:00:00.000Z",
  "lastUpdatedAt": "2024-01-01T10:00:00.000Z"
}
```

## API Endpoint

### `POST /api/check-uuid`

**Purpose:** Determines whether a new UUID should be created based on current device/IP info

**Request Body:**
```typescript
{
  currentIP: string;              // Current client IP
  deviceInfo: DeviceInfo;         // Current device information
  existingIP?: string;            // Previously stored IP
  existingDeviceInfo?: DeviceInfo; // Previously stored device info
}
```

**Response:**
```typescript
{
  needsNewUUID: boolean;  // true = create new UUID, false = keep existing
  message: string;        // Human-readable explanation
  reason?: string;        // "first_visit", "different_ip", "different_device", "same_device", "different_ip_and_device", "error"
}
```

## Utilities

### `device-utils.ts`
Functions to manage device information:
- `getDeviceInfo()` - Collect current device characteristics
- `deviceInfoMatches()` - Compare two device info objects
- `createDeviceFingerprint()` - Generate unique device identifier

### `storage-utils.ts`
Functions to manage localStorage:
- `getStoredSessionData()` - Retrieve session data from localStorage
- `saveSessionData()` - Save session data to localStorage
- `updateSessionUUID()` - Update UUID and timestamp
- `updateLastUpdatedAt()` - Update only the timestamp
- `clearSessionData()` - Clear all stored data

### `uuid-utils.ts`
UUID generation:
- `generateUUID()` - Generate a random v4 UUID

## Hook: `useDeviceTracking`

Use this hook in any component to access the tracking state:

```typescript
import { useDeviceTracking } from "@/app/hooks/useDeviceTracking";

export function MyComponent() {
  const { isInitialized, uuid, ip, error } = useDeviceTracking();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>Your UUID: {uuid}</p>
      <p>Your IP: {ip}</p>
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

## Files Structure

```
app/
├── api/
│   └── check-uuid/
│       └── route.ts              # API endpoint
├── components/
│   └── DeviceTrackingProvider.tsx # Client provider component
├── hooks/
│   └── useDeviceTracking.ts      # Hook for tracking
├── lib/
│   ├── device-utils.ts           # Device info utilities
│   ├── storage-utils.ts          # LocalStorage utilities
│   └── uuid-utils.ts             # UUID generation
├── layout.tsx                    # Updated to use DeviceTrackingProvider
└── ...
```

## Accessing Session Data

### From Browser Console
```javascript
// Get the current session data
const sessionData = JSON.parse(localStorage.getItem('shiva_session_data'));
console.log(sessionData);
```

### From React Component
```typescript
import { getStoredSessionData } from "@/app/lib/storage-utils";

const sessionData = getStoredSessionData();
```

## IP Detection Services Used

The system tries multiple services to detect the client's IP:
1. `https://api.ipify.org` (primary)
2. `https://ifconfig.me/` (fallback)

If both fail, it defaults to `"unknown"`. This is important to note if you're running locally.

## Debugging

Enable logging in your browser console to track initialization:

```javascript
// Clear existing session to test new UUID creation
localStorage.removeItem('shiva_session_data');
// Refresh the page - a new UUID will be created
```

Check the browser console for debug messages:
- "Device Tracking Initialized:" - Shows when tracking is ready
- "Device Tracking Error:" - Shows if there are any errors

## Security Considerations

- Device fingerprinting is not 100% unique but covers most common scenarios
- IP address can change within the same session (switching networks)
- Users can clear localStorage to reset their UUID
- Consider implementing server-side validation for production use

## Future Enhancements

- Add server-side UUID validation
- Implement more robust device fingerprinting (canvas fingerprinting, WebGL, etc.)
- Add user consent for tracking
- Implement analytics dashboard
- Add automatic cleanup of old sessions
