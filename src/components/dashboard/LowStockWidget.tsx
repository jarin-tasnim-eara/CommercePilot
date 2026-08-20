import Image from "next/image";
import Link from "next/link";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { getLowStockProducts } from "@/lib/utils/analytics";
import { Product } from "@/types";

interface LowStockWidgetProps {
  products: Product[];
}

export default function LowStockWidget({ products }: LowStockWidgetProps) {
  const lowStock = getLowStockProducts(products).slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-ink-900">Low Stock</h2>
        <Link
          href="/inventory"
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          View inventory
        </Link>
      </CardHeader>
      <CardBody>
        {lowStock.length === 0 ? (
          <EmptyState
            title="Stock levels look healthy"
            message="No products are below their low-stock threshold."
          />
        ) : (
          <ul className="divide-y divide-ink-100">
            {lowStock.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/products/${product.id}`}
                  className="flex items-center gap-3 py-2.5 hover:bg-ink-50"
                >
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={36}
                    height={36}
                    className="h-9 w-9 shrink-0 rounded-md object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-900">
                      {product.title}
                    </p>
                    <p className="truncate text-xs text-ink-500">
                      {product.category}
                    </p>
                  </div>
                  <Badge tone="danger">{product.stock} left</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}