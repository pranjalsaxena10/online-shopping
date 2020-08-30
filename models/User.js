const mongoDb = require('mongodb');
const ObjectID = mongoDb.ObjectID;
const getDb = require('../util/database').getDb;

class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }

    save() {
        const db = getDb();
        return db.collection('products').insertOne(this);
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('users').find().toArray();
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new ObjectID(userId) });
    }

    static deleteById(userId) {
        const db = getDb();
        return db.collection('users').deleteOne({ _id: new ObjectID(userId) });
    }
}

module.exports = User;