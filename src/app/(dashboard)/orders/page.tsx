"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import PageContainer from "@/components/layout/PageContainer";
import OrderTable from "@/components/orders/OrderTable";

export default function OrdersPage() {
  const orders = useAppSelector((state) => state.orders.items);

  return (
    <PageContainer title="Orders" subtitle="Track and manage customer orders">
      <OrderTable orders={orders} />
    </PageContainer>
  );
}