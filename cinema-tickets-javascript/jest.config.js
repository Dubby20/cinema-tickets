export default {
  clearMocks: true,
  collectCoverageFrom: [
    "**/*.{js}",
    "!**/node_modules/**",
    "!jest.config.js",
    "!**/coverage/**",
    "!**/tests/**",
    "**/src/**",
  ],
  coverageDirectory: "coverage",
  moduleFileExtensions: ["js", "json"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["\\\\node_modules\\\\"],
  transform: {
    "\\.js$": "babel-jest",
  },
  verbose: false,
};
