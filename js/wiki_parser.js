(function($) {
  var macro = {
    pattern: / *\{%\s*(\S*):?([^%]*)%\}(.*?)\{%\s*\1\s*%\}/m,
    substitution: function(match) {
      return '<macro>' + match[0] + '</macro>';
    }
  };
  var body_macro = {
    pattern: /\{\{\s*([^}\s]*):?([^}]*)\}\}/m,
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
        if (element.outerHTML) {
          return element.innerHTML;
        } else {
          return element.data.split(/\n\n/);
        }
      })), function(it) {
        return it.match(/\S/);
      });
    }
  }
  window.wiki_parser = parser;
  return parser;
})(jQuery)