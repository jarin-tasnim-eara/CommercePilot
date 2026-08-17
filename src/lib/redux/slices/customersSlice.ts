import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "@/types";
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from "@/lib/utils/persistence";
import seedCustomers from "@/data/customers.json";

interface CustomersState {
  items: Customer[];
}

const initialState: CustomersState = {
  items: loadFromStorage<Customer[]>(STORAGE_KEYS.customers, seedCustomers as Customer[]),
};

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    updateCustomerStatus(
      state,
      action: PayloadAction<{ id: string; status: Customer["status"] }>
    ) {
      const customer = state.items.find((c) => c.id === action.payload.id);
      if (!customer) return;
      customer.status = action.payload.status;
      saveToStorage(STORAGE_KEYS.customers, state.items);
    },
  },
});

export const { updateCustomerStatus } = customersSlice.actions;
export default customersSlice.reducer;
