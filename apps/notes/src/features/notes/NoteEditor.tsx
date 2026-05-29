import { useEffect, useState } from "react";
import { Button, FormField, Modal, TextArea } from "@skyface/ui";
import { notes, type Note } from "../../lib/notes";

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  note: Note | null;
  onSaved: (mode: "create" | "update") => void;
}

export function NoteEditor({ isOpen, onClose, note, onSaved }: NoteEditorProps) {
  const create = notes.useCreate();
  const update = notes.useUpdate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (isOpen) {
      setTitle(note?.title ?? "");
      setBody(note?.body ?? "");
      setError(undefined);
    }
  }, [isOpen, note]);

  const isPending = create.isPending || update.isPending;

  function handleSave() {
    if (!title.trim()) {
      setError("제목을 입력하세요.");
      return;
    }
    if (note) {
      update.mutate(
        { id: note.id, values: { title, body } },
        { onSuccess: () => onSaved("update") },
      );
    } else {
      create.mutate({ title, body }, { onSuccess: () => onSaved("create") });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={note ? "노트 편집" : "새 노트"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button isLoading={isPending} onClick={handleSave}>
            저장
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <FormField
          label="제목"
          value={title}
          error={error}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">내용</label>
          <TextArea rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}
