(function($) {
  $.plugin('mingle_textile_editor', (function() {
    return {
      init: function(options) {
        var id = wikimate.utils.generateId();
        var textile_bar = '#textile-toolbar-' + id;
        this.wikimate_text_editor({
          close: function(e) {
            $(textile_bar).remove();
          }
        }).find('.plain-text-editor').prop('id', id);

        TextileEditor.buttons = TextileEditor.attachDefaultMingleButtons().reject(function(button) {
          return Object.isFunction(button.afterTextileEditorInit);
        });
        TextileEditor.initialize(id, 'extended', '');
        return this;
      }
    };
  })());
})(jQuery);
