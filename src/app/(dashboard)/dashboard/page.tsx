"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import PageContainer from "@/components/layout/PageContainer";
import { DollarSign, ShoppingCart, Users, Receipt } from "lucide-react";
import { useGetProductsQuery } from "@/lib/redux/api/productsApi";
import LoadingState from "@/components/ui/LoadingState";
import ErrorState from "@/components/ui/ErrorState";
import KpiCard from "@/components/dashboard/KpiCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import CategoryPieChart from "@/components/dashboard/CategoryPieChart";
import RecentOrdersWidget from "@/components/dashboard/RecentOrdersWidget";
import LowStockWidget from "@/components/dashboard/LowStockWidget";
import { getKpiSummary } from "@/lib/utils/analytics";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const orders = useAppSelector((state) => state.orders.items);
  const customers = useAppSelector((state) => state.customers.items);
  const {
    data: products,
    isLoading: isLoadingProducts,
    isError: isProductsError,
    refetch,
  } = useGetProductsQuery();

  const kpis = getKpiSummary(orders, customers, 7);
  return (
    <PageContainer
      title="Dashboard"
      subtitle={`Welcome back, ${user?.name ?? "there"}.`}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Revenue"
          value={`৳${kpis.totalRevenue.value.toFixed(2)}`}
          trend={kpis.totalRevenue.trend}
          icon={DollarSign}
        />
        <KpiCard
          label="Total Orders"
          value={String(kpis.totalOrders.value)}
          trend={kpis.totalOrders.trend}
          icon={ShoppingCart}
        />
        <KpiCard
          label="Total Customers"
          value={String(kpis.totalCustomers.value)}
          trend={kpis.totalCustomers.trend}
          icon={Users}
        />
        <KpiCard
          label="Avg. Order Value"
          value={`৳${kpis.avgOrderValue.value.toFixed(2)}`}
          trend={kpis.avgOrderValue.trend}
          icon={Receipt}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart orders={orders} />
        </div>
        <CategoryPieChart orders={orders} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentOrdersWidget orders={orders} />
        {isLoadingProducts ? (
          <LoadingState message="Loading stock levels…" />
        ) : isProductsError ? (
          <ErrorState
            message="Couldn't load product stock levels."
            onRetry={refetch}
          />
        ) : (
          <LowStockWidget products={products ?? []} />
        )}
      </div>
    </PageContainer>
  );
}