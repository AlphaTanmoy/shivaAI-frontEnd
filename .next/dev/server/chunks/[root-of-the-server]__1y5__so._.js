module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/lib/device-utils.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions to get device information
 */ __turbopack_context__.s([
    "deviceInfoMatches",
    ()=>deviceInfoMatches,
    "getDeviceInfo",
    ()=>getDeviceInfo
]);
function getDeviceInfo() {
    if ("TURBOPACK compile-time truthy", 1) {
        return {
            userAgent: "",
            platform: "",
            language: "",
            screenResolution: "",
            timezone: "",
            deviceFingerprint: ""
        };
    }
    //TURBOPACK unreachable
    ;
    const userAgent = undefined;
    const platform = undefined;
    const language = undefined;
    const screenResolution = undefined;
    const timezone = undefined;
    // Create a device fingerprint combining multiple factors
    const deviceFingerprint = undefined;
}
/**
 * Create a device fingerprint by combining multiple device characteristics
 */ function createDeviceFingerprint(data) {
    const fingerprintString = `${data.userAgent}|${data.platform}|${data.screenResolution}|${data.timezone}`;
    // Simple hash function - you can use a more robust hashing library if needed
    let hash = 0;
    for(let i = 0; i < fingerprintString.length; i++){
        const char = fingerprintString.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
}
function deviceInfoMatches(info1, info2) {
    // Compare device fingerprints - this is the primary indicator
    if (info1.deviceFingerprint !== info2.deviceFingerprint) {
        return false;
    }
    // Also check userAgent and platform for additional confidence
    return info1.userAgent === info2.userAgent && info1.platform === info2.platform;
}
}),
"[project]/app/api/check-uuid/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
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
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$device$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/device-utils.ts [app-route] (ecmascript)");
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { currentIP, deviceInfo, existingIP, existingDeviceInfo } = body;
        // If no existing data, a new UUID is needed
        if (!existingIP || !existingDeviceInfo) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                needsNewUUID: true,
                message: "No existing session found. Creating new UUID.",
                reason: "first_visit"
            }, {
                status: 200
            });
        }
        // Check if IP and device information match
        const ipMatches = currentIP === existingIP;
        const deviceMatches = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$device$2d$utils$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deviceInfoMatches"])(deviceInfo, existingDeviceInfo);
        if (ipMatches && deviceMatches) {
            // Same IP and device - no new UUID needed
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                needsNewUUID: false,
                message: "IP and device info match. Keeping existing UUID.",
                reason: "same_device"
            }, {
                status: 200
            });
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            needsNewUUID: true,
            message: "IP or device info changed. Creating new UUID.",
            reason
        }, {
            status: 200
        });
    } catch (error) {
        console.error("Error in check-uuid API:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            needsNewUUID: true,
            message: "Error checking UUID status. Creating new UUID as fallback.",
            reason: "error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1y5__so._.js.map