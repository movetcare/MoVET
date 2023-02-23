/* eslint-disable quotes */
describe("home-page-loads", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("display home page hero elements", () => {
    cy.get("h1").first().contains("Your neighborhood vet,");
    cy.get("h1").last().contains("Delivered");
    cy.get("p span")
      .first()
      .contains("A stress-free way to take care of your vet appointments.");
    cy.get("div p").contains("SCHEDULE AN APPOINTMENT");
    cy.get("div form input").should("be.visible");
    cy.get("div .ios-app-link").should("be.visible");
    cy.get("div .android-app-link").should("be.visible");
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
    cy.get("h2").contains("Moving Pet Care Forward");
    cy.get("h2").contains("Additional Amenities");
    cy.get("h2").contains("Our Services");
    cy.get("h2").contains("Hours of Operation");
    cy.get("h2").contains("Our Happy Clients");
    cy.get("h2").contains("Contact Us");
    cy.get("h3").contains("Your neighborhood vet");
  });

  it("displays all footer links", () => {
    cy.get("footer a p").as("footerLinks");
    cy.get("@footerLinks").contains("Privacy Policy");
    cy.get("@footerLinks").contains("Terms of Service");
    cy.get("@footerLinks").contains("FAQs");
    cy.get("@footerLinks").contains("Emergency Care");
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
    cy.get("#contact-form h2").contains("Success!");
  });
});
