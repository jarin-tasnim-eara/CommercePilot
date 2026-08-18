import { Inbox } from "lucide-react";
import { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title = "Nothing here yet",
  message,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <Inbox className="h-6 w-6 text-ink-300" />
      <p className="text-sm font-medium text-ink-900">{title}</p>
      {message && <p className="max-w-sm text-sm text-ink-500">{message}</p>}
      {action}
    </div>
  );
}