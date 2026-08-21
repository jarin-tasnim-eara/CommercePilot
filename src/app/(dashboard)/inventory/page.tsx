"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Product } from "@/types";
import { useGetProductsQuery } from "@/lib/redux/api/productsApi";
import PageContainer from "@/components/layout/PageContainer";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import StockBadge from "@/components/products/StockBadge";
import StockAdjustModal from "@/components/products/StockAdjustModal";
import ProductThumbnail from "@/components/products/ProductThumbnail";

export default function InventoryPage() {
  const { data: products, isLoading, isError, refetch } = useGetProductsQuery();
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [adjustTarget, setAdjustTarget] = useState<Product | null>(null);

  const rows = useMemo(() => {
    const list = products ?? [];
    const filtered = lowStockOnly
      ? list.filter((p) => p.stock < p.lowStockThreshold)
      : list;
    return [...filtered].sort((a, b) => a.stock - b.stock);
  }, [products, lowStockOnly]);

  return (
    <PageContainer
      title="Inventory"
      subtitle="Track stock levels and make manual adjustments"
      action={
        <Button
          variant={lowStockOnly ? "primary" : "outline"}
          onClick={() => setLowStockOnly((prev) => !prev)}
        >
          Low Stock Only
        </Button>
      }
    >
      {isLoading ? (
        <LoadingState message="Loading inventory…" />
      ) : isError ? (
        <ErrorState message="Couldn't load inventory." onRetry={refetch} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={lowStockOnly ? "No low-stock products" : "No products yet"}
          message={
            lowStockOnly
              ? "All products are above their low-stock threshold."
              : "Add products to start tracking inventory."
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-500">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Threshold</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-ink-100 last:border-0 hover:bg-ink-50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <ProductThumbnail
                        src={product.thumbnail}
                        alt={product.title}
                        size={36}
                        className="rounded-md"
                      />
                      <span className="font-medium text-ink-900">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{product.category}</td>
                  <td className="px-4 py-3">
                    <StockBadge
                      stock={product.stock}
                      lowStockThreshold={product.lowStockThreshold}
                    />
                  </td>
                  <td className="px-4 py-3 text-ink-700">
                    {product.lowStockThreshold}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setAdjustTarget(product)}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      Adjust
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StockAdjustModal
        product={adjustTarget}
        onClose={() => setAdjustTarget(null)}
      />
    </PageContainer>
  );
}