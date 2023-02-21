const X2JS = require("x2js");

describe("sitemap", () => {
  it("sitemap exists with valid links", () => {
    cy.request("http://localhost:3000/sitemap.xml", {
      retryOnStatusCodeFailure: true,
    })
      .wait(3000, { log: false })
      .its("body")
      .then((body) => {
        const x2js = new X2JS();
        const json = x2js.xml2js(body);
        expect(json.urlset.url).to.be.an("array").and.have.length.gt(0);
        json.urlset.url.forEach((url) => {
          const parsed = new URL(url.loc);
          cy.log(parsed.pathname);
          cy.visit(
            url.loc.replaceAll(
              "https://movetcare.com",
              "http://localhost:3000"
            ),
            {
              retryOnStatusCodeFailure: true,
            }
          ).wait(3000, { log: false });
        });
      });
  });
});
