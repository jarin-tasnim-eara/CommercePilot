"use client";

import { useState } from "react";
import { Order, OrderStatus } from "@/types";
import { useAppDispatch } from "@/lib/redux/hooks";
import { updateOrderStatus } from "@/lib/redux/slices/ordersSlice";
import Select from "@/components/ui/Select";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface StatusUpdateControlProps {
  order: Order;
}

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function StatusUpdateControl({
  order,
}: StatusUpdateControlProps) {
  const dispatch = useAppDispatch();
  const [pendingStatus, setPendingStatus] = useState<OrderStatus | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handleConfirm() {
    if (!pendingStatus) return;
    setIsSaving(true);
    dispatch(updateOrderStatus({ id: order.id, status: pendingStatus }));
    setIsSaving(false);
    setPendingStatus(null);
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        options={STATUS_OPTIONS}
        value={order.status}
        onChange={(e) => setPendingStatus(e.target.value as OrderStatus)}
        className="w-44"
        aria-label="Update order status"
      />

      <ConfirmDialog
        isOpen={Boolean(pendingStatus) && pendingStatus !== order.status}
        title="Update order status"
        message={`Change this order's status from "${order.status}" to "${pendingStatus}"?`}
        confirmLabel="Update"
        isLoading={isSaving}
        onConfirm={handleConfirm}
        onCancel={() => setPendingStatus(null)}
      />
    </div>
  );
}