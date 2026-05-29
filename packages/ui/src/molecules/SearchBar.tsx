import { Input } from "../atoms/Input";
import { cn } from "../lib/cn";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** 지우기 버튼의 aria-label */
  clearLabel?: string;
}

/** 아이콘 + 지우기 버튼이 있는 검색 입력. 값 상태는 호출 측에서 관리하세요. */
export function SearchBar({
  value,
  onChange,
  placeholder,
  className,
  clearLabel = "검색어 지우기",
}: SearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        🔍
      </span>
      <Input
        className="pl-9 pr-9"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          aria-label={clearLabel}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
          onClick={() => onChange("")}
        >
          ✕
        </button>
      )}
    </div>
  );
}
