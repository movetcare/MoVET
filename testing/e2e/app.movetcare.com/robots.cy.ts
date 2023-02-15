describe("robots", () => {
  it("robots file exists", () =>
    cy
      .request("http://localhost:3001/robots.txt")
      .its("status")
      .should("eq", 200));
});
