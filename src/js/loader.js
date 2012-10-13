
(function() {
  var host = "http://localhost:7777/";
  var version = '2.0';
  function addScript(src) {
    var script = document.createElement('SCRIPT');
    script.type = 'text/javascript';
    script.src = host + src;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  function addStylesheet(href) {
    var script = document.createElement('link');
    script.type = 'text/css';
    script.rel = 'stylesheet';
    script.media = 'screen';
    script.href = host + href;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  addScript('card_editor/card_editor-' + version + '.min.js');
  addStylesheet('card_editor/css/wikimate-' + version + '.css');
  addStylesheet('card_editor/css/style-' + version + '.css');
})();
