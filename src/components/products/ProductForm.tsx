"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  productSchema,
  ProductFormValues,
} from "@/lib/validators/productSchema";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

type ProductFormInput = z.input<typeof productSchema>;

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  categoryOptions: string[];
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  onCancel: () => void;
}

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export default function ProductForm({
  defaultValues,
  categoryOptions,
  submitLabel,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInput, unknown, ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      price: 0,
      stock: 0,
      lowStockThreshold: 10,
      thumbnail: "",
      status: "active",
      ...defaultValues,
    },
  });

  const categoryListId = "product-category-options";

  return (
    <form
      onSubmit={handleSubmit((values) => onSubmit(values))}
      className="flex flex-col gap-4"
    >
      <Input
        label="Product Name"
        placeholder="e.g. Wireless Mouse"
        error={errors.title?.message}
        {...register("title")}
      />

      <Textarea
        label="Description"
        placeholder="Describe the product…"
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="category"
            className="text-sm font-medium text-ink-700"
          >
            Category
          </label>
          <input
            id="category"
            list={categoryListId}
            placeholder="Select or type a new category"
            className="h-10 rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            {...register("category")}
          />
          <datalist id={categoryListId}>
            {categoryOptions.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          {errors.category?.message && (
            <p className="text-xs text-danger-500">{errors.category.message}</p>
          )}
        </div>
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          error={errors.status?.message}
          {...register("status")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input
          label="Price (৳)"
          type="number"
          step="0.01"
          min="0"
          error={errors.price?.message}
          {...register("price")}
        />
        <Input
          label="Stock Quantity"
          type="number"
          min="0"
          error={errors.stock?.message}
          {...register("stock")}
        />
        <Input
          label="Low Stock Threshold"
          type="number"
          min="0"
          error={errors.lowStockThreshold?.message}
          {...register("lowStockThreshold")}
        />
      </div>

      <Input
        label="Image URL"
        placeholder="https://…"
        error={errors.thumbnail?.message}
        {...register("thumbnail")}
      />
      <p className="-mt-2 text-xs text-ink-500">
        No file storage backend in this mock app — paste an image URL instead of
        uploading a file.
      </p>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}