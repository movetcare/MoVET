/* eslint-disable quotes */
describe("reviews-page-loads", () => {
  beforeEach(() => {
    cy.visit(Cypress.env().websiteUrl + "/reviews");
  });
  it("display reviews list", () => {
    cy.get("h2").contains("Our Happy Clients");
    cy.get('*[class^="sm:grid"]').find(".group").should("have.length", 24);
  });
  it("display leave us a review cta", () => {
    cy.get("h5").contains("Leave Us a Review!");
    cy.get("a[href='https://g.page/r/CbtAdHSVgeMfEB0/review']").contains(
      "Add a Review"
    );
  });
});
