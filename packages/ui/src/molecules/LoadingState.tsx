import { cn } from "../lib/cn";
import { Spinner } from "../atoms/Spinner";
import { Text } from "../atoms/Text";

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

/** 로딩 중 중앙 정렬 스피너 + 메시지. */
export function LoadingState({ message = "불러오는 중…", className }: LoadingStateProps) {
  return (
    <div
      role="status"
      className={cn("flex flex-col items-center justify-center gap-3 p-10", className)}
    >
      <Spinner size={28} />
      {message && <Text variant="caption">{message}</Text>}
    </div>
  );
}
