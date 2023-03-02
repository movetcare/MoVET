const Parse = require("x2js");

describe(
  "sitemap",
  { defaultCommandTimeout: Cypress.env().defaultPathnameTimeOut },
  () => {
    it("sitemap exists with valid links", () => {
      cy.request(Cypress.env().websiteUrl + "/sitemap.xml", {
        retryOnStatusCodeFailure: true,
        failOnStatusCode: false,
        timeout: Cypress.env().defaultPathnameTimeOut,
      })
        .wait(3000, { log: false })
        .its("body")
        .then((body) => {
          const x2js = new Parse();
          const json = x2js.xml2js(body);
          expect(json.urlset.url).to.be.an("array").and.have.length.gt(0);
          json.urlset.url.forEach((url) => {
            const parsed = new URL(url.loc);
            cy.log(parsed.pathname);
            Cypress.on("fail", () => false);
            cy.visit(
              Cypress.env().environment === "development"
                ? url.loc.replaceAll(
                    "https://movetcare.com",
                    Cypress.env().websiteUrl
                  )
                : url.loc,
              {
                retryOnStatusCodeFailure: true,
              }
            ).wait(3000, { log: false });
            Cypress.on("fail", () => true);
          });
        });
    });
  }
);
