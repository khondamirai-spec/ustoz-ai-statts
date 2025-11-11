import { FlatCompat } from "@eslint/eslintrc";
import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const compat = new FlatCompat({
  baseDirectory: path.dirname(fileURLToPath(import.meta.url)),
});

export default defineConfig([
  ...compat.extends(
    "next",
    "next/core-web-vitals",
    "next/typescript",
  ),
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
]);
