/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(uid: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add("login", (uid) => {
  cy.visit("http://localhost:3002/test/login/");
  if (uid === "0") {
    cy.get("input[name='uname']").type("alex@movetcare.com");
    cy.get("input[name='pass']").type("testing123");
    cy.get("input[type='submit']").click();
  }
  if (uid === "2") {
    cy.get("input[name='uname']").type("info@movetcare.com");
    cy.get("input[name='pass']").type("testing123");
    cy.get("input[type='submit']").click();
  }
  cy.visit("http://localhost:3002/dashboard");
});
