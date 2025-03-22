describe("k9-smiles-page", () => {
  beforeEach(() => {
    cy.visit(
      Cypress.env().websiteUrl +
        "/blog/k9-smiles-clinic-for-cats-and-dogs/?disableRedirect=1"
    );
  });
  it("can view all k9 smile form ui", () => {
    cy.get("h3").contains("SCHEDULE A TEETH CLEANING FOR YOUR PET TODAY!");
    cy.get("p").contains("DENTAL EXAM + IN-DEPTH TEETH CLEANING - $295");
    cy.get("label").as("l").contains("First Name");
    cy.get("@l").contains("Last Name");
    cy.get("@l").contains("Email");
    cy.get("@l").contains("Phone");
    cy.get("input[name='firstName']").should("be.visible");
    cy.get("input[name='lastName']").should("be.visible");
    cy.get("input[name='email']").should("be.visible");
    cy.get("input[name='phone-number']").should("be.visible");
    cy.get("button[type='submit']").contains("Schedule an Appointment");
    cy.get("button[type='submit']").should("be.disabled");
  });
  it("can view all field errors", () => {
    cy.get("button[type='submit']")
      .as("submit")
      .contains("Schedule an Appointment");
    cy.get("@submit").should("be.disabled");
    cy.get("input[name='firstName']").type("CYPRESS");
    cy.get("@submit").should("be.enabled");
    cy.get("@submit").contains("Schedule an Appointment").click();
    cy.get("p.text-movet-red").contains("An email address is required");
    cy.get("p.text-movet-red").contains("A last name is required");
    cy.get("p.text-movet-red").contains("A phone number is required");
    cy.get("form.grid input[name='email']").type("CYPRESS");
    cy.get("@submit").contains("Schedule an Appointment").click();
    cy.get("p.text-movet-red").contains("Email must be a valid email address");
    cy.get("form.grid input[name='email']").type(
      "CYPRESS_K9_SMILES+test@TEST.COM"
    );
    cy.get("p.text-movet-red")
      .contains("Email must be a valid email address")
      .should("not.exist");
    cy.get("input[name='phone-number']").type("6999969996");
    cy.get("p.text-movet-red")
      .contains("A phone number is required")
      .should("not.exist");
    cy.get("input[name='lastName']").type("TEST USER (Safe to Delete)");
    cy.get("button[type='submit']").should("be.enabled");
  });
  it("can submit contact form", () => {
    cy.get("button[type='submit']")
      .as("submit")
      .contains("Schedule an Appointment");
    cy.get("@submit").should("be.disabled");
    cy.get("input[name='firstName']").type("CYPRESS");
    cy.get("@submit").should("be.enabled");
    cy.get("@submit").contains("Schedule an Appointment").click();
    cy.get("p.text-movet-red").contains("An email address is required");
    cy.get("p.text-movet-red").contains("A last name is required");
    cy.get("p.text-movet-red").contains("A phone number is required");
    cy.get("input[name='lastName']").type("TEST USER (Safe to Delete)");
    cy.get("form.grid input[name='email']").type(
      Cypress.env().contactFormTestUserEmail
    );
    cy.get("input[name='phone-number']").type("9699699969");
    cy.get("@submit").should("be.enabled");
    cy.get("@submit").contains("Schedule an Appointment").click();
  });

  it("short link redirect works", () => {
    cy.visit(Cypress.env().websiteUrl + "/k9-smiles");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/blog/k9-smiles-clinic-for-cats-and-dogs/");
    cy.get("h3").contains("SCHEDULE A TEETH CLEANING FOR YOUR PET TODAY!");
  });
});
