(function($) {
  window.baseUrl = "/api/v2/projects/";
  var editingCard = null;
  var render_from_server_paragraph = {
    // status: ['rendered', 'rendering', 'editing']
    //   rendering => rendered
    //   rendered => editing
    //   editing => rendering
    emit: function(div, item) {
      if (item.text == "") {
        div.data('status', 'rendered');
        return div.empty();
      } else {
        div.data('status', 'rendering');
        renderWiki(item.text, function(html) {
          if (div.data('status') == 'rendering') {
            div.data('status', 'rendered');
            div.html(html);
          }
        });
        return div.html('<img src="/images/spinner.gif" title="loading..."/>');
      }
    },
    bind: function(div, item) {
      div.unbind('dblclick').dblclick(function(e) {
        e.stopPropagation();
        if (div.data('status') == 'rendering') {
          alert("rendering " + item.text);
        } else {
          div.data('status', 'editing');
          return wikimate.plainTextEditor(div, item).focus();
        }
      });
    }
  }

  $.extend(wikimate.plugins, {
    paragraph: render_from_server_paragraph,
    macro: render_from_server_paragraph,
    body_macro: render_from_server_paragraph,
    html: render_from_server_paragraph
  });

  var mingle_wiki_parser = {
    parse: function(desc) {
      function nextId(index) {
        return 'story_item_' + index;
      }
      return _.map(wiki_parser.parse(desc), function(text, i) {
        if (typeof(text) == 'string') {
          return {id: nextId(i), type: 'paragraph', text: text};
        } else {
          return $.extend({id: nextId(i)}, text);
        }
      });
    },
  };

  function renderWiki(content, onSuccess) {
    var card_id = editingCard.find('card id').text();
    var paramStr = $.param({
      content_provider_x: {
        id: card_id,
        type: 'card'
      },
      content: content
    });
    jQuery.ajax({
      url: window.baseUrl + project() + "/render?" + paramStr,
      dataType: 'html',
      success: onSuccess
    });
  };

  function requestCard(uri, onSuccess) {
    jQuery.ajax({
      url: window.baseUrl + uri + '.xml',
      dataType: 'xml',
      success: onSuccess,
      failure: function(x) {
        console.log('failed: ' + x);
      }
    });
  };

  function renderWikiMate(story) {
    $('#content').empty().wikimate({story: story, change: updateCardDescription});
  };

  function updateCardDescription(event, action) {
    console.log("update: ");
    console.log(action);
  };

  function parseCardDescription(description) {
    return step('Parsing description', function() {
      return mingle_wiki_parser.parse(description);
    });
  };

  function loadCard(project, number) {
    step('Loading ' + project + ' card #' + number + ' description', function() {
      requestCard(project + '/cards/' + number, function(xmlDoc) {
        editingCard = $(xmlDoc);
        renderWikiMate(parseCardDescription(editingCard.find('card description').text()));
      });
    });
  };

  function cardPageMatch() {
    return window.location.href.match(/\/projects\/([\da-z_]+)\/cards\/(\d+)$/);
  };

  function project() {
    var match = cardPageMatch();
    if (match) {
      return match[1];
    }
    return undefined;
  };
  function number() {
    var match = cardPageMatch();
    if (match) {
      return match[2];
    }
    return undefined;
  };

  function step(msg, func) {
    $('#wiki').append(msg + "<br/>");
    return func.call();
  };

  if (project() && number()) {
    console.log("on card show page: " + project() + " #" + number());
    loadCard(project(), number());
  } else {
    console.log("not on card show page");
  }
})(jQuery);
