var mongodb = require('mongodb'),
    Promise = require('bluebird').Promise;

var dbConfig = require('../config').db,
    MongoClient = mongodb.MongoClient;
var connectDb = new Promise(function(resolved, rejected) {
    MongoClient.connect(dbConfig.url, 
        {
            server : {
                poolSize : 6 
            }
        },
        function(err, db) {
            if (err) {
                db.close();
                rejected(err);
            } else {
                resolved(db);
            }
        }
    );
});

var insert = function(collectionName, data) {
    var insert = function(db) {
        return new Promise(function(resolved, rejected) {
            var collection = db.collection(collectionName);
            collection.insert(data, function(err, result) {
                if (err) {
                    rejected(err);
                } else {
                    resolved(db);
                }
            });
        });
    }

    return connectDb
        .then(insert)
        .then(function(db) {
            console.log('success');
        })
        .catch(function(err) {
            console.log(err);
        });
}

exports.insert = insert;