import { defineConfig } from "cypress";

const cypressConfig = defineConfig({
    e2e: {
        baseUrl: "http://localhost:3000",
        defaultCommandTimeout: 10_000,
        downloadsFolder: "tests/cypress/downloads",
        fixturesFolder: "tests/cypress/fixtures",
        specPattern: "tests/cypress/suites/*.test.ts",
        screenshotsFolder: "tests/cypress/screenshots",
        supportFile: "tests/cypress/support.ts",
        videosFolder: "tests/cypress/videos",
        watchForFileChanges: true,
        testIsolation: false,
        viewportHeight: 1000,
        viewportWidth: 1200,
    },
});

export default cypressConfig;
