import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { OrderStatus } from "@/types";

interface StatusStepperProps {
  status: OrderStatus;
}

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export default function StatusStepper({ status }: StatusStepperProps) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger-700">
        <X className="h-4 w-4" />
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.key === status);

  return (
    <div className="flex items-center">
      {STEPS.map((step, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <div
            key={step.key}
            className="flex flex-1 items-center last:flex-none"
          >
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-medium",
                  isComplete && "border-brand-500 bg-brand-500 text-white",
                  isCurrent && "border-brand-500 bg-white text-brand-600",
                  !isComplete &&
                    !isCurrent &&
                    "border-ink-200 bg-white text-ink-300",
                )}
              >
                {isComplete ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span
                className={cn(
                  "text-xs",
                  isCurrent || isComplete
                    ? "font-medium text-ink-900"
                    : "text-ink-400",
                )}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  isComplete ? "bg-brand-500" : "bg-ink-200",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}