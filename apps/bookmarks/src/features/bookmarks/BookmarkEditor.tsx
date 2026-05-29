import { useEffect, useState } from "react";
import { Button, FormField, Modal } from "@skyface/ui";
import { bookmarks, type Bookmark } from "../../lib/bookmarks";

interface BookmarkEditorProps {
  isOpen: boolean;
  onClose: () => void;
  bookmark: Bookmark | null;
  onSaved: (mode: "create" | "update") => void;
}

export function BookmarkEditor({ isOpen, onClose, bookmark, onSaved }: BookmarkEditorProps) {
  const create = bookmarks.useCreate();
  const update = bookmarks.useUpdate();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (isOpen) {
      setTitle(bookmark?.title ?? "");
      setUrl(bookmark?.url ?? "");
      setTag(bookmark?.tag ?? "");
      setError(undefined);
    }
  }, [isOpen, bookmark]);

  const isPending = create.isPending || update.isPending;

  function handleSave() {
    if (!title.trim()) {
      setError("제목을 입력하세요.");
      return;
    }
    const values = { title: title.trim(), url: url.trim(), tag: tag.trim() };
    if (bookmark) {
      update.mutate({ id: bookmark.id, values }, { onSuccess: () => onSaved("update") });
    } else {
      create.mutate(values, { onSuccess: () => onSaved("create") });
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={bookmark ? "북마크 편집" : "새 북마크"}
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
        <FormField
          label="URL"
          placeholder="https://"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <FormField label="태그" value={tag} onChange={(e) => setTag(e.target.value)} />
      </div>
    </Modal>
  );
}
