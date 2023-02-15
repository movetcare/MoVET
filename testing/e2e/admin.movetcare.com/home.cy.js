describe("login-page-loads", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3002");
  });
  it("display app login button", () => {
    cy.get("main button").contains("EMAIL").should("be.visible");
  });
});
