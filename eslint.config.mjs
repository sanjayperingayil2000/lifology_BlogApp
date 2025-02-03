import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // Disables 'unused vars' error
      "next/next/no-img-element": "off", // Allows <img> usage without warnings
      "react-hooks/exhaustive-deps": "off", // Disables React hooks dependency warnings
      "no-console": "off", // Allows console.log() usage
      "eslint-disable-all": "off", // Disables all ESLint rules
    },
  },
];

export default eslintConfig;
