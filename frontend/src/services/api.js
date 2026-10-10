
import axios from "axios";

// Get the backend URL from the frontend .env file
const BACKEND_URL = import.meta.env.VITE_API_URL || "";

// Remove the last "/" if the URL has one
export const apiOrigin = BACKEND_URL.endsWith("/")
  ? BACKEND_URL.slice(0, -1)
  : BACKEND_URL;

// Create Axios so we can easily send requests to the backend
export const api = axios.create({
  baseURL: `${apiOrigin}/api`,
});

// Admin credentials live only for the current browser session.
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("ijaaboAdminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      sessionStorage.removeItem("ijaaboAdminToken");
      window.dispatchEvent(new Event("ijaabo:admin-session-expired"));
    }
    return Promise.reject(error);
  },
);

// Get the full URL of an image uploaded to the backend
export function getImageUrl(path) {
  // If there is no image path, return an empty string
  if (!path) {
    return "";
  }

  // If the image already has a full URL, use it as it is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Add the backend URL to the image path
  if (!path.startsWith("/")) {
    path = "/" + path;
  }

  return apiOrigin + path;
}
