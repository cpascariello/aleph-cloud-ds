import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";
import { Spinner } from "@ac/components/ui/spinner";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-heading font-bold",
    "rounded-full border-3 transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
  ].join(" "),
  {
    variants: {
      variant: {
        primary: [
          "bg-primary-600 text-white border-primary-400",
          "hover:bg-primary-700 hover:border-primary-500",
          "active:bg-primary-800 active:border-primary-500",
          "disabled:bg-primary-600/50 disabled:text-white/50 disabled:border-primary-400/50",
        ].join(" "),
        secondary: [
          "border-gradient-main text-primary-700",
          "hover:text-primary-800",
          "active:text-primary-800",
          "disabled:opacity-50",
        ].join(" "),
        outline: [
          "bg-transparent text-neutral-950 border-neutral-950",
          "dark:text-neutral-50 dark:border-neutral-50",
          "hover:bg-primary-100 dark:hover:bg-primary-800",
          "active:bg-primary-200 dark:active:bg-primary-700",
          "disabled:bg-transparent disabled:text-neutral-950/50",
          "disabled:border-neutral-950/50",
          "dark:disabled:text-neutral-50/50 dark:disabled:border-neutral-50/50",
        ].join(" "),
        text: [
          "bg-transparent text-primary-600 dark:text-primary-300 border-transparent",
          "hover:bg-primary-100 hover:text-primary-700",
          "dark:hover:bg-primary-800 dark:hover:text-primary-200",
          "active:bg-primary-200 active:text-primary-800",
          "dark:active:bg-primary-700 dark:active:text-primary-100",
          "disabled:bg-transparent disabled:text-primary-600/50",
          "dark:disabled:text-primary-300/50",
        ].join(" "),
        destructive: [
          "bg-error-600/20 text-error-700 dark:text-error-300 border-error-600",
          "hover:bg-error-600/30 hover:border-error-700",
          "active:bg-error-600/40 active:border-error-800",
          "disabled:bg-error-600/10 disabled:text-error-700/50 disabled:border-error-600/50",
        ].join(" "),
        warning: [
          "bg-warning-500/20 text-warning-800 dark:text-warning-200 border-warning-500",
          "hover:bg-warning-500/30 hover:border-warning-600",
          "active:bg-warning-500/40 active:border-warning-700",
          "disabled:bg-warning-500/10 disabled:text-warning-800/50 disabled:border-warning-500/50",
        ].join(" "),
      },
      size: {
        xs: "py-1 px-4 text-sm gap-1",
        sm: "py-1.5 px-5 text-base gap-1.5",
        md: "py-2 px-6 text-base gap-2",
        lg: "py-2.5 px-8 text-lg gap-2",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

const iconSize = {
  xs: "size-3.5",
  sm: "size-4",
  md: "size-4",
  lg: "size-5",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    iconLeft?: ReactNode;
    iconRight?: ReactNode;
    loading?: boolean;
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant,
      size,
      iconLeft,
      iconRight,
      loading = false,
      disabled = false,
      asChild = false,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const sizeKey = size ?? "md";
    const classes = cn(
      buttonVariants({ variant, size }),
      loading && "pointer-events-none",
      className,
    );

    const iconClass = cn("shrink-0", iconSize[sizeKey], "[&>svg]:size-full");

    const content = (
      <>
        {loading ? (
          <Spinner className={cn("shrink-0", iconSize[sizeKey])} />
        ) : iconLeft ? (
          <span className={iconClass}>{iconLeft}</span>
        ) : null}
        <span>{children}</span>
        {!loading && iconRight ? (
          <span className={iconClass}>{iconRight}</span>
        ) : null}
      </>
    );

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<Record<string, unknown>>, {
        className: classes,
        ref,
        ...rest,
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        aria-busy={loading || undefined}
        {...rest}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants, type ButtonProps };
