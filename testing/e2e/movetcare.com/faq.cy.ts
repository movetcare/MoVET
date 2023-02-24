describe("faq-page", () => {
  it("faq link works", () => {
    cy.visit(Cypress.env().websiteUrl);
    cy.get("footer a p").contains("FAQs").click();
    cy.get("h1").contains("MoVET Appointment Prep");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/appointment-prep/");
    cy.get("p").contains("Go Back").click();
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/");
  });
  it("faq page content exists", () => {
    cy.visit(Cypress.env().websiteUrl + "/appointment-prep");
    cy.get("h1").contains("MoVET Appointment Prep");
    cy.get("h2").contains("Medical Records:");
    cy.get("h2").contains("Payment on File");
    cy.get("h2").contains("Handling Tips for your Pets");
    cy.get("h2").contains("Virtual Consultations");
    cy.get("h3").contains(
      "Please email (or text us) if you have any questions!"
    );
  });
});
