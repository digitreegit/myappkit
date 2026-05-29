/**
 * 공유 Tailwind preset.
 * 색상은 CSS 변수(rgb 채널)를 참조하므로 light/dark 테마 전환이 자동으로 동작합니다.
 * 변수는 packages/theme/src/variables.css (build:tokens 로 생성) 에서 정의됩니다.
 *
 * 사용처 tailwind.config.js:
 *   module.exports = {
 *     presets: [require("@skyface/config/tailwind")],
 *     content: ["./src/**\/*.{ts,tsx}", "../../packages/ui/src/**\/*.{ts,tsx}"],
 *   };
 */

/** rgb 채널 변수를 alpha-modifier 지원 형태로 감쌉니다. */
const v = (name) => `rgb(var(--sf-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: v("color-background"),
        surface: v("color-surface"),
        "surface-muted": v("color-surface-muted"),
        border: v("color-border"),
        input: v("color-input"),
        ring: v("color-ring"),
        foreground: v("color-foreground"),
        muted: v("color-muted"),
        primary: {
          DEFAULT: v("color-primary"),
          foreground: v("color-primary-foreground"),
        },
        secondary: {
          DEFAULT: v("color-secondary"),
          foreground: v("color-secondary-foreground"),
        },
        accent: {
          DEFAULT: v("color-accent"),
          foreground: v("color-accent-foreground"),
        },
        success: v("color-success"),
        warning: v("color-warning"),
        danger: v("color-danger"),
      },
      borderRadius: {
        sm: "var(--sf-radius-sm)",
        DEFAULT: "var(--sf-radius-md)",
        md: "var(--sf-radius-md)",
        lg: "var(--sf-radius-lg)",
        xl: "var(--sf-radius-xl)",
      },
      boxShadow: {
        sf: "var(--sf-shadow-md)",
        "sf-lg": "var(--sf-shadow-lg)",
      },
      fontFamily: {
        sans: "var(--sf-font-sans)",
      },
    },
  },
  plugins: [],
};
