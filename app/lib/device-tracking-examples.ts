/**
 * Example usage of the device tracking system
 * This file shows different ways to use the tracking system in your app
 */

// ============================================================================
// Example 1: Get current session data in a component
// ============================================================================

import { getStoredSessionData } from "@/app/lib/storage-utils";

export function SessionInfoComponent() {
  const sessionData = getStoredSessionData();

  if (!sessionData) {
    return <div>No session data found</div>;
  }

  return (
    <div>
      <h2>Session Information</h2>
      <p>UUID: {sessionData.uuid}</p>
      <p>IP: {sessionData.ip}</p>
      <p>Platform: {sessionData.deviceInfo.platform}</p>
      <p>Created: {new Date(sessionData.createdAt).toLocaleString()}</p>
      <p>Last Updated: {new Date(sessionData.lastUpdatedAt).toLocaleString()}</p>
    </div>
  );
}

// ============================================================================
// Example 2: Use the hook in a component
// ============================================================================

"use client";

import { useDeviceTracking } from "@/app/hooks/useDeviceTracking";

export function TrackingStatusComponent() {
  const trackingState = useDeviceTracking();

  if (!trackingState.isInitialized) {
    return <div>Initializing tracking...</div>;
  }

  return (
    <div>
      <h2>Tracking Status</h2>
      <p>UUID: {trackingState.uuid}</p>
      <p>IP: {trackingState.ip}</p>
      {trackingState.error && (
        <p style={{ color: "red" }}>Error: {trackingState.error}</p>
      )}
    </div>
  );
}

// ============================================================================
// Example 3: Manually check UUID status
// ============================================================================

import axios from "axios";
import { getDeviceInfo } from "@/app/lib/device-utils";
import { getStoredSessionData } from "@/app/lib/storage-utils";

export async function checkUUIDStatus() {
  try {
    const currentDeviceInfo = getDeviceInfo();
    const storedData = getStoredSessionData();

    const response = await axios.post("/api/check-uuid", {
      currentIP: "192.168.1.1", // Get this from your IP detection
      deviceInfo: currentDeviceInfo,
      existingIP: storedData?.ip,
      existingDeviceInfo: storedData?.deviceInfo,
    });

    console.log("UUID Check Result:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error checking UUID status:", error);
  }
}

// ============================================================================
// Example 4: Reset session (simulate new browser instance)
// ============================================================================

import { clearSessionData } from "@/app/lib/storage-utils";

export function resetSession() {
  clearSessionData();
  // Reload the page to trigger new UUID creation
  window.location.reload();
}

// ============================================================================
// Example 5: Send session data to backend
// ============================================================================

import { getStoredSessionData } from "@/app/lib/storage-utils";

export async function sendSessionToBackend() {
  const sessionData = getStoredSessionData();

  if (!sessionData) {
    console.log("No session data to send");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:8080/api/session",
      sessionData
    );
    console.log("Session sent to backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending session to backend:", error);
  }
}

// ============================================================================
// Example 6: Debug device fingerprint
// ============================================================================

import { getDeviceInfo } from "@/app/lib/device-utils";

export function debugDeviceFingerprint() {
  const deviceInfo = getDeviceInfo();

  console.table({
    "User Agent": deviceInfo.userAgent,
    Platform: deviceInfo.platform,
    Language: deviceInfo.language,
    "Screen Resolution": deviceInfo.screenResolution,
    Timezone: deviceInfo.timezone,
    "Device Fingerprint": deviceInfo.deviceFingerprint,
  });

  return deviceInfo;
}

// ============================================================================
// Example 7: Monitor UUID changes (useful for logging/analytics)
// ============================================================================

"use client";

import { useDeviceTracking } from "@/app/hooks/useDeviceTracking";
import { useEffect, useRef } from "react";

export function SessionChangeMonitor() {
  const trackingState = useDeviceTracking();
  const previousUUIDRef = useRef<string | null>(null);

  useEffect(() => {
    if (trackingState.uuid && trackingState.uuid !== previousUUIDRef.current) {
      // UUID changed - could be new device, new IP, or first visit
      console.log("UUID Changed:", {
        previousUUID: previousUUIDRef.current,
        newUUID: trackingState.uuid,
        ip: trackingState.ip,
      });

      // Here you could send analytics or notifications
      // Example: analytics.track('uuid_changed', { newUUID: trackingState.uuid });

      previousUUIDRef.current = trackingState.uuid;
    }
  }, [trackingState.uuid, trackingState.ip]);

  return null; // This component doesn't render anything
}
