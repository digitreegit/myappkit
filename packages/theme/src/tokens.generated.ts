// 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
// 원본: figma/tokens/*.json  ·  생성: npm run build:tokens
/* eslint-disable */

export const primitives = {
  "color": {
    "neutral": {
      "0": "#ffffff",
      "50": "#f8fafc",
      "100": "#f1f5f9",
      "200": "#e2e8f0",
      "300": "#cbd5e1",
      "400": "#94a3b8",
      "500": "#64748b",
      "600": "#475569",
      "700": "#334155",
      "800": "#1e293b",
      "900": "#0f172a",
      "950": "#020617"
    },
    "brand": {
      "50": "#eef2ff",
      "100": "#e0e7ff",
      "200": "#c7d2fe",
      "300": "#a5b4fc",
      "400": "#818cf8",
      "500": "#6366f1",
      "600": "#4f46e5",
      "700": "#4338ca",
      "800": "#3730a3",
      "900": "#312e81"
    },
    "green": {
      "500": "#22c55e",
      "600": "#16a34a"
    },
    "amber": {
      "400": "#fbbf24",
      "500": "#f59e0b"
    },
    "red": {
      "500": "#ef4444",
      "600": "#dc2626"
    }
  },
  "radius": {
    "sm": "6px",
    "md": "10px",
    "lg": "16px",
    "xl": "24px"
  },
  "spacing": {
    "0": "0px",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px",
    "12": "48px",
    "16": "64px"
  },
  "fontSize": {
    "xs": "12px",
    "sm": "14px",
    "base": "16px",
    "lg": "18px",
    "xl": "20px",
    "2xl": "24px",
    "3xl": "30px"
  },
  "fontFamily": {
    "sans": "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
  },
  "shadow": {
    "md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
  }
} as const;

export const semantic = {
  light: {
  "background": "#ffffff",
  "surface": "#ffffff",
  "surface-muted": "#f1f5f9",
  "border": "#e2e8f0",
  "input": "#e2e8f0",
  "ring": "#94a3b8",
  "foreground": "#0f172a",
  "muted": "#64748b",
  "primary": "#0f172a",
  "primary-foreground": "#f8fafc",
  "secondary": "#f1f5f9",
  "secondary-foreground": "#0f172a",
  "accent": "#f1f5f9",
  "accent-foreground": "#0f172a",
  "success": "#16a34a",
  "warning": "#f59e0b",
  "danger": "#dc2626"
},
  dark: {
  "background": "#020617",
  "surface": "#0f172a",
  "surface-muted": "#1e293b",
  "border": "#1e293b",
  "input": "#1e293b",
  "ring": "#cbd5e1",
  "foreground": "#f8fafc",
  "muted": "#94a3b8",
  "primary": "#f8fafc",
  "primary-foreground": "#0f172a",
  "secondary": "#1e293b",
  "secondary-foreground": "#f8fafc",
  "accent": "#1e293b",
  "accent-foreground": "#f8fafc",
  "success": "#22c55e",
  "warning": "#fbbf24",
  "danger": "#ef4444"
},
} as const;

export type ColorToken = keyof typeof semantic.light;
export type ThemeMode = keyof typeof semantic;

export const tokens = { primitives, semantic } as const;
export default tokens;
