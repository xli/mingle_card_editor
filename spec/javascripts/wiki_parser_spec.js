describe("WikiParser", function() {
  it("parse macro as paragraph", function() {
    var paragraphs = wiki_parser.parse("{{ value }}{{ macro: hello\n  world }}");
    expect(paragraphs).toEqual(["{{ value }}", "{{ macro: hello\n  world }}"])
  });
  it("parse text as paragraphs splitted by 2 new lines", function() {
    var paragraphs = wiki_parser.parse("hello\n\nworld");
    expect(paragraphs).toEqual(["hello", "world"])
  });
  it("parse text splitted by 1 new line as paragraph", function() {
    var paragraphs = wiki_parser.parse("hello\nworld\n!");
    expect(paragraphs).toEqual(["hello\nworld\n!"])
  });
  it("parse text and macro", function() {
    var paragraphs = wiki_parser.parse("hello{{ value }}\nworld\n!");
    expect(paragraphs).toEqual(["hello", '{{ value }}', "world\n!"]);
  });
});