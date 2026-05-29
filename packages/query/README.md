# @skyface/query

react-query(@tanstack/react-query) 기반 데이터 레이어. **Repository 추상화** 덕분에 백엔드를 바꿔도 화면 코드는 그대로입니다.

## 개념

```text
화면 컴포넌트
   │  useList / useCreate / useUpdate / useRemove
   ▼
createResourceHooks(key, repo)   ← react-query 캐시/무효화 자동
   ▼
Repository<T>  ──┬── createLocalRepository(key)        # localStorage (데모/오프라인)
                 └── createRepository(supabase, table) # Supabase (@skyface/api)
```

## 사용

```tsx
// 1) 앱 루트
import { QueryProvider } from "@skyface/query";
<QueryProvider><App /></QueryProvider>

// 2) 리소스 정의
import { createLocalRepository, createResourceHooks } from "@skyface/query";
interface Note { id: string; title: string; body: string; created_at: string }
const repo = createLocalRepository<Note>("skyface.notes");
export const notes = createResourceHooks("notes", repo);

// 3) 화면에서
const { data, isLoading } = notes.useList();
const create = notes.useCreate();
create.mutate({ title: "제목", body: "내용" });
```

## Supabase 로 전환
`repo` 한 줄만 교체하면 됩니다:

```ts
import { createRepository } from "@skyface/api";
const repo = createRepository<Note>(supabase, "notes"); // 화면 코드 변경 0
```
