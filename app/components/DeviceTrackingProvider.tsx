"use client";

/**
 * Client component to initialize device tracking
 * This should be placed in the root layout to ensure tracking is initialized on app load
 */

import { useDeviceTracking } from "@/app/hooks/useDeviceTracking";
import { ReactNode } from "react";

interface DeviceTrackingProviderProps {
  children: ReactNode;
}

export function DeviceTrackingProvider({
  children,
}: DeviceTrackingProviderProps) {
  const trackingState = useDeviceTracking();

  // Log tracking state (useful for debugging)
  if (trackingState.isInitialized && trackingState.uuid) {
    console.log("Device Tracking Initialized:", {
      uuid: trackingState.uuid,
      ip: trackingState.ip,
    });
  }

  if (trackingState.error) {
    console.warn("Device Tracking Error:", trackingState.error);
  }

  return <>{children}</>;
}
