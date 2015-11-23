var request = require('request');
var helpers = require('./helpers');
const MIN_BACKLINK_THRESHOLD = 100;


  var getNextArticleCount = function (blcontinue) {
    var aggregated = arguments[0] === undefined ? true : arguments[0];
    var limit = arguments[1] === undefined ? 100 : arguments[1];


    var continue_url = "https://en.wikipedia.org/w/api.php?action=query&list=backlinks&format=json&blcontinue=" + encodeURIComponent() + "&bllimit=500&rawcontinue=&blpageid=" + encodeURIComponent(pageid);
    request(continue_url, function(err, resp, body) {
      var blcount = body.query.backlinks.length;
      var blcontinue = body['query-continue'];
      console.log("ARTICLE COUNT: ", blcount);
      return blcount, blcontinue
    });
  }

  var isGeneralEnough = function (pageid) {
    var backlink_url = "https://en.wikipedia.org/w/api.php?action=query&list=backlinks&format=json&bllimit=500&rawcontinue=&blpageid=" + encodeURIComponent(pageid);
    request(backlink_url, function(err, resp, body) {
      body = JSON.parse(body);
      var blcount = body.query.backlinks.length;
      var blcontinue = body['query-continue']['backlinks']['blcontinue'];

      if (!!blcontinue) {
        var plus;
        do {
          console.log("Calling getNextArticleCount");
          plus, blcontinue = getNextArticleCount(blcontinue);
          blcount += plus;
        }
        while (!!blcontinue);
      }

      return blcount > MIN_BACKLINK_THRESHOLD
    });
  }

  var requestPromise = function(url) {
    return new Promise(function (resolve, reject) {
        request(url, function(err, resp, body) {

        }).then(function (res) {
          return resolve(JSON.parse(res));
        });
    });
  }

  var fetchNewArticle = function() {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
        request.then(function (res) {
          var resolution = {};
          resolution.results = parseResults(res);
          if (res['query-continue']) {
            var type = Object.keys(res['query-continue'])[0];
            var continueKey = Object.keys(res['query-continue'][type])[0];
            params[continueKey] = res['query-continue'][type][continueKey];
            resolution.next = function () {
              return _this2.pagination(params, parseResults);
            };
          }
          resolve(resolution);
        })['catch'](reject);
      });




    var random_url = "https://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=1"
    request(random_url, function(err, resp, body) {
      body = JSON.parse(body);

      if (isGeneralEnough(body.query.random[0]['id'])) {
        return body.query.random[0];
      } else {
        return false
      }
    });
  }


module.exports = {
  getNextArticleCount: getNextArticleCount,
  isGeneralEnough: isGeneralEnough,
  fetchNewArticle: fetchNewArticle,
}
