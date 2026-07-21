"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

const WS_URL = "ws://localhost:8080/ws/chat";

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("🔥 WebSocket Connected");
      setConnected(true);
      setConnectionError(null);
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, { role: "bot", text: event.data }]);
      setLoading(false);
    };

    ws.onclose = (event) => {
      console.log("❌ WebSocket Disconnected", event);
      setConnected(false);
      setConnectionError(
        `WebSocket disconnected (${event.code}${event.reason ? `: ${event.reason}` : ""}). Refresh to reconnect.`
      );
      setLoading(false);
    };

    ws.onerror = (event) => {
      console.error("WebSocket error", event);
      setConnectionError(
        "WebSocket error occurred. Confirm the backend is running and /ws/chat is reachable."
      );
    };

    socketRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setConnectionError("WebSocket not connected.");
      console.error("WebSocket not connected");
      return;
    }

    const payload = JSON.stringify({ message: trimmed });
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setMessage("");
    setLoading(true);
    setError(null);

    ws.send(payload);
  };

  return (
    <div
      style={{
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
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ color: "#7dfcff", fontSize: 17, fontWeight: 700 }}>
          ShivaGPT (WS)
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
            Real-time divine connection 🔱
          </div>
          <div style={{ color: connectionError ? "#f87171" : connected ? "#34d399" : "#fbbf24", fontSize: 12 }}>
            {connectionError ?? (connected ? (loading ? "Sending..." : "Connected") : "Connecting...")}
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          paddingRight: 4,
          marginBottom: 12,
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "78%",
                padding: "14px 18px",
                borderRadius: 22,
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg,#38bdf8,#2563eb)"
                    : "rgba(15,23,42,0.96)",
                color: "white",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={connected ? "Ask Shiva..." : "Connecting to WebSocket..."}
          disabled={!connected}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: 16,
            border: "1px solid rgba(148,163,184,0.2)",
            background: "rgba(15,23,42,0.95)",
            color: "white",
            outline: "none",
            opacity: connected ? 1 : 0.6,
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          disabled={!connected || loading}
          style={{
            padding: "0 18px",
            borderRadius: 16,
            border: "none",
            background: "#38bdf8",
            fontWeight: 700,
            cursor: !connected || loading ? "not-allowed" : "pointer",
            opacity: !connected || loading ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}