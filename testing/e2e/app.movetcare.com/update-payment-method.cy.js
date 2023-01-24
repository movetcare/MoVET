describe("update-payment-method", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/update-payment-method");
  });

  it("Shows errors when invalid email is used", () => {
    cy.get("h2").contains("Add a Payment Method");
    cy.get("form input[name='email']").type("CYPRESSTEST");
    cy.get("form button[type='submit']")
      .contains("Add a Payment Method")
      .click();
    cy.get("p.text-movet-red").contains("Email must be a valid email address");
    cy.get("form input[name='email']").type("CYPRESS@TEST.COM");
    cy.get("form button[type='submit']")
      .contains("Add a Payment Method")
      .click();
    cy.get("h2").contains("Whoops!");
    cy.get("button").contains("Go Back").click();
  });

  it("Can redirect to stripe checkout", () => {
    cy.get("h2").contains("Add a Payment Method");
    cy.get("form input[name='email']").type(
      Cypress.env().existingClientWithPayment
    );
    cy.get("form button[type='submit']")
      .contains("Add a Payment Method")
      .click();
    cy.visit("http://localhost:3001/update-payment-method/?success=true");
    cy.get("h2").contains("You are all set!");
    cy.get("p").contains(
      "We have updated your payment method on file and will use that information to process your MoVET invoices going forward."
    );
  });
});
