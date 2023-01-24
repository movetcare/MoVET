describe("404", () => {
  it("Displays 404 error page", () => {
    cy.visit("http://localhost:3001/page-does-not-exist", {
      failOnStatusCode: false,
    });
    cy.get("h2").contains("404 - Not Found");
  });
});
