const defaultPathnameTimeOut = Cypress.env().defaultPathnameTimeOut;

describe("terms-of-service-page", () => {
  it("terms of service link works", () => {
    cy.visit("https://movetcare.com/");
    cy.get("footer a p").contains("Terms of Service").click();
    cy.get("h1").contains("Terms of Service");
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/terms-and-conditions/"
    );
    cy.get("p").contains("Go Back").click();
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/"
    );
  });
  it("terms of service page content exists", () => {
    cy.visit("https://movetcare.com/terms-and-conditions");
    cy.get("h1").contains("Terms of Service");
    cy.get("h2").contains("1. Revision Of This Agreement");
    cy.get("h2").contains("2. Services");
    cy.get("h2").contains("3. Acknowledgements");
    cy.get("h2").contains(
      "4. Communications Between Users And Veterinary Experts"
    );
    cy.get("h2").contains("5. DISCLAIMER");
    cy.get("h2").contains("6. LIMITATION OF LIABILITY");
    cy.get("h2").contains("7. Indemnification");
    cy.get("h2").contains("8. License and Ownership");
    cy.get("h2").contains("9. Fees And Billing");
    cy.get("h2").contains("10. No Veterinary-Client-Patient Relationship");
    cy.get("h2").contains("11. No Veterinary Advice");
    cy.get("h2").contains(
      "12. You Are Ultimately Responsible For Choosing Your Own Veterinary Expert"
    );
    cy.get("h2").contains("13. Copyright Policy");
    cy.get("h3").contains("Copyright Agent:");
    cy.get("h2").contains(
      "14. Right To Terminate Your Account Or Block Access To The Services"
    );
    cy.get("h2").contains("15. Entire Agreement; Choice Of Law");
    cy.get("h2").contains("16. No Waiver; Severability");
  });
});
