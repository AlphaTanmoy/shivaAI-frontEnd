"use client";

import React, { JSX, useEffect, useRef } from "react";
import axios from "axios";
import { getStoredSessionData, clearSessionData } from "@/app/lib/storage-utils";
import { getDeviceInfo } from "@/app/lib/device-utils";
import { useDeviceTracking } from "@/app/hooks/useDeviceTracking";

export function SessionInfoComponent(): JSX.Element {
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

export function TrackingStatusComponent(): JSX.Element {
  const trackingState = useDeviceTracking();

  if (!trackingState.isInitialized) {
    return <div>Initializing tracking...</div>;
  }

  return (
    <div>
      <h2>Tracking Status</h2>
      <p>UUID: {trackingState.uuid}</p>
      <p>IP: {trackingState.ip}</p>
      {trackingState.error && <p style={{ color: "red" }}>Error: {trackingState.error}</p>}
    </div>
  );
}

export async function checkUUIDStatus(): Promise<any> {
  try {
    const currentDeviceInfo = getDeviceInfo();
    const storedData = getStoredSessionData();

    const response = await axios.post("/api/check-uuid", {
      deviceInfo: currentDeviceInfo,
      existingIP: storedData?.ip,
      existingDeviceInfo: storedData?.deviceInfo,
    });

    return response.data;
  } catch (error) {
    console.error("Error checking UUID status:", error);
    throw error;
  }
}

export function resetSession(): void {
  clearSessionData();
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}

export async function sendSessionToBackend(): Promise<any | void> {
  const sessionData = getStoredSessionData();

  if (!sessionData) {
    console.log("No session data to send");
    return;
  }

  try {
    const response = await axios.post("http://localhost:8080/api/session", sessionData);
    return response.data;
  } catch (error) {
    console.error("Error sending session to backend:", error);
    throw error;
  }
}

export function debugDeviceFingerprint() {
  const deviceInfo = getDeviceInfo();

  // eslint-disable-next-line no-console
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

export function SessionChangeMonitor(): null {
  const trackingState = useDeviceTracking();
  const previousUUIDRef = useRef<string | null>(null);

  useEffect(() => {
    if (trackingState.uuid && trackingState.uuid !== previousUUIDRef.current) {
      console.log("UUID Changed:", {
        previousUUID: previousUUIDRef.current,
        newUUID: trackingState.uuid,
        ip: trackingState.ip,
      });
      previousUUIDRef.current = trackingState.uuid;
    }
  }, [trackingState.uuid, trackingState.ip]);

  return null;
}
