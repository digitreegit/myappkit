import { useId } from "react";
import { Input, type InputProps } from "../atoms/Input";
import { cn } from "../lib/cn";

export interface FormFieldProps extends InputProps {
  label?: string;
  error?: string;
  hint?: string;
}

/** label + input + error/hint 를 묶은 폼 필드. */
export function FormField({ label, error, hint, className, id, ...inputProps }: FormFieldProps) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <Input id={fieldId} invalid={!!error} aria-describedby={error ? `${fieldId}-err` : undefined} {...inputProps} />
      {error ? (
        <p id={`${fieldId}-err`} className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
