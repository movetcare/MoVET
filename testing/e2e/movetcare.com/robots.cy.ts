describe("robots", () => {
  it("robots file exists", () =>
    cy
      .request(Cypress.env().websiteUrl + "/robots.txt")
      .its("status")
      .should("eq", 200));
});
