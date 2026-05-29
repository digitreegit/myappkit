import skyfacePreset from "@skyface/config/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [skyfacePreset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    // 라이브러리 컴포넌트의 클래스도 스캔해야 purge 되지 않음
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};
