"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import {
  useAddProductMutation,
  useGetProductsQuery,
} from "@/lib/redux/api/productsApi";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";
import ProductForm from "@/components/products/ProductForm";
import { ProductFormValues } from "@/lib/validators/productSchema";

export default function NewProductPage() {
  const router = useRouter();
  const { data: products } = useGetProductsQuery();
  const [addProduct] = useAddProductMutation();

  const categoryOptions = useMemo(() => {
    return Array.from(new Set((products ?? []).map((p) => p.category))).sort();
  }, [products]);

  async function handleSubmit(values: ProductFormValues) {
    await addProduct({
      ...values,
      images: [values.thumbnail],
    });
    router.push("/products");
  }

  return (
    <PageContainer title="Add Product" subtitle="Create a new product">
      <Card className="max-w-2xl p-6">
        <ProductForm
          categoryOptions={categoryOptions}
          submitLabel="Create Product"
          onSubmit={handleSubmit}
          onCancel={() => router.push("/products")}
        />
      </Card>
    </PageContainer>
  );
}