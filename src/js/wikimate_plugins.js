(function($) {
  var clickableElement = function(ele) {
    return _.any(['a', 'input', 'textarea', 'button', 'object'], function(tn) {
      return jQuery.nodeName(ele, tn);
    });
  };
  var render_from_server_paragraph = (function() {
    return {
      // status: ['rendered', 'rendering', 'editing']
      //   rendering => rendered
      //   rendered => editing
      //   editing => rendering
      emit: function(div, item) {
        if (item.text === "") {
          div.data('status', 'rendered');
          return div.empty();
        } else {
          div.data('status', 'rendering');
          this.parents('.card_editor').card_editor('renderWiki', item.text, function(html) {
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
        div.bind('dblclick', function(e) {
          if (clickableElement(e.target) || !$this.story_item('editable')) {
            return;
          }
          if (div.data('status') == 'rendering') {
            alert("Please wait for server rendering " + item.text + "");
          } else {
            div.data('status', 'editing');
            $this.story_item('edit');
          }
        });
      },
      edit: function(item) {
        return this.mingle_textile_editor({project: window.mingleProject, editingCardId: window.editingCardId});
      }
    };
  })();

  var wiki_image = _.defaults({
    bind: function(div, item) {
      var $this = this;
      this.click(function(e) {
        if ($this.story_item('editable')) {
          $this.story_item('edit');
        }
      });
    },
    edit: function(item) {
      var itemElement = this;
      var title = this.story_item('newItem') ? "Add" : "Edit";
      $('<fieldset/>').css('text-align', 'left')
        .append($('<label for="image_url">Image URL: </label>'))
        .append($('<input class="image_url_input" type="text" readonly/>').css('width', '99%').val(this.find('img').prop('src')))
        .dialog({
          title: title,
          modal: true,
          width: "66%",
          buttons: {
            Close: function() {
              $(this).dialog('close');
            }
          }
        });
    }
  }, render_from_server_paragraph)

  if (window.wikimate && window.wikimate.plugins) {
    $.extend(window.wikimate.plugins, {
      paragraph: $.extend({'title': 'Wiki Markup'}, render_from_server_paragraph),
      macro: $.extend({}, render_from_server_paragraph),
      body_macro: $.extend({}, render_from_server_paragraph),
      html: $.extend({}, render_from_server_paragraph),
      one_column_layout: {},
      todo: {},
      image: wiki_image
    });
    // window.wikimate.default_story_item_type = 'rdoc';
    window.wikimate.plugins.rdoc.editor_options = {
      plugins: "advlink,advlist,autoresize,autolink,save,fullscreen,lists",
      theme_advanced_buttons1: "save,cancel,|,formatselect,bold,italic,underline,strikethrough,|,bullist,numlist,|,outdent,indent,|,undo,redo,|,unlink,removeformat,|,justifyleft,justifycenter,justifyright",
      theme_advanced_buttons2: ""
    };
  } else {
    console.log("No window.wikimate or window.wikimate.plugins found");
  }
})(jQuery);

