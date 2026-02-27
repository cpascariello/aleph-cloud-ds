import {
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@ac/lib/cn";

type FormFieldProps = {
  label: string;
  required?: boolean;
  helperText?: string;
  error?: string;
  children: ReactNode;
  className?: string;
};

function FormField({
  label,
  required = false,
  helperText,
  error,
  children,
  className,
}: FormFieldProps) {
  const id = useId();
  const inputId = `${id}-input`;
  const messageId = `${id}-message`;
  const hasMessage = Boolean(error ?? helperText);

  const child = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id: inputId,
        ...(hasMessage ? { "aria-describedby": messageId } : {}),
      })
    : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="text-error-600 ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {child}
      {error ? (
        <p id={messageId} role="alert" className="text-xs text-error-600">
          {error}
        </p>
      ) : helperText ? (
        <p id={messageId} className="text-xs text-muted-foreground">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

FormField.displayName = "FormField";

export { FormField, type FormFieldProps };
