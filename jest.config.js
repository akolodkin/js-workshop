module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  verbose: true,
  collectCoverageFrom: ["**/index.js", "!node_modules/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
