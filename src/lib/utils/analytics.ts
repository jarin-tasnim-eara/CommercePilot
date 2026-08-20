import { Customer, Order, Product } from "@/types";

const NON_REVENUE_STATUSES = new Set(["cancelled"]);

function isRevenueOrder(order: Order): boolean {
  return !NON_REVENUE_STATUSES.has(order.status);
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function daysAgo(days: number, from: Date): Date {
  const date = new Date(from);
  date.setDate(date.getDate() - days);
  return date;
}

interface Trend {
  value: number;
  direction: "up" | "down" | "flat";
}

function computeTrend(current: number, previous: number): Trend {
  if (previous === 0) {
    if (current === 0) return { value: 0, direction: "flat" };
    return { value: 100, direction: "up" };
  }
  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(change * 10) / 10;
  return {
    value: Math.abs(rounded),
    direction: rounded > 0 ? "up" : rounded < 0 ? "down" : "flat",
  };
}

function ordersInWindow(orders: Order[], start: Date, end: Date): Order[] {
  return orders.filter((order) => {
    const created = new Date(order.createdAt);
    return created >= start && created < end && isRevenueOrder(order);
  });
}

function customersInWindow(
  customers: Customer[],
  start: Date,
  end: Date,
): Customer[] {
  return customers.filter((customer) => {
    const joined = new Date(customer.joinedAt);
    return joined >= start && joined < end;
  });
}

export interface KpiSummary {
  totalRevenue: { value: number; trend: Trend };
  totalOrders: { value: number; trend: Trend };
  totalCustomers: { value: number; trend: Trend };
  avgOrderValue: { value: number; trend: Trend };
}

export function getKpiSummary(
  orders: Order[],
  customers: Customer[],
  windowDays: number = 7,
  now: Date = new Date(),
): KpiSummary {
  const currentStart = daysAgo(windowDays, now);
  const previousStart = daysAgo(windowDays * 2, now);

  const currentOrders = ordersInWindow(orders, currentStart, now);
  const previousOrders = ordersInWindow(orders, previousStart, currentStart);

  const currentRevenue = currentOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0,
  );
  const previousRevenue = previousOrders.reduce(
    (sum, o) => sum + o.totalAmount,
    0,
  );

  const currentCustomers = customersInWindow(customers, currentStart, now);
  const previousCustomers = customersInWindow(
    customers,
    previousStart,
    currentStart,
  );

  const currentAvg =
    currentOrders.length > 0 ? currentRevenue / currentOrders.length : 0;
  const previousAvg =
    previousOrders.length > 0 ? previousRevenue / previousOrders.length : 0;

  return {
    totalRevenue: {
      value: Math.round(currentRevenue * 100) / 100,
      trend: computeTrend(currentRevenue, previousRevenue),
    },
    totalOrders: {
      value: currentOrders.length,
      trend: computeTrend(currentOrders.length, previousOrders.length),
    },
    totalCustomers: {
      value: customers.length,
      trend: computeTrend(currentCustomers.length, previousCustomers.length),
    },
    avgOrderValue: {
      value: Math.round(currentAvg * 100) / 100,
      trend: computeTrend(currentAvg, previousAvg),
    },
  };
}

export interface RevenuePoint {
  date: string;
  revenue: number;
}

export function getRevenueSeries(
  orders: Order[],
  days: number = 7,
  now: Date = new Date(),
): RevenuePoint[] {
  const start = daysAgo(days - 1, now);
  const buckets = new Map<string, number>();

  for (let i = 0; i < days; i += 1) {
    const date = daysAgo(days - 1 - i, now);
    buckets.set(dayKey(date.toISOString()), 0);
  }

  orders
    .filter((order) => isRevenueOrder(order))
    .forEach((order) => {
      const created = new Date(order.createdAt);
      if (created < start) return;
      const key = dayKey(order.createdAt);
      if (!buckets.has(key)) return;
      buckets.set(key, (buckets.get(key) ?? 0) + order.totalAmount);
    });

  return Array.from(buckets.entries()).map(([date, revenue]) => ({
    date,
    revenue: Math.round(revenue * 100) / 100,
  }));
}

export interface CategorySales {
  category: string;
  revenue: number;
}

export function getSalesByCategory(orders: Order[]): CategorySales[] {
  const totals = new Map<string, number>();

  orders
    .filter((order) => isRevenueOrder(order))
    .forEach((order) => {
      order.items.forEach((item) => {
        const amount = item.price * item.quantity;
        totals.set(item.category, (totals.get(item.category) ?? 0) + amount);
      });
    });

  return Array.from(totals.entries())
    .map(([category, revenue]) => ({
      category,
      revenue: Math.round(revenue * 100) / 100,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getRecentOrders(orders: Order[], limit: number = 8): Order[] {
  return [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, limit);
}

export function getLowStockProducts(products: Product[]): Product[] {
  return products
    .filter((product) => product.stock < product.lowStockThreshold)
    .sort((a, b) => a.stock - b.stock);
}