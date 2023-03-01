describe("contact-form", () => {
  beforeEach(() => {
    cy.visit(Cypress.env().appUrl + "/contact");
  });
  it("Can submit contact form", () => {
    cy.get("input[name='firstName']").type("CYPRESS");
    cy.get("button[type='submit']").as("submit").contains("Submit").click();
    cy.get("p.text-movet-red")
      .as("errorMessage")
      .contains("An email address is required");
    cy.get("@errorMessage").contains("A message is required");
    cy.get("input[name='lastName']").type("TEST");
    cy.get("input[name='email']").type("CYPRESS");
    cy.get("@submit").click();
    cy.get("p.text-movet-red")
      .as("errorMessage")
      .contains("Email must be a valid email address");
    cy.get("input[name='email']").type("CYPRESS+test@TEST.COM");
    cy.get("input[name='phone-number']").type("9999999999");
    cy.get("textarea[name='message']").type("CYPRESS TEST 123...");
    cy.get("@submit").click();
    cy.get("h2").contains("Success!");
  });
});
