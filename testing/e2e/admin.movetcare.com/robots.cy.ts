if (Cypress.env().environment === "development")
  describe("robots", () => {
    it("robots file exists", () =>
      cy
        .request(Cypress.env().adminUrl + "/robots.txt")
        .its("status")
        .should("eq", 200));
  });
