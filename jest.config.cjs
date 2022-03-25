const config = {
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    modulePathIgnorePatterns: ["cypress"],
    testMatch: ["**/*.test.ts"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
};

module.exports = config;
