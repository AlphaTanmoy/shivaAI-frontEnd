"use client";

import { useEffect, useRef, useState } from "react";
import { endpoints } from "@/app/lib/api";

type Message = {
  role: "user" | "bot";
  text: string;
};

type ChatApiResponse = {
  message?: string;
  text?: string;
  reply?: string;
  content?: string;
};

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const extractBotText = (payload: ChatApiResponse | string | null | undefined) => {
    if (!payload) return "No response received.";

    if (typeof payload === "string") {
      return payload;
    }

    return payload.message ?? payload.text ?? payload.reply ?? payload.content ?? "No response received.";
  };

  const sendMessage = async () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setMessage("");
    setLoading(true);
    setConnectionError(null);
    setConnected(true);

    try {
      const response = await fetch(endpoints.chat, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as ChatApiResponse;
      const botText = extractBotText(data);
      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (error) {
      console.error("Chat request failed", error);
      setConnectionError("Unable to reach the chat backend. Check that your Spring app is running on port 9669.");
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Sorry, I couldn’t reach the chat service right now." },
      ]);
    } finally {
      setLoading(false);
    }
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
          ShivaGPT
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 12 }}>
            REST chat connection 🔱
          </div>
          <div style={{ color: connectionError ? "#f87171" : connected ? "#34d399" : "#fbbf24", fontSize: 12 }}>
            {connectionError ?? (loading ? "Sending..." : "Connected")}
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
          placeholder="Ask Shiva..."
          disabled={loading}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: 16,
            border: "1px solid rgba(148,163,184,0.2)",
            background: "rgba(15,23,42,0.95)",
            color: "white",
            outline: "none",
            opacity: 1,
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: "0 18px",
            borderRadius: 16,
            border: "none",
            background: "#38bdf8",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}