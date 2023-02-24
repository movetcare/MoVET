describe("robots", () => {
  it("robots file exists", () =>
    cy
      .request(Cypress.env().appUrl + "/robots.txt")
      .its("status")
      .should("eq", 200));
});
