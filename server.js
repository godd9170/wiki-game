#!/usr/bin/env node
var path = require('path');
var express = require('express');
var app = express();
var Wiki = require('wikijs');

var config = {
  port: 8000
};

///views

app.set('views', __dirname);
app.set('view engine', 'ejs');

///routes
app.get('/', function (req, res) {
  res.render('layout');
});


//Give a random article name & html content
app.get('/article', function (req, res) {
  var article = {};
  var wiki = new Wiki();
  //Fetch a random article name
  wiki.random().then(function(random) {
    var title = random[0];
    article['title'] = title;
    //Get the random article page
    wiki.page(title).then(function(page) {
        page.html().then(function(html) {
            article['html'] = html;
            res.json(article);
        });
    });
  });
});

// start the server
app.listen(config.port, function (err) {
  console.log("Server started; listening on port " + config.port);
});