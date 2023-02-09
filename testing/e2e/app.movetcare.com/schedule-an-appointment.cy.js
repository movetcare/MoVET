const defaultPathnameTimeOut = Cypress.env().defaultPathnameTimeOut;
const onlyTestOnePatient = Cypress.env().onlyTestOnePatient;
const skipWellnessCheck = Cypress.env().skipWellnessCheck;
console.log("endpointApiKey", Cypress.env().endpointApiKey);
console.log("defaultPathnameTimeOut", Cypress.env().defaultPathnameTimeOut);
console.log("onlyTestOnePatient", Cypress.env().onlyTestOnePatient);
console.log("skipWellnessCheck", Cypress.env().skipWellnessCheck);
console.log("existingClientNoPaymentEmail", Cypress.env().existingClientNoPaymentEmail);
console.log("existingClientNoPaymentFirstName", Cypress.env().existingClientNoPaymentFirstName);
console.log("existingClientNoPaymentLastName", Cypress.env().existingClientNoPaymentLastName);
console.log("existingClientNoPaymentId", Cypress.env().existingClientNoPaymentId);
console.log(
  "existingClientWithPaymentEmail",
  Cypress.env().existingClientWithPaymentEmail
);
console.log("existingClientWithPaymentFirstName", Cypress.env().existingClientWithPaymentFirstName);
console.log("existingClientWithPaymentLastName", Cypress.env().existingClientWithPaymentLastName);
console.log("existingClientWithPaymentId", Cypress.env().existingClientWithPaymentId);
describe(
  "standard-schedule-an-appointment-flow",
  { defaultCommandTimeout: defaultPathnameTimeOut },
  () => {
    it("Can schedule an appointment as a new client - VCPR REQUIRED", () => {
      runThroughAppointmentRequestWorkflows({
        email: `dev+test_client_${Math.floor(
          Math.random() * 99999999999
        )}@movetcare.com`,
        firstName: "Test",
        lastName: "Client (Can be Deleted)",
        petName: Cypress.env().existingPatientWithVcprName,
        id: null,
      });
    });

    if (!onlyTestOnePatient)
      it("Can schedule an appointment as existing client - VCPR REQUIRED", () => {
        cy.request(
          "POST",
          "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
          {
            apiKey: Cypress.env().endpointApiKey,
            id: Cypress.env().existingClientNoPaymentId,
          }
        );
        runThroughAppointmentRequestWorkflows({
          email: Cypress.env().existingClientNoPaymentEmail,
          firstName: "Test",
          lastName: "Client (Can be Deleted)",
          petName: Cypress.env().existingPatientWithVcprName,
          id: Cypress.env().existingClientNoPaymentId,
        });
      });

    it("Can schedule an appointment as an existing client - VCPR NOT REQUIRED", () => {
      cy.request(
        "POST",
        "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
        {
          apiKey: Cypress.env().endpointApiKey,
          id: Cypress.env().existingClientWithPaymentId,
        }
      );
      cy.visit(
        `http://localhost:3001/?email=${
          Cypress.env().existingClientWithPaymentEmail
        }`
      );
      cy.get("h2").as("heading").contains("Schedule an Appointment");
      cy.get("@heading").contains("Processing, please wait...");
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/pet-selection/"
      );
      cy.get("label").contains("NO VCPR TEST DOG").click();
      cy.get("label").contains("VCPR REQUIRED TEST CAT").click();
      cy.get("p")
        .as("text")
        .contains(
          "Only pets that require an Establish Care Exam may be selected"
        );
      cy.get("label").contains("VCPR REQUIRED TEST CAT").click();
      cy.get("label").as("label").contains("NO VCPR TEST CAT").click();
      cy.get("button[type='submit']").click();
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/location-selection/"
      );
      cy.get("#restart").contains("Restart").click();
      cy.get("@heading").contains("Restart Appointment Booking?");
      cy.get("button").contains("CANCEL").click();
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/location-selection/"
      );
      cy.get("@heading").contains("Choose a Location");
      cy.get("#restart").contains("Restart").click();
      cy.get("@heading").contains("Restart Appointment Booking?");
      cy.get("button").contains("CANCEL").click();
      cy.get("@heading").contains("MoVET @ Belleview Station");
      cy.get("a").contains("4912 S Newport St, Denver CO 80237");
      cy.get("button[type='submit']").as("submitButton").should("be.enabled");
      cy.get("#Virtually").contains("Virtually").click();
      cy.get("@heading").contains(
        "What can I expect in a Virtual Consultation?"
      );
      cy.get("@text").contains("What is VCPR?").click();
      cy.get("button").contains("CLOSE").click();
      cy.get("button").should("be.enabled");
      cy.get("#Home").contains("Home").click();
      cy.get("@submitButton").should("be.disabled");
      cy.get(".places-search").type("702 Westgate Ave");
      cy.wait(1000);
      cy.get("#react-select-3-option-0").click();
      cy.get("p.text-movet-red").contains(
        "MoVET does not currently service this area. Please enter a new address that is in (or near) the Denver Metro area."
      );
      cy.get("@submitButton").as("submit").should("be.disabled");
      cy.get(".places-search").type("4912 S Newport Street Denver");
      cy.wait(1000);
      cy.get("#react-select-3-option-0").click();
      cy.get("#info").type("Apartment 2A (This is a test address)");
      cy.get("@submitButton").should("be.enabled").click();
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/reason-selection/"
      );
      cy.get("@heading").contains("Choose a Service");
      cy.get("#restart").contains("Restart").click();
      cy.get("@heading").contains("Restart Appointment Booking?");
      cy.get("button").contains("CANCEL").click();
      cy.get("@submitButton").should("be.disabled");
      cy.get(".search-input").type("Exam");
      cy.wait(1000);
      cy.get("#react-select-3-option-0").click();
      cy.get("@submitButton").click();
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/staff-selection/"
      );
      cy.get("@heading").contains("Choose an Expert");
      cy.get("#restart").contains("Restart").click();
      cy.get("@heading").contains("Restart Appointment Booking?");
      cy.get("button").contains("CANCEL").click();
      cy.get("@submitButton").should("be.enabled");
      cy.get("@submitButton").contains("Request").click();
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/datetime-selection/"
      );
      cy.get("@heading").contains("Request a Time");
      cy.get("#restart").contains("Restart").click();
      cy.get("@heading").contains("Restart Appointment Booking?");
      cy.get("button").contains("CANCEL").click();
      cy.get("@submitButton").should("be.disabled");
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      cy.get("button abbr").contains(String(tomorrow.getDate())).click();
      cy.get(".time-input").type("1430");
      cy.get("@submitButton").should("be.enabled").click();
      cy.location("pathname", {
        timeout: defaultPathnameTimeOut + 3000,
      }).should("eq", "/schedule-an-appointment/success/");
      cy.get("@heading").contains("Appointment Request Successful");
    });
  }
);

describe(
  "winter-mode-schedule-an-appointment-flow",
  { defaultCommandTimeout: defaultPathnameTimeOut },
  () => {
    it("Can NOT request a housecall with VCPR required patient", () => {
      cy.request(
        "POST",
        "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
        { apiKey: Cypress.env().endpointApiKey, id: "winter-mode-off" }
      );
      cy.request(
        "POST",
        "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
        { apiKey: Cypress.env().endpointApiKey, id: "winter-mode-on" }
      );
      cy.request(
        "POST",
        "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
        {
          apiKey: Cypress.env().endpointApiKey,
          id: Cypress.env().existingClientWithPaymentId,
        }
      );
      cy.visit(
        `http://localhost:3001/?email=${
          Cypress.env().existingClientWithPaymentEmail
        }`
      );
      cy.get("h2").as("heading").contains("Schedule an Appointment");
      cy.get("@heading").contains("Processing, please wait...");
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/pet-selection/"
      );
      cy.get("label").as("label").contains("NO VCPR TEST DOG").click();
      cy.get("@label").contains("VCPR REQUIRED TEST CAT").click();
      cy.get("p")
        .as("text")
        .contains(
          "Only pets that require an Establish Care Exam may be selected"
        );
      cy.get("@label").contains("NO VCPR TEST DOG").click();
      cy.get("button[type='submit']").click();
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/wellness-check/"
      );
      cy.get("#restart").contains("Restart").click();
      cy.get("@heading").contains("Restart Appointment Booking?");
      cy.get("button").contains("CANCEL").click();
      cy.get("@heading").contains("Pet Wellness Check");
      cy.get("span").contains("What are symptoms of minor illness?").click();
      cy.get("@heading").contains("Minor Illness Symptoms");
      cy.get("button").contains("CLOSE").click();
      cy.get("button").contains("Skip").click();
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/location-selection/"
      );
      cy.get("@heading").contains("Choose a Location");
      cy.get("#restart").contains("Restart").click();
      cy.get("@heading").contains("Restart Appointment Booking?");
      cy.get("button").contains("CANCEL").click();
      cy.get("#Virtually").click();
      cy.get("@heading").contains(
        "What can I expect in a Virtual Consultation?"
      );
      cy.get("@text").contains("What is VCPR?").click();
      cy.get("button").contains("CLOSE").click();
      cy.get("button").should("be.enabled");
      cy.get("#Clinic").click();
      cy.get("@heading").contains("MoVET @ Belleview Station");
      cy.get("a").contains("4912 S Newport St, Denver CO 80237");
      cy.get("button[type='submit']").as("submitButton").should("be.enabled");
      cy.get("#Home").should("not.exist");
      cy.request(
        "POST",
        "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
        { apiKey: Cypress.env().endpointApiKey, id: "winter-mode-off" }
      );
    });

    it("(MOBILE WEBVIEW) Can request a housecall with VCPR required patient", () => {
      cy.request(
        "POST",
        "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
        { apiKey: Cypress.env().endpointApiKey, id: "winter-mode-off" }
      );
      cy.request(
        "POST",
        "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
        { apiKey: Cypress.env().endpointApiKey, id: "winter-mode-on" }
      );
      cy.request(
        "POST",
        "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
        {
          apiKey: Cypress.env().endpointApiKey,
          id: Cypress.env().existingClientWithPaymentId,
        }
      );
      cy.visit(
        `http://localhost:3001/?email=${
          Cypress.env().existingClientWithPaymentEmail
        }&mode=app&housecallRequest=1&disableMaps=1`
      );
      cy.get("legend").contains("Your Pet");
      cy.get("label").contains("VCPR REQUIRED TEST CAT");
      cy.get("button[type='submit']").as("submit").click();
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/wellness-check/"
      );
      cy.get("button").contains("Skip").click();
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/location-selection/"
      );
      cy.get("#Virtually").should("not.exist");
      cy.get("#Home").should("not.exist");
      cy.get(".places-search").type("4912 S Newport Street Denver");
      cy.wait(1000);
      cy.get("#react-select-3-option-0").click();
      cy.get("#info").type("Apartment 2A (This is a test address)");
      cy.get("@submit").click();
      cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
        "eq",
        "/schedule-an-appointment/datetime-selection/"
      );
      cy.get("@submit").should("be.disabled");
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      cy.get("button abbr").contains(String(tomorrow.getDate())).click();
      cy.get(".time-input").type("1430");
      cy.get("@submit").should("be.enabled").click();
      cy.location("pathname", {
        timeout: defaultPathnameTimeOut + 3000,
      }).should("eq", "/schedule-an-appointment/success/");
      cy.get("h2").contains("Housecall Request Successful");
      cy.request(
        "POST",
        "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
        { apiKey: Cypress.env().endpointApiKey, id: "winter-mode-off" }
      );
    });
  }
);

const runThroughAppointmentRequestWorkflows = ({email, id, firstName, lastName, petName}) => {
  cy.request(
    "POST",
    "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
    { apiKey: Cypress.env().endpointApiKey, id: "winter-mode-off" }
  );
  cy.request(
    "POST",
    "http://localhost:5001/movet-care-staging/us-central1/resetTestData",
    { apiKey: Cypress.env().endpointApiKey, id }
  );
  cy.visit("http://localhost:3001/schedule-an-appointment");
  cy.get("input[name='email']").type(email);
  cy.get("h2").as("heading").contains("Schedule an Appointment");
  cy.get("button[type='submit']").as("submitButton").click();
  cy.get("@heading").contains("Processing, please wait...");
  cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
    "eq",
    "/schedule-an-appointment/contact-info/"
  );
  cy.get("@heading").contains("Contact Information");
  cy.get("input[name='phone-number']").type("123");
  cy.get("@submitButton").click();
  cy.get("p.text-movet-red")
    .as("errorMessage")
    .contains("A first name is required");
  cy.get("@errorMessage").contains("A last name is required");
  cy.get("@errorMessage").contains("Phone number must be 10 digits");
  cy.get("input[name='firstName']").type(firstName);
  cy.get("input[name='lastName']").type(lastName);
  cy.get("input[name='phone-number']").type(
    Math.floor(100000000 + Math.random() * 900000000)
  );
  cy.get("@submitButton").click();
  cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
    "eq",
    "/schedule-an-appointment/add-a-pet/"
  );
  cy.get("@heading").contains("Add a Pet");
  cy.get("@submitButton").click();
  cy.get("@errorMessage").contains("A type is required");
  cy.get("@errorMessage").contains("A gender is required");
  cy.get("@errorMessage").contains("Name must contain at least 2 characters");
  cy.get("@errorMessage").contains("Weight must be between 1 and 300 pounds");
  cy.get("@errorMessage").contains("A selection is required");
  cy.get("@errorMessage").contains(
    "Please fix the errors highlighted above..."
  );
  cy.get("#dog").click();
  cy.get("#male").click();
  cy.get("input[name='name']").type(petName);
  cy.get(".search-input").type("Mix{enter}");
  cy.get("input[name='weight-number']").type("10");
  cy.get("input[name='birthday']").type("10102020");
  cy.get(".places-search").type("Kingsburry{enter}").click();
  cy.get("p")
    .as("text")
    .contains("this pet has no history of aggression")
    .click();
  cy.get("textarea#notes")
    .as("notes")
    .type("This is a test pet that is auto generated via Cypress...");
  cy.get("@submitButton").click();
  cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
    "eq",
    "/schedule-an-appointment/pet-selection/"
  );
  cy.get("@heading").contains("Select a Pet");
  cy.get("span").contains("What are Establish Care Exams?").click();
  cy.get("button").contains("CLOSE").click();
  cy.get("label").contains("* Requires Establish Care Exam");
  cy.get("label").contains(petName).click();
  cy.get("@text").contains("A pet selection is required");
  if (!onlyTestOnePatient) {
    cy.get("button").contains("Add a Pet").as("addAPetButton").click();
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/add-a-pet/"
    );
    cy.get("@heading").contains("Add a Pet");
    cy.get("#cat").click();
    cy.get("#female").click();
    cy.get("button.switch-input").click();
    cy.get("input[name='name']").type("TEST CAT 1");
    cy.get(".search-input").type("Bombay{enter}");
    cy.get("input[name='weight-number']").type("10");
    cy.get("input[name='birthday']").type("10102020");
    cy.get(".places-search").type("Kingsburry{enter}").click();
    cy.get("@text")
      .contains(
        "This pet DOES have had a history of aggression or aggressive tendencies."
      )
      .click();
    cy.get("@notes").type(
      "This is a test pet that is auto generated via Cypress..."
    );
    cy.get("@submitButton").click();
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/pet-selection/"
    );
    cy.get("@addAPetButton").click();
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/add-a-pet/"
    );
    cy.get("@heading").contains("Add a Pet");
    cy.get("#cat").click();
    cy.get("#female").click();
    cy.get("button.switch-input").click();
    cy.get("input[name='name']").type("TEST CAT 2");
    cy.get(".search-input").type("Bombay{enter}");
    cy.get("input[name='weight-number']").type("10");
    cy.get("input[name='birthday']").type("10102020");
    cy.get(".places-search").type("Kingsburry{enter}").click();
    cy.get("@text")
      .contains(
        "This pet DOES have had a history of aggression or aggressive tendencies."
      )
      .click();
    cy.get("@notes").type(
      "This is a test pet that is auto generated via Cypress..."
    );
    cy.get("@submitButton").click();
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/pet-selection/"
    );
    cy.get("@addAPetButton").click();
    cy.get("@heading").contains("Add a Pet");
    cy.get("#dog").click();
    cy.get("#female").click();
    cy.get("button.switch-input").click();
    cy.get("input[name='name']").type("TEST DOG 2");
    cy.get(".search-input").type("Lab{enter}");
    cy.get("input[name='weight-number']").type("10");
    cy.get("input[name='birthday']").type("10102020");
    cy.get(".places-search").type("Kingsburry{enter}").click();
    cy.get("@text")
      .contains(
        "This pet DOES have had a history of aggression or aggressive tendencies."
      )
      .click();
    cy.get("@notes").type(
      "This is a test pet that is auto generated via Cypress..."
    );
    cy.get("@submitButton").click();
  }
  cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
    "eq",
    "/schedule-an-appointment/pet-selection/"
  );
  cy.get("label").as("label").contains("TEST DOG").click();
  if (!onlyTestOnePatient) {
    cy.get("@label").contains("TEST DOG 2").click();
    cy.get("@label").contains("TEST CAT").click();
    cy.get("@label").contains("TEST CAT 2").click();
    cy.get("@text").contains("Only 3 pets are allowed per appointment");
    cy.get("@label").contains("TEST CAT 2").click();
  }
  cy.get("@submitButton").click();
  cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
    "eq",
    "/schedule-an-appointment/wellness-check/"
  );
  cy.get("#restart").contains("Restart").click();
  cy.get("@heading").contains("Restart Appointment Booking?");
  cy.get("button").contains("CANCEL").click();
  cy.get("@heading").contains("Pet Wellness Check");
  cy.get("span").contains("What are symptoms of minor illness?").click();
  cy.get("@heading").contains("Minor Illness Symptoms");
  cy.get("button").contains("CLOSE").click();
  if (skipWellnessCheck) cy.get("button").contains("Skip").click();
  if (!skipWellnessCheck) cy.get("label").contains("TEST DOG").click();
  if (!onlyTestOnePatient && !skipWellnessCheck)
    cy.get("label").contains("TEST CAT 1").click();
  if (!onlyTestOnePatient && !skipWellnessCheck)
    cy.get("button").contains("My Pets DO NOT need emergency care").click();
  else if (!skipWellnessCheck)
    cy.get("button").contains("My Pet DOES NOT need emergency care").click();
  if (!skipWellnessCheck) {
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/illness-selection/"
    );
    cy.get("@heading").contains("Minor Illness");
    cy.get("legend").contains("Symptoms");
    cy.get("#restart").contains("Restart").click();
    cy.get("@heading").contains("Restart Appointment Booking?");
    cy.get("button").contains("CANCEL").click();
    cy.get("@text").contains(
      "We're sorry to hear TEST DOG is not feeling well"
    );
    cy.get("@label").contains("Coughing").click();
    cy.get("@label").contains("Coughing").click();
    cy.get("@errorMessage").contains("A symptom selection is required");
    cy.get("@label").contains("Coughing").click();
    cy.get("@label").contains("Other").click();
    cy.get("@submitButton").click();
    cy.get("@errorMessage").contains("Please tell us more...");
    cy.get("textarea[name='details']").type("Test symptom notes...");
    cy.get("@submitButton").click();
  }
  if (!onlyTestOnePatient && !skipWellnessCheck) {
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/schedule-an-appointment/illness-selection/"
    );
    cy.get("@heading").contains("Minor Illness");
    cy.get("legend").contains("Symptoms");
    cy.get("@text").contains(
      "We're sorry to hear TEST CAT 1 is not feeling well"
    );
    cy.get("@label").contains("Other").click();
    cy.get("textarea[name='details']").type("Test symptom notes...");
    cy.get("button").contains("Continue").click();
  }
  cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
    "eq",
    "/schedule-an-appointment/location-selection/"
  );
  cy.get("@heading").contains("Choose a Location");
  cy.get("#restart").contains("Restart").click();
  cy.get("@heading").contains("Restart Appointment Booking?");
  cy.get("button").contains("CANCEL").click();
  cy.get("@heading").contains("MoVET @ Belleview Station");
  cy.get("a").contains("4912 S Newport St, Denver CO 80237");
  cy.get("@submitButton").should("be.enabled");
  cy.get("#Virtually").contains("Virtually").click();
  cy.get("@heading").contains("What can I expect in a Virtual Consultation?");
  cy.get("@text").contains("What is VCPR?").click();
  cy.get("button").contains("CLOSE").click();
  cy.get("button").should("be.enabled");
  cy.get("#Home").contains("Home").click();
  cy.get("@submitButton").should("be.disabled");
  cy.get(".places-search").type("702 Westgate Ave");
  cy.focused().tab();
  cy.get(".places-search").type("{enter}");
  cy.get("@submitButton").should("be.disabled");
  cy.get(".places-search").type("4912 S Newport Street Denver");
  cy.focused().tab();
  cy.get("@submitButton").should("be.disabled");
  cy.get("#info").type("Apartment 2A (This is a test address)");
  cy.get("#Clinic").contains("Clinic").click();
  cy.get("@submitButton").should("be.enabled").click();
  cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
    "eq",
    "/schedule-an-appointment/datetime-selection/"
  );
  cy.get("@heading").contains("Request a Time");
  cy.get("#restart").contains("Restart").click();
  cy.get("@heading").contains("Restart Appointment Booking?");
  cy.get("button").contains("CANCEL").click();
  cy.get("@submitButton").should("be.disabled");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  cy.get("button abbr").contains(String(tomorrow.getDate())).click();
  cy.get(".time-input").type("1430");
  cy.get("@submitButton").should("be.enabled").click();
  cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
    "eq",
    "/schedule-an-appointment/payment-confirmation/"
  );
  cy.get("@heading").contains("of Payment Required");
  cy.get("@text").contains(
    "* You will not be charged until your appointment is completed."
  );
  cy.on("uncaught:exception", (e) => {
    if (e.message.includes("Things went bad")) return false;
  });
  cy.get("@submitButton").should("be.enabled").click();
  cy.wait(5000);
  cy.visit("http://localhost:3001/schedule-an-appointment/success");
  cy.get("@heading").contains("Appointment Request Successful");
};