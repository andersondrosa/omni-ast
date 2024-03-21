import { defineConfig } from "vitest/config";

const exclude = [
  "./test/generators/**", //
  "./test/integrity/**", //
];

export default defineConfig({
  test: {
    exclude: [
      "**/node_modules/**",
      "**/src/**",
      "**/dist/**",
      "./test/utils/**",
      ...exclude,
    ],
  },
});
