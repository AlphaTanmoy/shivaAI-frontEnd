/**
 * API endpoint to check if a new UUID should be created
 * 
 * POST /api/check-uuid
 * Request body:
 * {
 *   currentIP: string,
 *   deviceInfo: DeviceInfo,
 *   existingUUID?: string,
 *   existingIP?: string,
 *   existingDeviceInfo?: DeviceInfo
 * }
 * 
 * Response:
 * {
 *   needsNewUUID: boolean,
 *   message: string
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { deviceInfoMatches, DeviceInfo } from "@/app/lib/device-utils";

interface CheckUUIDRequest {
  currentIP: string;
  deviceInfo: DeviceInfo;
  existingUUID?: string;
  existingIP?: string;
  existingDeviceInfo?: DeviceInfo;
}

interface CheckUUIDResponse {
  needsNewUUID: boolean;
  message: string;
  reason?: string;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<CheckUUIDResponse>> {
  try {
    const body = (await request.json()) as CheckUUIDRequest;

    const {
      currentIP,
      deviceInfo,
      existingIP,
      existingDeviceInfo,
    } = body;

    // If no existing data, a new UUID is needed
    if (!existingIP || !existingDeviceInfo) {
      return NextResponse.json(
        {
          needsNewUUID: true,
          message: "No existing session found. Creating new UUID.",
          reason: "first_visit",
        },
        { status: 200 }
      );
    }

    // Check if IP and device information match
    const ipMatches = currentIP === existingIP;
    const deviceMatches = deviceInfoMatches(deviceInfo, existingDeviceInfo);

    if (ipMatches && deviceMatches) {
      // Same IP and device - no new UUID needed
      return NextResponse.json(
        {
          needsNewUUID: false,
          message: "IP and device info match. Keeping existing UUID.",
          reason: "same_device",
        },
        { status: 200 }
      );
    }

    // Different IP or device - new UUID needed
    let reason = "";
    if (!ipMatches && !deviceMatches) {
      reason = "different_ip_and_device";
    } else if (!ipMatches) {
      reason = "different_ip";
    } else {
      reason = "different_device";
    }

    return NextResponse.json(
      {
        needsNewUUID: true,
        message: "IP or device info changed. Creating new UUID.",
        reason,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in check-uuid API:", error);
    return NextResponse.json(
      {
        needsNewUUID: true,
        message: "Error checking UUID status. Creating new UUID as fallback.",
        reason: "error",
      },
      { status: 500 }
    );
  }
}
