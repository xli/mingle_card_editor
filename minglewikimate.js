(function($) {
  window.baseUrl = "http://localhost:3000/api/v2/projects/";

  var mingle_wiki_parser = {
    parse: function(desc) {
      var story = [];
      function nextId() {
        return 'story_item_' + story.length;
      }
      var splitByMacro = this.splitByMacro;
      this.splitByHtmlElement(desc, function(element) {
        if (element.outerHTML) {
          story.push({id: nextId(), type: 'paragraph', text: element.outerHTML});
        } else {
          splitByMacro(element.data, function(text) {
            story.push({id: nextId(), type: 'paragraph', text: text});
          });
        }
      });
      return story;
    },
    splitByMacro: function(text, callback) {
      var group = [];
      while(text.length > 0) {
        var i = text.search("{");
        if (i >=0 && i < (text.length - 1)) {
          switch(text[i + 1]) {
            case '{':
              var rest = text.substring(i);
              var endAt = rest.search("}}");
              if (endAt < 0) {
                group.push(text.substring(0, i+2));
                text = text.substring(i+2);
                continue;
              }
              if(i > 0) {
                group.push(text.substring(0, i));
              }
              callback(group.join(''));
              group = [];
              callback(rest.substring(0, endAt + 2));
              text = rest.substring(endAt + 2);
              break;
            case '%':
              var rest = text.substring(i);
              var headEnd = rest.search("%}");
              if (headEnd < 0) {
                group.push(text.substring(0, i+2));
                text = text.substring(i+2);
                continue;
              }
              var head = rest.substring(2, headEnd).replace(/\s+/, '\\s+');
              rest = rest.substring(headEnd + 2);
              var endAt = rest.search(new RegExp("{%\s*" + head + "\s*%}", 'im'));
              if (endAt < 0) {
                group.push(text.substring(0, i + 2));
                text = text.substring(i + 2);
                continue;
              }
              if(i > 0) {
                group.push(text.substring(0, i));
              }
              callback(group.join(''));
              group = [];
              var x = rest.substring(0, endAt);
              rest = rest.substring(endAt);
              var ee = rest.search(/%\}/) + 2;
              x += rest.substring(0, ee);
              callback(x);

              text = rest.substring(ee);
              break;
          }
        } else {
          group.push(text);
          text = '';
        }
      }
      if (group.length > 0) {
        callback(group.join(''));
      }
    },
    splitByHtmlElement: function(desc, callback) {
      $($("<div></div>").html(desc)[0].childNodes).each(function(i, element) {
        callback(element);
      });
    }
  }

  function executeMQL(mql, onSuccess) {
    jQuery.ajax({
      url: window.baseUrl + "/cards/execute_mql.json?mql=" + mql,
      dataType: 'json',
      success: onSuccess
    });
  };

  function requestCard(uri, onSuccess) {
    jQuery.ajax({
      url: window.baseUrl + uri + '.xml',
      dataType: 'xml',
      beforeSend : function(req) {
        req.setRequestHeader("Authorization", "Basic bWluZ2xlX2J1aWxkZXIyOmNGalc4RnI5ZA==");
      },
      success: onSuccess,
      failure: function(x) {
        console.log('failed: ' + x);
      }
    });
  };

  function renderWikiMate(story) {
    $('#wiki').empty().wikimate({story: story, change: updateCardDescription});
  };

  function updateCardDescription(event, action) {
    console.log("update: ");
    console.log(action);
  };

  function parseCardDescription(description) {
    return step('Parsing description', function() {
      return mingle_wiki_parser.parse(description);
    });
  };

  function loadCard(project, number) {
    step('Loading ' + project + ' card #' + number + ' description', function() {
      requestCard(project + '/cards/' + number, function(xmlDoc) {
        renderWikiMate(parseCardDescription($(xmlDoc).find('card description').text()));
      });
    });
  };

  function project() {
    return $('#project').val();
  };
  function number() {
    return $('#card_number').val();
  };

  function step(msg, func) {
    $('#wiki').append(msg + "<br/>");
    return func.call();
  };

  $(document).ready(function() {
    loadCard(project(), number());
  });
})(jQuery)


// var story = eval($('.store textarea').val());
// $('.wikimate').wikimate({story: story, change: function(event, action) {
//   var data = eval($('.store textarea').val());
//   if (action.type == 'add') {
//     data.push(action.item);
//   } else if (action.type == 'edit') {
//     $.each(data, function(i, item) {
//       if (item.id == action.id) {
//         item.text = action.item.text;
//       }
//     });
//   } else if (action.type == 'remove') {
//     $.each(data, function(i, item) {
//       if (item.id == action.id) {
//         data.splice(i, 1);
//       }
//     });
//   } else {
//     alert("Unknown action type: " + action.type);
//   }
//   $('.store textarea').text(JSON.stringify(data));
// }});
