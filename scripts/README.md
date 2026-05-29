# scripts

| 스크립트 | 명령 | 설명 |
| --- | --- | --- |
| `build-tokens.ts` | `npm run build:tokens` | figma/tokens → @skyface/theme (TS + CSS 변수) 생성 |
| `sync-figma-tokens.ts` | `npm run sync:tokens` | 토큰 검증(+선택적 원격 fetch) 후 build-tokens 실행 |
| `create-new-app.ts` | `npm run create-app` | templates/* → apps/* 복제로 새 앱 생성 |

모두 외부 의존성 없이 `tsx` 로 실행됩니다.
