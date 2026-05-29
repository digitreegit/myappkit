# @skyface/config

모든 패키지·앱이 공유하는 설정 모음입니다. 한 곳에서 바꾸면 전체에 반영됩니다.

## tsconfig

```jsonc
// 앱의 tsconfig.json
{
  "extends": "@skyface/config/tsconfig/react", // 또는 nextjs / react-native / base
  "include": ["src"]
}
```

## ESLint

```js
// .eslintrc.cjs
module.exports = { root: true, extends: ["@skyface/config/eslint"] };
```

## Prettier

```jsonc
// .prettierrc.json
"@skyface/config/prettier"
```

## Tailwind

```js
// tailwind.config.js
module.exports = {
  presets: [require("@skyface/config/tailwind")],
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
};
```

> Tailwind 색상은 CSS 변수를 참조하므로, 앱 진입 CSS에서
> `@import "@skyface/theme/variables.css";` 를 반드시 불러와야 색이 적용됩니다.
