"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  useDeleteProductMutation,
  useUpdateProductMutation,
} from "@/lib/redux/api/productsApi";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/lib/utils/format";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EmptyState from "@/components/ui/EmptyState";
import StockBadge from "./StockBadge";

interface ProductTableProps {
  products: Product[];
}

type SortKey = "title" | "price" | "stock";
type SortDirection = "asc" | "desc";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

const PAGE_SIZE = 10;

export default function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();
  const role = useAppSelector((state) => state.auth.user?.role);
  const canDelete = role === "admin";

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const categoryOptions = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return unique.sort().map((category) => ({
      value: category,
      label: category,
    }));
  }, [products]);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    return products.filter((product) => {
      const matchesSearch = term
        ? product.title.toLowerCase().includes(term)
        : true;
      const matchesCategory = categoryFilter
        ? product.category === categoryFilter
        : true;
      const matchesStatus = statusFilter
        ? product.status === statusFilter
        : true;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, debouncedSearch, categoryFilter, statusFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const dir = sortDirection === "asc" ? 1 : -1;
      if (sortKey === "title") return a.title.localeCompare(b.title) * dir;
      return (a[sortKey] - b[sortKey]) * dir;
    });
    return copy;
  }, [filtered, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const allOnPageSelected =
    paged.length > 0 && paged.every((p) => selectedIds.includes(p.id));

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  }

  function toggleSelectAllOnPage() {
    if (allOnPageSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !paged.some((p) => p.id === id)),
      );
    } else {
      setSelectedIds((prev) => [
        ...prev,
        ...paged.filter((p) => !prev.includes(p.id)).map((p) => p.id),
      ]);
    }
  }

  function toggleSelectOne(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    setIsBusy(true);
    await deleteProduct(deleteTarget.id);
    setIsBusy(false);
    setDeleteTarget(null);
  }

  async function handleBulkDelete() {
    setIsBusy(true);
    await Promise.all(selectedIds.map((id) => deleteProduct(id)));
    setIsBusy(false);
    setSelectedIds([]);
    setBulkDeleteOpen(false);
  }

  async function handleBulkStatusChange(status: Product["status"]) {
    setIsBusy(true);
    await Promise.all(
      selectedIds.map((id) => updateProduct({ id, changes: { status } })),
    );
    setIsBusy(false);
    setSelectedIds([]);
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products yet"
        message="Add your first product to get started."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search products…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          placeholder="All categories"
          options={categoryOptions}
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="sm:w-48"
        />
        <Select
          placeholder="All statuses"
          options={STATUS_OPTIONS}
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="sm:w-40"
        />
      </div>

      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700">
          <span className="font-medium">{selectedIds.length} selected</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkStatusChange("active")}
            disabled={isBusy}
          >
            Mark Active
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleBulkStatusChange("archived")}
            disabled={isBusy}
          >
            Archive
          </Button>
          {canDelete && (
            <Button
              size="sm"
              variant="danger"
              onClick={() => setBulkDeleteOpen(true)}
              disabled={isBusy}
            >
              Delete Selected
            </Button>
          )}
          <button
            type="button"
            className="ml-auto text-xs text-brand-600 underline"
            onClick={() => setSelectedIds([])}
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-ink-100 text-left text-xs font-medium uppercase tracking-wide text-ink-500">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all on page"
                  checked={allOnPageSelected}
                  onChange={toggleSelectAllOnPage}
                  className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500"
                />
              </th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  className="flex items-center gap-1"
                  onClick={() => toggleSort("title")}
                >
                  Product <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  className="flex items-center gap-1"
                  onClick={() => toggleSort("price")}
                >
                  Price <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3">
                <button
                  type="button"
                  className="flex items-center gap-1"
                  onClick={() => toggleSort("stock")}
                >
                  Stock <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((product) => (
              <tr
                key={product.id}
                className="border-b border-ink-100 last:border-0 hover:bg-ink-50"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label={`Select ${product.title}`}
                    checked={selectedIds.includes(product.id)}
                    onChange={() => toggleSelectOne(product.id)}
                    className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex items-center gap-3"
                  >
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={36}
                      height={36}
                      className="h-9 w-9 shrink-0 rounded-md object-cover"
                    />
                    <span className="font-medium text-ink-900 hover:text-brand-600">
                      {product.title}
                    </span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-700">{product.category}</td>
                <td className="px-4 py-3 text-ink-700">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-4 py-3">
                  <StockBadge
                    stock={product.stock}
                    lowStockThreshold={product.lowStockThreshold}
                  />
                </td>
                <td className="px-4 py-3">
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
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      aria-label={`View ${product.title}`}
                      onClick={() => router.push(`/products/${product.id}`)}
                      className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Edit ${product.title}`}
                      onClick={() =>
                        router.push(`/products/${product.id}/edit`)
                      }
                      className="rounded-md p-1.5 text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {canDelete && (
                      <button
                        type="button"
                        aria-label={`Delete ${product.title}`}
                        onClick={() => setDeleteTarget(product)}
                        className="rounded-md p-1.5 text-danger-500 hover:bg-danger-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="No matching products"
          message="Try adjusting your search or filters."
        />
      ) : (
        <div className="flex items-center justify-between text-sm text-ink-500">
          <span>
            Showing {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, sorted.length)} of{" "}
            {sorted.length}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Delete product"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDanger
        isLoading={isBusy}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        isOpen={bulkDeleteOpen}
        title="Delete selected products"
        message={`Are you sure you want to delete ${selectedIds.length} product(s)? This cannot be undone.`}
        confirmLabel="Delete All"
        isDanger
        isLoading={isBusy}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkDeleteOpen(false)}
      />
    </div>
  );
}