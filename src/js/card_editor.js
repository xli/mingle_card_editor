jQuery.noConflict();
(function($) {
  $.plugin('card_editor', (function() {
    var baseUrl = "/api/v2/projects/";
    var cardElement;
    function card_uri() {
      return baseUrl + window.mingleProject + "/cards/" + window.number + '.xml';
    }
    function ajaxErrorHandler(x) {
      console.log(x);
      cardElement.card_editor('status', 'error');
    }

    return {
      init: function(card) {
        window.mingleProject = card.project;
        window.number = card.number;
        cardElement = this;
        this.card_editor('status', 'loading');
        var $this = this.addClass('card_editor');
        $.ajax({
          url: card_uri(),
          dataType: 'xml',
          success: function(xmlDoc) {
            $this.card_editor('initWikiMate', xmlDoc);
            $this.card_editor('status', 'idle');
          },
          failure: ajaxErrorHandler
        });
        return this;
      },

      initWikiMate: function(cardDoc) {
        var editingCard = $(cardDoc);
        window.editingCardId = editingCard.find('card id').text();
        var story = window.wiki_parser.parse(editingCard.find('card description').text());
        var $this = this;
        this.empty().wikimate({story: story, change: function(event, action) {
          $this.card_editor('update', event, action);
        }});
      },

      update: function(event, action) {
        this.card_editor('status', 'updating');
        var desc = wiki_parser.dump(this.wikimate('story'));

        var $this = this;
        $.ajax({
          url: card_uri(),
          dataType: 'xml',
          data: {card: {description: desc}},
          type: 'PUT',
          success: function(r) {
            $this.card_editor('status', 'idle');
          },
          failure: ajaxErrorHandler
        });
        return this;
      },

      renderWiki: function(content, onSuccess) {
        var paramStr = $.param({
          content_provider: {id: window.editingCardId, type: 'card'},
          content: content
        });
        $.ajax({
          url: baseUrl + window.mingleProject + "/render?" + paramStr,
          dataType: 'html',
          success: onSuccess,
          failure: ajaxErrorHandler
        });
      },

      status: function(newStatus) {
        switch(newStatus) {
          case 'loading':
          case 'updating':
            this.css('border-left', '2px solid yellow');
            break;
          case 'error':
            this.css('border-left', '2px solid red');
            break;
          default:
            this.css('border-left', '2px solid orange');
        }
      }
    };
  })());

  var match = window.location.href.match(/\/projects\/([\da-z_]+)\/cards\/(\d+)[^\/]*$/);
  if (match) {
    $('#content').card_editor({project: match[1], number: match[2]});
  } else {
    if (console) {
      console.log("Not on Mingle Card show page: ");
      console.log(window.location.href);
    }
  }
})(jQuery);
