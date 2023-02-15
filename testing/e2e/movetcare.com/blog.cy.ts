/* eslint-disable quotes */
describe("blog-page-loads", () => {
  it("display featured blog", () => {
    cy.visit("http://localhost:3000/blog");
    cy.get("h2").contains("From The Blog");
    cy.get(
      "*[class^='flex flex-col lg:flex-row overflow-hidden rounded-lg shadow-lg col-span-3']"
    ).should("be.visible");
  });
  it("display blog list", () => {
    cy.visit("http://localhost:3000/blog");
    cy.get(".grid")
      .find("*[class^='flex flex-col overflow-hidden rounded-lg shadow-lg']")
      .should("have.length", 6);
  });
});
