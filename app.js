var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var port = process.env.PORT || 8080;
var path = require('path');
var mongoose = require ('mongoose');
require('dotenv').config()

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

mongoose.connect(process.env.url , function(err, db) {
  if (err) {
    console.log(err);
  } else {
    console.log('connection to DB established');
  }
})

app.listen(port, function() {
  console.log('server established, listening on port: ', port);
})
