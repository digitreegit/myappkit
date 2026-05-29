import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Repository } from "./types";

/**
 * Repository 하나로부터 표준 react-query 훅 세트를 생성합니다.
 * 캐시 무효화(invalidation)까지 자동 처리되어 보일러플레이트가 사라집니다.
 *
 *   const notes = createResourceHooks("notes", notesRepo);
 *   const { data, isLoading } = notes.useList();
 *   const create = notes.useCreate();
 *   create.mutate({ title: "..." });
 */
export function createResourceHooks<T extends { id: string }, NewT = Omit<T, "id">>(
  resourceKey: string,
  repo: Repository<T, NewT>,
) {
  const listKey = [resourceKey] as const;
  const itemKey = (id: string) => [resourceKey, id] as const;

  function useList() {
    return useQuery({ queryKey: listKey, queryFn: () => repo.list() });
  }

  function useItem(id: string | undefined) {
    return useQuery({
      queryKey: itemKey(id ?? ""),
      queryFn: () => repo.getById(id as string),
      enabled: !!id,
    });
  }

  function useCreate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (values: NewT) => repo.create(values),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    });
  }

  function useUpdate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, values }: { id: string; values: Partial<T> }) =>
        repo.update(id, values),
      onSuccess: (_data, { id }) => {
        qc.invalidateQueries({ queryKey: listKey });
        qc.invalidateQueries({ queryKey: itemKey(id) });
      },
    });
  }

  function useRemove() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => repo.remove(id),
      onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
    });
  }

  return { useList, useItem, useCreate, useUpdate, useRemove };
}
