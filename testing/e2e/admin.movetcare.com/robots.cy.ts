if (Cypress.env().testAdminApp)
  describe("robots", () => {
    it("robots file exists", () =>
      cy
        .request(Cypress.env().adminUrl + "/robots.txt")
        .its("status")
        .should("eq", 200));
  });
