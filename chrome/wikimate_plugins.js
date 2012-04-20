(function($) {
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
        window.mingle_wikimate.renderWiki(item.text, function(html) {
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
          $this.story_item('edit')
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
})(jQuery);

