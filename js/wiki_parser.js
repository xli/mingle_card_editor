(function($) {
  var inline_macros = ['value', 'project', 'project-variable'];
  var macro = {
    pattern: /[ ]*\{\{\s*([^}\s:]*):?([^}]*)\}\}[ ]*/m,
    substitution: function(match) {
      if(inline_macros.indexOf(match[1]) >= 0) {
        return match[0];
      } else {
        return '<macro>' + match[0] + '</macro>';
      }
    }
  };

  var body_macro = {
    pattern: /[ ]*\{%\s*(\S*):?([^%]*)%\}([^\{]|\{(?!\{%\s*\1\s*%\}))*\{%\s*\1\s*%\}[ ]*/m,
    substitution: function(match) {
      return '<body_macro>' + match[0] + '</body_macro>';
    }
  };

  function splitByHtmlElement(desc, callback) {
    return $($("<div></div>").html(desc)[0].childNodes);
  };

  function gsub(st, pattern, replacement) {
    var result = '', source = st, match;

    while (source.length > 0) {
      if (match = source.match(pattern)) {
        result += source.slice(0, match.index);
        result += replacement(match);
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source, source = '';
      }
    }
    return result;
  };

  var parser = {
    rules: $([
      macro,
      body_macro
    ]),
    parse: function(content) {
      this.rules.each(function(i, rule) {
        content = gsub(content, rule.pattern, rule.substitution);
      });
      return _.filter(_.flatten(_.map(splitByHtmlElement(content), function(element) {
        if (element.data) {
          return element.data.split(/\n\n/);
        } else {
          if (element.tagName.match(/macro/i)) {
            return {type: element.tagName.toLowerCase(), text: element.innerHTML};
          } else {
            return {type: 'html', text: element.outerHTML};
          }
        }
      })), function(it) {
        return typeof(it) == 'string' ? it.match(/\S/) : true;
      });
    }
  }
  window.wiki_parser = parser;
  return parser;
})(jQuery)