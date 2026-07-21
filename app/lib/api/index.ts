export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export const endpoints = {
  chat: `${API_BASE_URL}/api/chat`,
  // Add additional endpoints here as needed:
  // login: `${API_BASE_URL}/api/login`,
  // status: `${API_BASE_URL}/api/status`,
};
