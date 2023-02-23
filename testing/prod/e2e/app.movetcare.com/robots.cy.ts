describe("robots", () => {
  it("robots file exists", () =>
    cy
      .request("https://app.movetcare.com/robots.txt")
      .its("status")
      .should("eq", 200));
});
