"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { loadFromStorage, STORAGE_KEYS } from "@/lib/utils/persistence";
import { hydrate as hydrateAuth } from "@/lib/redux/slices/authSlice";
import { hydrate as hydrateUi } from "@/lib/redux/slices/uiSlice";
import { hydrate as hydrateOrders } from "@/lib/redux/slices/ordersSlice";
import { hydrate as hydrateCustomers } from "@/lib/redux/slices/customersSlice";
import { hydrate as hydrateStaff } from "@/lib/redux/slices/staffSlice";
import { AuthUser, Customer, Order, StaffMember } from "@/types";
import seedOrders from "@/data/orders.json";
import seedCustomers from "@/data/customers.json";
import seedStaff from "@/data/staff.json";

interface PersistedUiState {
  sidebarCollapsed: boolean;
  theme: "light" | "dark";
}

interface PersistedAuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export default function StoreHydrator() {
  const dispatch = useAppDispatch();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const ui = loadFromStorage<PersistedUiState>(STORAGE_KEYS.ui, {
      sidebarCollapsed: false,
      theme: "light",
    });
    dispatch(hydrateUi(ui));

    const orders = loadFromStorage<Order[]>(
      STORAGE_KEYS.orders,
      seedOrders as Order[],
    );
    dispatch(hydrateOrders(orders));

    const customers = loadFromStorage<Customer[]>(
      STORAGE_KEYS.customers,
      seedCustomers as Customer[],
    );
    dispatch(hydrateCustomers(customers));

    const staff = loadFromStorage<StaffMember[]>(
      STORAGE_KEYS.staff,
      seedStaff as StaffMember[],
    );
    dispatch(hydrateStaff(staff));

    const auth = loadFromStorage<PersistedAuthState>(STORAGE_KEYS.auth, {
      user: null,
      isAuthenticated: false,
    });
    dispatch(hydrateAuth(auth));
  }, [dispatch]);

  return null;
}