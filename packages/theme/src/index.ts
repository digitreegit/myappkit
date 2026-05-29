export { primitives, semantic, tokens, default } from "./tokens.generated";
export type { ColorToken, ThemeMode } from "./tokens.generated";

import { semantic } from "./tokens.generated";

/**
 * 런타임에서 토큰 hex 값을 읽을 때 사용 (React Native 등 CSS 변수를 못 쓰는 환경).
 * 웹에서는 가급적 Tailwind 클래스(`bg-primary` 등)나 CSS 변수를 사용하세요.
 */
export function getColor(
  token: keyof typeof semantic.light,
  mode: keyof typeof semantic = "light",
): string {
  return semantic[mode][token];
}

/** <html>/<body> 에 적용할 테마 클래스 ('' | 'dark') */
export function themeClass(mode: keyof typeof semantic): string {
  return mode === "dark" ? "dark" : "";
}
