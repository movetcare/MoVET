const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "isemvz",
  env: {
    defaultPathnameTimeOut:
      Number(process.env.CYPRESS_DISPLAY_PATH_TIMEOUT) || 15000,
    onlyTestOnePatient: process.env.CYPRESS_ONLY_TEST_ONE_PATIENT || true,
    skipWellnessCheck: process.env.CYPRESS_SKIP_WELLNESS_CHECK || true,
    endpointApiKey: "L9At3HGmvRDuyi7TTX",
    existingClientNoPaymentEmail: "dev+test@movetcare.com",
    existingClientNoPaymentFirstName: "(No Payment) Fake Client - ",
    existingClientNoPaymentLastName: "DO NOT DELETE",
    existingClientNoPaymentId: 5769,
    existingClientWithPaymentEmail: "dev+test_vcpr_not_required@movetcare.com",
    existingClientWithPaymentId: 5768,
    existingClientWithPaymentFirstName: "(Has Payment) Fake Client - ",
    existingClientWithPaymentLastName: "DO NOT DELETE",
    existingPatientWithNoVcprName: "NO VCPR TEST DOG",
    existingPatientWithVcprName: "VCPR REQUIRED TEST DOG",
  },
  retries: {
    runMode: 4,
    openMode: 0,
  },
  defaultCommandTimeout: 25000,
  redirectionLimit: 3,
  requestTimeout: 15000,
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
  // modifyObstructiveCode: true,
  // experimentalModifyObstructiveThirdPartyCode: true,
});
