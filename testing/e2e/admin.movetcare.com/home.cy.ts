describe("login-page-loads", () => {
  it("display app login button", () => {
    cy.visit("http://localhost:3002");
    cy.get("main button").contains("EMAIL").should("be.visible");
  });
  it.only("can view all admin screens", () => {
    cy.login("0");
    cy.visit("http://localhost:3002/dashboard");
    cy.get(".mobile-nav-toggle").click();
    cy.get("a").contains("Dashboard");
    cy.get("a").contains("Billing");
    cy.get("a").contains("Telehealth");
    cy.get("a").contains("ProVet");
    cy.get("a").contains("GoTo");
  });
});
