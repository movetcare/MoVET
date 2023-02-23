describe("admin-app-pages", () => {
  it("display app login button", () => {
    cy.visit("http://localhost:3002");
    cy.get("main button").contains("EMAIL").should("be.enabled");
  });
  it("all admin pages load", () => {
    cy.visit("http://localhost:4000/auth");
    cy.get("button").contains("more_vert").click().wait(1, { log: false });
    cy.get(".mdc-list-item")
      .contains("Edit user")
      .click()
      .wait(1000, { log: false });
    cy.get("input[name='password']")
      .as("password")
      .clear()
      .wait(10, { log: false });
    cy.get("@password").type("t").wait(1, { log: false });
    cy.get("@password").type("e").wait(1, { log: false });
    cy.get("@password").type("s").wait(1, { log: false });
    cy.get("@password").type("t").wait(1, { log: false });
    cy.get("@password").type("i").wait(1, { log: false });
    cy.get("@password").type("n").wait(1, { log: false });
    cy.get("@password").type("g").wait(1, { log: false });
    cy.get("@password").type("1").wait(1, { log: false });
    cy.get("@password").type("2").wait(1, { log: false });
    cy.get("@password").type("3").wait(1, { log: false });
    cy.get("button[type='submit']").click().wait(1000, { log: false });
    cy.login("0");
    cy.get(".mobile-nav-toggle").click();
    cy.get("#mobile-billing").click();
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/billing/");
    cy.get("#mobile-telehealth").click();
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/telehealth/chat/");
    cy.get("#mobile-dashboard").click();
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/dashboard/");
    cy.get("a[href='/settings/']").click();
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/");
    cy.get("a[href='/settings/users/']").click();
    cy.visit("http://localhost:3002/settings/");
    cy.get("a[href='/settings/booking/']").click();
    cy.visit("http://localhost:3002/settings/");
    cy.get("a[href='/settings/announcement-banner/']").click();
    cy.visit("http://localhost:3002/settings/");
    cy.get("a[href='/settings/winter-mode/']").click();
    cy.visit("http://localhost:3002/settings/");
    cy.get("a[href='/settings/tools/']").click();
    cy.visit("http://localhost:3002/settings/");
    cy.get("a[href='/settings/testing/']").click();
    cy.get("a[href='/request-a-feature/']").click();
    cy.get("a[href='/report-a-bug/']").click();
    cy.get("a[href='/docs/']").click();
    cy.visit("http://localhost:3002/404/", {
      failOnStatusCode: false,
    });
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/dashboard/");
    cy.get("a[href='/signout/']").click();
    cy.get("main button").contains("EMAIL").should("be.enabled");
  });
  it("no admin pages load for staff", () => {
    cy.visit("http://localhost:4000/auth");
    cy.get("button").eq(5).click().wait(1, { log: false });
    cy.get("div.mdc-menu-surface--open")
      .find(".mdc-list-item")
      .contains("Edit user")
      .click()
      .wait(1000, { log: false });
    cy.get("input[name='password']")
      .as("password")
      .clear()
      .wait(10, { log: false });
    cy.get("@password").type("t").wait(1, { log: false });
    cy.get("@password").type("e").wait(1, { log: false });
    cy.get("@password").type("s").wait(1, { log: false });
    cy.get("@password").type("t").wait(1, { log: false });
    cy.get("@password").type("i").wait(1, { log: false });
    cy.get("@password").type("n").wait(1, { log: false });
    cy.get("@password").type("g").wait(1, { log: false });
    cy.get("@password").type("1").wait(1, { log: false });
    cy.get("@password").type("2").wait(1, { log: false });
    cy.get("@password").type("3").wait(1, { log: false });
    cy.get("button[type='submit']").click().wait(1000, { log: false });
    cy.login("2");
    cy.get(".mobile-nav-toggle").click();
    cy.get("#mobile-billing").click();
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/billing/");
    cy.get("#mobile-telehealth").click();
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/telehealth/chat/");
    cy.get("#mobile-dashboard").click();
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/dashboard/");
    cy.get("a[href='/request-a-feature/']").click();
    cy.get("a[href='/report-a-bug/']").click();
    cy.get("a[href='/docs/']").click();
    cy.visit("http://localhost:3002/404/", {
      failOnStatusCode: false,
    });
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/dashboard/");
    cy.get("a[href='/settings/']").should("not.exist");
    cy.visit("http://localhost:3002/settings/");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/");
    cy.get("p").contains("You do not have permission to view this page");
    cy.visit("http://localhost:3002/settings/booking");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/booking/");
    cy.get("p").contains("You do not have permission to view this page");
    cy.visit("http://localhost:3002/settings/booking/clinic");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/booking/clinic/");
    cy.get("p").contains("You do not have permission to view this page");
    cy.visit("http://localhost:3002/settings/booking/housecall");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/booking/housecall/");
    cy.get("p").contains("You do not have permission to view this page");
    cy.visit("http://localhost:3002/settings/booking/telehealth");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/booking/telehealth/");
    cy.get("p").contains("You do not have permission to view this page");
    cy.visit("http://localhost:3002/settings/announcement-banner");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/announcement-banner/");
    cy.get("p").contains("You do not have permission to view this page");
    cy.visit("http://localhost:3002/settings/request-an-appointment");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/request-an-appointment/");
    cy.get("p").contains("You do not have permission to view this page");
    cy.visit("http://localhost:3002/settings/testing");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/testing/");
    cy.get("p").contains("You do not have permission to view this page");
    cy.visit("http://localhost:3002/settings/tools");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/tools/");
    cy.get("p").contains("You do not have permission to view this page");
    cy.visit("http://localhost:3002/settings/users");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/users/");
    cy.get("p").contains("You do not have permission to view this page");
    cy.visit("http://localhost:3002/settings/winter-mode");
    cy.location("pathname", {
      timeout: Cypress.env().defaultPathnameTimeOut,
    }).should("eq", "/settings/winter-mode/");
    cy.get("p").contains("You do not have permission to view this page");
    cy.get("a[href='/signout/']").click();
    cy.get("main button").contains("EMAIL").should("be.enabled");
  });
});
