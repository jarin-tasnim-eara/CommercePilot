import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { StaffMember } from "@/types";
import { saveToStorage, STORAGE_KEYS } from "@/lib/utils/persistence";
import seedStaff from "@/data/staff.json";

interface StaffState {
  items: StaffMember[];
}

const initialState: StaffState = {
  items: seedStaff as StaffMember[],
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<StaffMember[]>) {
      state.items = action.payload;
    },
    addStaff(state, action: PayloadAction<StaffMember>) {
      state.items.push(action.payload);
      saveToStorage(STORAGE_KEYS.staff, state.items);
    },
    updateStaffStatus(
      state,
      action: PayloadAction<{ id: string; status: StaffMember["status"] }>,
    ) {
      const member = state.items.find((s) => s.id === action.payload.id);
      if (!member) return;
      member.status = action.payload.status;
      saveToStorage(STORAGE_KEYS.staff, state.items);
    },
  },
});

export const { hydrate, addStaff, updateStaffStatus } = staffSlice.actions;
export default staffSlice.reducer;