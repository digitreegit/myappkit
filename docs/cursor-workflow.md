# Cursor 워크플로 (바이브코딩 가이드)

이 키트는 `.cursor/rules/*` 로 Cursor 가 항상 라이브러리를 먼저 쓰도록 유도합니다.

## 황금 규칙 (Cursor 에게 기대하는 것)
1. **재사용 먼저**: 새로 만들기 전에 `@skyface/ui|hooks|utils|api` 에서 찾는다.
2. **토큰만**: 색/간격은 Tailwind 토큰 클래스. hex 금지.
3. **계층 준수**: 컴포넌트는 atoms/molecules/organisms 규칙대로.
4. **패턴 재사용**: 인증/CRUD/폼/구독은 `snippets/*` 패턴을 따른다.
5. **승격**: 재사용성 있는 코드는 앱이 아니라 `packages/*` 에 둔다.

## 프롬프트 예시 (복붙해서 사용)

신규 화면:
> "프로필 편집 화면 만들어줘. @skyface/ui 의 FormField/Button/Card 사용하고,
> 검증은 @skyface/utils 의 zod 패턴(snippets/form-pattern.md) 따라줘.
> 저장은 @skyface/api createCrud 로."

신규 컴포넌트(라이브러리 추가):
> "Tabs 컴포넌트를 packages/ui 에 molecule 로 추가해줘. cva 로 variant 관리하고
> 토큰 클래스만 써. index.ts 와 figma/component-map.md 도 업데이트."

새 앱:
> "react-web 템플릿으로 'habit-tracker' 앱 만들어줘." → `npm run create-app` 안내

점검:
> "snippets/app-launch-checklist.md 기준으로 이 앱 점검하고 빠진 것 고쳐줘."

## 규칙 파일이 자동 적용되는 상황
| 작업 | 적용 규칙 |
| --- | --- |
| 항상 | `general.mdc` |
| `packages/ui/**`, `*.tsx` | `ui-components.mdc` |
| supabase/api 관련 | `supabase.mdc` |
| `figma/**`, 토큰 작업 | `figma-tokens.mdc` |
| 새 앱/템플릿 | `app-template.mdc` |

## 팁
- 큰 작업은 "계획 먼저" 요청 → 검토 후 구현.
- 컴포넌트 만들 때 "Figma 컴포넌트 이름" 을 함께 주면 매핑이 정확해짐.
- 반복되는 코드를 발견하면 Cursor 에게 "이거 packages 로 승격해줘" 라고 요청.
