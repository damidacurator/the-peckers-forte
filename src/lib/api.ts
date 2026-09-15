import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        // Only redirect if not already on login/register/public pages
        const path = window.location.pathname;
        if (!path.startsWith("/login") && !path.startsWith("/register") && !path.startsWith("/forgot")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export const get = async <T>(url: string) => {
  const response = await api.get<T>(url);
  return response.data;
};

export const post = async <T>(url: string, data?: any) => {
  const response = await api.post<T>(url, data);
  return response.data;
};

export const put = async <T>(url: string, data?: any) => {
  const response = await api.put<T>(url, data);
  return response.data;
};

export const del = async <T>(url: string) => {
  const response = await api.delete<T>(url);
  return response.data;
};

export const upload = async <T>(url: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<T>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
