import Badge from "@/components/ui/Badge";

interface StockBadgeProps {
  stock: number;
  lowStockThreshold: number;
}

export default function StockBadge({
  stock,
  lowStockThreshold,
}: StockBadgeProps) {
  if (stock === 0) {
    return <Badge tone="danger">Out of stock</Badge>;
  }
  if (stock < lowStockThreshold) {
    return <Badge tone="warning">{stock} left — Low</Badge>;
  }
  return <Badge tone="success">{stock} in stock</Badge>;
}