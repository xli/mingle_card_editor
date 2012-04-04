(function($) {
  window.baseUrl = "http://localhost:3000/api/v2/projects/";

  var mingle_wiki_parser = {
    parse: function(desc) {
      var story = [];
      $($("<div></div>").html(desc)[0].childNodes).each(function(i, element) {
        if (element.outerHTML) {
          story.push({id: 'story_item_' + i, type: 'paragraph', text: element.outerHTML});
        } else {
          story.push({id: 'story_item_' + i, type: 'paragraph', text: element.data});
        }
      });
      return story;
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
