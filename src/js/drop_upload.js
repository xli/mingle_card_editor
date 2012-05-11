(function($) {
  $.plugin('drop_upload', (function() {
    return {
      // options:
      //   field_name: String, post file as form field name
      //   post_url: String, post target url
      //   start: function, after dropped, before uploading
      //   complete: function, callback after uploaded
      init: function(options) {
        // .bind('drop', drop).bind('dragenter', dragEnter).bind('dragover', dragOver).bind('dragleave', dragLeave)
        var $this = this;
        return this.on("drop", function(e) {
          e.preventDefault();
          options.start.apply($this, []);
          var file = e.originalEvent.dataTransfer.files[0];
          // Uploading - for Firefox, Google Chrome and Safari
          var xhr = new XMLHttpRequest();
          xhr.open("post", options.post_url, true);
          xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
          // File uploaded
          xhr.addEventListener("load", function (e) {
            // Calling complete function
            options.complete.apply($this, [e, file]);
          }, false);

          var fd = new FormData();
          fd.append(options.field_name, file);
          xhr.send(fd);

        }).on('dragenter', function(e) {
          // console.log('dragenter');
        }).on('dragover', function(e) {
          // console.log('dragover');
        }).on('dragleave', function(e) {
          // console.log('dragleave');
        });
      }
    }
  })());
})(jQuery);