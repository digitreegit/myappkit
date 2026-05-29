import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "../lib/cn";
import { Text } from "../atoms/Text";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/** 접근성 기본을 갖춘 모달. 열림 상태는 useDisclosure(@skyface/hooks) 로 관리하세요. */
export function Modal({ isOpen, onClose, title, children, footer, className }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "w-full max-w-md rounded-lg border border-border bg-surface shadow-sf-lg",
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="border-b border-border p-5">
            <Text variant="h3">{title}</Text>
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-border p-5">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
