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
    cy.get("#contact-form input[name='firstName']").type("CYPRESS");
    cy.get("#contact-form input[name='lastName']").type("TEST");
    cy.get("#contact-form input[name='email']").type("CYPRESS@TEST.COM");
    cy.get("#contact-form input[name='phone-number']").type("9999999999");
    cy.get("#contact-form textarea[name='message']").type(
      "CYPRESS TEST 123..."
    );
    cy.get("#contact-form button").contains("Submit").click();
    cy.wait(3000);
    cy.get("#contact-form h2").contains("Success!");
  });
});
