describe("application-redirects", () => {
  it("pharmacy redirect works", () => {
    cy.visit(Cypress.env().websiteUrl + "/pharmacy");
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "movetcare.vetsfirstchoice.com");
  });
  it("appointment check in redirects work", () => {
    cy.visit(Cypress.env().websiteUrl + "/checkin");
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/appointment-check-in/");
    cy.visit(Cypress.env().websiteUrl + "/check-in");
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/appointment-check-in/");
  });
  it("update payment redirects work", () => {
    cy.visit(Cypress.env().websiteUrl + "/payment");
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/update-payment-method/");
    cy.visit(Cypress.env().websiteUrl + "/update-payment");
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/update-payment-method/");
    cy.visit(Cypress.env().websiteUrl + "/change-payment");
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/update-payment-method/");
    cy.visit(
      Cypress.env().websiteUrl +
        "/payment?email=dev+test_cypress_redirects@movetcare.com"
    );
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/update-payment-method/");
  });
  it("schedule an appointment redirects work", () => {
    cy.visit(Cypress.env().websiteUrl + "/booking");
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/schedule-an-appointment/");
    cy.visit(Cypress.env().websiteUrl + "/schedule");
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/schedule-an-appointment/");
    cy.visit(Cypress.env().websiteUrl + "/book-an-appointment");
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/schedule-an-appointment/");
    cy.visit(Cypress.env().websiteUrl + "/schedule-an-appointment");
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/schedule-an-appointment/");
    cy.visit(Cypress.env().websiteUrl + "/appointment-booking");
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/schedule-an-appointment/");
    cy.visit(
      Cypress.env().websiteUrl +
        "/schedule-an-appointment?email=dev+test_cypress_redirects@movetcare.com"
    );
    cy.location("host", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should(
      "eq",
      Cypress.env().environment === "development"
        ? "localhost:3001"
        : "app.movetcare.com"
    );
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/schedule-an-appointment/");
  });
});
