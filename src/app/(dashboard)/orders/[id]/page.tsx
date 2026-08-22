"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import PageContainer from "@/components/layout/PageContainer";
import EmptyState from "@/components/ui/EmptyState";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ProductThumbnail from "@/components/products/ProductThumbnail";
import StatusStepper from "@/components/orders/StatusStepper";
import StatusUpdateControl from "@/components/orders/StatusUpdateControl";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { Order, OrderStatus } from "@/types";

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

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const orders = useAppSelector((state) => state.orders.items);
  const customers = useAppSelector((state) => state.customers.items);

  const order = orders.find((o) => o.id === params.id);

  if (!order) {
    return (
      <PageContainer title="Order">
        <EmptyState
          title="Order not found"
          message="This order may not exist."
        />
      </PageContainer>
    );
  }

  const customer = customers.find((c) => c.id === order.customerId);
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <PageContainer
      title={order.id}
      subtitle={`Placed on ${formatDate(order.createdAt)}`}
      action={
        <Button variant="outline" onClick={() => router.push("/orders")}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex flex-col gap-4 xl:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ink-900">
                Order Status
              </h2>
              <StatusUpdateControl order={order} />
            </CardHeader>
            <CardBody>
              <StatusStepper status={order.status} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ink-900">Items</h2>
            </CardHeader>
            <CardBody>
              <ul className="divide-y divide-ink-100">
                {order.items.map((item) => (
                  <li
                    key={item.productId}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <ProductThumbnail
                      src={item.thumbnail}
                      alt={item.title}
                      size={44}
                      className="rounded-md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-ink-500">
                        {item.category} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-ink-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-1.5 border-t border-ink-100 pt-4 text-sm">
                <div className="flex justify-between text-ink-500">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-500">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-ink-900">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ink-900">Timeline</h2>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3">
                {order.timeline.map((entry, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    <Badge tone={STATUS_TONE[entry.status]}>
                      {entry.status}
                    </Badge>
                    <div>
                      <p className="text-ink-700">
                        {entry.note ?? `Status changed to ${entry.status}`}
                      </p>
                      <p className="text-xs text-ink-500">
                        {formatDate(entry.timestamp)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ink-900">Customer</h2>
            </CardHeader>
            <CardBody className="space-y-2 text-sm">
              <p className="font-medium text-ink-900">
                {order.customerName}
              </p>
              {customer && (
                <>
                  <p className="text-ink-500">{customer.email}</p>
                  <p className="text-ink-500">{customer.phone}</p>
                  <Link
                    href={`/customers/${customer.id}`}
                    className="inline-block text-xs font-medium text-brand-600 hover:text-brand-700"
                  >
                    View customer profile
                  </Link>
                </>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ink-900">
                Shipping Address
              </h2>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-ink-700">{order.shippingAddress}</p>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ink-900">Payment</h2>
            </CardHeader>
            <CardBody>
              <Badge tone={PAYMENT_TONE[order.paymentStatus]}>
                {order.paymentStatus}
              </Badge>
            </CardBody>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}