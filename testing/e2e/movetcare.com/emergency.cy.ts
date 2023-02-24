describe("emergency-page", () => {
  it("emergency link works", () => {
    cy.visit(Cypress.env().websiteUrl);
    cy.get("footer a p").contains("Emergency Care").click();
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/emergency/");
    cy.get("h2").contains("Emergency Care Notice");
  });
  it("emergency page content exists", () => {
    cy.visit(Cypress.env().websiteUrl + "/emergency");
    cy.get("h2").contains("Emergency Care Notice");
    cy.get("p").contains(
      "If you think this is an animal emergency, please contact a 24/7 ER clinic or urgent care center:"
    );
  });
});
