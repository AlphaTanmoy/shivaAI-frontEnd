/**
 * Utility functions to manage localStorage safely
 */

import { DeviceInfo } from "./device-utils";

export interface StoredSessionData {
  uuid: string;
  ip: string;
  deviceInfo: DeviceInfo;
  createdAt: string;
  lastUpdatedAt: string;
}

const STORAGE_KEY = "shiva_session_data";

/**
 * Get stored session data from localStorage
 */
export function getStoredSessionData(): StoredSessionData | null {
  try {
    if (typeof window === "undefined") return null;

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    return JSON.parse(data) as StoredSessionData;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
}

/**
 * Save session data to localStorage
 */
export function saveSessionData(data: StoredSessionData): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
}

/**
 * Clear session data from localStorage
 */
export function clearSessionData(): void {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}

/**
 * Update session UUID (if a new UUID needs to be created)
 */
export function updateSessionUUID(
  newUUID: string,
  newIP: string,
  newDeviceInfo: DeviceInfo
): void {
  const now = new Date().toISOString();
  const sessionData: StoredSessionData = {
    uuid: newUUID,
    ip: newIP,
    deviceInfo: newDeviceInfo,
    createdAt: now,
    lastUpdatedAt: now,
  };

  saveSessionData(sessionData);
}

/**
 * Update last updated timestamp without changing UUID
 */
export function updateLastUpdatedAt(): void {
  const sessionData = getStoredSessionData();
  if (sessionData) {
    sessionData.lastUpdatedAt = new Date().toISOString();
    saveSessionData(sessionData);
  }
}
