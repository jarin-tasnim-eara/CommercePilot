import Link from "next/link";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { getRecentOrders } from "@/lib/utils/analytics";
import { Order, OrderStatus } from "@/types";

interface RecentOrdersWidgetProps {
  orders: Order[];
}

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

export default function RecentOrdersWidget({
  orders,
}: RecentOrdersWidgetProps) {
  const recent = getRecentOrders(orders, 8);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-ink-900">Recent Orders</h2>
        <Link
          href="/orders"
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          View all
        </Link>
      </CardHeader>
      <CardBody>
        {recent.length === 0 ? (
          <EmptyState
            title="No orders yet"
            message="New orders will show up here."
          />
        ) : (
          <ul className="divide-y divide-ink-100">
            {recent.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 py-2.5 hover:bg-ink-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {order.id}
                    </p>
                    <p className="truncate text-xs text-ink-500">
                      {order.customerName}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge tone={STATUS_TONE[order.status]}>
                      {order.status}
                    </Badge>
                    <span className="text-sm font-medium text-ink-900">
                     ৳{order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}