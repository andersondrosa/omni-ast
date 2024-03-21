import { defineConfig } from "vitest/config";

const exclude = [
  // "./test/generators/**", //
  "./tests/integrity/**", //
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
