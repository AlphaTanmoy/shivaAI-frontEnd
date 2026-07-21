/**
 * Type definitions for the device tracking system
 * Import from here for consistent typing across the app
 */

/**
 * Device information collected from the browser
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
 * Session data stored in localStorage
 */
export interface StoredSessionData {
  uuid: string;
  ip: string;
  deviceInfo: DeviceInfo;
  createdAt: string;
  lastUpdatedAt: string;
}

/**
 * Check UUID API request body
 */
export interface CheckUUIDRequest {
  currentIP: string;
  deviceInfo: DeviceInfo;
  existingUUID?: string;
  existingIP?: string;
  existingDeviceInfo?: DeviceInfo;
}

/**
 * Check UUID API response
 */
export interface CheckUUIDResponse {
  needsNewUUID: boolean;
  message: string;
  reason?: 
    | "first_visit"
    | "different_ip"
    | "different_device"
    | "different_ip_and_device"
    | "same_device"
    | "error";
}

/**
 * Device tracking hook state
 */
export interface DeviceTrackingState {
  isInitialized: boolean;
  uuid: string | null;
  ip: string | null;
  error: string | null;
}
