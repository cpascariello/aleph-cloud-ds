import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const textareaVariants = cva(
  [
    "w-full font-sans text-foreground bg-card",
    "border-2 border-edge rounded-2xl",
    "placeholder:text-muted-foreground",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-200",
    "disabled:opacity-50 disabled:pointer-events-none",
    "ring-0 resize-y transition-[color,border-color,box-shadow]",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "py-1.5 px-4 text-sm",
        md: "py-2 px-5 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> &
  VariantProps<typeof textareaVariants> & {
    error?: boolean;
  };

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ size, error = false, rows = 4, className, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          textareaVariants({ size }),
          error && "border-3 border-error-400 hover:border-error-500",
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      />
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants, type TextareaProps };
