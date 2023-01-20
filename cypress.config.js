const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    defaultPathnameTimeOut:
      Number(process.env.CYPRESS_DISPLAY_PATH_TIMEOUT) || 6000,
    onlyTestOnePatient: process.env.CYPRESS_ONLY_TEST_ONE_PATIENT || true,
    skipWellnessCheck: process.env.CYPRESS_SKIP_WELLNESS_CHECK || true,
    endpointApiKey: process.env.CYPRESS_ENDPOINT_API_KEY || "",
    vcprClientEmail: "alex.rodriguez+CYPRESS_TEST_VCPR_REQUIRED@MOVETCARE.COM",
    noVcprClientEmail:
      "alex.rodriguez+CYPRESS_TEST_VCPR_NOT_REQUIRED@MOVETCARE.COM",
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  defaultCommandTimeout: 10000,
  redirectionLimit: 3,
  requestTimeout: 10000,
  responseTimeout: 30000,
  taskTimeout: 60000,
  viewportHeight: 667,
  viewportWidth: 375,
  fixturesFolder: "testing/fixtures",
  downloadsFolder: "testing/results/downloads",
  screenshotsFolder: "testing/results/screenshots",
  videosFolder: "testing/results/videos",
  e2e: {
    specPattern: "testing/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "testing/support/e2e.{js,jsx,ts,tsx}",
  },
  component: {
    specPattern: "testing/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "testing/support/e2e.{js,jsx,ts,tsx}",
  },
});
