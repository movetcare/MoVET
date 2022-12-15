describe("home-page-loads", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3001");
  });

 it("display app sign in form", () => {
   cy.get("form input[name='email']").type("CYPRESS@TEST.COM");
   cy.get("form button[type='submit']")
     .contains("Continue")
     .should("be.visible")
     .click();
 });
});
