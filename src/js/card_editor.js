jQuery.noConflict();
(function($) {
  window.contextPath = '';
  $.plugin('card_editor', (function() {
    var cardElement;
    function baseUrl() {
      var path = "/api/v2/projects/"
      return window.contextPath + path;
    }
    function card_uri() {
      return baseUrl() + window.mingleProject + "/cards/" + window.number + '.xml';
    }
    function card_attachments_url() {
      return baseUrl() + window.mingleProject + "/cards/" + window.number + "/attachments.xml";
    }
    function ajaxErrorHandler(x) {
      console.log(x);
      cardElement.card_editor('status', 'error');
    }
    var upload_dropfile = function(wikimateElement) {
      var dialog, progressbar;
      return {
        post_url: card_attachments_url(),
        field_name: 'file',
        start: function(xhr, file) {
          progressbar = $('<div/>').progressbar({ value: 0 });
          dialog = $('<div/>').append(progressbar).dialog({
            title: "Uploading",
            modal: true
          });
          xhr.upload.addEventListener("progress", function (e) {
            if (e.lengthComputable) {
              var loaded = Math.ceil((e.loaded / e.total) * 100);
              progressbar.progressbar("value", loaded);
            }
          }, false);
        },
        complete: function(result, file) {
          if (dialog) {
            dialog.dialog('close');
            dialog.remove();
            dialog = null;
            // Mingle sanitize_filename logic, from file_column plugin
            // filename = File.basename(filename.gsub("\\", "/")) # work-around for IE
            // filename.gsub!(/[^\w0-9\.\-_]/,"_")
            // filename = "_#{filename}" if filename =~ /^\.+$/
            // filename = "unnamed" if filename.size == 0
            var file_name = file.name
            file_name = file_name.gsub(/[^\w0-9\.\-_]/,"_")
            if (/^\.+$/.test(file_name)) {
              file_name = "_" + file_name;
            }
            if (file_name.length == 0) {
              file_name = "unnamed"
            }
            var item = (/image/i).test(file.type) ? {type: 'image', text: "!" + file_name + "!"} : {type: 'paragraph', text: "[[" + file_name + "]]"};
            wikimateElement.wikimate("newItem", item).story_item('save');
          }
        }
      };
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
        }}).dropfile(upload_dropfile(this));
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
          url: baseUrl() + window.mingleProject + "/render?" + paramStr,
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
  if (match && $('#card-edit-link-top').length > 0) {
    path = window.location.href.split("/");
    if (path[3] != 'projects') {
      window.contextPath = '/' + path[3];
    }
    $('#content').card_editor({project: match[1], number: match[2]});
  }
})(jQuery);
