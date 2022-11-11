describe("home-page-loads", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("display home page hero elements", () => {
    cy.get("main section h1").first().contains("Your neighborhood vet,");
    cy.get("main section h1").last().contains("Delivered");
    cy.get("main section p span")
      .first()
      .contains("A stress-free way to take care of your vet appointments.");
    cy.get("main section div p").contains("REQUEST AN APPOINTMENT");
    cy.get("main section div form input").should("be.visible");
  });
});
