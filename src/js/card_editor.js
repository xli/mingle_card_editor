jQuery.noConflict();
(function($) {
  $.plugin('card_editor', (function() {
    var baseUrl = "/api/v2/projects/";
    var editingCard;
    var editingCardId;
    var project;
    var number;
    function card_uri() {
      return baseUrl + project + "/cards/" + number;
    }
    function ajaxErrorHandler(x) {
      console.log(x);
      $this.card_editor('status', 'error');
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
        this.card_editor('status', 'loading');
        var $this = this.addClass('card_editor');
        $.ajax({
          url: card_uri() + '.xml',
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
        editingCard = $(cardDoc);
        editingCardId = editingCard.find('card id').text();
        user = editingCard.find('card modified_by').attr('url');
        var story = window.wiki_parser.parse(editingCard.find('card description').text());
        var $this = this;
        this.empty().wikimate({story: story, change: function(event, action) {
          $this.card_editor('update', event, action);
        }});
        user = currentUser();
        $.ajax({
          url: '/projects/' + project + '/cards/history?id=' + editingCardId,
          dataType: 'html',
          success: function(xmlDoc) {
            var changes = $(xmlDoc).find('.card-event').filter(function(_, card_event) {
              return $(card_event).find('.change').text().trim().match(/Description changed/);
            });
            var journal = _.map(story, function(item) { return {id: item.id, type: 'add', item: item}; });
            var userIcons = changes.map(function(i, change) {
              return $(change).find('.user-icon img');
            }).toArray();

            $this.wikimate('journal', journal, function(actionElement) {
              var img = userIcons.pop();
              if (img) {
                actionElement.css('background-image', 'url(' + $(img).prop('src') + ')');
              } else {
                updateUserIcon(user, actionElement);
              }
              actionElement.html(actionImage(actionElement));
            });
            userIcons = [];
          },
          failure: ajaxErrorHandler
        });
      },

      update: function(event, action) {
        this.card_editor('status', 'updating');
        var desc = wiki_parser.dump(this.wikimate('story'));

        var $this = this;
        $.ajax({
          url: card_uri() + ".xml",
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
          content_provider: {id: editingCardId, type: 'card'},
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
    $('#content').card_editor({project: match[1], number: match[2]});
  } else {
    if (console) {
      console.log("Not on Mingle Card show page: ");
      console.log(window.location.href);
    }
  }
})(jQuery);
