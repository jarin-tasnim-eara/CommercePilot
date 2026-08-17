import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StaffMember } from "@/types";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "@/lib/utils/persistence";
import seedStaff from "@/data/staff.json";

interface StaffState {
  items: StaffMember[];
}

const initialState: StaffState = {
  items: loadFromStorage<StaffMember[]>(STORAGE_KEYS.staff, seedStaff as StaffMember[]),
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    addStaff(state, action: PayloadAction<StaffMember>) {
      state.items.push(action.payload);
      saveToStorage(STORAGE_KEYS.staff, state.items);
    },
    updateStaffStatus(
      state,
      action: PayloadAction<{ id: string; status: StaffMember["status"] }>
    ) {
      const member = state.items.find((s) => s.id === action.payload.id);
      if (!member) return;
      member.status = action.payload.status;
      saveToStorage(STORAGE_KEYS.staff, state.items);
    },
  },
});

export const { addStaff, updateStaffStatus } = staffSlice.actions;
export default staffSlice.reducer;
