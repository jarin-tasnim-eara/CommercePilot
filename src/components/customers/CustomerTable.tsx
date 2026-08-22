"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Customer, Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import EmptyState from "@/components/ui/EmptyState";

interface CustomerTableProps {
  customers: Customer[];
  orders: Order[];
}

export default function CustomerTable({
  customers,
  orders,
}: CustomerTableProps) {
  const rows = useMemo(() => {
    return customers.map((customer) => {
      const customerOrders = orders.filter((o) => o.customerId === customer.id);
      const totalOrders = customerOrders.length;
      const totalSpent = customerOrders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + o.totalAmount, 0);
      return { customer, totalOrders, totalSpent };
    });
  }, [customers, orders]);

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No customers yet"
        message="Customers will appear here once added."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-500">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">Total Orders</th>
            <th className="px-4 py-3">Total Spent</th>
            <th className="px-4 py-3">Joined</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ customer, totalOrders, totalSpent }) => (
            <tr
              key={customer.id}
              className="border-b border-ink-100 last:border-0 hover:bg-ink-50"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/customers/${customer.id}`}
                  className="font-medium text-ink-900 hover:text-brand-600"
                >
                  {customer.name}
                </Link>
              </td>
              <td className="px-4 py-3 text-ink-700">{customer.email}</td>
              <td className="px-4 py-3 text-ink-700">{customer.phone}</td>
              <td className="px-4 py-3 text-ink-700">{totalOrders}</td>
              <td className="px-4 py-3 text-ink-700">
                {formatCurrency(totalSpent)}
              </td>
              <td className="px-4 py-3 text-ink-700">
                {formatDate(customer.joinedAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}