import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading…",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-500">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" />
      <p className="text-sm">{message}</p>
    </div>
  );
}