"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  DollarSign,
  Mail,
  MapPin,
  Phone,
  Receipt,
  ShoppingCart,
} from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import PageContainer from "@/components/layout/PageContainer";
import EmptyState from "@/components/ui/EmptyState";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import CustomerStatsCard from "@/components/customers/CustomerStatsCard";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { OrderStatus } from "@/types";

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

export default function CustomerProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const customers = useAppSelector((state) => state.customers.items);
  const orders = useAppSelector((state) => state.orders.items);

  const customer = customers.find((c) => c.id === params.id);

  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return orders
      .filter((o) => o.customerId === customer.id)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [orders, customer]);

  const totalOrders = customerOrders.length;
  const totalSpent = customerOrders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  if (!customer) {
    return (
      <PageContainer title="Customer">
        <EmptyState
          title="Customer not found"
          message="This customer may not exist."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={customer.name}
      subtitle={`Customer since ${formatDate(customer.joinedAt)}`}
      action={
        <Button variant="outline" onClick={() => router.push("/customers")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <CustomerStatsCard
          label="Total Orders"
          value={String(totalOrders)}
          icon={ShoppingCart}
        />
        <CustomerStatsCard
          label="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={DollarSign}
        />
        <CustomerStatsCard
          label="Avg. Order Value"
          value={formatCurrency(avgOrderValue)}
          icon={Receipt}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-1">
          <CardHeader>
            <h2 className="text-sm font-semibold text-ink-900">Contact Info</h2>
          </CardHeader>
          <CardBody className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
              <span className="text-ink-700">{customer.email}</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
              <span className="text-ink-700">{customer.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />
              <span className="text-ink-700">{customer.address}</span>
            </div>
            <Badge tone={customer.status === "active" ? "success" : "neutral"}>
              {customer.status}
            </Badge>
          </CardBody>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <h2 className="text-sm font-semibold text-ink-900">
              Order History
            </h2>
          </CardHeader>
          <CardBody>
            {customerOrders.length === 0 ? (
              <EmptyState
                title="No orders yet"
                message="This customer hasn't placed any orders."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm">
                  <thead>
                    <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-500">
                      <th className="py-2 pr-4">Order ID</th>
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Total</th>
                      <th className="py-2 pr-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-ink-100 last:border-0"
                      >
                        <td className="py-2.5 pr-4">
                          <Link
                            href={`/orders/${order.id}`}
                            className="font-medium text-ink-900 hover:text-brand-600"
                          >
                            {order.id}
                          </Link>
                        </td>
                        <td className="py-2.5 pr-4 text-ink-700">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-2.5 pr-4 text-ink-700">
                          {formatCurrency(order.totalAmount)}
                        </td>
                        <td className="py-2.5 pr-4">
                          <Badge tone={STATUS_TONE[order.status]}>
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </PageContainer>
  );
}