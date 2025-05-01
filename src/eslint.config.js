import eslint from "@eslint/js";
import globals from "globals";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginReactRefresh from "eslint-plugin-react-refresh";
import eslintPluginSimpleImportSort from "eslint-plugin-simple-import-sort";
import tsEslint from "typescript-eslint";

export default tsEslint.config({
  files: ["**/*.ts", "**/*.tsx"],
  extends: [
    eslint.configs.recommended,
    tsEslint.configs.strict,
    tsEslint.configs.stylistic,
    eslintPluginReact.configs.flat.recommended,
    eslintPluginReact.configs.flat["jsx-runtime"],
    eslintPluginPrettierRecommended,
  ],
  languageOptions: {
    globals: globals.browser,
    parser: tsEslint.parser,
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
      ecmaVersion: 2020,
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    react: eslintPluginReact,
    "react-hooks": eslintPluginReactHooks,
    "react-refresh": eslintPluginReactRefresh,
    "simple-import-sort": eslintPluginSimpleImportSort,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    ...eslintPluginReactHooks.configs.recommended.rules,
    ...eslintPluginReact.configs.recommended.rules,
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        fixStyle: "separate-type-imports",
        prefer: "type-imports",
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-invalid-void-type": "off",
    "@typescript-eslint/no-restricted-imports": "error",
    "@typescript-eslint/no-unused-expressions": ["error", { allowShortCircuit: true }],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: false,
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-console": "warn",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "react/display-name": "off",
    "react/no-children-prop": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          // Side effect imports,
          // Node.js builtins,
          // Packages,
          // Absolute imports, Anything not matched in another group,
          // ---
          // Relative imports, Anything that starts with a dot,
          // ----
          // Type imports
          ["^\\u0000", "^node:", "^@?\\w", "^"],
          ["^\\."],
          ["^.+\\u0000$"],
        ],
      },
    ],
  },
});
