module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "./src",
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest"
  },
  collectCoverageFrom: ["**/*.service.ts", "**/*.controller.ts"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
};
