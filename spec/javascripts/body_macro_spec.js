describe("WikiParser parses body macro", function() {
  it("parse body macro", function() {
    expect(p("{% panel-heading %}\nsomething\n{% panel-heading %}")).
    toEqual(["{% panel-heading %}\nsomething\n{% panel-heading %}"]);

    expect(p("{% panel-heading %}\nsomething\n{% panel-heading %}hello\n\nworld")).
    toEqual(["{% panel-heading %}\nsomething\n{% panel-heading %}", 'hello', 'world']);
  });

  it("parse multi level body macro as one paragraph", function() {
    expect(p("{% panel %}{% panel-heading %}\nsomething\n{% panel-heading %}{% panel %}")).
    toEqual(["{% panel %}{% panel-heading %}\nsomething\n{% panel-heading %}{% panel %}"]);
  });

  it("parse out body macro like string", function() {
    expect(p("{% panel %}{% panel-heading %}\nsomething\n\nhaha")).
    toEqual(["{% panel %}{% panel-heading %}\nsomething", 'haha']);

    expect(p("{% panel {% panel-heading %}\nsomething\n\nhaha")).
    toEqual(["{% panel {% panel-heading %}\nsomething", 'haha']);

    expect(p("{% panel {% panel-heading\nsomething\n\nhaha")).
    toEqual(["{% panel {% panel-heading\nsomething", 'haha']);
  });
});