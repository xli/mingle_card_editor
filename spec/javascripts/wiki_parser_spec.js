describe("WikiParser", function() {
  it("parse macro as paragraphs", function() {
    expect(p("{{ table }}{{ macro: hello\n  world }}")).
    toEqual([{type: 'macro', text: "{{ table }}"}, {type: 'macro', text: "{{ macro: hello\n  world }}"}])
  });
  it("parse macro with > and <", function() {
    expect(p("{{ macro: hello >< world }}")).
    toEqual([{type: 'macro', text: "{{ macro: hello >< world }}"}])
  });
  it("empty str before/after macro should be part of macro", function() {
    expect(p("  {{ table }}  ")).
    toEqual([{type: 'macro', text: "  {{ table }}  "}]);
  });
  it("parse text as paragraphs splitted by 2 new lines", function() {
    expect(p("hello\n\nworld")).
    toEqual(["hello", "world"]);
  });
  it("parse text splitted by 1 new line as paragraph", function() {
    expect(p("hello\nworld\n!")).
    toEqual(["hello\nworld\n!"]);
  });
  it("parse text and macro paragraphs", function() {
    expect(p("hello{{ table }}\nworld\n!")).
    toEqual(["hello", {type: 'macro', text: "{{ table }}"}, "\nworld\n!"]);

    expect(p("hello\n{{ table\n  p1: xxx\n  p2: yyy\n}}\nworld\n\nhah!{{ ppp }}")).
    toEqual(["hello\n", {type: 'macro', text: "{{ table\n  p1: xxx\n  p2: yyy\n}}"}, "\nworld", 'hah!', {type: 'macro', text: '{{ ppp }}'}]);
  });
  it("parse }} as text if there is no {{ before it", function() {
    expect(p("hello value }}!")).
    toEqual(["hello value }}!"]);

    expect(p("hello value }} {{ table }}!")).
    toEqual(["hello value }}", {type: 'macro', text: " {{ table }}"}, "!"]);

    expect(p("hello value }\n\n {{ table }}!}}")).
    toEqual(["hello value }", {type: 'macro', text: " {{ table }}"}, "!}}"]);
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
    expect(p("hello\n\nworld<p>{%!</p>")).
    toEqual(["hello", 'world', {type: 'html', text: "<p>{%!</p>"}]);
  });

  it("should reject empty paragraphs", function() {
    expect(p("hello \n\n vv \n\n {{ table }}!}}")).
    toEqual(["hello ", " vv ", {type: 'macro', text: " {{ table }}"}, "!}}"]);
  });

  it("should parse inline macro as part of text paragraph", function() {
    expect(p("hello {{ value query: xxx }}")).
    toEqual(["hello {{ value query: xxx }}"]);

    expect(p("hello {{ project }}")).
    toEqual(["hello {{ project }}"]);

    expect(p("hello {{ project-variable \n     name: 'card-plv' \n    project: #{other_project.identifier} \n}}")).
    toEqual(["hello {{ project-variable \n     name: 'card-plv' \n    project: #{other_project.identifier} \n}}"]);
  });
});
