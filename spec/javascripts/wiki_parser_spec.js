describe("WikiParser", function() {
  it("parse macro as paragraphs", function() {
    expect(p("{{ table }}{{ macro: hello\n  world }}")).
    toEqual([{id: 'story_item_1', type: 'macro', text: "{{ table }}"}, {id: 'story_item_2', type: 'macro', text: "{{ macro: hello\n  world }}"}]);
  });
  it("parse macro with > and <", function() {
    expect(p("{{ macro: hello >< world }}")).
    toEqual([{id: 'story_item_1', type: 'macro', text: "{{ macro: hello >< world }}"}]);
  });
  it("empty str before/after macro should be part of macro", function() {
    expect(p("  {{ table }}  ")).
    toEqual([{id: 'story_item_1', type: 'macro', text: "  {{ table }}  "}]);
  });
  it("parse text as paragraphs splitted by 2 new lines", function() {
    expect(p("hello\n\nworld")).
    toEqual([{id: 'story_item_1', type: "paragraph", text: "hello"}, {id: 'story_item_2', type: 'paragraph', text: "world"}]);
  });
  it("parse text splitted by 1 new line as paragraph", function() {
    expect(p("hello\nworld\n!")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello\nworld\n!"}]);
  });
  it("parse text and macro paragraphs", function() {
    expect(p("hello{{ table }}\nworld\n!")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello"}, {id: 'story_item_2', type: 'macro', text: "{{ table }}"}, {id: 'story_item_3', type: 'paragraph', text: "\nworld\n!"}]);

    expect(p("hello\n{{ table\n  p1: xxx\n  p2: yyy\n}}\nworld\n\nhah!{{ ppp }}")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello\n"}, {id: 'story_item_2', type: 'macro', text: "{{ table\n  p1: xxx\n  p2: yyy\n}}"}, {id: 'story_item_3', type: 'paragraph', text: "\nworld"}, {id: 'story_item_4', type: 'paragraph', text: 'hah!'}, {id: 'story_item_5', type: 'macro', text: '{{ ppp }}'}]);
  });
  it("parse }} as text if there is no {{ before it", function() {
    expect(p("hello value }}!")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello value }}!"}]);

    expect(p("hello value }} {{ table }}!")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello value }}"}, {id: 'story_item_2', type: 'macro', text: " {{ table }}"}, {id: 'story_item_3', type: 'paragraph', text: "!"}]);

    expect(p("hello value }\n\n {{ table }}!}}")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello value }"}, {id: 'story_item_3', type: 'macro', text: " {{ table }}"}, {id: 'story_item_4', type: 'paragraph', text: "!}}"}]);
  });
  it("parse { as text", function() {
    expect(p("hello {!")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello {!"}]);

    expect(p("hello {{!")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello {{!"}]);
  });

  it("parse {% as text", function() {
    expect(p("hello {%!")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello {%!"}]);

    expect(p("hello {% not exist %}!")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello {% not exist %}!"}]);
  });

  it("parse html element", function() {
    expect(p("hello\n\nworld<p>{%!</p>")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello"}, {id: 'story_item_2', type: 'paragraph', text: 'world'}, {id: 'story_item_3', type: 'html', text: "<p>{%!</p>"}]);
  });

  it("should reject empty paragraphs", function() {
    expect(p("hello \n\n vv \n\n {{ table }}!}}")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello "}, {id: 'story_item_2', type: 'paragraph', text: " vv "}, {id: 'story_item_4', type: 'macro', text: " {{ table }}"}, {id: 'story_item_5', type: 'paragraph', text: "!}}"}]);
  });

  it("should parse inline macro as part of text paragraph", function() {
    expect(p("hello {{ value query: xxx }}")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello {{ value query: xxx }}"}]);

    expect(p("hello {{ project }}")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello {{ project }}"}]);

    expect(p("hello {{ project-variable \n     name: 'card-plv' \n    project: #{other_project.identifier} \n}}")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "hello {{ project-variable \n     name: 'card-plv' \n    project: #{other_project.identifier} \n}}"}]);
  });

  describe("dump", function() {
    it('convert story items to string that can be saved to Mingle card', function() {
      expect(d([{id: 'story_item_1', type: 'paragraph', text: "p 1"}])).
      toEqual("p 1");

      expect(d([{id: 'story_item_1', type: 'paragraph', text: "p 1"}, {id: 'story_item_2', type: 'paragraph', text: "task 1"}])).
      toEqual("p 1\n\ntask 1");
    });

    it('parse out image', function() {
      var item = {id: 'story_item_1', type: 'image', text: "!image_identifier!"};
      expect(p(d([item]))).
      toEqual([item]);
    });
  });
});
