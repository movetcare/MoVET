const defaultPathnameTimeOut = Cypress.env().defaultPathnameTimeOut;
describe("application-redirects", () => {
  it("pharmacy redirect works", () => {
    cy.visit("http://localhost:3000/pharmacy");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "movetcare.vetsfirstchoice.com"
    );
  });
  it("appointment check in redirects work", () => {
    cy.visit("http://localhost:3000/checkin");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/appointment-check-in/"
    );
    cy.visit("http://localhost:3000/check-in");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/appointment-check-in/"
    );
  });
  it("update payment redirects work", () => {
    cy.visit("http://localhost:3000/payment");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/update-payment-method/"
    );
    cy.visit("http://localhost:3000/update-payment");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/update-payment-method/"
    );
    cy.visit("http://localhost:3000/change-payment");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/update-payment-method/"
    );
    cy.visit(
      "http://localhost:3000/payment?email=dev+test_cypress_redirects@movetcare.com"
    );
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/update-payment-method/"
    );
  });
  it("schedule an appointment redirects work", () => {
    cy.visit("http://localhost:3000/booking");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/"
    );
    cy.visit("http://localhost:3000/schedule");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/"
    );
    cy.visit("http://localhost:3000/book-an-appointment");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/"
    );
    cy.visit("http://localhost:3000/schedule-an-appointment");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/"
    );
    cy.visit("http://localhost:3000/appointment-booking");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/"
    );
    cy.visit(
      "http://localhost:3000/schedule-an-appointment?email=dev+test_cypress_redirects@movetcare.com"
    );
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/"
    );
  });
});
