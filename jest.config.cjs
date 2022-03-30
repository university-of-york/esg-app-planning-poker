const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    modulePathIgnorePatterns: ["cypress"],
    moduleFileExtensions: ["js", "mjs", "ts"],
    testMatch: ["**/*.test.ts"],
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        "^.+\\.ts?$": "ts-jest",
        "^.+\\.tsx?$": "ts-jest",
    },
    globals: {
        'ts-jest': {
            useESM: true
        }
    }
};

module.exports = config;
