describe("robots", () => {
  it("robots file exists", () =>
    cy
      .request("http://localhost:3002/robots.txt")
      .its("status")
      .should("eq", 200));
});
