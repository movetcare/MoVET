/* eslint-disable quotes */
describe("careers-page-loads", () => {
  it("display reviews list", () => {
    cy.visit(Cypress.env().websiteUrl + "/careers");
    cy.get("h2").contains("We're Hiring!");
    cy.get("h4").contains("Benefits of Working with MoVET");
    cy.get("h2").contains("Available Position");
    cy.get("h3").contains("Lead Veterinary Nurse / Technician");
    cy.get("h4").contains(
      "Experienced Veterinary Nurse to join exciting new veterinary startup!"
    );
    cy.get("h4").contains("Education & Experience Requirements:");
    cy.get("h4").contains("Required Technology Skills:");
    cy.get("h5").contains("Major Duties");
    cy.get("h5").contains("Personnel");
    cy.get("h5").contains("Client Satisfaction");
    cy.get("h5").contains("Inventory");
    cy.get("h5").contains("Other Duties");
    cy.get("h5").contains("Job Type");
    cy.get("h4").contains("Benefits");
    cy.get("p").contains("To apply, send an email to admin@movetcare.com");
  });
});
