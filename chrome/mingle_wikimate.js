(function($) {
  window.baseUrl = "/api/v2/projects/";
  var editingCard = null;

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

  window.mingle_wikimate = {
    renderWiki: function(content, onSuccess) {
      var card_id = editingCard.find('card id').text();
      var paramStr = $.param({
        content_provider: {
          id: card_id,
          type: 'card'
        },
        content: content
      });
      $.ajax({
        url: window.baseUrl + project() + "/render?" + paramStr,
        dataType: 'html',
        success: onSuccess,
        failure: ajaxCallFailed
      });
    }
  }

  function requestCard(uri, onSuccess) {
    $.ajax({
      url: window.baseUrl + uri + '.xml',
      dataType: 'xml',
      success: onSuccess,
      failure: ajaxCallFailed
    });
  };

  function updateCardDescription(event, action) {
    var desc = $.map($('.wikimate').wikimate('story'), function(item){
      return item.text.trim();
    }).join("\n\n");

    updatingCardDescription();
    var url = window.baseUrl + project() + "/cards/" + number() + ".xml";
    $.ajax({
      url: url,
      dataType: 'xml',
      data: {card: {description: desc}},
      type: 'PUT',
      success: function(r) {
        updatedCardDescription();
      },
      failure: ajaxCallFailed
    })
  };

  function updatingCardDescription() {
    $('.wikimate').css('border-left', '2px solid yellow');
  };
  function updatedCardDescription() {
    $('.wikimate').css('border-left', '2px solid orange');
  };
  function ajaxCallFailed(ajax) {
    console.log("Ajax call failed");
    console.log(ajax);
    $('.wikimate').css('border-left', '2px solid red');
  };

  function parseCardDescription(description) {
    return step('Parsing description', function() {
      return mingle_wiki_parser.parse(description);
    });
  };

  function loadCard(project, number) {
    updatingCardDescription();
    step('Loading ' + project + ' card #' + number + ' description', function() {
      requestCard(project + '/cards/' + number, function(xmlDoc) {
        editingCard = $(xmlDoc);
        var story = parseCardDescription(editingCard.find('card description').text());
        $('#content').empty().wikimate({story: story, change: updateCardDescription});
        updatedCardDescription();
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
  }
})(jQuery);
