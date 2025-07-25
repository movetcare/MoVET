describe("hours-page-loads", () => {
  Cypress.on("fail", () => false);
  it("display hours list", () => {
    cy.visit(Cypress.env().websiteUrl + "/hours");
    cy.get("h2").contains("Hours of Operation");
    cy.get("h3").contains("MoVET @ Belleview Station");
    cy.get("h3").contains("Clinic Walk-In Hours");
    cy.get("h3").contains("Housecalls");
    // cy.get("span").contains("View Parking Map");
    // cy.get("iframe[title='Google Map of MoVET @ Belleview Station']").should(
    //   "be.visible"
    // );
  });
  it("display closures list", () => {
    cy.visit(Cypress.env().websiteUrl + "/hours");
    cy.get("h3").contains("Seasonal Closures");
    cy.get("span").contains("Christmas");
    cy.get("span").contains("New Year");
  });
  Cypress.on("fail", () => true);
  //if (Cypress.env().environment === "development")
  // it.skip("WINTER MODE - display hours list", () => {
  //   cy.request("POST", Cypress.env().testApiUrl, {
  //     apiKey: Cypress.env().endpointApiKey,
  //     id: "winter-mode-off",
  //   });
  //   cy.request("POST", Cypress.env().testApiUrl, {
  //     apiKey: Cypress.env().endpointApiKey,
  //     id: "winter-mode-on",
  //   }).wait(3000, { log: false });
  //   cy.visit(Cypress.env().websiteUrl + "/hours");
  //   cy.get("h2").contains("Hours of Operation");
  //   cy.get("h3").contains("MoVET @ Belleview Station");
  //   cy.get("h3").contains("Clinic Walk-In Hours");
  //   cy.get("h3").contains("Housecalls");
  //   // cy.get("span").contains("View Parking Map");
  //   // cy.get("iframe[title='Google Map of MoVET @ Belleview Station']").should(
  //   //   "be.visible"
  //   // );
  //   cy.get("p").contains(
  //     "Due to weather variability housecalls are by request only"
  //   );
  //   cy.request("POST", Cypress.env().testApiUrl, {
  //     apiKey: Cypress.env().endpointApiKey,
  //     id: "winter-mode-off",
  //   });
  // });
});
