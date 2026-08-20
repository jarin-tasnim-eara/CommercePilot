"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useGetProductsQuery } from "@/lib/redux/api/productsApi";
import PageContainer from "@/components/layout/PageContainer";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import Button from "@/components/ui/Button";
import ProductTable from "@/components/products/ProductTable";

export default function ProductsPage() {
  const { data: products, isLoading, isError, refetch } = useGetProductsQuery();

  return (
    <PageContainer
      title="Products"
      subtitle="Manage your product catalog"
      action={
        <Link href="/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      }
    >
      {isLoading ? (
        <LoadingState message="Loading products…" />
      ) : isError ? (
        <ErrorState message="Couldn't load products." onRetry={refetch} />
      ) : (
        <ProductTable products={products ?? []} />
      )}
    </PageContainer>
  );
}