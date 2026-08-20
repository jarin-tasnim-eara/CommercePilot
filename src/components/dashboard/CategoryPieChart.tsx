"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { getSalesByCategory } from "@/lib/utils/analytics";
import { Order } from "@/types";

interface CategoryPieChartProps {
  orders: Order[];
}

const COLORS = [
  "var(--color-brand-500)",
  "var(--color-success-500)",
  "var(--color-warning-500)",
  "var(--color-danger-500)",
  "var(--color-ink-500)",
  "var(--color-brand-200)",
];

export default function CategoryPieChart({ orders }: CategoryPieChartProps) {
  const data = useMemo(() => getSalesByCategory(orders), [orders]);
  const hasData = data.length > 0 && data.some((d) => d.revenue > 0);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-ink-900">
          Sales by Category
        </h2>
      </CardHeader>
      <CardBody>
        {!hasData ? (
          <EmptyState
            title="No category sales yet"
            message="Sales will appear here once orders come in."
          />
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="h-56 w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="revenue"
                    nameKey="category"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [
                      `$${Number(value ?? 0).toFixed(2)}`,
                      "Revenue",
                    ]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid var(--color-ink-100)",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="flex flex-1 flex-col gap-2 text-sm">
              {data.map((entry, index) => (
                <li
                  key={entry.category}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-2 text-ink-700">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    {entry.category}
                  </span>
                  <span className="font-medium text-ink-900">
                    ${entry.revenue.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardBody>
    </Card>
  );
}