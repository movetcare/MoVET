describe("services-page-loads", () => {
  it("display services list", () => {
    cy.visit("https://movetcare.com/services");
    cy.get("h2").contains("Services");
    cy.get("h3").contains("Primary Care & Minor Illnesses");
    cy.get("button").contains("Juvenile").click();
    cy.get("h3").contains("Juvenile & Senior Pet Care");
    cy.get("button").contains("Telehealth").click();
    cy.get("h3").contains("Telehealth & Virtual Care");
    cy.get("button").contains("Concierge").click();
    cy.get("h3").contains("Concierge & Specialty Services");
    cy.get("button").contains("What We").click();
    cy.get("h3").contains("What We Don’t Do");
    cy.get("button").contains("Primary Care").click();
    cy.get("h3").contains("Primary Care & Minor Illnesses");
  });
});
