// eslint.config.js
import js from "@eslint/js";
import ts from "typescript-eslint";
import astro from "eslint-plugin-astro";

export default [
  {
    ignores: [
      "src/components/typed.umd.js",
      "src/scripts/pageScript.bundle.js",
      "src/scripts/Untitled.js",
      "src/scripts/google-analytics_analytics.js",
      "src/pages/contact.astro",
      ".astro/**/*",
      "dist/**/*",
      "node_modules/**/*",
    ],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs["flat/recommended"],
  {
    files: ["**/*.js", "**/*.ts", "**/*.astro"],
    languageOptions: {
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        performance: "readonly",
        URLSearchParams: "readonly",
        atob: "readonly",
        btoa: "readonly",
        self: "readonly",
        // DOM types
        Element: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLSelectElement: "readonly",
        HTMLOptionElement: "readonly",
        HTMLTextAreaElement: "readonly",
        XPathResult: "readonly",
        // Event types
        Event: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
        FocusEvent: "readonly",
        InputEvent: "readonly",
      },
    },
    rules: {
      // Your custom rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "no-undef": "off", // Turn off since we're defining globals above
    },
  },
  {
    files: ["**/*.astro"],
    rules: {
      // Disable parsing errors for Astro files
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
