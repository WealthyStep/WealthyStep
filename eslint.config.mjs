import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Intentionally suppressed for production: unescaped entities are common in marketing copy
      "react/no-unescaped-entities": "off",
      // Unused vars often remain during rapid development, safe to ignore
      "@typescript-eslint/no-unused-vars": "off",
      // 'any' used in strict third-party API types that are hard to satisfy
      "@typescript-eslint/no-explicit-any": "off",
      // Empty interfaces used for future component props expansion
      "@typescript-eslint/no-empty-object-type": "off",
      // We intentionally use <img> for tiny avatars/logos where next/image overhead is unnecessary
      "@next/next/no-img-element": "off"
    }
  }
]);

export default eslintConfig;
