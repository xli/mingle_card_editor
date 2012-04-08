describe("WikiParser parses body macro", function() {
  it("parse body macro", function() {
    expect(p("{% panel-heading %}\nsomething\n{% panel-heading %}")).
    toEqual(["{% panel-heading %}\nsomething\n{% panel-heading %}"]);
  });
});