var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var port = process.env.PORT || 8080;
var path = require('path');
var http = require('http');
var url = require('url');


//require('dotenv').config() //removed for deployment


var app = express();

// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

MongoClient.connect(process.env.url, function(err, db) {
    var collection = db.collection('shrturls');


    if (err) {
        console.log(err);
    } else {
        console.log('connection to DB established');
    }

    app.get("/", function(req, res) {
        res.send('type in /new and an address starting with www on the end of this url');
    });

    app.get("/new/:url", function(req, res) {
        var getHost = req.protocol + '://' + req.get('host') + '/new'
        var linkID = '';
        var httpLink = "http://" + req.params.url;


        //displays new URL to user once collection find/insert is someplete
        var showNewUrl = function(err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log('document inserted successfully')
                res.send('your new URL is: ' +
                    getHost.slice(0, -3) + 'url/' +
                    (result.ops[0].listing).toString()
                )
            }
        }

        //inserts a new document using the URL parameter as the desired URL and a listing number as a counter to find it
        var insertNewDocument = function(err, data) {
            collection.insert({
                'listing': data[0].listing + 1,
                'url': httpLink
            }, showNewUrl);
        }

        // initiates the find/insert and sorts listing number to be used as shortened URL



        collection.find({}).sort({
            'listing': -1
        }).limit(1).toArray(insertNewDocument);
    });

    app.get('/url/:id', function(req, res) {

        var id = parseInt(req.params.id)
        collection.find({
            'listing': id
        }).toArray(function(err, docs) {
            res.redirect(docs[0].url);
        });
    });

    app.listen(port, function() {
        console.log('server established, listening on port: ', port);
    });

});
