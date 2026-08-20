import {
  ArrowDownRight,
  ArrowUpRight,
  Minus,
  type LucideIcon,
} from "lucide-react";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

interface Trend {
  value: number;
  direction: "up" | "down" | "flat";
}

interface KpiCardProps {
  label: string;
  value: string;
  trend: Trend;
  icon: LucideIcon;
}

const trendStyles = {
  up: "text-success-700 bg-success-50",
  down: "text-danger-700 bg-danger-50",
  flat: "text-ink-500 bg-ink-100",
};

const TrendIcon = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: Minus,
};

export default function KpiCard({
  label,
  value,
  trend,
  icon: Icon,
}: KpiCardProps) {
  const Arrow = TrendIcon[trend.direction];

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-ink-500">{label}</p>
          <p className="mt-1.5 text-2xl font-semibold text-ink-900">{value}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="h-[18px] w-[18px]" />
        </div>
      </div>
      <div
        className={cn(
          "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
          trendStyles[trend.direction],
        )}
      >
        <Arrow className="h-3 w-3" />
        {trend.value}%
        <span className="font-normal text-ink-500">vs previous period</span>
      </div>
    </Card>
  );
}