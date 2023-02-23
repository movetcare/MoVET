describe("hours-page-loads", () => {
  beforeEach(() => {
    cy.visit("https://movetcare.com/hours");
  });
  it("display hours list", () => {
    cy.get("h2").contains("Hours of Operation");
    cy.get("h3").contains("MoVET @ Belleview Station");
    cy.get("h3").contains("Clinic Walk-In Hours");
    cy.get("h3").contains("Housecalls");
    // cy.get("span").contains("View Parking Map");
    // cy.get("iframe[title='Google Map of MoVET @ Belleview Station']").should(
    //   "be.visible"
    // );
  });
  it("WINTER MODE - display hours list", () => {
    cy.request(
      "POST",
      "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
      { apiKey: Cypress.env().endpointApiKey, id: "winter-mode-off" }
    );
    cy.request(
      "POST",
      "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
      { apiKey: Cypress.env().endpointApiKey, id: "winter-mode-on" }
    ).wait(3000, { log: false });
    cy.get("h2").contains("Hours of Operation");
    cy.get("h3").contains("MoVET @ Belleview Station");
    cy.get("h3").contains("Clinic Walk-In Hours");
    cy.get("h3").contains("Housecalls");
    // cy.get("span").contains("View Parking Map");
    // cy.get("iframe[title='Google Map of MoVET @ Belleview Station']").should(
    //   "be.visible"
    // );
    cy.get("p").contains(
      "Due to weather variability housecalls are by request only"
    );
    cy.request(
      "POST",
      "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
      { apiKey: Cypress.env().endpointApiKey, id: "winter-mode-off" }
    );
  });
});
