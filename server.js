#!/usr/bin/env node
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var helpers2 = require('./helpers2.js')
var request = require('request');
const MIN_BACKLINK_THRESHOLD = 300;

var config = {
  port: 22986
};



///views

app.set('views', __dirname);
app.set('view engine', 'ejs');

//static content
app.use('/assets', express.static(__dirname + '/src/assets'));

// parse application/json
app.use(bodyParser.json())

///routes
app.get('/', function (req, res) {
  res.render('layout');
});

app.post('/id', function (req, res) {
  var title = req.body.title;
  var response = {title : title};
  //url to get the topic's id
  var id_url = "https://en.wikipedia.org/w/api.php?action=query&format=json&titles=" + encodeURIComponent(title);
  // request module is used to process the yql url and return the results in JSON format
  request(id_url, function(err, resp, body) {
    body = JSON.parse(body);
    // logic used to compare search results with the input from user
    response['id'] = Object.keys(body.query.pages)[0];
    res.json(response);
  });
});


app.get('/random', function (req, res) {
  var response = {}

  //Get the inital two articles
  var random_url = "https://en.wikipedia.org/w/api.php?action=query&list=random&format=json&rnnamespace=0&rnlimit=1"
  request(random_url, function(err, resp, body) {
    body = JSON.parse(body);
    response['start_article'] = body.query.random[0];
    var links_url = "https://en.wikipedia.org/w/api.php?action=parse&format=json&pageid="+ encodeURIComponent(body.query.random[0].id) + "&prop=links";
    request(links_url, function(err, resp, body) {
      body = JSON.parse(body);
      var links = [];
      body.parse.links.forEach( function(link) {
        if (link.ns === 0) {
          links.push(link["*"]);
        }
      });
      response['links'] = links;
      helpers2.getRandomWikiTopic().then( function (parsedBody) {
        //console.log("Got new random article id: ", parsedBody.query.random[0]['id']);
        var id = parsedBody.query.random[0]['id'];
        response['end_article'] = parsedBody.query.random[0];
        helpers2.getBLCount(id).then( function (parsedBody) {
          var blcount = parsedBody['query']['backlinks'].length;
          response['backlinks'] = blcount;
          response['success'] = (blcount >  MIN_BACKLINK_THRESHOLD);
          var end_id = response['end_article']['id'];
          links_url = "https://en.wikipedia.org/w/api.php?action=parse&format=json&pageid="+ encodeURIComponent(end_id) + "&prop=links";
          request(links_url, function(err, resp, body) {
            body = JSON.parse(body);
            var end_id = response['end_article'].id;
            summary_url = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&explaintext=&pageids=" + encodeURIComponent(end_id);
            request(summary_url, function(err, resp, body) {
              body = JSON.parse(body);
              response['summary'] = body.query.pages[end_id]['extract'];
              res.json(response);
            });
          });
        });
      });
    });
  });
});


app.post('/links', function (req, res) {
  var title = req.body.title;
  var response = {title : title};

  //url to get the topic's id
  var id_url = "https://en.wikipedia.org/w/api.php?action=query&format=json&titles=" + encodeURIComponent(title);
  // request module is used to process the yql url and return the results in JSON format
  request(id_url, function(err, resp, body) {
    body = JSON.parse(body);
    // logic used to compare search results with the input from user
    var article_id  = Object.keys(body.query.pages)[0];
    var links_url = "https://en.wikipedia.org/w/api.php?action=parse&format=json&pageid="+ encodeURIComponent(article_id) + "&prop=links";
    request(links_url, function(err, resp, body) {
      body = JSON.parse(body);
      var links = [];

      if (!!body.parse.links) {
        body.parse.links.forEach( function(link) {
          if (link.ns === 0) {
            links.push(link["*"]);
          }
        });
        //send away the article and it's links
        response['links'] = links;
        res.json(response);
      } else {
        console.log("No links for Article, Send the Bad News: ", body.parse.links);
        res.status(500).send('No articles for that link bro!');
        return
      }

   });

 });
});




// start the server
app.listen(config.port, function (err) {
  console.log("Server started; listening on port " + config.port);
});
