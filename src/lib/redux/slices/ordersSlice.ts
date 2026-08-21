import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order, OrderStatus } from "@/types";
import { saveToStorage, STORAGE_KEYS } from "@/lib/utils/persistence";
import seedOrders from "@/data/orders.json";

interface OrdersState {
  items: Order[];
}

const initialState: OrdersState = {
  items: seedOrders as Order[],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    hydrate(state, action: PayloadAction<Order[]>) {
      state.items = action.payload;
    },
    updateOrderStatus(
      state,
      action: PayloadAction<{ id: string; status: OrderStatus; note?: string }>,
    ) {
      const order = state.items.find((o) => o.id === action.payload.id);
      if (!order) return;
      order.status = action.payload.status;
      order.updatedAt = new Date().toISOString();
      order.timeline.push({
        status: action.payload.status,
        timestamp: order.updatedAt,
        note: action.payload.note,
      });
      saveToStorage(STORAGE_KEYS.orders, state.items);
    },
    setOrders(state, action: PayloadAction<Order[]>) {
      state.items = action.payload;
      saveToStorage(STORAGE_KEYS.orders, state.items);
    },
  },
});

export const { hydrate, updateOrderStatus, setOrders } = ordersSlice.actions;
export default ordersSlice.reducer;