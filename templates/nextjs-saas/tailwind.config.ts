import type { Config } from "tailwindcss";
import skyfacePreset from "@skyface/config/tailwind";

const config: Config = {
  presets: [skyfacePreset as Config],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
};

export default config;
