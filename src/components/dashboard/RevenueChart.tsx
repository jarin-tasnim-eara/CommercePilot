"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card, { CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getRevenueSeries } from "@/lib/utils/analytics";
import { Order } from "@/types";

interface RevenueChartProps {
  orders: Order[];
}

const RANGE_OPTIONS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
] as const;

export default function RevenueChart({ orders }: RevenueChartProps) {
  const [days, setDays] = useState<7 | 30>(7);

  const series = useMemo(() => getRevenueSeries(orders, days), [orders, days]);

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-ink-900">Revenue</h2>
        <div className="flex gap-1">
          {RANGE_OPTIONS.map((option) => (
            <Button
              key={option.days}
              size="sm"
              variant={days === option.days ? "primary" : "outline"}
              onClick={() => setDays(option.days)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardBody>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={series}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-brand-500)"
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-brand-500)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-ink-100)"
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: "var(--color-ink-500)" }}
                tickFormatter={(value: string) => value.slice(5)}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--color-ink-500)" }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-brand-500)"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardBody>
    </Card>
  );
}