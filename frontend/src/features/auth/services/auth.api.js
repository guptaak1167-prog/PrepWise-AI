
import axios from "axios";

// Create a reusable Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Register user
export async function Register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.error(
      "Registration failed:",
      err.response?.data || err.message
    );
    throw err;
  }
}

// Login user
export async function Login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.error(
      "Login failed:",
      err.response?.data || err.message
    );
    throw err;
  }
}

// Logout user
export async function Logout() {
  try {
    const response = await api.post("/api/auth/logout");

    return response.data;
  } catch (err) {
    console.error(
      "Logout failed:",
      err.response?.data || err.message
    );
    throw err;
  }
}

// Get logged-in user
export const getMe = async () => {
  const response = await api.get('/api/auth/get-me');
  return response.data;
};
