// @ts-check

import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import importX from "eslint-plugin-import-x";
import security from "eslint-plugin-security";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  // === Next.js core-web-vitals ===
  ...compat.extends("next/core-web-vitals"),

  // === TypeScript strict ===
  ...tseslint.configs.strict,

  // === Security plugin ===
  security.configs.recommended,

  // === Custom rules ===
  {
    plugins: {
      "import-x": importX,
    },
    rules: {
      // --- TypeScript strict ---
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // --- Security ---
      // detect-eval y detect-object-injection ya están en recommended
      // Asegurar que están activos:
      "security/detect-eval-with-expression": "error",
      "security/detect-object-injection": "warn",

      // --- Import order (6 grupos según Tech Spec §9) ---
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            // Grupo 1: React
            { pattern: "react", group: "builtin", position: "before" },
            { pattern: "react-dom/**", group: "builtin", position: "before" },

            // Grupo 2: Librerías externas (explícitas)
            { pattern: "next/**", group: "external", position: "after" },
            { pattern: "framer-motion/**", group: "external", position: "before" },
            { pattern: "zustand/**", group: "external", position: "before" },
            { pattern: "stripe/**", group: "external", position: "before" },
            { pattern: "inngest/**", group: "external", position: "before" },
            { pattern: "@supabase/**", group: "external", position: "before" },
            { pattern: "@upstash/**", group: "external", position: "before" },
            {
              pattern: "@google/generative-ai",
              group: "external",
              position: "before",
            },

            // Grupo 3: Componentes internos
            { pattern: "@/components/**", group: "internal", position: "before" },

            // Grupo 4: Hooks internos
            { pattern: "@/hooks/**", group: "internal", position: "after" },

            // Grupo 5: Core logic
            { pattern: "@/lib/**", group: "internal", position: "after" },
            { pattern: "@/core/**", group: "internal", position: "after" },

            // Grupo 6: Tipos
            { pattern: "@/types/**", group: "internal", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["react", "type"],
          "newlines-between": "ignore",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import-x/no-duplicates": "error",
    },
    settings: {
      "import-x/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },

  // === Ignores ===
  {
    ignores: [".next/", "node_modules/", "*.config.mjs", "*.config.js", "scripts/"],
  },
);
