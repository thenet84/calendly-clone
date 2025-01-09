import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import stylisticJs from '@stylistic/eslint-plugin-js';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {

      '@stylistic/js/indent': ['error', 2],
      // ...
    }
  }
];

