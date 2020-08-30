const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const uri = '';

const mongoConnect = callBack => {
    MongoClient.connect(uri)
    .then(client => {
        _db = client.db();
        callBack();
    })
    .catch(err => console.log(err));
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No Database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

