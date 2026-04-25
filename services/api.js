import * as SecureStore from 'expo-secure-store';

const API_BASE = "http://192.168.100.25:8000/api";

export async function getStoredToken() {
  return await SecureStore.getItemAsync("access");
}

async function getAuthHeaders() {
  const token = await SecureStore.getItemAsync("access");

  if (!token) {
    throw new Error("No access token. Please log in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// PROFILE
export async function fetchProfile() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/profile/`, { headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch profile");
  }

  return data;
}

// LOGIN
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

// LESSONS
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

// BOOKINGS
export async function createBooking(lessonId) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/bookings/create/`, {
    method: "POST",
    headers,
    body: JSON.stringify({ lesson: lessonId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to create booking");
  }

  return data;
}

export async function fetchMyBookings() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/my-bookings/`, { headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch bookings");
  }

  return data;
}

export async function fetchTeacherBookings() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/teacher-bookings/`, { headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch teacher bookings");
  }

  return data;
}

export async function updateBookingStatus(id, status) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/booking/${id}/update/`, {
    method: "POST",
    headers,
    body: JSON.stringify({ status }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update booking");
  }

  return data;
}

// ENROLLMENTS (new)
export async function fetchMyEnrollments() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/my-enrollments/`, { headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch enrollments");
  }

  return data;
}

// LOGOUT
export async function logoutUser() {
  await SecureStore.deleteItemAsync('access');
  await SecureStore.deleteItemAsync('refresh');
}


// REGISTER
export async function registerUser(username, email, password, password2, role = 'student') {
  const res = await fetch(`${API_BASE}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      email,
      password,
      password2,
      role,
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error ||
      data.username ||
      data.password ||
      "Registration failed"
    );
  }

  return data;
}


// UPDATE PROFILE
export async function updateProfile(username, email) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/profile/update/`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ username, email }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update profile");
  }

  return data;
}


// CREATE LESSON
export async function createLesson(data) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/lessons/create/`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to create lesson");
  }

  return result;
}


// LESSON OPTIONS
export async function fetchMyLessons() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/my-lessons/`, { headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch my lessons");
  }

  return data;
}


// API HELPER
export async function updateLesson(id, data) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_BASE}/lessons/${id}/update/`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Failed to update lesson");
  }

  return result;
}