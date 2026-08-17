import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "@/types";
import {
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
} from "@/lib/utils/persistence";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = loadFromStorage<AuthState>(STORAGE_KEYS.auth, {
  user: null,
  isAuthenticated: false,
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      saveToStorage(STORAGE_KEYS.auth, state);
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      saveToStorage(STORAGE_KEYS.auth, state);
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
