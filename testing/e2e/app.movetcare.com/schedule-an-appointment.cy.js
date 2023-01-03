const defaultTimeOut = 15000;
describe(
  "schedule-an-appointment-flow",
  { defaultCommandTimeout: defaultTimeOut },
  () => {
    it("can schedule an appointment as existing client with no patients", () => {
      // cy.request(
      //   "POST",
      //   "http://localhost:5001/movet-care-staging/us-central1/incomingWebhook/app/config",
      //   { apiKey: "L9At3HGmvRDuyi7TTX", type: "breeds" }
      // );
      cy.request(
        "POST",
        "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
        { apiKey: "L9At3HGmvRDuyi7TTX", id: 5125 }
      );
      cy.visit("http://localhost:3001/schedule-an-appointment");
      cy.get("form input[name='email']").type(
        "alex.rodriguez+TEST@MOVETCARE.COM"
      );
      cy.get("h2").contains("Schedule an Appointment").should("be.visible");
      cy.get("form button[type='submit']").contains("Continue").click();
      cy.get("h2").contains("Processing, please wait...").should("be.visible");
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/contact-info/"
      );
      cy.get("h2").contains("Contact Information").should("be.visible");
      cy.get("form input[name='phone-number']").type("123");
      cy.get("form button[type='submit']").contains("Continue").click();
      cy.get("p.text-movet-red")
        .contains("A first name is required")
        .should("be.visible");
      cy.get("p.text-movet-red")
        .contains("A last name is required")
        .should("be.visible");
      cy.get("p.text-movet-red")
        .contains("Phone number must be 10 digits")
        .should("be.visible");
      cy.get("form input[name='firstName']").type("TEST");
      cy.get("form input[name='lastName']").type("CLIENT - DO NOT DELETE");
      cy.get("form input[name='phone-number']").type("2345678901");
      cy.get("form button[type='submit']").contains("Continue").click();
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/add-a-pet/"
      );
      cy.get("h2").contains("Add a Pet").should("be.visible");
      cy.get("form button[type='submit']").contains("Continue").click();
      cy.get("p.text-movet-red")
        .contains("A type is required")
        .should("be.visible");
      cy.get("p.text-movet-red")
        .contains("A gender is required")
        .should("be.visible");
      cy.get("p.text-movet-red")
        .contains("Name must contain at least 2 characters")
        .should("be.visible");
      cy.get("p.text-movet-red")
        .contains("Weight must be between 1 and 300 pounds")
        .should("be.visible");
      cy.get("p.text-movet-red")
        .contains("A selection is required")
        .should("be.visible");
      cy.get("p.text-movet-red")
        .contains("Please fix the errors highlighted above...")
        .should("be.visible");
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
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/pet-selection/"
      );
      cy.get("h2").contains("Select a Pet").should("be.visible");
      cy.get("span").contains("What are Establish Care Exams?").click();
      cy.get("button").contains("CLOSE").click();
      cy.get("section label")
        .contains("* Requires Establish Care Exam")
        .should("be.visible");
      cy.get("section label").contains("TEST DOG").click();
      cy.get("section p")
        .contains("A pet selection is required")
        .should("be.visible");
      cy.get("button").contains("Add a Pet").click();
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/add-a-pet/"
      );
      cy.get("h2").contains("Add a Pet").should("be.visible");
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
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/pet-selection/"
      );
      cy.get("button").contains("Add a Pet").click();
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/add-a-pet/"
      );
      cy.get("h2").contains("Add a Pet").should("be.visible");
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
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/pet-selection/"
      );
      cy.get("button").contains("Add a Pet").click();
      cy.get("h2").contains("Add a Pet").should("be.visible");
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
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/pet-selection/"
      );
      cy.get("section label").contains("TEST DOG").click();
      cy.get("section label").contains("TEST DOG 2").click();
      cy.get("section label").contains("TEST CAT").click();
      cy.get("section label").contains("TEST CAT 2").click();
      cy.get("section p")
        .contains("Only 3 pets are allowed per appointment")
        .should("be.visible");
      cy.get("section label").contains("TEST CAT 2").click();
      cy.get("section button[type='submit']").contains("Continue").click();
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/wellness-check/"
      );
      cy.get("p").contains("Restart").click();
      cy.get("h2")
        .contains("Restart Appointment Booking?")
        .should("be.visible");
      cy.get("button").contains("CANCEL").click();
      cy.get("h2").contains("Pet Wellness Check").should("be.visible");
      cy.get("span").contains("What are symptoms of minor illness?").click();
      cy.get("h2").contains("Minor Illness Symptoms").should("be.visible");
      cy.get("button").contains("CLOSE").click();
      cy.get("section label").contains("TEST DOG").click();
      cy.get("section label").contains("TEST CAT 1").click();
      cy.get("section button[type='submit']")
        .contains("My Pets DO NOT need emergency care")
        .click();
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/illness-selection/"
      );
      cy.get("h2").contains("Minor Illness").should("be.visible");
      cy.get("legend").contains("Symptoms").should("be.visible");
      cy.get("p").contains("Restart").click();
      cy.get("h2")
        .contains("Restart Appointment Booking?")
        .should("be.visible");
      cy.get("button").contains("CANCEL").click();
      cy.get("p")
        .contains("We're sorry to hear TEST DOG is not feeling well")
        .should("be.visible");
      cy.get("section label p").contains("Coughing").click();
      cy.get("section label p").contains("Coughing").click();
      cy.get("p.text-movet-red")
        .contains("A symptom selection is required")
        .should("be.visible");
      cy.get("section label p").contains("Coughing").click();
      cy.get("section label p").contains("Other").click();
      cy.get("section button[type='submit']").contains("Continue").click();
      cy.get("p.text-movet-red")
        .contains("Please tell us more...")
        .should("be.visible");
      cy.get("textarea[name='details']").type("Test symptom notes...");
      cy.get("section button[type='submit']").contains("Continue").click();
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/illness-selection/"
      );
      cy.get("h2").contains("Minor Illness").should("be.visible");
      cy.get("legend").contains("Symptoms").should("be.visible");
      cy.get("p")
        .contains("We're sorry to hear TEST CAT 1 is not feeling well")
        .should("be.visible");
      cy.get("section label p").contains("Other").click();
      cy.get("textarea[name='details']").type("Test symptom notes...");
      cy.get("section button").contains("Continue").click();
      cy.location("pathname", { timeout: defaultTimeOut }).should(
        "eq",
        "/schedule-an-appointment/location-selection/"
      );
      cy.get("h2").contains("Choose a Location").should("be.visible");
      cy.get("p").contains("Restart").click();
      cy.get("h2")
        .contains("Restart Appointment Booking?")
        .should("be.visible");
      cy.get("button").contains("CANCEL").click();
      cy.get("h2").contains("MoVET @ Belleview Station").should("be.visible");
      cy.get("a")
        .contains("4912 S Newport St, Denver CO 80237")
        .should("be.visible");
      cy.get("button[type='submit']").should("not.be.disabled");
      cy.get("#Virtually").contains("Virtually").click();
      cy.get("h2")
        .contains("What can I expect in a Virtual Consultation?")
        .should("be.visible");
      cy.get("p").contains("What is VCPR?").click();
      cy.get("button").contains("CLOSE").click();
      cy.get("button[type='submit']").should("not.be.disabled");
      cy.get("#Home").contains("Home").click();
      cy.get("button[type='submit']").should("be.disabled");
      cy.get("form .places-search").type("702 Westgate Ave");
      cy.focused().tab();
      cy.get("button[type='submit']").should("be.disabled");
      // cy.get("p.text-movet-red")
      //   .contains(
      //     "MoVET does not currently service this area. Please enter a new address that is in (or near) the Denver Metro area."
      //   )
      //   .should("be.visible");
      cy.get("form .places-search").type("4912 S Newport Street Denver");
      cy.focused().tab();
      cy.get("button[type='submit']").should("be.disabled");
      cy.get("#info").type("Apartment 2A (This is a test address)");
    });
  }
);
