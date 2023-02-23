const defaultPathnameTimeOut = Cypress.env().defaultPathnameTimeOut;

describe("privacy-policy-page", () => {
  it("privacy policy link works", () => {
    cy.visit("https://movetcare.com/");
    cy.get("footer a p").contains("Privacy Policy").click();
    cy.get("h1").contains("Privacy Policy");
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/privacy-policy/"
    );
    cy.get("p").contains("Go Back").click();
    cy.location("pathname", { timeout: defaultPathnameTimeOut }).should(
      "eq",
      "/"
    );
  });
  it("privacy policy page content exists", () => {
    cy.visit("https://movetcare.com/privacy-policy");
    cy.get("h1").contains("Privacy Policy");
    cy.get("h2").contains("Introduction");
    cy.get("h2").contains("IMPORTANT DEFINITIONS");
    cy.get("h2").contains("Children Under Age 18");
    cy.get("h2").contains("Collection of Personal Information");
    cy.get("h2").contains("Usage of Personal Health Data");
    cy.get("h2").contains("Security and Storage of Your Information");
    cy.get("h2").contains("Storage of Personal Data");
    cy.get("h2").contains("Disclosure of Personal Information");
    cy.get("h2").contains("Information We Collect Via Technology");
    cy.get("h2").contains("De-Identified Information");
    cy.get("h2").contains("Data Collected Through the Use of Service");
    cy.get("h2").contains(
      "Information We Receive from Social Networking Sites"
    );
    cy.get("h2").contains("Calendar Information");
    cy.get("h2").contains("Information You Share with Third Parties");
    cy.get("h2").contains("Modification of Information");
    cy.get("h2").contains("Communications");
    cy.get("h2").contains("Marketing Communications");
    cy.get("h2").contains("Third Party Tracking and Online Advertising");
    cy.get("h2").contains("Data Retention");
    cy.get("h2").contains("Limitations on Deletion of Information");
    cy.get("h2").contains("Report Violations");
    cy.get("h2").contains("Updates to this Privacy Policy");
    cy.get("h2").contains("Contacting Us");
    cy.get("h2").contains("Last Revision Date");
    cy.get("p").contains(
      "This Policy was posted on April 1st 2022, and last revised on, and effective as of, April 1st 2022."
    );
  });
});
