var express = require('express');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var port = process.env.PORT || 8080;


var app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

app.get('/', function(req,res) {
  res.send('enter an address at the end of the URL to shorten')
});

app.get('/:url', function(req,res) {
  MongoClient.connect("mongodb://adam:yukonho1984@ds111479.mlab.com:11479/shrturl" , function(err, db) {
    if (err) {
      console.log('unable to connect to the MongoDB server. Error:', err)
    } else {

      console.log('Connection establish to monogDB server');
      var collection = db.collection('shrturls');

      collection.insert(function(err, docs) {
        if (err) {
          throw err;
        } else {
          console.log(docs);
        }
      } )
    }
  });
});

app.listen(port, function() {
  console.log('server established, listening on port: ', port);
})
