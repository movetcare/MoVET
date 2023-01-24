/* eslint-disable quotes */
describe("home-page-loads", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("display home page hero elements", () => {
    cy.get("main section h1").first().contains("Your neighborhood vet,");
    cy.get("main section h1").last().contains("Delivered");
    cy.get("main section p span")
      .first()
      .contains("A stress-free way to take care of your vet appointments.");
    cy.get("main section div p").contains("REQUEST AN APPOINTMENT");
    cy.get("main section div form input").should("be.visible");
    cy.get("main section div .ios-app-link").should("be.visible");
    cy.get("main section div .android-app-link").should("be.visible");
  });

  it("display working mobile navigation", () => {
    cy.get("#mobile-navigation").click();
    cy.get("#mobile-reviews").should("be.visible");
    cy.get("#mobile-services").should("be.visible");
    cy.get("#mobile-careers").should("be.visible");
    cy.get("#mobile-contact").should("be.visible");
    cy.get("#mobile-blog").should("be.visible");
    cy.get("#mobile-text-us-cta").should("be.visible");
    cy.get("#mobile-request-appointment-cta").should("be.visible");
  });

  it("display working announcement banner", () => {
    cy.get('[aria-label="Announcement Link"] p').first().contains("Welcome!");
  });

  it("displays all primary content sections", () => {
    cy.get("main section div h2").contains("Moving Pet Care Forward");
    cy.get("main section div h2").contains("Additional Amenities");
    cy.get("main section h2").contains("Our Services");
    cy.get("main section div h2").contains("Hours of Operation");
    cy.get("main section div h2").contains("Our Happy Clients");
    cy.get("main section div h2").contains("Contact Us");
    cy.get("main section div h3").contains("Your neighborhood vet");
  });

  it("displays all footer links", () => {
    cy.get("footer a p").contains("Privacy Policy");
    cy.get("footer a p").contains("Terms of Service");
    cy.get("footer a p").contains("FAQs");
    cy.get("footer a p").contains("Emergency Care");
  });

  it("can submit contact form", () => {
    cy.get("input[name='firstName']").type("CYPRESS");
    cy.get("button[type='submit']").as("submit").contains("Submit").click();
    cy.get("p.text-movet-red")
      .as("errorMessage")
      .contains("An email address is required");
    cy.get("@errorMessage").contains("A message is required");
    cy.get("input[name='lastName']").type("TEST");
    cy.get("input[name='email']").type("CYPRESS");
    cy.get("@submit").click();
    cy.get("p.text-movet-red")
      .as("errorMessage")
      .contains("Email must be a valid email address");
    cy.get("input[name='email']").type("CYPRESS@TEST.COM");
    cy.get("input[name='phone-number']").type("9999999999");
    cy.get("textarea[name='message']").type("CYPRESS TEST 123...");
    cy.get("@submit").click();
    cy.get("h2").contains("Success!");
  });
});
