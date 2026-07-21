/**
 * Utility functions to get device information
 */

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  screenResolution: string;
  timezone: string;
  deviceFingerprint: string;
}

/**
 * Get detailed device information
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === "undefined") {
    return {
      userAgent: "",
      platform: "",
      language: "",
      screenResolution: "",
      timezone: "",
      deviceFingerprint: "",
    };
  }

  const userAgent = navigator.userAgent;
  const platform = navigator.platform || "unknown";
  const language = navigator.language || "unknown";
  const screenResolution = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Create a device fingerprint combining multiple factors
  const deviceFingerprint = createDeviceFingerprint({
    userAgent,
    platform,
    screenResolution,
    timezone,
  });

  return {
    userAgent,
    platform,
    language,
    screenResolution,
    timezone,
    deviceFingerprint,
  };
}

/**
 * Create a device fingerprint by combining multiple device characteristics
 */
function createDeviceFingerprint(data: {
  userAgent: string;
  platform: string;
  screenResolution: string;
  timezone: string;
}): string {
  const fingerprintString = `${data.userAgent}|${data.platform}|${data.screenResolution}|${data.timezone}`;

  // Simple hash function - you can use a more robust hashing library if needed
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash).toString(16);
}

/**
 * Check if device characteristics match
 */
export function deviceInfoMatches(
  info1: DeviceInfo,
  info2: DeviceInfo
): boolean {
  // Compare device fingerprints - this is the primary indicator
  if (info1.deviceFingerprint !== info2.deviceFingerprint) {
    return false;
  }

  // Also check userAgent and platform for additional confidence
  return (
    info1.userAgent === info2.userAgent && info1.platform === info2.platform
  );
}
