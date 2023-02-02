const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "isemvz",
  env: {
    defaultPathnameTimeOut:
      Number(process.env.CYPRESS_DISPLAY_PATH_TIMEOUT) || 10000,
    onlyTestOnePatient: process.env.CYPRESS_ONLY_TEST_ONE_PATIENT || true,
    skipWellnessCheck: process.env.CYPRESS_SKIP_WELLNESS_CHECK || true,
    endpointApiKey: "L9At3HGmvRDuyi7TTX",
    existingClientNoPayment: "dev+test@movetcare.com",
    existingClientWithPayment: "dev+test_vcpr_not_required@movetcare.com",
  },
  retries: {
    runMode: 3,
    openMode: 2,
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
  experimentalModifyObstructiveThirdPartyCode: true,
});
