jQuery.noConflict();
(function($) {
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
    }
  };

  $.plugin('mingle_card_editor', (function() {
    var baseUrl = "/api/v2/projects/";
    var editingCard;
    var project;
    var number;
    function card_uri() {
      return baseUrl + project + "/cards/" + number;
    }
    function ajaxErrorHandler(x) {
      console.log(x);
      $this.mingle_card_editor('status', 'error');
    }

    var userIconCache = {};

    function ajaxUpdateUserIcon(url, elements) {
      $.ajax({
        url: url,
        dataType: 'xml',
        success: function(xmlDoc) {
          var icon_path = $(xmlDoc).find('icon_path').text();
          if (icon_path) {
            userIconCache[url] = icon_path;
            updateUserIcon(url, elements);
          }
        },
        failure: ajaxErrorHandler
      });
    }

    function updateUserIcon(url, elements) {
      if (userIconCache[url]) {
        elements.css('background-image', 'url(' + userIconCache[url] + ')');
      } else {
        ajaxUpdateUserIcon(url, elements);
      }
    }

    function currentUser() {
      var currentUserId = $('#current-user a').attr('href').split('/')[3];
      return "/api/v2/users/" + currentUserId + ".xml";
    }

    var actionImage = (function() {
      var actionImages = {
        "add": '/images/icon-source-add.png',
        "edit": '/images/icon-edit-pencil.gif',
        "remove": '/images/icon-source-delete.png',
        "move": '/images/icon-source-modify.png'
      };

      return function (actionElement) {
        return $('<img/>').attr('src', actionImages[actionElement.data('data').type]);
      };
    })();

    var user;

    return {
      init: function(card) {
        project = card.project;
        number = card.number;
        this.mingle_card_editor('status', 'loading');
        var $this = this.addClass('mingle_card_editor');
        $.ajax({
          url: card_uri() + '.xml',
          dataType: 'xml',
          success: function(xmlDoc) {
            $this.mingle_card_editor('initWikiMate', xmlDoc);
            $this.mingle_card_editor('status', 'idle');
          },
          failure: ajaxErrorHandler
        });
        return this;
      },

      initWikiMate: function(cardDoc) {
        editingCard = $(cardDoc);
        user = editingCard.find('card modified_by').attr('url');
        var story = mingle_wiki_parser.parse(editingCard.find('card description').text());
        var journal = _.map(story, function(item) { return {id: item.id, type: 'add', item: item}; });
        var $this = this;
        this.empty().wikimate({story: story, change: function(event, action) {
          $this.mingle_card_editor('update', event, action);
        }}).wikimate('journal', journal, function(actionElement) {
          updateUserIcon(user, actionElement);
          actionElement.html(actionImage(actionElement));
        });
        user = currentUser();
      },

      update: function(event, action) {
        this.mingle_card_editor('status', 'updating');
        var desc = $.map(this.wikimate('story'), function(item){
          return item.text.trim();
        }).join("\n\n");

        var $this = this;
        $.ajax({
          url: card_uri() + ".xml",
          dataType: 'xml',
          data: {card: {description: desc}},
          type: 'PUT',
          success: function(r) {
            $this.mingle_card_editor('status', 'idle');
          },
          failure: ajaxErrorHandler
        });
        return this;
      },

      renderWiki: function(content, onSuccess) {
        var card_id = editingCard.find('card id').text();
        var paramStr = $.param({
          content_provider: {id: card_id, type: 'card'},
          content: content
        });
        $.ajax({
          url: baseUrl + project + "/render?" + paramStr,
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
    $('#content').mingle_card_editor({project: match[1], number: match[2]});
  } else {
    if (console) {
      console.log("Not on Mingle Card show page: ");
      console.log(window.location.href);
    }
  }
})(jQuery);
