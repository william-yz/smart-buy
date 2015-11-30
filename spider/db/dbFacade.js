var mongodb = require('mongodb'),
    Promise = require('bluebird').Promise;

var dbConfig = require('../config').db,
    server = new mongodb.Server(dbConfig.host,dbConfig.port,dbConfig.config),
    db = new mongodb.Db('smartBuy', server);

var connectDb = new Promise(function(resolved, rejected) {
    db.open(function(err, db) {
        if (err) {
            rejected(err);
        } else {
            resolved(db);
        }
    });
});

var connectCollection = function(collectionName) {
    return function(db) {
        return new Promise(function(resolved, rejected) {
            db.createCollection(collectionName, function(err, collection) {
                if (err) {
                    rejected(err);
                } else {
                    resolved(collection);
                }
            });
        });
    }
};

var insert = function(conllectionName, data) {
    var insert = function(collection) {
        return new Promise(function(resolved, rejected) {
            collection.insert(data, function(err, result) {
                if (err) {
                    rejected(err);
                } else {
                    resolved(result);
                }
            });
        });
    }

    return connectDb
        .then(connectCollection(conllectionName))
        .then(insert)
        .then(function(result) {
            console.log('success');
        })
        .catch(function(err) {
            console.log(err);
        })
        .finally(function() {
            //db.close();
        });
}

exports.insert = insert;