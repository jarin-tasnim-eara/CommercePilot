import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils/cn";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id ?? props.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-ink-700"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={Boolean(error)}
          rows={4}
          className={cn(
            "rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900",
            "placeholder:text-ink-300 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100",
            error &&
              "border-danger-500 focus:border-danger-500 focus:ring-danger-50",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger-500">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export default Textarea;