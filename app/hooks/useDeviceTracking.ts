"use client";

/**
 * Hook to manage device tracking and UUID creation
 * Call this in your root layout or app component to initialize tracking
 */

import { useEffect, useState } from "react";
import axios from "axios";
import { getDeviceInfo } from "@/app/lib/device-utils";
import {
  getStoredSessionData,
  updateSessionUUID,
  updateLastUpdatedAt,
  type StoredSessionData,
} from "@/app/lib/storage-utils";
import { generateUUID } from "@/app/lib/uuid-utils";

export interface DeviceTrackingState {
  isInitialized: boolean;
  uuid: string | null;
  ip: string | null;
  error: string | null;
}

/**
 * Hook to initialize device tracking
 * Returns the current session state
 */
export function useDeviceTracking(): DeviceTrackingState {
  const [state, setState] = useState<DeviceTrackingState>({
    isInitialized: false,
    uuid: null,
    ip: null,
    error: null,
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const initializeTracking = async () => {
      try {
        // Get current device information
        const currentDeviceInfo = getDeviceInfo();

        // Get client IP address
        const ip = await getClientIP();

        // Get stored session data
        const storedData = getStoredSessionData();

        // Call API to check if new UUID is needed
        const checkResponse = await axios.post("/api/check-uuid", {
          currentIP: ip,
          deviceInfo: currentDeviceInfo,
          existingIP: storedData?.ip,
          existingDeviceInfo: storedData?.deviceInfo,
        });

        const { needsNewUUID } = checkResponse.data;

        let sessionData: StoredSessionData;

        if (needsNewUUID) {
          // Create new UUID
          const newUUID = generateUUID();
          updateSessionUUID(newUUID, ip, currentDeviceInfo);
          sessionData = {
            uuid: newUUID,
            ip,
            deviceInfo: currentDeviceInfo,
            createdAt: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString(),
          };
        } else {
          // Keep existing UUID, just update timestamp
          updateLastUpdatedAt();
          sessionData = storedData!;
        }

        setState({
          isInitialized: true,
          uuid: sessionData.uuid,
          ip: sessionData.ip,
          error: null,
        });
      } catch (error) {
        console.error("Error initializing device tracking:", error);

        // Fallback: create a new UUID if API fails
        try {
          const currentDeviceInfo = getDeviceInfo();
          const ip = await getClientIP();
          const newUUID = generateUUID();
          updateSessionUUID(newUUID, ip, currentDeviceInfo);

          setState({
            isInitialized: true,
            uuid: newUUID,
            ip,
            error: "Failed to check UUID status, created new UUID as fallback",
          });
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
          setState({
            isInitialized: false,
            uuid: null,
            ip: null,
            error: "Failed to initialize device tracking",
          });
        }
      }
    };

    initializeTracking();
  }, []);

  return state;
}

/**
 * Get the client's IP address by calling an IP detection service
 * Falls back to a simple value if detection fails
 */
async function getClientIP(): Promise<string> {
  try {
    // Try using a public IP detection API
    const response = await axios.get("https://api.ipify.org?format=json", {
      timeout: 5000,
    });
    return response.data.ip;
  } catch (error) {
    console.warn("Failed to get IP from ipify, using fallback method:", error);
    try {
      // Fallback to another service
      const response = await axios.get("https://ifconfig.me/", {
        timeout: 5000,
      });
      return response.data.trim();
    } catch (fallbackError) {
      console.warn("Failed to get IP from ifconfig.me:", fallbackError);
      // Return a placeholder if both fail
      return "unknown";
    }
  }
}
