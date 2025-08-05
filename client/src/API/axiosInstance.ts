import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { baseUrl } from "@/utils/config";
import { refreshAccessTokenAPI } from "./services/authService";
import { persistor, store } from "@/store";
import { logout } from "@/reducer/auth";
import { isTokenExpired } from "@/utils/checkSetin";

let isRefreshing = false;

type FailedRequest = {
  resolve: (value?: string) => void;
  reject: (error?: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token ?? undefined);
    }
  });
  failedQueue = [];
};

const refreshToken = async (): Promise<string> => {
  try {
    const res = await refreshAccessTokenAPI();

    if (res.status === 200) {
      const newToken = res.data.data.accessToken;
      localStorage.setItem("token", newToken);
      api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
      processQueue(null, newToken);
      return newToken;
    }

    throw new Error("Failed to refresh token");
  } catch (err) {
    processQueue(err, null);
    localStorage.clear();
    persistor.purge();
    store.dispatch(logout());
    window.location.replace("/login");
    throw err;
  } finally {
    isRefreshing = false;
  }
};

const api: AxiosInstance = axios.create({
  baseURL: baseUrl || "http://localhost:4000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // Define public endpoints that don't require authentication
  const publicEndpoints = ['/dynamic-forms'];
  
  // Check if this is a public endpoint
  const isPublicEndpoint = publicEndpoints.some(endpoint => 
    config.url?.includes(endpoint)
  );

  // For public endpoints, skip authentication
  if (isPublicEndpoint) {
    return config;
  }

  // Only add token if it exists and the request is not to a public endpoint
  const token = localStorage.getItem("token");

  // If no token exists, proceed with the request without authentication
  if (!token) {
    return config;
  }

  // If token exists but is expired, try to refresh it
  if (isTokenExpired(token)) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshToken();
        if (config.headers) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      } catch (err) {
        return config;
      }
    } else {
      // Wait for the refresh to finish and queue the request
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (newToken?: string) => {
            if (config.headers && newToken) {
              config.headers.Authorization = `Bearer ${newToken}`;
            }
            resolve(config);
          },
          reject,
        });
      });
    }
  } else {
    // Token is valid, add it to the request
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    // Log the error for debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.config?.headers,
    });

    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Define public endpoints that don't require authentication
    const publicEndpoints = ['/dynamic-forms'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      originalRequest.url?.includes(endpoint)
    );

    // If the error is 401 or 403 and it's NOT a public endpoint, clear the token and redirect to login
    if ((error.response?.status === 401 || error.response?.status === 403) && !isPublicEndpoint) {
      localStorage.clear();
      persistor.purge();
      store.dispatch(logout());
      window.location.replace("/login");
      return Promise.reject(error);
    }

    // For public endpoints with auth errors, just continue
    if ((error.response?.status === 401 || error.response?.status === 403) && isPublicEndpoint) {
      return Promise.reject(error);
    }

    // Handle token refresh for 410 status
    if (error.response?.status === 410 && !originalRequest._retry && !isPublicEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers && token) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
