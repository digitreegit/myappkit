import { cn } from "../lib/cn";
import { Text } from "../atoms/Text";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/** 데이터가 없을 때 보여주는 빈 상태. */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border p-10 text-center",
        className,
      )}
    >
      {icon && <div className="text-muted">{icon}</div>}
      <Text variant="h3">{title}</Text>
      {description && <Text variant="caption">{description}</Text>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
