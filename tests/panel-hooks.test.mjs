import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { ESLint } from "eslint";
import parser from "@typescript-eslint/parser";
import reactHooks from "eslint-plugin-react-hooks";

test("panel keeps hook order when the SSO session finishes loading", async () => {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [{
      files: ["**/*.tsx"],
      languageOptions: { parser, parserOptions: { ecmaFeatures: { jsx: true } } },
      plugins: { "react-hooks": reactHooks },
      rules: { "react-hooks/rules-of-hooks": "error" },
    }],
  });
  const results = await eslint.lintFiles([
    fileURLToPath(new URL("../app/panel/RoleDashboard.tsx", import.meta.url)),
  ]);
  assert.deepEqual(results.flatMap((result) => result.messages), []);
});
