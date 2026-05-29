import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { Modal } from "./Modal";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** 확정 버튼 톤. 삭제류는 danger, 일반 확인은 primary */
  tone?: "danger" | "primary";
  isLoading?: boolean;
}

/** 확인/취소 2버튼 확인 다이얼로그 (삭제 확인 등). Modal 위에 구성. */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  tone = "danger",
  isLoading,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={tone} isLoading={isLoading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <Text variant="body">{message}</Text>
    </Modal>
  );
}
