"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/lib/redux/api/productsApi";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import EmptyState from "@/components/ui/EmptyState";
import ProductForm from "@/components/products/ProductForm";
import { ProductFormValues } from "@/lib/validators/productSchema";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const productId = Number(params.id);
  const router = useRouter();

  const { data: products, isLoading, isError, refetch } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();

  const product = products?.find((p) => p.id === productId);

  const categoryOptions = useMemo(() => {
    return Array.from(new Set((products ?? []).map((p) => p.category))).sort();
  }, [products]);

  async function handleSubmit(values: ProductFormValues) {
    await updateProduct({
      id: productId,
      changes: { ...values, images: [values.thumbnail] },
    });
    router.push(`/products/${productId}`);
  }

  if (isLoading) {
    return (
      <PageContainer title="Edit Product">
        <LoadingState message="Loading product…" />
      </PageContainer>
    );
  }

  if (isError) {
    return (
      <PageContainer title="Edit Product">
        <ErrorState message="Couldn't load this product." onRetry={refetch} />
      </PageContainer>
    );
  }

  if (!product) {
    return (
      <PageContainer title="Edit Product">
        <EmptyState
          title="Product not found"
          message="It may have been deleted."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Edit Product" subtitle={product.title}>
      <Card className="max-w-2xl p-6">
        <ProductForm
          defaultValues={product}
          categoryOptions={categoryOptions}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
          onCancel={() => router.push(`/products/${productId}`)}
        />
      </Card>
    </PageContainer>
  );
}