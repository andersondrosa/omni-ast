import { ESLint } from "eslint";
import { tokenizer } from "./tokenizer";

export const lint = async (code: string) => {
  const eslint = new ESLint({
    fix: true,
    useEslintrc: false,
    overrideConfig: {
      extends: ["eslint:recommended"],
      parserOptions: { sourceType: "module", ecmaVersion: "latest" },
      env: { es2022: true, node: true },
      rules: {
        "no-extra-semi": "error",
        "no-extra-parens": ["error", "all", { nestedBinaryExpressions: false }],
        semi: ["error", "never"],
      },
    },
  });
  const results = await eslint.lintText(code);
  const { output } = results[0] || {};
  return output || code;
};
