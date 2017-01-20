var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var port = process.env.PORT || 8080;
var path = require('path');
var ObjectId = require('mongodb').ObjectId

require('dotenv').config()


var app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

MongoClient.connect(process.env.url , function(err, db) {
  var collection = db.collection('shrturls');

  if (err) {
    console.log(err);
  } else {
    console.log('connection to DB established');
  }

  app.get("/", function(req,res) {
    res.send('type in an address on the end of this url');
  });

  app.get("/new/:url", function(req,res) {
    var linkID = '';
    var httpLink = "http://" + req.params.url;

    collection.find({'url':httpLink}).toArray(function(err, docs) {
      if (err) {throw err}
      if (docs.length==0) {
        collection.insert({'url':httpLink}, function(err,docs) {
          linkID = docs.ops[0]._id;
          console.log(linkID);
        });
        console.log(httpLink + " successfully added to database");
      } else {
        console.log(docs[0].url)
      }
    })
    console.log(httpLink);
    console.log(req.params.url);

    res.send(httpLink + " shortens to " + " placeholder");
  });

  app.get('/url/:id', function(req,res) {
    var id = ObjectId(req.params.id)
    collection.find({"_id":id}).toArray(function(err, docs) {
      res.send(docs);
    });
  });

  app.listen(port, function() {
    console.log('server established, listening on port: ', port);
  });


});
