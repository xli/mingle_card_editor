describe("WikiParser parses body macro", function() {
  it("parse body macro", function() {
    expect(p("{% panel-heading %}\nsomething\n{% panel-heading %}")).
    toEqual([{id: 'story_item_1', type: 'body_macro', text: "{% panel-heading %}\nsomething\n{% panel-heading %}"}]);

    expect(p("{% panel-heading %}\nsomething\n{% panel-heading %}hello\n\nworld")).
    toEqual([{id: 'story_item_1', type: 'body_macro', text: "{% panel-heading %}\nsomething\n{% panel-heading %}"}, {id: 'story_item_2', type: 'paragraph', text: 'hello'}, {id: 'story_item_3', type: 'paragraph', text: 'world'}]);
  });

  it("parse multi level body macro as one paragraph", function() {
    expect(p("{% panel %}{% panel-heading %}\nsomething\n{% panel-heading %}{% panel %}")).
    toEqual([{id: 'story_item_1', type: 'body_macro', text: "{% panel %}{% panel-heading %}\nsomething\n{% panel-heading %}{% panel %}"}]);
  });

  it("parse out body macro like string", function() {
    expect(p("{% panel %}{% panel-heading %}\nsomething\n\nhaha")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "{% panel %}{% panel-heading %}\nsomething"}, {id: 'story_item_2', type: 'paragraph', text: 'haha'}]);

    expect(p("{% panel {% panel-heading %}\nsomething\n\nhaha")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "{% panel {% panel-heading %}\nsomething"}, {id: 'story_item_2', type: 'paragraph', text: 'haha'}]);

    expect(p("{% panel {% panel-heading\nsomething\n\nhaha")).
    toEqual([{id: 'story_item_1', type: 'paragraph', text: "{% panel {% panel-heading\nsomething"}, {id: 'story_item_2', type: 'paragraph', text: 'haha'}]);
  });
});