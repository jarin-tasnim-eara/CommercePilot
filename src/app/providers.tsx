"use client";

import { Provider } from "react-redux";
import { store } from "@/lib/redux/store";
import StoreHydrator from "@/components/system/StoreHydrator";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <StoreHydrator />
      {children}
    </Provider>
  );
}