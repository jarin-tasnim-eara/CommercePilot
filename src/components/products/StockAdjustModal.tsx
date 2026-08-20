"use client";

import { useState } from "react";
import { Product } from "@/types";
import { useUpdateProductMutation } from "@/lib/redux/api/productsApi";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface StockAdjustModalProps {
  product: Product | null;
  onClose: () => void;
}

const DIRECTION_OPTIONS = [
  { value: "increase", label: "Increase stock" },
  { value: "decrease", label: "Decrease stock" },
];

export default function StockAdjustModal({
  product,
  onClose,
}: StockAdjustModalProps) {
  const [updateProduct] = useUpdateProductMutation();
  const [direction, setDirection] = useState<"increase" | "decrease">(
    "increase",
  );
  const [amount, setAmount] = useState(1);
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!product) return null;

  const nextStock =
    direction === "increase" ? product.stock + amount : product.stock - amount;

  async function handleSave() {
    if (!product) return;
    if (amount <= 0) {
      setError("Enter a quantity greater than 0.");
      return;
    }
    if (nextStock < 0) {
      setError("Stock cannot go below 0.");
      return;
    }
    if (!reason.trim()) {
      setError("Please provide a reason for this adjustment.");
      return;
    }
    setError(null);
    setIsSaving(true);
    await updateProduct({ id: product.id, changes: { stock: nextStock } });
    setIsSaving(false);
    setAmount(1);
    setReason("");
    onClose();
  }

  return (
    <Modal isOpen={Boolean(product)} onClose={onClose} title="Adjust Stock">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-ink-500">
          {product.title} — current stock:{" "}
          <span className="font-medium text-ink-900">{product.stock}</span>
        </p>

        <Select
          label="Adjustment Type"
          options={DIRECTION_OPTIONS}
          value={direction}
          onChange={(e) =>
            setDirection(e.target.value as "increase" | "decrease")
          }
        />

        <Input
          label="Quantity"
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <Input
          label="Reason"
          placeholder="e.g. Restock, damaged goods, inventory correction"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <p className="text-xs text-ink-500">
          New stock will be:{" "}
          <span className="font-medium text-ink-900">
            {Math.max(nextStock, 0)}
          </span>
        </p>

        {error && <p className="text-sm text-danger-500">{error}</p>}

        <div className="mt-1 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} isLoading={isSaving}>
            Save Adjustment
          </Button>
        </div>
      </div>
    </Modal>
  );
}