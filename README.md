# 🏭 Skyface App Kit

> **나만의 앱 공장 Starter Kit** — Figma 디자인 시스템 + 재사용 코드 + Cursor 규칙을 하나로 묶은 모노레포.
> 새 앱을 만들 때마다 0부터 시작하지 말고, 검증된 컴포넌트·훅·패턴을 **그대로 가져다 쓰세요.**

Atomic Design 방법론을 코드와 디자인에 동시에 적용해, "디자인 토큰 → 컴포넌트 → 템플릿 → 앱"으로 이어지는 일관된 파이프라인을 제공합니다.

---

## 📦 무엇이 들어있나요

| 영역 | 위치 | 설명 |
| --- | --- | --- |
| 공통 UI | `packages/ui` | Atomic Design 기반 React 컴포넌트 (atoms/molecules/organisms) |
| 재사용 Hooks | `packages/hooks` | `useDebounce`, `useDisclosure`, `useAuth`, `useFormSubmit` 등 |
| 유틸 | `packages/utils` | formatter, validation(zod), helpers |
| API 래퍼 | `packages/api` | Supabase client / auth / CRUD / Repository 어댑터 |
| 데이터 레이어 | `packages/query` | react-query + Repository 추상화 (백엔드 교체 무관) |
| 테마 | `packages/theme` | Figma 토큰에서 생성된 디자인 토큰 (TS) |
| 공유 설정 | `packages/config` | eslint / tsconfig / tailwind / prettier preset |
| Figma 토큰 | `figma/tokens` | Tokens Studio export 원본 + 매핑 문서 |
| 템플릿 | `templates/*` | react-web · react-native · nextjs-saas 스타터 |
| 스니펫 | `snippets/*` | auth, subscription, form, CRUD, 런칭 체크리스트 |
| 문서 | `docs/*` | 디자인 시스템 / 컴포넌트 규칙 / 아키텍처 / 네이밍 / Cursor 워크플로 |
| Cursor 규칙 | `.cursor/rules/*` | 바이브코딩 시 일관성을 강제하는 규칙 |

---

## 🚀 빠른 시작

```bash
# 1) 의존성 설치 (npm workspaces)
npm install

# 2) Figma 토큰 → 테마 코드 생성
npm run build:tokens

# 3) 타입체크
npm run typecheck

# 4) 새 앱 만들기 (템플릿에서 복제)
npm run create-app
```

> 자세한 사용법은 **[docs/getting-started.md](docs/getting-started.md)** 와
> **[docs/cursor-workflow.md](docs/cursor-workflow.md)** 를 보세요.

---

## 🧱 폴더 구조

```text
SkyfaceAppKit/
├─ packages/        # 재사용 라이브러리 (소스 그대로 import)
│  ├─ ui/ hooks/ utils/ api/ theme/ config/
├─ figma/           # 디자인 토큰 원본 + 매핑
├─ templates/       # 새 앱 시작점
├─ snippets/        # 반복 패턴 (복붙용 + Cursor 참조용)
├─ docs/            # 설계/규칙 문서
├─ scripts/         # 토큰 빌드 / 동기화 / 앱 생성 자동화
├─ .github/         # CI + 토큰 자동 PR
└─ .cursor/rules/   # Cursor AI 규칙
```

## 🔁 핵심 워크플로

```text
Figma (Tokens Studio)
   │  export
   ▼
figma/tokens/*.json ──build:tokens──▶ packages/theme  ──▶ packages/ui  ──▶ templates  ──▶ 내 새 앱
                                          ▲                   ▲
                                    tailwind preset      Cursor 규칙/스니펫이 일관성 보장
```

라이선스: 개인용. 자유롭게 복제·수정하세요.
