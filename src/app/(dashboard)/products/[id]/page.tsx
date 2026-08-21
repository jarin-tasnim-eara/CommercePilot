"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/lib/redux/api/productsApi";
import { useAppSelector } from "@/lib/redux/hooks";
import PageContainer from "@/components/layout/PageContainer";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import Card, { CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import StockBadge from "@/components/products/StockBadge";
import ProductThumbnail from "@/components/products/ProductThumbnail";
import { formatCurrency, formatDate } from "@/lib/utils/format";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);
  const router = useRouter();
  const role = useAppSelector((state) => state.auth.user?.role);
  const canDelete = role === "admin";

  const { data: products, isLoading, isError, refetch } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const product = products?.find((p) => p.id === productId);

  async function handleDelete() {
    if (!product) return;
    setIsDeleting(true);
    await deleteProduct(product.id);
    setIsDeleting(false);
    router.push("/products");
  }

  if (isLoading) {
    return (
      <PageContainer title="Product">
        <LoadingState message="Loading product…" />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer title="Product">
        <ErrorState message="Couldn't load this product." onRetry={refetch} />
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer title="Product">
        <EmptyState
          title="Product not found"
          message="It may have been deleted."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={product.title}
      subtitle={product.category}
      action={
        <div className="flex gap-2">
          <Link href="/products">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <Link href={`/products/${product.id}/edit`}>
            <Button variant="outline">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          {canDelete && (
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      }
    >
      <Card>
        <CardBody>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[240px_1fr]">
            <ProductThumbnail
              src={product.thumbnail}
              alt={product.title}
              size={240}
              className="rounded-lg"
            />
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  tone={
                    product.status === "active"
                      ? "success"
                      : product.status === "draft"
                        ? "warning"
                        : "neutral"
                  }
                >
                  {product.status}
                </Badge>
                <StockBadge
                  stock={product.stock}
                  lowStockThreshold={product.lowStockThreshold}
                />
              </div>

              <p className="text-sm text-ink-700">{product.description}</p>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-ink-500">Price</dt>
                  <dd className="font-medium text-ink-900">
                    {formatCurrency(product.price)}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-500">Stock</dt>
                  <dd className="font-medium text-ink-900">{product.stock}</dd>
                </div>
                <div>
                  <dt className="text-ink-500">Low Stock Threshold</dt>
                  <dd className="font-medium text-ink-900">
                    {product.lowStockThreshold}
                  </dd>
                </div>
                {product.brand && (
                  <div>
                    <dt className="text-ink-500">Brand</dt>
                    <dd className="font-medium text-ink-900">
                      {product.brand}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-ink-500">Created</dt>
                  <dd className="font-medium text-ink-900">
                    {formatDate(product.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink-500">Last Updated</dt>
                  <dd className="font-medium text-ink-900">
                    {formatDate(product.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </CardBody>
      </Card>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete product"
        message={`Are you sure you want to delete "${product.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDanger
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </PageContainer>
  );
}