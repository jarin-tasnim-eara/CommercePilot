import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "@/types";
import { saveToStorage, STORAGE_KEYS } from "@/lib/utils/persistence";
import seedCustomers from "@/data/customers.json";

interface CustomersState {
  items: Customer[];
}

const initialState: CustomersState = {
  items: seedCustomers as Customer[],
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<Customer[]>) {
      state.items = action.payload;
    },
    updateCustomerStatus(
      state,
      action: PayloadAction<{ id: string; status: Customer["status"] }>,
    ) {
      const customer = state.items.find((c) => c.id === action.payload.id);
      if (!customer) return;
      customer.status = action.payload.status;
      saveToStorage(STORAGE_KEYS.customers, state.items);
    },
  },
});

export const { hydrate, updateCustomerStatus } = customersSlice.actions;
export default customersSlice.reducer;