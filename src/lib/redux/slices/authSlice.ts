import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "@/types";
import { saveToStorage, STORAGE_KEYS } from "@/lib/utils/persistence";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrate(
      state,
      action: PayloadAction<{
        user: AuthUser | null;
        isAuthenticated: boolean;
      }>,
    ) {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.hydrated = true;
    },
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.hydrated = true;
      saveToStorage(STORAGE_KEYS.auth, {
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      });
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      saveToStorage(STORAGE_KEYS.auth, {
        user: null,
        isAuthenticated: false,
      });
    },
  },
});

export const { hydrate, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;