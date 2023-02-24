describe("home-page-loads", () => {
  beforeEach(() => {
    cy.visit(Cypress.env().appUrl);
  });

  it("Displays app sign in form w/ errors", () => {
    cy.get("h2").contains("Schedule an Appointment");
    cy.get("input[name='email']").as("email").type("CYPRESS");
    cy.get("button[type='submit']").as("submit").contains("Continue").click();
    cy.get("p.text-movet-red")
      .as("errorMessage")
      .contains("Email must be a valid email address");
    cy.get("@email").clear();
    cy.get("@email").type(Cypress.env().existingClientNoPaymentEmail);
    cy.get("@submit").click();
  });

  it("Privacy policy and terms of service links work", () => {
    cy.get("h2").contains("Schedule an Appointment");
    cy.get(".hidden").invoke("show").click();
    cy.get("a").contains("privacy policy").click();
    cy.get("h1").contains("Privacy Policy");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/privacy-policy/");
    cy.get("p").contains("Go Back").click();
    cy.get(".hidden").invoke("show").click();
    cy.get("a").contains("terms of service").click();
    cy.get("h1").contains("Terms of Service");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/terms-and-conditions/");
    cy.get("p").contains("Go Back").click();
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/");
  });
});
