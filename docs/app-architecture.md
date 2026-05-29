# 앱 아키텍처

## 모노레포 구조

```text
SkyfaceAppKit/
├─ packages/   # 재사용 라이브러리 (버전 공유, 소스 직접 import)
├─ apps/       # 실제 앱 (create-app 으로 생성, 워크스페이스 멤버)
├─ templates/  # 앱 청사진 (설치 대상 아님)
├─ figma/      # 디자인 토큰 원본
├─ snippets/   # 패턴 모음
├─ docs/       # 문서
├─ scripts/    # 자동화
└─ .cursor/    # AI 규칙
```

## 의존성 방향 (한 방향만 허용)

```text
apps  ──▶  ui  ──▶  theme  ──▶  (figma tokens)
  │         │
  ├────────▶ hooks
  ├────────▶ utils ◀── api
  └────────▶ api  ──▶  utils
```

- `apps` 는 모든 패키지를 소비.
- `ui` 는 `theme` 에만 의존 (데이터/네트워크 의존 금지).
- `api` 는 `utils` 까지만 의존.
- **역방향 import 금지** (패키지가 앱을 import 하면 안 됨).

## 앱 내부 권장 구조 (web)

```text
apps/my-app/src/
├─ pages|routes/    # 라우팅 단위
├─ features/        # 도메인별 묶음 (auth, billing…)
│   └─ <feature>/{components,hooks,api}.ts
├─ lib/             # supabase 클라이언트 등 초기화
└─ App.tsx
```

## 코드 배치 결정 트리
1. 다른 앱에서도 쓸까? → **Yes**: `packages/*`
2. 이 앱 여러 화면에서 쓸까? → **Yes**: `features/` 또는 앱 공통 폴더
3. 한 화면 전용? → 그 화면 옆에.

## 상태/데이터
- 서버 데이터는 `@skyface/api` 래퍼로 접근. (필요 시 react-query 등 추가)
- 전역 UI 상태는 가볍게 (Context/zustand). organisms 는 상태를 props 로 받는다.
