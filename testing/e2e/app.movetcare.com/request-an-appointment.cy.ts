describe(
  "standard-request-an-appointment-flow",
  { defaultCommandTimeout: Cypress.env().defaultPathnameTimeOut },
  () => {
    it("Can request an appointment as a new client - Fastest Path", () => {
      cy.visit(Cypress.env().appUrl + "/schedule-an-appointment");
      cy.get("input[name='email']").type(
        `dev+test_client_${Math.floor(
          Math.random() * 99999999999
        )}@movetcare.com`
      );
      cy.get("h2").as("heading").contains("Schedule an Appointment");
      cy.get("button[type='submit']").as("submitButton").click();
      cy.location("pathname", {
        timeout: Cypress.env().defaultPathnameTimeOut,
      }).should("eq", "/request-an-appointment/");
      cy.get("@heading").contains("Welcome to MoVET");
      cy.get("input[name='firstName']").type("Test User");
      cy.get("input[name='lastName']").type("(Can be deleted)");
      cy.get("input[name='phone-number']").type(
        Math.floor(100000000 + Math.random() * 9000000000).toString()
      );
      cy.get("input[name='firstName']").clear();
      cy.get("input[name='lastName']").clear();
      cy.get("input[name='phone-number']").clear();
      cy.get("span").contains("Request Appointment").click();
      cy.get("p.text-movet-red")
        .as("errorMessage")
        .contains("A first name is required");
      cy.get("@errorMessage").contains("A last name is required");
      cy.get("@errorMessage").contains("Phone number must be 10 digits");
      cy.get("@errorMessage").contains("Please fix all of the errors above");
      cy.get("input[name='firstName']").type("Test User");
      cy.get("input[name='lastName']").type("(Can be deleted)");
      cy.get("input[name='phone-number']").type(
        Math.floor(100000000 + Math.random() * 9000000000).toString()
      );
      cy.get("input[name='numberOfPets-number']").clear();
      cy.get("input[name='numberOfPetsWithMinorIllness-number']").clear();
      cy.get("input[name='numberOfPets-number']").type("2");
      cy.get("input[name='numberOfPetsWithMinorIllness-number']").type("1");
      cy.get("textarea[name='notes']").type("This is a test pet note!");
      cy.get("div span").contains("Home").click();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      cy.get("button abbr").contains(String(tomorrow.getDate())).click();
      cy.get("p").contains("Specific Time Preference").click();
      cy.get("input[name='specificTime']").type("4:25 PM Please!");
      cy.get("span").contains("Request Appointment").click();
      cy.location("pathname", {
        timeout: Cypress.env().defaultPathnameTimeOut,
      }).should("eq", "/request-an-appointment/success/");
      cy.get("@heading").contains("Appointment Request Successful");
    });
  }
);
