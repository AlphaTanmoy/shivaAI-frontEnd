module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/components/ChatBox.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatBox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const WS_URL = "ws://localhost:9669/ws/chat";
function ChatBox() {
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [connected, setConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [connectionError, setConnectionError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const socketRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const ws = new WebSocket(WS_URL);
        ws.onopen = ()=>{
            console.log("🔥 WebSocket Connected");
            setConnected(true);
            setConnectionError(null);
        };
        ws.onmessage = (event)=>{
            setMessages((prev)=>[
                    ...prev,
                    {
                        role: "bot",
                        text: event.data
                    }
                ]);
            setLoading(false);
        };
        ws.onclose = (event)=>{
            console.log("❌ WebSocket Disconnected", event);
            setConnected(false);
            setConnectionError(`WebSocket disconnected (${event.code}${event.reason ? `: ${event.reason}` : ""}). Refresh to reconnect.`);
            setLoading(false);
        };
        ws.onerror = (event)=>{
            console.error("WebSocket error", event);
            setConnectionError("WebSocket error occurred. Confirm the backend is running and /ws/chat is reachable.");
        };
        socketRef.current = ws;
        return ()=>{
            ws.close();
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [
        messages
    ]);
    const sendMessage = ()=>{
        const trimmed = message.trim();
        if (!trimmed) return;
        const ws = socketRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            setConnectionError("WebSocket not connected.");
            console.error("WebSocket not connected");
            return;
        }
        const payload = JSON.stringify({
            message: trimmed
        });
        setMessages((prev)=>[
                ...prev,
                {
                    role: "user",
                    text: trimmed
                }
            ]);
        setMessage("");
        setLoading(true);
        setError(null);
        ws.send(payload);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            position: "fixed",
            bottom: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(620px, 96%)",
            maxHeight: "84vh",
            zIndex: 20,
            background: "rgba(7, 11, 21, 0.96)",
            backdropFilter: "blur(22px)",
            padding: "18px",
            borderRadius: "24px",
            border: "1px solid rgba(56, 189, 248, 0.16)",
            boxShadow: "0 28px 96px rgba(0, 0, 0, 0.28)",
            display: "flex",
            flexDirection: "column"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 14
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            color: "#7dfcff",
                            fontSize: 17,
                            fontWeight: 700
                        },
                        children: "ShivaGPT (WS)"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ChatBox.tsx",
                        lineNumber: 107,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: "rgba(255,255,255,0.65)",
                                    fontSize: 12
                                },
                                children: "Real-time divine connection 🔱"
                            }, void 0, false, {
                                fileName: "[project]/app/components/ChatBox.tsx",
                                lineNumber: 111,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    color: connectionError ? "#f87171" : connected ? "#34d399" : "#fbbf24",
                                    fontSize: 12
                                },
                                children: connectionError ?? (connected ? loading ? "Sending..." : "Connected" : "Connecting...")
                            }, void 0, false, {
                                fileName: "[project]/app/components/ChatBox.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ChatBox.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ChatBox.tsx",
                lineNumber: 106,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    flex: 1,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    paddingRight: 4,
                    marginBottom: 12
                },
                children: [
                    messages.map((msg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    maxWidth: "78%",
                                    padding: "14px 18px",
                                    borderRadius: 22,
                                    background: msg.role === "user" ? "linear-gradient(135deg,#38bdf8,#2563eb)" : "rgba(15,23,42,0.96)",
                                    color: "white",
                                    whiteSpace: "pre-wrap"
                                },
                                children: msg.text
                            }, void 0, false, {
                                fileName: "[project]/app/components/ChatBox.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this)
                        }, i, false, {
                            fileName: "[project]/app/components/ChatBox.tsx",
                            lineNumber: 133,
                            columnNumber: 11
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        ref: messagesEndRef
                    }, void 0, false, {
                        fileName: "[project]/app/components/ChatBox.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ChatBox.tsx",
                lineNumber: 121,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: message,
                        onChange: (e)=>setMessage(e.target.value),
                        placeholder: connected ? "Ask Shiva..." : "Connecting to WebSocket...",
                        disabled: !connected,
                        style: {
                            flex: 1,
                            padding: "14px",
                            borderRadius: 16,
                            border: "1px solid rgba(148,163,184,0.2)",
                            background: "rgba(15,23,42,0.95)",
                            color: "white",
                            outline: "none",
                            opacity: connected ? 1 : 0.6
                        },
                        onKeyDown: (e)=>{
                            if (e.key === "Enter") sendMessage();
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/ChatBox.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: sendMessage,
                        disabled: !connected || loading,
                        style: {
                            padding: "0 18px",
                            borderRadius: 16,
                            border: "none",
                            background: "#38bdf8",
                            fontWeight: 700,
                            cursor: !connected || loading ? "not-allowed" : "pointer",
                            opacity: !connected || loading ? 0.6 : 1
                        },
                        children: "Send"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ChatBox.tsx",
                        lineNumber: 184,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/ChatBox.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/ChatBox.tsx",
        lineNumber: 86,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/components/ShivaBackground.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShivaBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
function ShivaBackground() {
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("❌ Canvas not found");
            return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("❌ Canvas context not found");
            return;
        }
        console.log("✅ Canvas initialized", {
            width: window.innerWidth,
            height: window.innerHeight
        });
        let w = canvas.width = window.innerWidth;
        let h = canvas.height = window.innerHeight;
        let animationId;
        const resize = ()=>{
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        const particles = Array.from({
            length: 120
        }).map(()=>({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 2.2,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4
            }));
        let frame = 0;
        let trishulLoaded = false;
        let trishulLoadError = false;
        const trishulImg = new Image();
        trishulImg.crossOrigin = "anonymous";
        trishulImg.src = "/trishul.svg";
        trishulImg.onload = ()=>{
            trishulLoaded = true;
            console.log("✅ Trishul loaded successfully");
        };
        trishulImg.onerror = ()=>{
            trishulLoadError = true;
            console.error("❌ Trishul failed to load");
        };
        const drawTrishul = (x, y, glow)=>{
            ctx.save();
            const haloRadius = 220;
            const halo = ctx.createRadialGradient(x, y, 16, x, y, haloRadius);
            halo.addColorStop(0, `rgba(0,255,255,${0.45 + glow * 0.3})`);
            halo.addColorStop(0.25, `rgba(0,180,255,${0.2 + glow * 0.18})`);
            halo.addColorStop(0.7, `rgba(0,100,255,${0.08 + glow * 0.12})`);
            halo.addColorStop(1, "rgba(0,0,0,0)");
            ctx.globalCompositeOperation = "lighter";
            ctx.fillStyle = halo;
            ctx.beginPath();
            ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
            ctx.fill();
            // Draw glow/shadow effect
            ctx.shadowColor = "rgba(0,255,255,0.9)";
            ctx.shadowBlur = 32 + glow * 40;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            // Draw trishul SVG image with invert filter
            if (trishulLoaded && !trishulLoadError) {
                ctx.globalCompositeOperation = "lighter";
                ctx.globalAlpha = 0.85 + glow * 0.15;
                ctx.filter = "invert(1) brightness(1.2)";
                const size = 220;
                ctx.drawImage(trishulImg, x - size / 2, y - size / 2, size, size);
                ctx.filter = "none";
            }
            ctx.shadowBlur = 0;
            ctx.restore();
        };
        const drawOm = (x, y, size)=>{
            ctx.save();
            ctx.globalAlpha = 0.35;
            ctx.fillStyle = "cyan";
            ctx.font = `${size}px serif`;
            ctx.fillText("ॐ", x, y);
            ctx.restore();
        };
        const animate = ()=>{
            frame++;
            // Clear canvas with proper composite operation
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "#02040a";
            ctx.fillRect(0, 0, w, h);
            const cx = w / 2;
            const cy = h / 2;
            const glow = 0.28 + Math.sin(frame * 0.08) * 0.08;
            // Draw concentric rings first
            ctx.globalCompositeOperation = "lighter";
            for(let i = 0; i < 4; i++){
                const radius = (frame * 0.8 + i * 120) % 500;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0,255,255,${0.12 - i * 0.03})`;
                ctx.lineWidth = 1.5;
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.stroke();
            }
            // Draw particles
            ctx.globalCompositeOperation = "lighter";
            for (const p of particles){
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;
                ctx.beginPath();
                ctx.fillStyle = "rgba(0,255,255,0.5)";
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
            // Draw trishul with glow (must be after particles to layer correctly)
            drawTrishul(cx, cy, glow);
            // Draw occasional Om symbols
            if (frame % 60 === 0) {
                ctx.globalCompositeOperation = "source-over";
                drawOm(Math.random() * w, Math.random() * h, 22);
            }
            animationId = requestAnimationFrame(animate);
        };
        animate();
        return ()=>{
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        style: {
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            display: "block",
            background: "#000"
        }
    }, void 0, false, {
        fileName: "[project]/app/components/ShivaBackground.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/tty [external] (tty, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/http2 [external] (http2, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[project]/app/hooks/useDeviceTracking.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDeviceTracking",
    ()=>useDeviceTracking
]);
/**
 * Hook to manage device tracking and UUID creation
 * Call this in your root layout or app component to initialize tracking
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function useDeviceTracking() {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        isInitialized: false,
        uuid: null,
        ip: null,
        error: null
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Only run on client side
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const initializeTracking = undefined;
    }, []);
    return state;
}
/**
 * Get the client's IP address by calling an IP detection service
 * Falls back to a simple value if detection fails
 */ async function getClientIP() {
    try {
        // Try using a public IP detection API
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("https://api.ipify.org?format=json", {
            timeout: 5000
        });
        return response.data.ip;
    } catch (error) {
        console.warn("Failed to get IP from ipify, using fallback method:", error);
        try {
            // Fallback to another service
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].get("https://ifconfig.me/", {
                timeout: 5000
            });
            return response.data.trim();
        } catch (fallbackError) {
            console.warn("Failed to get IP from ifconfig.me:", fallbackError);
            // Return a placeholder if both fail
            return "unknown";
        }
    }
}
}),
"[project]/app/components/DeviceTrackingProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeviceTrackingProvider",
    ()=>DeviceTrackingProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
/**
 * Client component to initialize device tracking
 * This should be placed in the root layout to ensure tracking is initialized on app load
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useDeviceTracking$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useDeviceTracking.ts [app-ssr] (ecmascript)");
"use client";
;
;
function DeviceTrackingProvider({ children }) {
    const trackingState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useDeviceTracking$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDeviceTracking"])();
    // Log tracking state (useful for debugging)
    if (trackingState.isInitialized && trackingState.uuid) {
        console.log("Device Tracking Initialized:", {
            uuid: trackingState.uuid,
            ip: trackingState.ip
        });
    }
    if (trackingState.error) {
        console.warn("Device Tracking Error:", trackingState.error);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__08njc9s._.js.map