export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9669";

export const getWebSocketUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_WS_URL?.trim();
  if (configuredUrl) {
    return configuredUrl;
  }

  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL).trim();
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");

  if (/^https:\/\//i.test(normalizedBaseUrl)) {
    return `${normalizedBaseUrl.replace(/^https:\/\//i, "wss://")}/ws/chat`;
  }

  if (/^http:\/\//i.test(normalizedBaseUrl)) {
    return `${normalizedBaseUrl.replace(/^http:\/\//i, "ws://")}/ws/chat`;
  }

  return `${normalizedBaseUrl}/ws/chat`;
};

export const endpoints = {
  chat: `${API_BASE_URL}/api/chat`,
  // Add additional endpoints here as needed:
  // login: `${API_BASE_URL}/api/login`,
  // status: `${API_BASE_URL}/api/status`,
};
