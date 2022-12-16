describe("schedule-an-appointment-flow", () => {
  it("can schedule an appointment as existing client with no patients", () => {
    cy.request(
      "POST",
      "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
      { apiKey: "L9At3HGmvRDuyi7TTX", id: 5125 }
    );
    cy.visit("http://localhost:3001/schedule-an-appointment");
    cy.get("form input[name='email']").type(
      "alex.rodriguez+TEST@MOVETCARE.COM"
    );
    cy.get("form button[type='submit']").contains("Continue").click();
    cy.wait(5000);
    cy.get("form input[name='firstName']").type("TEST");
    cy.get("form input[name='lastName']").type("CLIENT - DO NOT DELETE");
    cy.get("form input[name='phone-number']").type("2222222222");
    cy.get("form button[type='submit']").contains("Continue").click();
    cy.wait(3000);
    cy.get("form #dog").click();
    cy.get("form #male").click();
    cy.get("form button.switch-input").click();
    cy.get("form input[name='name']").type("TEST DOG");
    cy.get("form .search-input").type("Mix{enter}");
    cy.get("form input[name='weight-number']").type("10");
    cy.get("form input[name='birthday']").type("10102020");
    cy.get("form .places-search").type("Kingsburry{enter}").click();
    cy.get("form p")
      .contains(
        "This pet DOES have had a history of aggression or aggressive tendencies."
      )
      .click();
    cy.get("form textarea#notes").type(
      "This is a test pet that is auto generated via Cypress..."
    );
    cy.get("form button[type='submit']").contains("Continue").click();
    cy.wait(3000);
    cy.get("span").contains("What are Establish Care Exams?").click();
    cy.get("button").contains("CLOSE").click();
    cy.get("button").contains("Add a Pet").click();
    cy.wait(3000);
    cy.get("form #cat").click();
    cy.get("form #female").click();
    cy.get("form button.switch-input").click();
    cy.get("form input[name='name']").type("TEST CAT 1");
    cy.get("form .search-input").type("Bombay{enter}");
    cy.get("form input[name='weight-number']").type("10");
    cy.get("form input[name='birthday']").type("10102020");
    cy.get("form .places-search").type("Kingsburry{enter}").click();
    cy.get("form p")
      .contains(
        "This pet DOES have had a history of aggression or aggressive tendencies."
      )
      .click();
    cy.get("form textarea#notes").type(
      "This is a test pet that is auto generated via Cypress..."
    );
    cy.get("form button[type='submit']").contains("Continue").click();
    cy.wait(3000);
    cy.get("button").contains("Add a Pet").click();
    cy.get("form #cat").click();
    cy.get("form #female").click();
    cy.get("form button.switch-input").click();
    cy.get("form input[name='name']").type("TEST CAT 2");
    cy.get("form .search-input").type("Bombay{enter}");
    cy.get("form input[name='weight-number']").type("10");
    cy.get("form input[name='birthday']").type("10102020");
    cy.get("form .places-search").type("Kingsburry{enter}").click();
    cy.get("form p")
      .contains(
        "This pet DOES have had a history of aggression or aggressive tendencies."
      )
      .click();
    cy.get("form textarea#notes").type(
      "This is a test pet that is auto generated via Cypress..."
    );
    cy.get("form button[type='submit']").contains("Continue").click();
    cy.wait(3000);
    cy.get("button").contains("Add a Pet").click();
    cy.get("form #dog").click();
    cy.get("form #female").click();
    cy.get("form button.switch-input").click();
    cy.get("form input[name='name']").type("TEST DOG 2");
    cy.get("form .search-input").type("Lab{enter}");
    cy.get("form input[name='weight-number']").type("10");
    cy.get("form input[name='birthday']").type("10102020");
    cy.get("form .places-search").type("Kingsburry{enter}").click();
    cy.get("form p")
      .contains(
        "This pet DOES have had a history of aggression or aggressive tendencies."
      )
      .click();
    cy.get("form textarea#notes").type(
      "This is a test pet that is auto generated via Cypress..."
    );
    cy.get("form button[type='submit']").contains("Continue").click();
    cy.wait(3000);
    cy.get("section label").contains("TEST DOG").click();
    cy.get("section label").contains("TEST DOG").click();
    cy.get("section p")
      .contains("A pet selection is required")
      .should("be.visible");
    cy.get("section label").contains("TEST DOG").click();
    cy.get("section label").contains("TEST DOG 2").click();
    cy.get("section label").contains("TEST CAT").click();
    cy.get("section label").contains("TEST CAT 2").click();
    cy.get("section p")
      .contains("Only 3 pets are allowed per appointment")
      .should("be.visible");
    cy.get("section label").contains("TEST CAT 2").click();
    cy.get("section button[type='submit']").contains("Continue").click();
  });
});
