const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "isemvz",
  env: {
    environment: process.env.CYPRESS_ENVIRONMENT || "development",
    adminUrl: process.env.CYPRESS_ADMIN_URL || "http://localhost:3002",
    appUrl: process.env.CYPRESS_APP_URL || "http://localhost:3001",
    websiteUrl: process.env.CYPRESS_WEBSITE_URL || "http://localhost:3000",
    emulatorUrl: "http://localhost:4000",
    testApiUrl:
      process.env.CYPRESS_TEST_API_URL ||
      "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
    defaultPathnameTimeOut:
      Number(process.env.CYPRESS_DISPLAY_PATH_TIMEOUT) || 30000,
    onlyTestOnePatient: process.env.CYPRESS_ONLY_TEST_ONE_PATIENT || true,
    skipWellnessCheck: process.env.CYPRESS_SKIP_WELLNESS_CHECK || true,
    endpointApiKey: "L9At3HGmvRDuyi7TTX",
    existingClientNoPaymentEmail: "dev+test@movetcare.com",
    existingClientNoPaymentFirstName: "(No Payment) Fake Client - ",
    existingClientNoPaymentLastName: "DO NOT DELETE",
    existingClientNoPaymentId: 5769,
    existingClientWithPaymentEmail: "dev+test_vcpr_not_required@movetcare.com",
    existingClientWithPaymentId: 6008,
    existingClientWithPaymentFirstName: "(Has Payment) Fake Client - ",
    existingClientWithPaymentLastName: "DO NOT DELETE",
    existingPatientWithNoVcprName: "NO VCPR TEST DOG",
    existingPatientWithVcprName: "VCPR REQUIRED TEST DOG",
    contactFormTestUserEmail: "dev+test_cypress_contact_test@movetcare.com",
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
    // setupNodeEvents(on, config) {
    //   require("cypress-fail-fast/plugin")(on, config);
    //   return config;
    // },
    specPattern: "testing/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "testing/support/e2e.{js,jsx,ts,tsx}",
  },
});
