import { forwardRef, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const inputVariants = cva(
  [
    "w-full font-sans text-foreground bg-card",
    "border-2 border-edge rounded-full",
    "placeholder:text-muted-foreground",
    "hover:border-edge-hover",
    "focus-visible:outline-none focus-visible:ring-3",
    "focus-visible:ring-primary-200",
    "disabled:opacity-50 disabled:pointer-events-none",
    "ring-0 transition-[color,border-color,box-shadow]",
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

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof inputVariants> & {
    error?: boolean;
  };

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size, error = false, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          inputVariants({ size }),
          error && "border-3 border-error-400 hover:border-error-500",
          className,
        )}
        aria-invalid={error || undefined}
        {...rest}
      />
    );
  },
);

Input.displayName = "Input";

export { Input, inputVariants, type InputProps };
