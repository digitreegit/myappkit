import { cn } from "../lib/cn";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
}

export function Spinner({ size = 20, className, ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="로딩 중"
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-primary",
        className,
      )}
      style={{ width: size, height: size }}
      {...props}
    />
  );
}
