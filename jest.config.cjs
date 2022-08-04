const config = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    roots: ["<rootDir>/tests"],
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    modulePathIgnorePatterns: ["cypress"],
    moduleFileExtensions: ["js", "mjs", "ts", "jsx", "tsx"],
    moduleNameMapper: {
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|webp|svg)$": "<rootDir>/tests/helpers/assetMock.cjs",
    },
    testMatch: ["**/*.test.mjs", "**/*.test.ts"],
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.(js|mjs|jsx)$": "babel-jest",
        "^.+\\.(ts|tsx)$": "ts-jest",
    },
    globals: {
        "ts-jest": {
            useESM: true,
        },
    },
};

module.exports = config;
