# 시작하기 — Skyface App Kit 사용 가이드

이 키트를 "앱 공장"으로 쓰는 전체 흐름입니다. 새 앱을 만들 때 이 문서만 따라 하세요.

## 0. 최초 1회 셋업

```bash
npm install            # 모노레포 전체 의존성
npm run build:tokens   # Figma 토큰 → 코드 테마 생성
npm run typecheck      # 정상 확인
```

## 1. 새 앱 만들기

```bash
# 대화형
npm run create-app

# 또는 인자로 한 번에
npm run create-app -- --template react-web --name my-app
```

- `templates/<template>` 가 `apps/<name>` 으로 복제됩니다.
- 자동으로 워크스페이스 멤버가 되어 `@skyface/*` 를 바로 import 합니다.

```bash
npm install                  # 새 워크스페이스 링크
npm run dev -w @app/my-app   # 또는 cd apps/my-app && npm run dev
```

## 2. 개발 (바이브코딩) 흐름

Cursor 에서 다음처럼 시키면 `.cursor/rules` 가 자동 적용되어 일관되게 만들어집니다.

> "로그인 화면 만들어줘. @skyface/ui 의 AuthForm 쓰고, 검증은 @skyface/utils 의 loginSchema 로."

> "todos CRUD 화면 만들어줘. snippets/supabase-crud.md 패턴 따라서."

핵심 원칙:
- **새로 만들기 전에 라이브러리에 있는지 먼저 찾는다.** (`packages/ui`, `hooks`, `utils`)
- 색/간격은 **토큰만** 사용 (하드코딩 금지).
- 재사용될 만한 코드는 앱이 아니라 `packages/*` 에 추가한다.

## 3. 컴포넌트를 라이브러리로 승격하기

앱에서 만든 컴포넌트가 다른 앱에서도 쓸 것 같으면:
1. `apps/<app>/...` 에서 `packages/ui/src/<계층>/` 으로 이동
2. 토큰/cn 사용으로 정리, props 일반화
3. `packages/ui/src/index.ts` 에 export 추가
4. `figma/component-map.md` 에 매핑 기록

이게 이 키트의 핵심 선순환입니다: **앱을 만들수록 라이브러리가 풍부해짐.**

## 4. 디자인 토큰 갱신

Figma 에서 색/간격을 바꿨다면:
```bash
# figma/tokens/*.json 갱신 후
npm run build:tokens
```
모든 앱과 컴포넌트가 자동 반영됩니다. (자세히: figma/sync-notes.md)

## 자주 쓰는 명령어

| 명령 | 설명 |
| --- | --- |
| `npm run create-app` | 새 앱 생성 |
| `npm run build:tokens` | 토큰 → 테마 재생성 |
| `npm run typecheck` | 전체 타입체크 |
| `npm run lint` | 린트 |
| `npm run dev -w @app/<name>` | 특정 앱 실행 |
