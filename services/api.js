import * as SecureStore from 'expo-secure-store';

const API_BASE = "http://192.168.100.25:8000/api";

export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Login failed");
  }

  await SecureStore.setItemAsync("access", data.access);
  await SecureStore.setItemAsync("refresh", data.refresh);

  return data;
}

export async function fetchLessons() {
  const res = await fetch(`${API_BASE}/lessons/`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch lessons");
  }

  return data;
}