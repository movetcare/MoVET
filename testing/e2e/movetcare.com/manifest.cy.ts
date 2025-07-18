describe("manifest", () => {
  it("manifest file exists", () =>
    cy
      .request(Cypress.env().websiteUrl + "/manifest.json")
      .its("body")
      .then(
        (body: {
          name: string;
          background_color: string;
          description: string;
          display: string;
          scope: string;
          short_name: string;
          start_url: string;
          theme_color: string;
          icons: Array<{ src: string; sizes: string; type: "image/png" }>;
        }) => {
          expect(body.name).to.be.eq("MoVET");
          expect(body.background_color).to.be.eq("#f6f2f0");
          expect(body.description).to.be.eq("Moving Pet Care Forward");
          expect(body.display).to.be.eq("standalone");
          expect(body.scope).to.be.eq("/");
          expect(body.short_name).to.be.eq("MoVET");
          expect(body.start_url).to.be.eq("/schedule-an-appointment");
          expect(body.theme_color).to.be.eq("#E76159");
          body.icons.map((icon) => {
            expect(icon.src).to.have.length.gt(0);
            expect(icon.sizes).to.have.length.gt(0);
            expect(icon.type).to.be.eq("image/png");
          });
        }
      ));
});
