describe("robots", () => {
  it("robots file exists", () =>
    cy
      .request("http://localhost:3000/robots.txt")
      .its("status")
      .should("eq", 200));
});
