const defaultPathnameTimeOut = Cypress.env().defaultPathnameTimeOut;
describe("application-redirects", () => {
  it("pharmacy redirect works", () => {
    cy.visit("https://movetcare.com/pharmacy");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "movetcare.vetsfirstchoice.com"
    );
  });
  it("appointment check in redirects work", () => {
    cy.visit("https://movetcare.com/checkin");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/appointment-check-in/"
    );
    cy.visit("https://movetcare.com/check-in");
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
    cy.visit("https://movetcare.com/payment");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/update-payment-method/"
    );
    cy.visit("https://movetcare.com/update-payment");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/update-payment-method/"
    );
    cy.visit("https://movetcare.com/change-payment");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/update-payment-method/"
    );
    cy.visit(
      "https://movetcare.com/payment?email=dev+test_cypress_redirects@movetcare.com"
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
    cy.visit("https://movetcare.com/booking");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/"
    );
    cy.visit("https://movetcare.com/schedule");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/"
    );
    cy.visit("https://movetcare.com/book-an-appointment");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/"
    );
    cy.visit("https://movetcare.com/schedule-an-appointment");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/"
    );
    cy.visit("https://movetcare.com/appointment-booking");
    cy.location("host", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "localhost:3001"
    );
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/"
    );
    cy.visit(
      "https://movetcare.com/schedule-an-appointment?email=dev+test_cypress_redirects@movetcare.com"
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
