#!/usr/bin/env node
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var Wiki = require('wikijs');

var config = {
  port: 4242
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


//Give a random article name & content
app.get('/random', function (req, res) {
  var article = {};
  var wiki = new Wiki();
  //Fetch a random article name
  wiki.random().then(function(random) {
    var title = random[0];
    article['title'] = title;
    //Get the random article page content
    wiki.page(title).then(function(page) {
      page.content().then(function(content) {
        article['content'] = content;
        //get links
        wiki.page(title).then(function(page) {
          page.links().then(function(links) {
            article['links'] = links;
            //Fetch a second random article name
            wiki.random().then(function(random) {
              var title2 = random[0];
              article['title2'] = title2;
              res.json(article);
            });
          });
        });
      });
    });
  });
});

app.post('/article', function (req, res) {
  var title = req.body.title;
  var article = {title : title};
  var wiki = new Wiki();
  wiki.page(title).then(function(page) {
    page.content().then(function(content) {
      article['content'] = content;
      //get links
      wiki.page(title).then(function(page) {
        page.links().then(function(links) {
          article['links'] = links;
          res.json(article);
        });
      });
    });
  });
});



// start the server
app.listen(config.port, function (err) {
  console.log("Server started; listening on port " + config.port);
});