import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  ConfirmDialog,
  EmptyState,
  LoadingState,
  PageHeader,
  SearchBar,
  Text,
  useToast,
} from "@skyface/ui";
import { useDebounce, useDisclosure } from "@skyface/hooks";
import { formatRelativeTime } from "@skyface/utils";
import { bookmarks, type Bookmark } from "../../lib/bookmarks";
import { BookmarkEditor } from "./BookmarkEditor";

interface BookmarksPageProps {
  dark: boolean;
  onToggleTheme: () => void;
  userEmail?: string;
  onSignOut?: () => void;
}

export function BookmarksPage({ dark, onToggleTheme, userEmail, onSignOut }: BookmarksPageProps) {
  const { toast } = useToast();
  const editor = useDisclosure();
  const [editing, setEditing] = useState<Bookmark | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const query = useDebounce(search, 250);

  const list = bookmarks.useList();
  const remove = bookmarks.useRemove();

  const filtered = useMemo(() => {
    const rows = list.data ?? [];
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q) ||
        b.tag.toLowerCase().includes(q),
    );
  }, [list.data, query]);

  function openNew() {
    setEditing(null);
    editor.open();
  }
  function openEdit(bookmark: Bookmark) {
    setEditing(bookmark);
    editor.open();
  }
  function handleDelete(id: string) {
    remove.mutate(id, {
      onSuccess: () => toast("북마크를 삭제했습니다.", "success"),
      onError: () => toast("삭제에 실패했습니다.", "danger"),
      onSettled: () => setConfirmId(null),
    });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader
        title="My Bookmarks"
        description="Skyface App Kit 로 만든 두 번째 앱 — 노트 앱과 같은 라이브러리를 재사용"
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={onToggleTheme}>
              {dark ? "☀️" : "🌙"}
            </Button>
            {onSignOut && (
              <Button variant="ghost" size="sm" onClick={onSignOut} title={userEmail}>
                로그아웃
              </Button>
            )}
            <Button size="sm" onClick={openNew}>
              + 새 북마크
            </Button>
          </>
        }
      />

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="제목·URL·태그 검색…" />
      </div>

      {list.isLoading ? (
        <LoadingState message="북마크를 불러오는 중…" />
      ) : list.isError ? (
        <EmptyState
          title="불러오지 못했습니다"
          description="잠시 후 다시 시도해 주세요."
          action={<Button onClick={() => list.refetch()}>다시 시도</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={query ? "검색 결과가 없습니다" : "아직 북마크가 없어요"}
          description={query ? "다른 키워드로 검색해 보세요." : "첫 북마크를 추가해 보세요."}
          action={!query && <Button onClick={openNew}>+ 새 북마크</Button>}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((bookmark) => (
            <li key={bookmark.id}>
              <Card>
                <CardBody className="flex items-start justify-between gap-4">
                  <button
                    className="flex-1 text-left"
                    onClick={() => openEdit(bookmark)}
                    aria-label={`${bookmark.title} 편집`}
                  >
                    <Text variant="h3">{bookmark.title || "(제목 없음)"}</Text>
                    {bookmark.url && (
                      <Text variant="caption" className="mt-1 block break-all">
                        {bookmark.url}
                      </Text>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      {bookmark.tag && <Badge tone="primary">{bookmark.tag}</Badge>}
                      <Badge>{formatRelativeTime(bookmark.created_at)}</Badge>
                    </div>
                  </button>
                  <div className="flex shrink-0 items-center gap-1">
                    {bookmark.url && (
                      <a
                        href={bookmark.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="열기"
                      >
                        <Button variant="ghost" size="sm">
                          ↗
                        </Button>
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmId(bookmark.id)}
                      aria-label="삭제"
                    >
                      🗑
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <BookmarkEditor
        isOpen={editor.isOpen}
        onClose={editor.close}
        bookmark={editing}
        onSaved={(mode) => {
          editor.close();
          toast(mode === "create" ? "북마크를 추가했습니다." : "북마크를 수정했습니다.", "success");
        }}
      />

      <ConfirmDialog
        isOpen={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => confirmId && handleDelete(confirmId)}
        title="북마크 삭제"
        message="이 북마크를 삭제할까요? 되돌릴 수 없습니다."
        confirmLabel="삭제"
        isLoading={remove.isPending}
      />
    </div>
  );
}
