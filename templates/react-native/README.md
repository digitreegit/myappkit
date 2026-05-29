# react-native 템플릿 (Expo + TS)

모바일 스타터. **디자인 토큰을 공유**하되 UI는 네이티브 컴포넌트로 구성합니다.

## 새 앱 만들기

```bash
npm run create-app -- --template react-native --name my-mobile
cd apps/my-mobile && npm install && npm start
```

## 중요한 차이점
- `@skyface/ui` 는 **웹 DOM 전용**이라 RN 에서 import 하지 않습니다.
- 대신 `@skyface/theme` 의 `getColor(token, mode)` 로 **같은 토큰 값**을 StyleSheet 에 사용합니다.
- `@skyface/hooks`, `@skyface/utils`, `@skyface/api` 는 그대로 사용 가능.

## 토큰 일관성 유지
웹/모바일이 같은 `figma/tokens` 를 보므로 색이 자동으로 일치합니다.
RN 전용 컴포넌트가 늘어나면 `packages/ui-native` 패키지를 새로 만들어 분리하는 것을 권장합니다.
