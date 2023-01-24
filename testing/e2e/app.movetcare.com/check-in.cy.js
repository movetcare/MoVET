const defaultPathnameTimeOut = Cypress.env().defaultPathnameTimeOut;

describe("appointment-check-in", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001/appointment-check-in");
  });

  it("Shows errors when invalid email is used", () => {
    cy.get("h2").contains("Appointment Check-In");
    cy.get("form input[name='email']").type("CYPRESSTEST");
    cy.get("form button[type='submit']")
      .contains("Check In for Appointment")
      .click();
    cy.get("p.text-movet-red").contains("Email must be a valid email address");
  });

  it("Privacy policy and terms of service links work", () => {
    cy.get("h2").contains("Appointment Check-In");
    cy.get("a").contains("privacy policy").click();
    cy.get("h1").contains("Privacy Policy");
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/privacy-policy/"
    );
    cy.get("p").contains("Go Back").click();
    cy.get("a").contains("terms of service").click();
    cy.get("h1").contains("Terms of Service");
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/terms-and-conditions/"
    );
    cy.get("p").contains("Go Back").click();
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/appointment-check-in/"
    );
  });

  it("New client can check in", () => {
    runThroughCheckInWorkflows(
      `alex.rodriguez+test_CYPRESS_${Math.floor(
        Math.random() * 99999999999
      )}@movetcare.com`,
      true
    );
  });

  it("Existing client can check in w/ no payment on file", () => {
    cy.request(
      "POST",
      "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
      { apiKey: Cypress.env().endpointApiKey, id: 5125 }
    );
    runThroughCheckInWorkflows(Cypress.env().existingClientNoPayment, true);
  });

  it("Existing client can check in w/ payment on file", () => {
    runThroughCheckInWorkflows(Cypress.env().existingClientWithPayment, false);
  });
});

const runThroughCheckInWorkflows = (clientEmail, isNewClient) => {
  cy.get("h2").contains("Appointment Check-In");
  cy.get("form input[name='email']").type(clientEmail);
  cy.get("form button[type='submit']")
    .contains("Check In for Appointment")
    .click();
  if (isNewClient) {
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/appointment-check-in/info/"
    );
    cy.get("h1").contains("Contact Information");
    cy.get("label").contains("First Name");
    cy.get("label").contains("Last Name");
    cy.get("label").contains("Phone Number");
    cy.get("form button[type='submit']").contains("Submit").click();
    cy.get("p.text-movet-red")
      .as("errorMessage")
      .contains("A first name is required");
    cy.get("@errorMessage").contains("A last name is required");
    cy.get("@errorMessage").contains("Phone number must be 10 digits");
    cy.wait(1000);
    cy.get("input[name='firstName']").type("TEST");
    cy.wait(1000);
    cy.get("input[name='lastName']").type("CLIENT - CYPRESS");
    cy.wait(1000);
    cy.get("input[name='phone-number']").type(
      Math.floor(100000000 + Math.random() * 900000000)
    );
    cy.wait(1000);
    cy.get("form button[type='submit']").contains("Submit").click();

    cy.wait(1000);
    cy.visit("http://localhost:3001/appointment-check-in/success");
    cy.wait(1000);
    cy.get("h3").contains("We've got you checked in");
  } else {
    cy.get("h3").contains("Welcome Back");
    cy.get("h3").contains("We've got you checked in");
  }
};
