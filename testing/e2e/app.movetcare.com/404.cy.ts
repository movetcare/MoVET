describe("404", () => {
  it("Displays 404 error page", () => {
    cy.visit(Cypress.env().appUrl + "/page-does-not-exist", {
      failOnStatusCode: false,
    });
    cy.get("h2").contains("404 - Not Found");
  });
});
