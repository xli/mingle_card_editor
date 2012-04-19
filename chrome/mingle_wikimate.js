(function($) {
  window.baseUrl = "/api/v2/projects/";
  var editingCard = null;
  var clickableElement = function(ele) {
    return _.any(['a', 'input', 'textarea', 'button', 'object'], function(tn) {
      return jQuery.nodeName(ele, tn);
    });
  };
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
            div.find('img').remove();
            div.append(html);
          }
        });
        return div.html('<img src="/images/spinner.gif" title="loading..."/>');
      }
    },
    bind: function(div, item) {
      var $this = this;
      div.bind('click', function(e) {
        if (clickableElement(e.target) || !$this.story_item('editable')) {
          return;
        }
        if (div.data('status') == 'rendering') {
          alert("Please wait for server rendering " + item.text + "");
        } else {
          div.data('status', 'editing');
          div.trigger(wikimate.events.EDIT);
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
      content_provider: {
        id: card_id,
        type: 'card'
      },
      content: content
    });
    jQuery.ajax({
      url: window.baseUrl + project() + "/render?" + paramStr,
      dataType: 'html',
      success: onSuccess,
      failure: ajaxCallFailed
    });
  };

  function requestCard(uri, onSuccess) {
    jQuery.ajax({
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
