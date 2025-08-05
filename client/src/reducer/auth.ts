// store/authSlice.ts
import type { User } from "@/utils/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// adjust the path as needed

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        isAuthenticated: boolean;
        user: User;
        role: string;
      }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
