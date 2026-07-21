# Device Tracking System - Visual Diagrams

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Your Next.js App                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              layout.tsx (Root)                          │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │    DeviceTrackingProvider (Client Component)     │  │   │
│  │  │  ┌─────────────────────────────────────────────┐ │  │   │
│  │  │  │  useDeviceTracking() Hook                  │ │  │   │
│  │  │  │                                             │ │  │   │
│  │  │  │  ├─ getDeviceInfo()                        │ │  │   │
│  │  │  │  ├─ getClientIP()                          │ │  │   │
│  │  │  │  ├─ getStoredSessionData()                 │ │  │   │
│  │  │  │  ├─ POST /api/check-uuid                   │ │  │   │
│  │  │  │  └─ updateSessionUUID()                    │ │  │   │
│  │  │  └─────────────────────────────────────────────┘ │  │   │
│  │  │                    ↓                              │  │   │
│  │  │         {children} - Your Components             │  │   │
│  │  └───────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
        ┌───────────────────────────────────────────┐
        │         Browser Environment               │
        ├───────────────────────────────────────────┤
        │ localStorage:                             │
        │ {                                         │
        │   "shiva_session_data": {                │
        │     uuid: "550e8400-...",                │
        │     ip: "203.0.113.42",                  │
        │     deviceInfo: {...},                   │
        │     timestamps                           │
        │   }                                       │
        │ }                                         │
        └───────────────────────────────────────────┘
```

---

## 2. Initialization Flow

```
                    APP LOADS
                        │
                        ↓
        ┌───────────────────────────────┐
        │ DeviceTrackingProvider Mounted │
        └───────────────────┬───────────┘
                            │
                    ┌───────┴───────┐
                    │               │
             useEffect()    (only client)
                    │
     ┌──────────────┴──────────────┐
     │                             │
     ↓                             ↓
(A) GET DATA              (B) GET STORED DATA
┌──────────────┐           ┌────────────────────┐
│ Device Info: │           │ Check localStorage │
├──────────────┤           │ for:               │
│ • User Agent │           │ • Previous UUID    │
│ • Platform   │           │ • Previous IP      │
│ • Language   │           │ • Previous Device  │
│ • Screen Res │           │   Info             │
│ • Timezone   │           └────────────────────┘
│ • Fingerprnt │                   │
└──────────────┘                   │
     │                             │
     │          ┌──────────────────┘
     │          │
     ↓          ↓
 (C) GET CLIENT IP
 ┌────────────────────────┐
 │ Try: api.ipify.org     │
 │ Fallback: ifconfig.me  │
 │ Default: "unknown"     │
 └───────────┬────────────┘
             │
     ┌───────┴───────┐
     │               │
     ↓               ↓
 IP Found       IP Failed
 (e.g. 203...)  ("unknown")
     │               │
     └───────┬───────┘
             │
             ↓
 ┌─────────────────────────────┐
 │ (D) CALL API /check-uuid    │
 │ POST {                      │
 │   currentIP,                │
 │   deviceInfo,               │
 │   existingIP,               │
 │   existingDeviceInfo        │
 │ }                           │
 └──────────┬──────────────────┘
            │
       ┌────┴────────────────────────────────┐
       │                                     │
       ↓                                     ↓
  (E) DECISION              (F) DECISION
 ┌──────────────────┐      ┌──────────────────┐
 │ needsNewUUID:    │      │ needsNewUUID:    │
 │ • true           │      │ • false          │
 │ (reason: ...)    │      │ (reason: ...)    │
 └────────┬─────────┘      └────────┬─────────┘
          │                         │
          ↓                         ↓
  ┌─────────────────┐       ┌──────────────────┐
  │ generateUUID()  │       │ updateLastUpdated│
  │ (new UUID)      │       │ At()             │
  └────────┬────────┘       │ (keep UUID)      │
           │                └────────┬─────────┘
           │                        │
           └────────────┬───────────┘
                        │
                        ↓
             ┌──────────────────────┐
             │ updateSessionUUID()  │
             │ or                   │
             │ updateLastUpdatedAt()│
             └──────────┬───────────┘
                        │
                        ↓
          ┌────────────────────────┐
          │ saveSessionData()       │
          │ to localStorage         │
          └──────────┬─────────────┘
                     │
                     ↓
          ┌────────────────────────┐
          │ setState({             │
          │   isInitialized: true, │
          │   uuid: "...",         │
          │   ip: "...",           │
          │   error: null          │
          │ })                     │
          └──────────┬─────────────┘
                     │
                     ↓
          ┌────────────────────────┐
          │ ✅ READY TO USE!       │
          │ Components can now     │
          │ access UUID & IP       │
          └────────────────────────┘
```

---

## 3. UUID Decision Logic

```
                  ┌─────────────────────────┐
                  │  Any Stored Data in     │
                  │  localStorage?          │
                  └───────────┬─────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                   │
                   NO                  YES
                    │                   │
                    ↓                   ↓
            ┌────────────────┐  ┌──────────────────────┐
            │ No previous    │  │ Compare:             │
            │ session data   │  │ • IP address         │
            │                │  │ • Device fingerprint │
            │ ✅ NEW UUID    │  │ • User Agent         │
            │ reason:        │  │ • Platform           │
            │ "first_visit"  │  └──────────┬───────────┘
            └────────────────┘             │
                                   ┌───────┴───────────┐
                                   │                  │
                        ┌──────────┴──┐      ┌────────┴────────┐
                        │             │      │                │
                       BOTH         NONE      ONE or          BOTH
                       MATCH        MATCH    DON'T MATCH      DON'T
                        │             │      MATCH            MATCH
                        │             │        │                │
                        ↓             ↓        ↓                ↓
                   ┌─────────┐  ┌──────────┐ ┌──────┐    ┌────────────┐
                   │ ✅ KEEP │  │ ❌ NEW  │ │ ❌  │    │ ❌ NEW   │
                   │ UUID    │  │ UUID     │ │NEW  │    │ UUID     │
                   │         │  │ reason:  │ │UUID │    │ reason:  │
                   │ reason: │  │ "diff... │ │rea- │    │ "diff... │
                   │ "same_  │  │ ip"      │ │son: │    │ ip_and_  │
                   │ device" │  │          │ │"diff device"        │
                   │         │  │          │ │...  │    │          │
                   │ Update  │  │ Create   │ │dev" │    │ Create   │
                   │ timestamp  │ new UUID   │     │    │ new UUID │
                   └─────────┘  └──────────┘ └──────┘    └────────────┘
                        │             │        │                │
                        └─────────────┴────────┴────────────────┘
                                      │
                                      ↓
                        ┌──────────────────────────┐
                        │ Save to localStorage     │
                        │ with createdAt/Updated   │
                        │ At timestamps            │
                        └──────────────────────────┘
```

---

## 4. Component Integration

```
Layout.tsx
    │
    ├─ DeviceTrackingProvider (Client Component)
    │   │
    │   └─ useDeviceTracking() Hook
    │       │
    │       └─ Provides state: { isInitialized, uuid, ip, error }
    │
    └─ Children Components
        │
        ├─ Your Page Components
        │   └─ Can use:
        │      ├─ getStoredSessionData()
        │      ├─ useDeviceTracking() [if "use client"]
        │      └─ Access UUID, IP, deviceInfo
        │
        ├─ ChatBox Component
        │   └─ Can send UUID/IP to backend
        │
        └─ Other Components
            └─ Can access session data

```

---

## 5. Data Flow - New Browser

```
First Time: Browser Cleared or New Tab
│
├─ localStorage is empty
│  └─ getStoredSessionData() → null
│
├─ Device Info Collected:
│  ├─ userAgent: "Mozilla/5.0..."
│  ├─ platform: "Win32"
│  ├─ screenResolution: "1920x1080"
│  └─ deviceFingerprint: "a1b2c3d4"
│
├─ IP Detected: "203.0.113.42"
│
├─ API Check:
│  ├─ currentIP: "203.0.113.42"
│  ├─ deviceInfo: {...}
│  ├─ existingIP: undefined
│  └─ existingDeviceInfo: undefined
│
├─ API Response:
│  ├─ needsNewUUID: true
│  ├─ reason: "first_visit"
│  └─ message: "No existing session..."
│
├─ Generate UUID: "550e8400-e29b-41d4-a716-446655440000"
│
├─ Save to localStorage:
│  └─ shiva_session_data: {
│     uuid: "550e8400-...",
│     ip: "203.0.113.42",
│     deviceInfo: {...},
│     createdAt: "2024-01-01T10:00:00Z",
│     lastUpdatedAt: "2024-01-01T10:00:00Z"
│  }
│
└─ ✅ Ready! UUID available for use
```

---

## 6. Data Flow - Same Device/IP (Refresh)

```
Page Refresh: Same Browser, Same IP
│
├─ localStorage has data
│  └─ getStoredSessionData() → previous session
│
├─ Device Info Collected (current):
│  ├─ userAgent: "Mozilla/5.0..." (same)
│  ├─ platform: "Win32" (same)
│  ├─ screenResolution: "1920x1080" (same)
│  └─ deviceFingerprint: "a1b2c3d4" (same)
│
├─ IP Detected: "203.0.113.42" (same)
│
├─ API Check:
│  ├─ currentIP: "203.0.113.42"
│  ├─ deviceInfo: {...} (current)
│  ├─ existingIP: "203.0.113.42" (stored)
│  └─ existingDeviceInfo: {...} (stored)
│
├─ Comparison:
│  ├─ IPs match: ✅ yes
│  └─ Devices match: ✅ yes
│
├─ API Response:
│  ├─ needsNewUUID: false
│  ├─ reason: "same_device"
│  └─ message: "IP and device match..."
│
├─ Keep existing UUID: "550e8400-..."
│
├─ Update localStorage (timestamp only):
│  └─ shiva_session_data: {
│     uuid: "550e8400-...", ← SAME
│     ip: "203.0.113.42",    ← SAME
│     deviceInfo: {...},      ← SAME
│     createdAt: "2024-01-01T10:00:00Z",      ← UNCHANGED
│     lastUpdatedAt: "2024-01-01T10:05:00Z"   ← UPDATED
│  }
│
└─ ✅ Ready! Same UUID still in use
```

---

## 7. Data Flow - Different IP

```
Different IP: Same Browser, Different Network
│
├─ localStorage has data
│  └─ Previous: ip="203.0.113.42"
│
├─ Device Info Collected (same):
│  └─ deviceFingerprint: "a1b2c3d4" (same)
│
├─ IP Detected (different): "192.168.1.1"
│
├─ API Check:
│  ├─ currentIP: "192.168.1.1" ← NEW IP
│  ├─ existingIP: "203.0.113.42"
│  ├─ Device match: ✅ yes
│  └─ IP match: ❌ no
│
├─ API Response:
│  ├─ needsNewUUID: true ← CHANGED!
│  ├─ reason: "different_ip"
│  └─ message: "IP changed..."
│
├─ Generate NEW UUID: "662e9511-..."
│
├─ Save to localStorage:
│  └─ shiva_session_data: {
│     uuid: "662e9511-..." ← NEW!
│     ip: "192.168.1.1",    ← NEW!
│     deviceInfo: {...},
│     createdAt: "2024-01-01T10:05:00Z" ← NEW!
│     lastUpdatedAt: "2024-01-01T10:05:00Z"
│  }
│
└─ ✅ Ready! New UUID created for new IP
```

---

## 8. localStorage Structure

```
Browser localStorage
├─ Key: "shiva_session_data"
│
└─ Value: JSON Object
    ├─ uuid: string
    │  └─ Example: "550e8400-e29b-41d4-a716-446655440000"
    │
    ├─ ip: string
    │  └─ Example: "203.0.113.42"
    │
    ├─ deviceInfo: Object
    │  ├─ userAgent: string
    │  │  └─ Example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
    │  ├─ platform: string
    │  │  └─ Example: "Win32"
    │  ├─ language: string
    │  │  └─ Example: "en-US"
    │  ├─ screenResolution: string
    │  │  └─ Example: "1920x1080"
    │  ├─ timezone: string
    │  │  └─ Example: "America/New_York"
    │  └─ deviceFingerprint: string
    │     └─ Example: "a1b2c3d4"
    │
    ├─ createdAt: ISO string
    │  └─ Example: "2024-01-01T10:00:00.000Z"
    │
    └─ lastUpdatedAt: ISO string
       └─ Example: "2024-01-01T10:00:00.000Z"
```

---

## 9. API Request/Response Flow

```
Client Component
    │
    ├─ Collect data (device info, IP)
    │
    ├─ Prepare request:
    │  └─ POST /api/check-uuid
    │     {
    │       currentIP: "203.0.113.42",
    │       deviceInfo: {...},
    │       existingIP?: "203.0.113.42",
    │       existingDeviceInfo?: {...}
    │     }
    │
    ├─ axios sends request
    │  │
    │  └─→ Server (route.ts)
    │      │
    │      ├─ Parse request body
    │      │
    │      ├─ Compare IPs
    │      │  └─ currentIP === existingIP?
    │      │
    │      ├─ Compare devices
    │      │  └─ deviceInfoMatches()?
    │      │
    │      ├─ Determine needsNewUUID
    │      │  └─ Reason?
    │      │
    │      └─ Return response
    │         {
    │           needsNewUUID: boolean,
    │           message: string,
    │           reason: string
    │         }
    │
    └─→ Client receives response
        │
        ├─ If needsNewUUID === true
        │  └─ generateUUID()
        │
        └─ updateSessionUUID() or updateLastUpdatedAt()
```

---

## 10. Lifecycle Timeline

```
Browser Lifetime
├─ T=0s: Browser opens → First page load
│  │
│  ├─ DeviceTrackingProvider mounts
│  ├─ useDeviceTracking() runs
│  ├─ Collects device info
│  ├─ Detects IP
│  ├─ localStorage empty → needsNewUUID = true
│  ├─ Generate first UUID
│  └─ Save to localStorage
│
├─ T=5s: User navigates to different page
│  │
│  └─ useDeviceTracking() not re-run (already done)
│     UUID stays same, available to all pages
│
├─ T=30s: User refreshes page
│  │
│  ├─ DeviceTrackingProvider remounts
│  ├─ useDeviceTracking() runs
│  ├─ Device & IP same → needsNewUUID = false
│  ├─ Keep UUID
│  └─ Update lastUpdatedAt
│
├─ T=1h: User switches network (coffee shop)
│  │
│  ├─ DeviceTrackingProvider remounts
│  ├─ useDeviceTracking() runs
│  ├─ IP changed → needsNewUUID = true
│  ├─ Generate NEW UUID
│  └─ Update localStorage
│
└─ T=24h: User clears browser data
   │
   ├─ localStorage cleared
   │
   └─ Next page load:
      ├─ localStorage empty
      ├─ Generate another new UUID
      └─ Start fresh tracking
```

---

These diagrams show how every piece of the system connects and operates!
