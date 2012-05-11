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
  }

  function gsub(st, pattern, replacement) {
    var result = '', source = st, match;

    while (source.length > 0) {
      match = source.match(pattern);
      if (match) {
        result += source.slice(0, match.index);
        result += replacement(match);
        source  = source.slice(match.index + match[0].length);
      } else {
        result += source;
        source = '';
      }
    }
    return result;
  }


  var index = 0;
  function nextId() {
    index++;
    return 'story_item_' + index;
  }

  var parser = {
    rules: $([
      macro,
      body_macro
    ]),
    dump: function(story) {
      return _.map(_.select(story, function(item) {
        var type = item.type;
        return type != 'todo' && type != 'one_column_layout';
      }), function(item) {
        if (item.type == 'rdoc') {
          return "<div story_item_type='rdoc'>" + item.text + "</div>";
        }
        return item.text.trim();
      }).join("\n\n");
    },
    parse: function(content) {
      index = 0;
      this.rules.each(function(i, rule) {
        content = gsub(content, rule.pattern, rule.substitution);
      });
      var result = [];
      _.each(splitByHtmlElement(content), function(element) {
        if (element.data) {
          _.each(element.data.split(/\n\n/), function(text) {
            var type = text.trim().match(/^\![^\!]+\!$/) != null ? "image" : "paragraph";
            result.push({id: nextId(), type: type, text: text});
          });
        } else {
          if (element.tagName.match(/macro/i)) {
            result.push({id: nextId(), type: element.tagName.toLowerCase(), text: $(element).text()});
          } else {
            var type = $(element).attr('story_item_type');
            if (type) {
              result.push({id: nextId(), type: type, text: $(element).html()});
            } else {
              result.push({id: nextId(), type: 'html', text: element.outerHTML});
            }
          }
        }
      });
      return _.filter(result, function(it) {
        return it.text.match(/\S/);
      });
    }
  };
  window.wiki_parser = parser;
  return parser;
})(jQuery);