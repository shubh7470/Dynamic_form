// src/api/services/authService.ts
import api from "../axiosInstance";
import ENDPOINTS from "../endpoints";

export const loginAPI = (data: { email: string; password: string }) => {
  return api.post(ENDPOINTS.LOGIN, data);
};
export const logoutAPI = () => {
  return api.post(ENDPOINTS.LOGOUT);
};
export const refreshAccessTokenAPI = () => {
  return api.post(ENDPOINTS.REFRESH_ACCESS_TOKEN);
};
