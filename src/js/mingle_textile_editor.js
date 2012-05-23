(function($) {
  $.plugin('mingle_textile_editor', (function() {
    function createShowMacroEditorBehavior(project, editingCardId) {
      return function(macro_type) {
        var paramStr = $.param({
          content_provider: {id: editingCardId, type: 'card'},
          macro_type: macro_type
        });
        $.ajax({
          url: AlsoViewing.CONTEXT_PATH + '/projects/' + project + "/macro_editor/show?" + paramStr,
          dataType: 'script',
          method: 'get'
        });
      }
    }

    return {
      init: function(options) {
        var id = wikimate.utils.generateId();
        var textile_bar = '#textile-toolbar-' + id;
        this.wikimate_text_editor({
          close: function(e) {
            $(textile_bar).remove();
          }
        }).find('.plain-text-editor').prop('id', id);

        var showMacroEditorBehavior = createShowMacroEditorBehavior(options.project, options.editingCardId);
        TextileEditor.buttons = TextileEditor.attachDefaultMingleButtons();
        TextileEditor.initialize(id, 'extended', '');
        TextileEditor.buttons.each(function(button) {
          if(Object.isFunction(button.afterTextileEditorInit)) {
            button.afterTextileEditorInit(id, showMacroEditorBehavior);
          }
        });
        return this;
      }
    };
  })());
})(jQuery);
