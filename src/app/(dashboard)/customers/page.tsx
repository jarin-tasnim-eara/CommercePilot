"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import PageContainer from "@/components/layout/PageContainer";
import CustomerTable from "@/components/customers/CustomerTable";

export default function CustomersPage() {
  const customers = useAppSelector((state) => state.customers.items);
  const orders = useAppSelector((state) => state.orders.items);

  return (
    <PageContainer
      title="Customers"
      subtitle="View customer profiles and order history"
    >
      <CustomerTable customers={customers} orders={orders} />
    </PageContainer>
  );
}