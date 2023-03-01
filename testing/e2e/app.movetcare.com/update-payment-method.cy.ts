describe("update-payment-method", () => {
  beforeEach(() => {
    cy.visit(Cypress.env().appUrl + "/update-payment-method");
  });

  it("Shows errors when invalid email is used", () => {
    cy.get("h2").contains("Add a Payment Method");
    cy.get("input[name='email']").type("CYPRESSTEST");
    cy.get("button[type='submit']").contains("Add a Payment Method").click();
    cy.get("p.text-movet-red").contains("Email must be a valid email address");
    cy.get("input[name='email']").type("CYPRESS+test@TEST.COM");
    cy.get("button[type='submit']").contains("Add a Payment Method").click();
  });

  it("Can redirect to stripe checkout as existing client with valid payment already on file", () => {
    cy.get("h2").contains("Add a Payment Method");
    cy.get("input[name='email']").type(
      Cypress.env().existingClientWithPaymentEmail
    );
    cy.get("button[type='submit']").contains("Add a Payment Method").click();
    if (Cypress.env().environment === "development")
      cy.origin("https://payment.movetcare.com", () => {
        cy.on("uncaught:exception", () => false);
      });
  });

  it("Can redirect to stripe checkout as existing client NO valid payment on file", () => {
    cy.get("h2").contains("Add a Payment Method");
    cy.get("input[name='email']").type(
      Cypress.env().existingClientNoPaymentEmail
    );
    cy.get("button[type='submit']").contains("Add a Payment Method").click();
    if (Cypress.env().environment === "development")
      cy.origin("https://payment.movetcare.com", () => {
        cy.on("uncaught:exception", () => false);
      });
  });

  it("Success page loads", () => {
    cy.visit(Cypress.env().appUrl + "/update-payment-method/?success=true");
    cy.get("h2").contains("You are all set!");
    cy.get("p").contains(
      "We have updated your payment method on file and will use that information to process your MoVET invoices going forward."
    );
  });
});
