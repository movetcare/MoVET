describe("404", () => {
  it("Displays 404 error page", () => {
    cy.visit("https://app.movetcare.com/page-does-not-exist", {
      failOnStatusCode: false,
    });
    cy.get("h2").contains("404 - Not Found");
  });
});
