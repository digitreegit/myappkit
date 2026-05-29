import { cn } from "../lib/cn";
import { Text } from "../atoms/Text";

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/** 페이지 상단 제목 + 설명 + 액션 영역. */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 pb-6", className)}>
      <div className="flex flex-col gap-1">
        <Text variant="h1">{title}</Text>
        {description && <Text variant="caption">{description}</Text>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
