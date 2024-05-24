/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**"],
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/", "/stories/", "^.*.stories.tsx?$"],
  coverageThreshold: {
    global: {
      lines: 50,
    },
  },
  roots: ["src"],
  testEnvironment: "jsdom",
  verbose: true,
  moduleNameMapper: {
    ".(css|less|scss)$": "identity-obj-proxy",
  },
};
