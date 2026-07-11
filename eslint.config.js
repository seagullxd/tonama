import globals from "globals";

export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser  // This includes ALL browser globals automatically!
      }
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-dupe-args": "error",
      "no-dupe-keys": "error",
      "semi": ["error", "always"],
      "quotes": ["error", "double"]
    }
  }
];
