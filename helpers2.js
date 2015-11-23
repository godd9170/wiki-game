var rp = require('request-promise');
const MIN_BACKLINK_THRESHOLD = 100;


var getBLCount = function (id) {
  console.log("is General enough called with: ", id);
  var continue_url = "https://en.wikipedia.org/w/api.php?action=query&list=backlinks&format=json&bllimit=500&rawcontinue=&blpageid=" + encodeURIComponent(id);
  var backlinks_options = {
      method: 'POST',
      uri: continue_url,
      json: true // Automatically stringifies the body to JSON 
  };
  
  return rp(backlinks_options)
    .catch(function(err) {
      console.error("Failed to get the backlink count");
    });
}

var getRandomWikiTopic = function() {
  var random_url = "https://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=1"

  var random_options = {
      method: 'POST',
      uri: random_url,
      json: true // Automatically stringifies the body to JSON 
  };

  console.log("Getting a new random article.");
  return rp(random_options)
      .catch(function (err) {
          console.error("Failed to get a random article");
      });

}


module.exports = {
  getRandomWikiTopic: getRandomWikiTopic,
  getBLCount : getBLCount
}