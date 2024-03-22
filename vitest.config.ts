import { defineConfig } from "vitest/config";

const exclude = [
  "./tests/generators/**", //
  "./tests/integrity/**", //
  // "./tests/defaults/**", //
];

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/src/**",
      "**/dist/**",
      "./tests/utils/**",
      ...exclude,
    ],
  },
});
