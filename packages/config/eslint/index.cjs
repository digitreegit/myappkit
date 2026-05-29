/**
 * 공유 ESLint 설정 (classic config).
 * 사용처 .eslintrc.cjs:
 *   module.exports = { root: true, extends: ["@skyface/config/eslint"] };
 */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: 2021, sourceType: "module", ecmaFeatures: { jsx: true } },
  plugins: ["@typescript-eslint", "react-hooks"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: { browser: true, es2021: true, node: true },
  settings: { react: { version: "detect" } },
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }]
  },
  ignorePatterns: ["dist", "build", ".next", "node_modules", "*.generated.ts"]
};
