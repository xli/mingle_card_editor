
(function() {
  var version = '1.7';
  function addScript(src) {
    var script = document.createElement('SCRIPT');
    script.type = 'text/javascript';
    script.src = chrome.extension.getURL(src);
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  function addStylesheet(href) {
    var script = document.createElement('link');
    script.type = 'text/css';
    script.rel = 'stylesheet';
    script.media = 'screen';
    script.href = chrome.extension.getURL(href);
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  var match = window.location.href.match(/\/projects\/([\da-z_]+)\/cards\/(\d+)[^\/]*$/);
  if (match) {
    addScript('/card_editor-' + version + '.js');
    addStylesheet('/css/wikimate-' + version + '.css');
    addStylesheet('/css/style-' + version + '.css');
    addStylesheet('/css/jquery-ui-1.8.20.custom.css');
  }
})();
