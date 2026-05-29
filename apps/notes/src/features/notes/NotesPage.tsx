import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  EmptyState,
  Input,
  LoadingState,
  Modal,
  PageHeader,
  Text,
  useToast,
} from "@skyface/ui";
import { useDebounce, useDisclosure } from "@skyface/hooks";
import { formatRelativeTime, truncate } from "@skyface/utils";
import { notes, type Note } from "../../lib/notes";
import { NoteEditor } from "./NoteEditor";

interface NotesPageProps {
  dark: boolean;
  onToggleTheme: () => void;
}

export function NotesPage({ dark, onToggleTheme }: NotesPageProps) {
  const { toast } = useToast();
  const editor = useDisclosure();
  const [editing, setEditing] = useState<Note | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const query = useDebounce(search, 250);

  const list = notes.useList();
  const remove = notes.useRemove();

  const filtered = useMemo(() => {
    const rows = list.data ?? [];
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q),
    );
  }, [list.data, query]);

  function openNew() {
    setEditing(null);
    editor.open();
  }
  function openEdit(note: Note) {
    setEditing(note);
    editor.open();
  }
  function handleDelete(id: string) {
    remove.mutate(id, {
      onSuccess: () => toast("노트를 삭제했습니다.", "success"),
      onError: () => toast("삭제에 실패했습니다.", "danger"),
      onSettled: () => setConfirmId(null),
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader
        title="My Notes"
        description="Skyface App Kit 로 만든 첫 앱 — 로컬 저장, 검색, CRUD 데모"
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={onToggleTheme}>
              {dark ? "☀️" : "🌙"}
            </Button>
            <Button size="sm" onClick={openNew}>
              + 새 노트
            </Button>
          </>
        }
      />

      <div className="mb-4">
        <Input
          placeholder="노트 검색…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {list.isLoading ? (
        <LoadingState message="노트를 불러오는 중…" />
      ) : list.isError ? (
        <EmptyState
          title="불러오지 못했습니다"
          description="잠시 후 다시 시도해 주세요."
          action={<Button onClick={() => list.refetch()}>다시 시도</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={query ? "검색 결과가 없습니다" : "아직 노트가 없어요"}
          description={query ? "다른 키워드로 검색해 보세요." : "첫 노트를 만들어 보세요."}
          action={!query && <Button onClick={openNew}>+ 새 노트</Button>}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((note) => (
            <li key={note.id}>
              <Card>
                <CardBody className="flex items-start justify-between gap-4">
                  <button
                    className="flex-1 text-left"
                    onClick={() => openEdit(note)}
                    aria-label={`${note.title} 편집`}
                  >
                    <Text variant="h3">{note.title || "(제목 없음)"}</Text>
                    {note.body && (
                      <Text variant="caption" className="mt-1 block">
                        {truncate(note.body, 100)}
                      </Text>
                    )}
                    <Badge className="mt-2">{formatRelativeTime(note.created_at)}</Badge>
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmId(note.id)}
                    aria-label="삭제"
                  >
                    🗑
                  </Button>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <NoteEditor
        isOpen={editor.isOpen}
        onClose={editor.close}
        note={editing}
        onSaved={(mode) => {
          editor.close();
          toast(mode === "create" ? "노트를 추가했습니다." : "노트를 수정했습니다.", "success");
        }}
      />

      <Modal
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        title="노트 삭제"
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmId(null)}>
              취소
            </Button>
            <Button
              variant="danger"
              isLoading={remove.isPending}
              onClick={() => confirmId && handleDelete(confirmId)}
            >
              삭제
            </Button>
          </>
        }
      >
        <Text variant="body">이 노트를 삭제할까요? 되돌릴 수 없습니다.</Text>
      </Modal>
    </div>
  );
}
