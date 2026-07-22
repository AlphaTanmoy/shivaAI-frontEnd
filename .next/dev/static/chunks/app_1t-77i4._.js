(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/ChatBox.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatBox
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const WS_URL = "ws://localhost:9669/ws/chat";
function ChatBox() {
    _s();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [connected, setConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [connectionError, setConnectionError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const socketRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatBox.useEffect": ()=>{
            const ws = new WebSocket(WS_URL);
            ws.onopen = ({
                "ChatBox.useEffect": ()=>{
                    console.log("🔥 WebSocket Connected");
                    setConnected(true);
                    setConnectionError(null);
                }
            })["ChatBox.useEffect"];
            ws.onmessage = ({
                "ChatBox.useEffect": (event)=>{
                    setMessages({
                        "ChatBox.useEffect": (prev)=>[
                                ...prev,
                                {
                                    role: "bot",
                                    text: event.data
                                }
                            ]
                    }["ChatBox.useEffect"]);
                    setLoading(false);
                }
            })["ChatBox.useEffect"];
            ws.onclose = ({
                "ChatBox.useEffect": (event)=>{
                    console.log("❌ WebSocket Disconnected", event);
                    setConnected(false);
                    setConnectionError(`WebSocket disconnected (${event.code}${event.reason ? `: ${event.reason}` : ""}). Refresh to reconnect.`);
                    setLoading(false);
                }
            })["ChatBox.useEffect"];
            ws.onerror = ({
                "ChatBox.useEffect": (event)=>{
                    console.error("WebSocket error", event);
                    setConnectionError("WebSocket error occurred. Confirm the backend is running and /ws/chat is reachable.");
                }
            })["ChatBox.useEffect"];
            socketRef.current = ws;
            return ({
                "ChatBox.useEffect": ()=>{
                    ws.close();
                }
            })["ChatBox.useEffect"];
        }
    }["ChatBox.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatBox.useEffect": ()=>{
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth"
            });
        }
    }["ChatBox.useEffect"], [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    marginBottom: 14
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    messages.map((msg, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                display: "flex",
                                justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    display: "flex",
                    gap: 10
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
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
_s(ChatBox, "IF6/Mglo3TMih24L4HahPazpBfc=");
_c = ChatBox;
var _c;
__turbopack_context__.k.register(_c, "ChatBox");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/ShivaBackground.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShivaBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function ShivaBackground() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShivaBackground.useEffect": ()=>{
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
            const resize = {
                "ShivaBackground.useEffect.resize": ()=>{
                    w = canvas.width = window.innerWidth;
                    h = canvas.height = window.innerHeight;
                }
            }["ShivaBackground.useEffect.resize"];
            window.addEventListener("resize", resize);
            const particles = Array.from({
                length: 120
            }).map({
                "ShivaBackground.useEffect.particles": ()=>({
                        x: Math.random() * w,
                        y: Math.random() * h,
                        r: Math.random() * 2.2,
                        dx: (Math.random() - 0.5) * 0.4,
                        dy: (Math.random() - 0.5) * 0.4
                    })
            }["ShivaBackground.useEffect.particles"]);
            let frame = 0;
            let trishulLoaded = false;
            let trishulLoadError = false;
            const trishulImg = new Image();
            trishulImg.crossOrigin = "anonymous";
            trishulImg.src = "/trishul.svg";
            trishulImg.onload = ({
                "ShivaBackground.useEffect": ()=>{
                    trishulLoaded = true;
                    console.log("✅ Trishul loaded successfully");
                }
            })["ShivaBackground.useEffect"];
            trishulImg.onerror = ({
                "ShivaBackground.useEffect": ()=>{
                    trishulLoadError = true;
                    console.error("❌ Trishul failed to load");
                }
            })["ShivaBackground.useEffect"];
            const drawTrishul = {
                "ShivaBackground.useEffect.drawTrishul": (x, y, glow)=>{
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
                }
            }["ShivaBackground.useEffect.drawTrishul"];
            const drawOm = {
                "ShivaBackground.useEffect.drawOm": (x, y, size)=>{
                    ctx.save();
                    ctx.globalAlpha = 0.35;
                    ctx.fillStyle = "cyan";
                    ctx.font = `${size}px serif`;
                    ctx.fillText("ॐ", x, y);
                    ctx.restore();
                }
            }["ShivaBackground.useEffect.drawOm"];
            const animate = {
                "ShivaBackground.useEffect.animate": ()=>{
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
                }
            }["ShivaBackground.useEffect.animate"];
            animate();
            return ({
                "ShivaBackground.useEffect": ()=>{
                    window.removeEventListener("resize", resize);
                    cancelAnimationFrame(animationId);
                }
            })["ShivaBackground.useEffect"];
        }
    }["ShivaBackground.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
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
_s(ShivaBackground, "UJgi7ynoup7eqypjnwyX/s32POg=");
_c = ShivaBackground;
var _c;
__turbopack_context__.k.register(_c, "ShivaBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/device-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
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
        timezone
    });
    return {
        userAgent,
        platform,
        language,
        screenResolution,
        timezone,
        deviceFingerprint
    };
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/storage-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions to manage localStorage safely
 */ __turbopack_context__.s([
    "clearSessionData",
    ()=>clearSessionData,
    "getStoredSessionData",
    ()=>getStoredSessionData,
    "saveSessionData",
    ()=>saveSessionData,
    "updateLastUpdatedAt",
    ()=>updateLastUpdatedAt,
    "updateSessionUUID",
    ()=>updateSessionUUID
]);
const STORAGE_KEY = "shiva_session_data";
function getStoredSessionData() {
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return null;
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
    }
}
function saveSessionData(data) {
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Error writing to localStorage:", error);
    }
}
function clearSessionData() {
    try {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing localStorage:", error);
    }
}
function updateSessionUUID(newUUID, newIP, newDeviceInfo) {
    const now = new Date().toISOString();
    const sessionData = {
        uuid: newUUID,
        ip: newIP,
        deviceInfo: newDeviceInfo,
        createdAt: now,
        lastUpdatedAt: now
    };
    saveSessionData(sessionData);
}
function updateLastUpdatedAt() {
    const sessionData = getStoredSessionData();
    if (sessionData) {
        sessionData.lastUpdatedAt = new Date().toISOString();
        saveSessionData(sessionData);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/lib/uuid-utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * UUID generation utility
 */ /**
 * Generate a v4 UUID
 */ __turbopack_context__.s([
    "generateUUID",
    ()=>generateUUID
]);
function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/hooks/useDeviceTracking.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDeviceTracking",
    ()=>useDeviceTracking
]);
/**
 * Hook to manage device tracking and UUID creation
 * Call this in your root layout or app component to initialize tracking
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$device$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/device-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$storage$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/storage-utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$uuid$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/uuid-utils.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function useDeviceTracking() {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isInitialized: false,
        uuid: null,
        ip: null,
        error: null
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDeviceTracking.useEffect": ()=>{
            // Only run on client side
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            const initializeTracking = {
                "useDeviceTracking.useEffect.initializeTracking": async ()=>{
                    try {
                        // Get current device information
                        const currentDeviceInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$device$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeviceInfo"])();
                        // Get client IP address
                        const ip = await getClientIP();
                        // Get stored session data
                        const storedData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$storage$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoredSessionData"])();
                        // Call API to check if new UUID is needed
                        const checkResponse = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("/api/check-uuid", {
                            currentIP: ip,
                            deviceInfo: currentDeviceInfo,
                            existingIP: storedData?.ip,
                            existingDeviceInfo: storedData?.deviceInfo
                        });
                        const { needsNewUUID } = checkResponse.data;
                        let sessionData;
                        if (needsNewUUID) {
                            // Create new UUID
                            const newUUID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$uuid$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateUUID"])();
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$storage$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateSessionUUID"])(newUUID, ip, currentDeviceInfo);
                            sessionData = {
                                uuid: newUUID,
                                ip,
                                deviceInfo: currentDeviceInfo,
                                createdAt: new Date().toISOString(),
                                lastUpdatedAt: new Date().toISOString()
                            };
                        } else {
                            // Keep existing UUID, just update timestamp
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$storage$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateLastUpdatedAt"])();
                            sessionData = storedData;
                        }
                        setState({
                            isInitialized: true,
                            uuid: sessionData.uuid,
                            ip: sessionData.ip,
                            error: null
                        });
                    } catch (error) {
                        console.error("Error initializing device tracking:", error);
                        // Fallback: create a new UUID if API fails
                        try {
                            const currentDeviceInfo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$device$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDeviceInfo"])();
                            const ip = await getClientIP();
                            const newUUID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$uuid$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["generateUUID"])();
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$storage$2d$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateSessionUUID"])(newUUID, ip, currentDeviceInfo);
                            setState({
                                isInitialized: true,
                                uuid: newUUID,
                                ip,
                                error: "Failed to check UUID status, created new UUID as fallback"
                            });
                        } catch (fallbackError) {
                            console.error("Fallback error:", fallbackError);
                            setState({
                                isInitialized: false,
                                uuid: null,
                                ip: null,
                                error: "Failed to initialize device tracking"
                            });
                        }
                    }
                }
            }["useDeviceTracking.useEffect.initializeTracking"];
            initializeTracking();
        }
    }["useDeviceTracking.useEffect"], []);
    return state;
}
_s(useDeviceTracking, "EcHLmGN3iVesqT1O6VwMf8ejvks=");
/**
 * Get the client's IP address by calling an IP detection service
 * Falls back to a simple value if detection fails
 */ async function getClientIP() {
    try {
        // Try using a public IP detection API
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("https://api.ipify.org?format=json", {
            timeout: 5000
        });
        return response.data.ip;
    } catch (error) {
        console.warn("Failed to get IP from ipify, using fallback method:", error);
        try {
            // Fallback to another service
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("https://ifconfig.me/", {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/components/DeviceTrackingProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DeviceTrackingProvider",
    ()=>DeviceTrackingProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * Client component to initialize device tracking
 * This should be placed in the root layout to ensure tracking is initialized on app load
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useDeviceTracking$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useDeviceTracking.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function DeviceTrackingProvider({ children }) {
    _s();
    const trackingState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useDeviceTracking$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeviceTracking"])();
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(DeviceTrackingProvider, "atxr3wqRQmi+7DrEOo6hfI2iSRI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useDeviceTracking$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDeviceTracking"]
    ];
});
_c = DeviceTrackingProvider;
var _c;
__turbopack_context__.k.register(_c, "DeviceTrackingProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_1t-77i4._.js.map