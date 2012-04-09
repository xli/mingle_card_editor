(function($) {
  window.baseUrl = "http://localhost:3000/api/v2/projects/";
  var editingCard = null;
  var render_from_server_paragraph = {
    emit: function(div, item) {
      renderWiki(item.text, function(html) {
        div.html(html);
        div.unbind('dblclick').dblclick(function(e) {
          e.stopPropagation();
          return wikimate.plainTextEditor(div, item).focus();
        });
      });
      return div.html('<img src="http://localhost:3000/images/spinner.gif" title="loading..."/>');
    },
    bind: function(div, item) {
      return null;
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
      content_provider: {
        id: card_id,
        type: 'card'
      },
      content: content
    })
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
      beforeSend : function(req) {
        req.setRequestHeader("Authorization", "Basic bWluZ2xlX2J1aWxkZXIyOmNGalc4RnI5ZA==");
      },
      success: onSuccess,
      failure: function(x) {
        console.log('failed: ' + x);
      }
    });
  };

  function renderWikiMate(story) {
    $('#wiki').empty().wikimate({story: story, change: updateCardDescription});
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

  function project() {
    return $('#project').val();
  };
  function number() {
    return $('#card_number').val();
  };

  function step(msg, func) {
    $('#wiki').append(msg + "<br/>");
    return func.call();
  };

  $(document).ready(function() {
    loadCard(project(), number());
  });
})(jQuery);


// var story = eval($('.store textarea').val());
// $('.wikimate').wikimate({story: story, change: function(event, action) {
//   var data = eval($('.store textarea').val());
//   if (action.type == 'add') {
//     data.push(action.item);
//   } else if (action.type == 'edit') {
//     $.each(data, function(i, item) {
//       if (item.id == action.id) {
//         item.text = action.item.text;
//       }
//     });
//   } else if (action.type == 'remove') {
//     $.each(data, function(i, item) {
//       if (item.id == action.id) {
//         data.splice(i, 1);
//       }
//     });
//   } else {
//     alert("Unknown action type: " + action.type);
//   }
//   $('.store textarea').text(JSON.stringify(data));
// }});
