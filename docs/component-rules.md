# 컴포넌트 규칙

## Atomic Design 계층

| 계층 | 정의 | 예 | 위치 |
| --- | --- | --- | --- |
| Atoms | 더 못 쪼개는 최소 단위 | Button, Input, Text, Badge, Spinner | `ui/atoms` |
| Molecules | atom 조합, 한 가지 일 | FormField, Card | `ui/molecules` |
| Organisms | molecule/atom 조합, 화면 한 블록 | AuthForm, Navbar | `ui/organisms` |
| Templates/Pages | 페이지 레이아웃·라우팅 | — | 각 앱 (`apps/*`) |

> 어디에 둘지 헷갈리면: "다른 컴포넌트가 이걸 부품으로 쓰나?" → Yes 면 더 낮은 계층.

## 작성 규칙
- 함수형 + TypeScript. props 인터페이스 export.
- 스타일은 Tailwind 토큰 클래스만. 충돌 시 `cn()`(`@skyface/ui`) 사용.
- variant 가 2개 이상 → `class-variance-authority(cva)`.
- 입력류(Button/Input)는 `forwardRef` + `displayName`.
- 외부 부수효과(데이터 fetch 등) 금지 — props/콜백으로 주입받는다 (organisms 도 동일).
- 접근성: label 연결, `aria-*`, 포커스 링(`focus-visible:ring-ring`).

## 안티패턴
- ❌ 앱 안에서만 쓰는 컴포넌트를 `ui` 에 넣기 (재사용성 없는 건 앱에 둔다)
- ❌ `ui` 컴포넌트가 특정 라우터/스토어에 의존
- ❌ hex/px 하드코딩
- ❌ organism 이 직접 supabase 호출 (콜백으로 받기)

## 새 컴포넌트 추가 순서
1. 계층 결정 → 해당 폴더에 파일 생성
2. props 설계 (Figma variant ↔ props 매핑)
3. 계층 `index.ts` 와 `ui/src/index.ts` 에 export
4. `figma/component-map.md` 표 업데이트
