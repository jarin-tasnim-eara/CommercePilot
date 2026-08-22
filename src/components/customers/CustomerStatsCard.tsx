import { type LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";

interface CustomerStatsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
}

export default function CustomerStatsCard({
  label,
  value,
  icon: Icon,
}: CustomerStatsCardProps) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
        <Icon className="h-[18px] w-[18px]" />
      </div>

      <div>
        <p className="text-xs text-ink-500">{label}</p>
        <p className="text-base font-semibold text-ink-900">{value}</p>
      </div>
    </Card>
  );
}