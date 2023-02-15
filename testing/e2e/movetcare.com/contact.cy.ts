describe("contact-page-loads", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/contact");
  });
  it("can view all contact form ui", () => {
    cy.get("h2").contains("Contact Us");
    cy.get("p").contains(
      "Leave us a note and we'll get back to you as soon as possible!"
    );
    cy.get("label").as("l").contains("First Name");
    cy.get("@l").contains("Last Name");
    cy.get("@l").contains("Email");
    cy.get("@l").contains("Phone");
    cy.get("@l").contains("Reason");
    cy.get("@l").contains("Message");
    cy.get("input[name='firstName']").should("be.visible");
    cy.get("input[name='lastName']").should("be.visible");
    cy.get("input[name='email']").should("be.visible");
    cy.get("input[name='phone-number']").should("be.visible");
    cy.get("textarea[name='message']").should("be.visible");
    cy.get("button[type='submit']").contains("Submit");
    cy.get("button[type='submit']").should("be.disabled");
  });
  it("can view all field errors", () => {
    cy.get("button[type='submit']").as("submit").contains("Submit");
    cy.get("@submit").should("be.disabled");
    cy.get("input[name='firstName']").type("CYPRESS");
    cy.get("@submit").should("be.enabled");
    cy.get("@submit").contains("Submit").click();
    cy.get("p.text-movet-red").contains("An email address is required");
    cy.get("p.text-movet-red").contains("A message is required");
    cy.get("form.grid input[name='email']").type("CYPRESS");
    cy.get("@submit").contains("Submit").click();
    cy.get("p.text-movet-red").contains("Email must be a valid email address");
    cy.get("form.grid input[name='email']").type("CYPRESS@MOVETCARE.COM");
    cy.get("p.text-movet-red")
      .contains("Email must be a valid email address")
      .should("not.exist");
    cy.get("button[type='submit']").should("be.disabled");
    cy.get("textarea[name='message']").type("CYPRESS TEST 123...");
    cy.get("button[type='submit']").should("be.enabled");
  });
  it("can submit contact form", () => {
    cy.get("button[type='submit']").as("submit").contains("Submit");
    cy.get("@submit").should("be.disabled");
    cy.get("input[name='firstName']").type("CYPRESS");
    cy.get("@submit").should("be.enabled");
    cy.get("@submit").contains("Submit").click();
    cy.get("p.text-movet-red").contains("An email address is required");
    cy.get("p.text-movet-red").contains("A message is required");
    cy.get("input[name='lastName']").type("TEST USER (Safe to Delete)");
    cy.get("form.grid input[name='email']").type(
      Cypress.env().contactFormTestUserEmail
    );
    cy.get("input[name='phone-number']").type("9999999999");
    cy.get("textarea[name='message']").type("Cypress Test 123...");
    cy.get("@submit").should("be.enabled");
    cy.get("@submit").contains("Submit").click();
    cy.get("h2").contains("Success!");
    cy.get("h2").contains("Emergency Care Notice");
    cy.get("p").contains(
      "If you think this is an animal emergency, please contact a 24/7 ER clinic or urgent care center"
    );
  });
});
