import * as SecureStore from 'expo-secure-store';

const API_BASE = "http://192.168.100.36:8000/api";

export async function fetchProfile() {
  const token = await SecureStore.getItemAsync("access");

  if (!token) {
    throw new Error("No access token. Please log in first.");
  }

  const res = await fetch(`${API_BASE}/profile/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch profile");
  }

  return await res.json();
}

export async function getStoredToken() {
  return await SecureStore.getItemAsync('access');
}

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

export async function fetchLessonById(id) {
  const res = await fetch(`${API_BASE}/lessons/${id}/`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch lesson details");
  }

  return data;
}

export async function createBooking(lessonId) {
  const token = await SecureStore.getItemAsync("access");

  if (!token) {
    router.replace("/login");
    return;
  }  

  const res = await fetch(`${API_BASE}/bookings/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ lesson: lessonId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create booking");
  }

  return data;
}

export async function fetchMyBookings() {
  const token = await SecureStore.getItemAsync("access");

  const res = await fetch(`${API_BASE}/my-bookings/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch bookings");
  }

  return data;
}

export async function fetchTeacherBookings() {
  const token = await SecureStore.getItemAsync("access");

  const res = await fetch(`${API_BASE}/teacher-bookings/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Failed to fetch teacher bookings");
  }

  return data;
}

export async function updateBookingStatus(id, status) {
  const token = await SecureStore.getItemAsync("access");

  const res = await fetch(`${API_BASE}/booking/${id}/update/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update booking");
  }

  return data;
}

export async function logoutUser() {
  await SecureStore.deleteItemAsync('access');
  await SecureStore.deleteItemAsync('refresh');
}