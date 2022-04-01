require('dotenv').config({path:'./../digital-deck-server/ENV.env'});
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://app:" + process.env.PASSWORD + "@dd.mkxa1.mongodb.net/DD?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect();
const database = client.db('DD');
const sessionData = database.collection('sessions');
module.exports = sessionData;