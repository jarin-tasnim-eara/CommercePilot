import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadFromStorage,saveToStorage,STORAGE_KEYS,} from "@/lib/utils/persistence";
type Theme = "light" | "dark";

interface PersistedUiState {
  sidebarCollapsed: boolean;
  theme: Theme;
}

interface UiState extends PersistedUiState {
  mobileNavOpen: boolean;
}

const persisted = loadFromStorage<PersistedUiState>(STORAGE_KEYS.ui, {
  sidebarCollapsed: false,
  theme: "light",
});

const initialState: UiState = {
  ...persisted,
  mobileNavOpen: false,
};

function persist(state: UiState) {
  saveToStorage<PersistedUiState>(STORAGE_KEYS.ui, {
    sidebarCollapsed: state.sidebarCollapsed,
    theme: state.theme,
  });
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
      persist(state);
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload;
      persist(state);
    },
    openMobileNav(state) {
      state.mobileNavOpen = true;
    },
    closeMobileNav(state) {
      state.mobileNavOpen = false;
    },
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
  },
});

export const {
  toggleSidebar,
  setTheme,
  openMobileNav,
  closeMobileNav,
  toggleMobileNav,
} = uiSlice.actions;
export default uiSlice.reducer;