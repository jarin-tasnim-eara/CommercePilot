"use client";

import { useAppSelector } from "@/lib/redux/hooks";
import PageContainer from "@/components/layout/PageContainer";
import Card from "@/components/ui/Card";

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <PageContainer
      title="Dashboard"
      subtitle={`Welcome back, ${user?.name ?? "there"}.`}
    >
      <Card className="p-6 text-sm text-ink-500">
        KPI cards, revenue chart, category breakdown, recent orders and
        low-stock widgets will be built in the next milestone.
      </Card>
    </PageContainer>
  );
}