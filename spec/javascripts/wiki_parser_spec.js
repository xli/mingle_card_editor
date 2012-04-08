describe("WikiParser", function() {
  it("parse macro as paragraph", function() {
    expect(p("{{ value }}{{ macro: hello\n  world }}")).
    toEqual(["{{ value }}", "{{ macro: hello\n  world }}"])
  });
  it("parse text as paragraphs splitted by 2 new lines", function() {
    expect(p("hello\n\nworld")).
    toEqual(["hello", "world"])
  });
  it("parse text splitted by 1 new line as paragraph", function() {
    expect(p("hello\nworld\n!")).
    toEqual(["hello\nworld\n!"])
  });
  it("parse text and macro paragraphs", function() {
    expect(p("hello{{ value }}\nworld\n!")).
    toEqual(["hello", "{{ value }}", "\nworld\n!"]);
    expect(p("hello\n{{ value\n  p1: xxx\n  p2: yyy\n}}\nworld\n\nhah!{{ ppp }}")).
    toEqual(["hello\n", "{{ value\n  p1: xxx\n  p2: yyy\n}}", "\nworld", 'hah!', '{{ ppp }}']);
  });
  it("parse }} as text if there is no {{ before it", function() {
    expect(p("hello value }}!")).
    toEqual(["hello value }}!"]);

    expect(p("hello value }} {{ value }}!")).
    toEqual(["hello value }} ", "{{ value }}", "!"]);

    expect(p("hello value }\n\n {{ value }}!}}")).
    toEqual(["hello value }", "{{ value }}", "!}}"]);
  });
  it("parse { as text", function() {
    expect(p("hello {!")).
    toEqual(["hello {!"]);

    expect(p("hello {{!")).
    toEqual(["hello {{!"]);
  });

  it("parse {% as text", function() {
    expect(p("hello {%!")).
    toEqual(["hello {%!"]);

    expect(p("hello {% not exist %}!")).
    toEqual(["hello {% not exist %}!"]);
  });
});
