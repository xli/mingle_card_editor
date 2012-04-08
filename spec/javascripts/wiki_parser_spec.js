describe("WikiParser", function() {
  it("parse macro as paragraphs", function() {
    expect(p("{{ table }}{{ macro: hello\n  world }}")).
    toEqual(["{{ table }}", "{{ macro: hello\n  world }}"])
  });
  it("empty str before/after macro should be part of macro", function() {
    expect(p("  {{ table }}  ")).
    toEqual(["  {{ table }}  "])
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
    expect(p("hello{{ table }}\nworld\n!")).
    toEqual(["hello", "{{ table }}", "\nworld\n!"]);
    expect(p("hello\n{{ table\n  p1: xxx\n  p2: yyy\n}}\nworld\n\nhah!{{ ppp }}")).
    toEqual(["hello\n", "{{ table\n  p1: xxx\n  p2: yyy\n}}", "\nworld", 'hah!', '{{ ppp }}']);
  });
  it("parse }} as text if there is no {{ before it", function() {
    expect(p("hello value }}!")).
    toEqual(["hello value }}!"]);

    expect(p("hello value }} {{ table }}!")).
    toEqual(["hello value }}", " {{ table }}", "!"]);

    expect(p("hello value }\n\n {{ table }}!}}")).
    toEqual(["hello value }", " {{ table }}", "!}}"]);
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

  it("parse html element", function() {
    expect(p("hello <pre>{%!</pre>")).
    toEqual(["hello ", "<pre>{%!</pre>"]);
  });

  it("should reject empty paragraphs", function() {
    expect(p("hello \n\n vv \n\n {{ table }}!}}")).
    toEqual(["hello ", " vv ", " {{ table }}", "!}}"]);
  });
});
