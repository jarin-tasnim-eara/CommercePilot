"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Order, OrderStatus } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";

interface OrderTableProps {
  orders: Order[];
}

type Tab = "all" | OrderStatus;

const TABS: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_TONE: Record<
  OrderStatus,
  "neutral" | "success" | "warning" | "danger" | "brand"
> = {
  pending: "warning",
  processing: "brand",
  shipped: "brand",
  delivered: "success",
  cancelled: "danger",
};

const PAYMENT_TONE: Record<
  Order["paymentStatus"],
  "neutral" | "success" | "warning" | "danger" | "brand"
> = {
  paid: "success",
  pending: "warning",
  refunded: "neutral",
};

export default function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("all");

  const counts = useMemo(() => {
    const map: Record<Tab, number> = {
      all: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((order) => {
      map[order.status] += 1;
    });
    return map;
  }, [orders]);

  const filtered = useMemo(() => {
    const list =
      tab === "all" ? orders : orders.filter((o) => o.status === tab);
    return [...list].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [orders, tab]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-1 border-b border-ink-100">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={cn(
              "border-b-2 px-3 py-2 text-sm font-medium",
              tab === t.value
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-ink-500 hover:text-ink-900",
            )}
          >
            {t.label}{" "}
            <span className="text-xs text-ink-400">({counts[t.value]})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No orders found"
          message="Try a different status filter."
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-500">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-ink-100 last:border-0 hover:bg-ink-50"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/orders/${order.id}`}
                      className="font-medium text-ink-900 hover:text-brand-600"
                    >
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-700">
                    {order.customerName}
                  </td>
                  <td className="px-4 py-3 text-ink-700">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-ink-700">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={PAYMENT_TONE[order.paymentStatus]}>
                      {order.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={STATUS_TONE[order.status]}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      aria-label={`View order ${order.id}`}
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}