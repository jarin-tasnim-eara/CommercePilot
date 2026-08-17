import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import ordersReducer from "./slices/ordersSlice";
import customersReducer from "./slices/customersSlice";
import staffReducer from "./slices/staffSlice";
import { productsApi } from "./api/productsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    orders: ordersReducer,
    customers: customersReducer,
    staff: staffReducer,
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
